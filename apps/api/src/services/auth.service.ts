import { Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

import prisma from '../lib/prisma';
import { SECRET_KEY } from '../configs/env.config';
import { createCustomError } from '../utils/customError';

export const registerService = async (data: Prisma.UserCreateInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw createCustomError(400, 'Email is already registered!');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const newUser = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  return newUser;
};

export const loginService = async (data: Prisma.UserCreateInput) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw createCustomError(401, 'Invalid email or password!');
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);

  if (!isValidPassword) {
    throw createCustomError(401, 'Invalid email or password!');
  }

  const payload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };

  const token = sign(payload, SECRET_KEY, { expiresIn: '1d' });

  return { user: payload, token };
};
