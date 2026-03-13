import { z } from 'zod';
import { EventStatus, TicketType } from '@prisma/client';
import {
  uuidSchema,
  dateSchema,
  positiveIntSchema,
  nonNegativeIntSchema,
  paginationQuerySchema,
} from './common.validator';

// Ticket tier schema
const ticketTierSchema = z.object({
  name: z
    .string()
    .min(1, 'Nama tiket wajib diisi')
    .max(100, 'Nama tiket terlalu panjang'),
  description: z.string().max(500, 'Deskripsi terlalu panjang').optional(),
  price: nonNegativeIntSchema,
  ticketType: z.nativeEnum(TicketType),
  quota: positiveIntSchema,
  maxPerUser: positiveIntSchema.optional().default(5),
  salesStartDate: dateSchema,
  salesEndDate: dateSchema,
});

// Create event schema
export const createEventSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .min(3, 'Nama event minimal 3 karakter')
        .max(200, 'Nama event terlalu panjang'),
      description: z
        .string()
        .min(10, 'Deskripsi minimal 10 karakter')
        .max(5000, 'Deskripsi terlalu panjang'),
      categoryId: uuidSchema,
      locationId: uuidSchema,
      venue: z
        .string()
        .min(3, 'Nama venue minimal 3 karakter')
        .max(200, 'Nama venue terlalu panjang'),
      address: z
        .string()
        .min(10, 'Alamat minimal 10 karakter')
        .max(500, 'Alamat terlalu panjang'),
      startDate: dateSchema,
      endDate: dateSchema,
      ticketTiers: z
        .array(ticketTierSchema)
        .min(1, 'Minimal 1 jenis tiket')
        .max(10, 'Maksimal 10 jenis tiket'),
    })
    .refine((data) => data.endDate > data.startDate, {
      message: 'Tanggal berakhir harus setelah tanggal mulai',
      path: ['endDate'],
    })
    .refine((data) => data.startDate > new Date(), {
      message: 'Tanggal mulai harus di masa depan',
      path: ['startDate'],
    }),
});

// Update event schema
export const updateEventSchema = z.object({
  params: z.object({
    id: uuidSchema,
  }),
  body: z.object({
    name: z
      .string()
      .min(3, 'Nama event minimal 3 karakter')
      .max(200)
      .optional(),
    description: z
      .string()
      .min(10, 'Deskripsi minimal 10 karakter')
      .max(5000)
      .optional(),
    categoryId: uuidSchema.optional(),
    locationId: uuidSchema.optional(),
    venue: z
      .string()
      .min(3, 'Nama venue minimal 3 karakter')
      .max(200)
      .optional(),
    address: z
      .string()
      .min(10, 'Alamat minimal 10 karakter')
      .max(500)
      .optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    status: z.nativeEnum(EventStatus).optional(),
  }),
});

// Get events query schema
export const getEventsQuerySchema = z.object({
  query: paginationQuerySchema.extend({
    categoryId: uuidSchema.optional(),
    locationId: uuidSchema.optional(),
    search: z.string().max(100).optional(),
    startDate: dateSchema.optional(),
    endDate: dateSchema.optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    status: z.nativeEnum(EventStatus).optional(),
    isFree: z.coerce.boolean().optional(),
  }),
});

// Get event by id/slug schema
export const getEventParamsSchema = z.object({
  params: z.object({
    idOrSlug: z.string().min(1, 'ID atau slug wajib diisi'),
  }),
});

// Export types
export type CreateEventInput = z.infer<typeof createEventSchema>['body'];
export type UpdateEventInput = z.infer<typeof updateEventSchema>['body'];
export type GetEventsQuery = z.infer<typeof getEventsQuerySchema>['query'];
