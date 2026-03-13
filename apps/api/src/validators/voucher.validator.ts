import { z } from 'zod';
import { DiscountType } from '@prisma/client';
import {
  uuidSchema,
  dateSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
} from './common.validator';

// Create voucher schema
export const createVoucherSchema = z.object({
  body: z
    .object({
      eventId: uuidSchema,
      code: z
        .string()
        .min(4, 'Kode voucher minimal 4 karakter')
        .max(20, 'Kode voucher maksimal 20 karakter')
        .regex(
          /^[A-Z0-9-]+$/,
          'Kode voucher hanya boleh huruf kapital, angka, dan strip'
        )
        .optional(),
      discountType: z.nativeEnum(DiscountType),
      discountValue: positiveIntSchema,
      minPurchase: nonNegativeIntSchema.optional().default(0),
      maxDiscount: positiveIntSchema.nullable().optional(),
      usageLimit: positiveIntSchema,
      startDate: dateSchema,
      endDate: dateSchema,
    })
    .refine((data) => data.endDate > data.startDate, {
      message: 'Tanggal berakhir harus setelah tanggal mulai',
      path: ['endDate'],
    })
    .refine(
      (data) => {
        if (data.discountType === 'PERCENTAGE' && data.discountValue > 100) {
          return false;
        }
        return true;
      },
      {
        message: 'Persentase diskon tidak boleh lebih dari 100%',
        path: ['discountValue'],
      }
    ),
});

// Update voucher schema
export const updateVoucherSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    discountType: z.nativeEnum(DiscountType).optional(),
    discountValue: positiveIntSchema.optional(),
    minPurchase: nonNegativeIntSchema.optional(),
    maxDiscount: positiveIntSchema.nullable().optional(),
    usageLimit: positiveIntSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    isActive: z.boolean().optional(),
  }),
});

// Validate voucher code schema
export const validateVoucherSchema = z.object({
  body: z.object({
    code: z.string().min(1, 'Kode voucher wajib diisi'),
    eventId: uuidSchema,
    totalAmount: positiveIntSchema,
  }),
});

// Export types
export type CreateVoucherInput = z.infer<typeof createVoucherSchema>['body'];
export type UpdateVoucherInput = z.infer<typeof updateVoucherSchema>['body'];
export type ValidateVoucherInput = z.infer<
  typeof validateVoucherSchema
>['body'];
