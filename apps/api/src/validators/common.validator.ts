import { z } from 'zod';

// Common validation schemas
export const uuidSchema = z.string().uuid('ID harus berupa UUID yang valid');

export const emailSchema = z
  .string()
  .min(1, 'Email wajib diisi')
  .email('Format email tidak valid')
  .max(255, 'Email terlalu panjang')
  .trim()
  .toLowerCase();

export const passwordSchema = z
  .string()
  .min(8, 'Password minimal 8 karakter')
  .max(128, 'Password terlalu panjang')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    'Password harus mengandung huruf kecil, huruf besar, dan angka'
  );

export const nameSchema = z
  .string()
  .min(2, 'Nama minimal 2 karakter')
  .max(100, 'Nama terlalu panjang')
  .regex(/^[a-zA-Z\s]+$/, 'Nama hanya boleh mengandung huruf dan spasi')
  .trim();

export const phoneSchema = z
  .string()
  .regex(
    /^(\+62|62|0)8[1-9][0-9]{6,10}$/,
    'Format nomor telepon Indonesia tidak valid'
  )
  .optional();

export const dateSchema = z.coerce.date({
  message: 'Format tanggal tidak valid',
});

export const positiveIntSchema = z
  .number()
  .int('Harus berupa bilangan bulat')
  .positive('Harus berupa bilangan positif');

export const nonNegativeIntSchema = z
  .number()
  .int('Harus berupa bilangan bulat')
  .nonnegative('Tidak boleh negatif');

// Pagination query schema
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

// ID params schema
export const idParamsSchema = z.object({
  id: uuidSchema,
});

export default {
  uuidSchema,
  emailSchema,
  passwordSchema,
  nameSchema,
  phoneSchema,
  dateSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  paginationQuerySchema,
  idParamsSchema,
};
