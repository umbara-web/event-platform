import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import type { Prisma } from '@prisma/client';
import type { EventFilters } from '../../types/event.types';

export async function validateCategory(categoryId: string): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw ApiError.badRequest('Kategori tidak ditemukan');
  }
}

export async function validateLocation(locationId: string): Promise<void> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
  });

  if (!location) {
    throw ApiError.badRequest('Lokasi tidak ditemukan');
  }
}

export async function validateEventOwnership(
  eventId: string,
  organizerId: string
) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });

  if (!event) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  if (event.organizerId !== organizerId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  return event;
}

export async function getAverageRating(eventId: string): Promise<number> {
  const result = await prisma.review.aggregate({
    where: { eventId },
    _avg: { rating: true },
  });

  return result._avg.rating ?? 0;
}

export async function getCompletedTransactionsCount(
  eventId: string
): Promise<number> {
  return prisma.transaction.count({
    where: { eventId, status: 'COMPLETED' },
  });
}

export function buildEventFilters(
  filters: EventFilters
): Prisma.EventWhereInput {
  const where: Prisma.EventWhereInput = {};

  if (filters.status) where.status = filters.status;
  if (filters.categoryId) where.categoryId = filters.categoryId;
  if (filters.locationId) where.locationId = filters.locationId;
  if (filters.organizerId) where.organizerId = filters.organizerId;
  if (filters.startDate) where.startDate = { gte: filters.startDate };
  if (filters.endDate) where.endDate = { lte: filters.endDate };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: 'insensitive' } },
      { description: { contains: filters.search, mode: 'insensitive' } },
      { venue: { contains: filters.search, mode: 'insensitive' } },
    ];
  }

  applyPriceFilters(where, filters);

  return where;
}

function applyPriceFilters(
  where: Prisma.EventWhereInput,
  filters: EventFilters
): void {
  const hasPriceFilter =
    filters.minPrice !== undefined || filters.maxPrice !== undefined;

  if (hasPriceFilter) {
    where.ticketTypes = {
      some: {
        ...(filters.minPrice !== undefined && {
          price: { gte: filters.minPrice },
        }),
        ...(filters.maxPrice !== undefined && {
          price: { lte: filters.maxPrice },
        }),
      },
    };
  }

  if (filters.isFree !== undefined) {
    where.ticketTypes = {
      some: { ticketType: filters.isFree ? 'FREE' : 'PAID' },
    };
  }
}
