import { z } from 'zod';
import { Role } from '@prisma/client';
import { emailSchema, passwordSchema, nameSchema } from './common.validator.js';

// Register schema
export const registerSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: passwordSchema,
      firstName: nameSchema,
      lastName: nameSchema,
      role: z.nativeEnum(Role, {
        message: `Role harus salah satu dari: ${Object.values(Role).join(', ')}`,
      }),
      referralCode: z
        .string()
        .trim()
        .toUpperCase()
        .regex(/^REF-[A-Z0-9]{8}$/, 'Format kode referral tidak valid')
        .optional(),
    })
    .strict(),
});

// Login schema
export const loginSchema = z.object({
  body: z
    .object({
      email: emailSchema,
      password: z.string().min(1, 'Password wajib diisi'),
    })
    .strict(),
});

// Refresh token schema
export const refreshTokenSchema = z.object({
  body: z
    .object({
      refreshToken: z.string().min(40, 'Refresh token wajib diisi'),
    })
    .strict(),
});

// Forgot password schema
export const forgotPasswordSchema = z.object({
  body: z
    .object({
      email: emailSchema,
    })
    .strict(),
});

// Reset password schema
export const resetPasswordSchema = z.object({
  body: z
    .object({
      token: z.string().min(64, 'Format token tidak valid'),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Konfirmasi password tidak cocok',
      path: ['confirmPassword'],
    })
    .strict(),
});

// Change password schema
export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
      newPassword: passwordSchema,
      confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Konfirmasi password tidak cocok',
      path: ['confirmPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
      message: 'Password baru tidak boleh sama dengan password saat ini',
      path: ['newPassword'],
    })
    .strict(),
});

// Export types
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
