import { z } from 'zod';
import { TransactionStatus } from '@prisma/client';
import {
  uuidSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  paginationQuerySchema,
  dateSchema,
} from './common.validator';

// Transaction item schema
const transactionItemSchema = z.object({
  ticketTierId: uuidSchema,
  quantity: positiveIntSchema.max(10, 'Maksimal 10 tiket per jenis'),
});

// Create transaction schema
export const createTransactionSchema = z.object({
  body: z.object({
    eventId: uuidSchema,
    items: z.array(transactionItemSchema).min(1, 'Minimal 1 item tiket'),
    voucherCode: z.string().optional(),
    couponId: uuidSchema.optional(),
    usePoints: z.boolean().optional().default(false),
    pointsToUse: nonNegativeIntSchema.optional(),
  }),
});

// Upload payment proof schema
export const uploadPaymentProofSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
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

// Confirm transaction schema
export const confirmTransactionSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z
    .object({
      action: z.enum(['accept', 'reject'], {
        message: 'Action harus accept atau reject',
      }),
      rejectionReason: z
        .string()
        .max(500, 'Alasan penolakan terlalu panjang')
        .optional(),
    })
    .refine(
      (data) => {
        if (data.action === 'reject' && !data.rejectionReason) {
          return false;
        }
        return true;
      },
      {
        message: 'Alasan penolakan wajib diisi jika menolak transaksi',
        path: ['rejectionReason'],
      }
    ),
});

// Get transactions query schema
export const getTransactionsQuerySchema = z.object({
  query: paginationQuerySchema.extend({
    status: z.nativeEnum(TransactionStatus).optional(),
    eventId: uuidSchema.optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
  }),
});

// Cancel transaction schema
export const cancelTransactionSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
});

// Export types
export type CreateTransactionInput = z.infer<
  typeof createTransactionSchema
>['body'];
export type ConfirmTransactionInput = z.infer<
  typeof confirmTransactionSchema
>['body'];
export type GetTransactionsQuery = z.infer<
  typeof getTransactionsQuerySchema
>['query'];
