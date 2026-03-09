import { Role } from '@prisma/client';

export interface JWTPayload {
  id: string;
  email: string;
  role: Role;
  firstName: string;
  lastName: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
  referralCode?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}
