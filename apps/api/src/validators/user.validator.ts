import { z } from 'zod';
import { nameSchema } from './common.validator.js';

// Update profile schema
export const updateProfileSchema = z.object({
  body: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
  }),
});

// Upload profile image schema
export const uploadProfileImageSchema = z.object({
  file: z
    .object({
      fieldname: z.string(),
      originalname: z.string(),
      mimetype: z
        .string()
        .refine(
          (type) => ['image/jpeg', 'image/png', 'image/webp'].includes(type),
          'Tipe file harus JPEG, PNG, atau WebP'
        ),
      size: z.number().max(5 * 1024 * 1024, 'Ukuran file maksimal 5MB'),
    })
    .optional(),
});

// Export types
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body'];
