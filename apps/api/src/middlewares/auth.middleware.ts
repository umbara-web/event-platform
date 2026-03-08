import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { createCustomError } from '../utils/customError';
import { SECRET_KEY } from '../configs/env.config';

export interface Token {
  id: string;
  email: string;
  name: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: Token;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer '))
      throw createCustomError(401, 'Unauthorized');

    const token = authHeader.split(' ')[1];
    const decoded = verify(token, SECRET_KEY) as Token;

    req.user = decoded;

    next();
  } catch (err) {
    next(err);
  }
}

export function roleGuard(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) throw createCustomError(401, 'invalid token');

      if (!allowedRoles.includes(user?.role))
        throw createCustomError(401, 'Insufficient permissions');

      next();
    } catch (err) {
      next(err);
    }
  };
}
