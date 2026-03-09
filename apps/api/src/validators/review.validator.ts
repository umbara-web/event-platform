import { z } from 'zod';
import { uuidSchema, paginationQuerySchema } from './common.validator.js';

// Create review schema
export const createReviewSchema = z.object({
  body: z.object({
    eventId: uuidSchema,
    rating: z
      .number()
      .int()
      .min(1, 'Rating minimal 1')
      .max(5, 'Rating maksimal 5'),
    comment: z.string().max(1000, 'Komentar maksimal 1000 karakter').optional(),
  }),
});

// Update review schema
export const updateReviewSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    rating: z
      .number()
      .int()
      .min(1, 'Rating minimal 1')
      .max(5, 'Rating maksimal 5')
      .optional(),
    comment: z.string().max(1000, 'Komentar maksimal 1000 karakter').optional(),
  }),
});

// Get reviews query schema
export const getReviewsQuerySchema = z.object({
  query: paginationQuerySchema.extend({
    eventId: uuidSchema.optional(),
    organizerId: uuidSchema.optional(),
    rating: z.coerce.number().int().min(1).max(5).optional(),
  }),
});

// Export types
export type CreateReviewInput = z.infer<typeof createReviewSchema>['body'];
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>['body'];
export type GetReviewsQuery = z.infer<typeof getReviewsQuerySchema>['query'];
