import prisma from '../../configs/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/index.js';
import {
  parsePaginationParams,
  toPrismaQuery,
  createPaginatedResult,
} from '../../utils/pagination.js';
import {
  getAverageRating,
  getCompletedTransactionsCount,
  buildEventFilters,
} from '../event/event-helpers.js';
import { eventDetailInclude, eventListInclude } from '../event/event-types.js';
import type { EventFilters } from '../../types/event.types.js';
import type { PaginationParams } from '../../types/index.js';

export async function getEventByIdOrSlug(idOrSlug: string) {
  const event = await findEventByIdOrSlug(idOrSlug);

  if (!event) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  return enrichEventDetails(event);
}

async function findEventByIdOrSlug(idOrSlug: string) {
  return prisma.event.findFirst({
    where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    include: eventDetailInclude,
  });
}

async function enrichEventDetails(event: any) {
  const [averageRating, totalAttendees] = await Promise.all([
    getAverageRating(event.id),
    getCompletedTransactionsCount(event.id),
  ]);

  const ticketTypes = event.ticketTypes.map((tier: any) => ({
    ...tier,
    availableSeats: tier.quota - tier.soldCount,
  }));

  return {
    ...event,
    ticketTypes,
    averageRating,
    totalReviews: event._count.reviews,
    totalAttendees,
  };
}

export async function getEvents(
  filters: EventFilters,
  pagination: PaginationParams
) {
  const paginationOptions = parsePaginationParams(pagination);
  const { skip, take, orderBy } = toPrismaQuery(paginationOptions);
  const where = buildEventFilters(filters);

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where,
      include: eventListInclude,
      orderBy,
      skip,
      take,
    }),
    prisma.event.count({ where }),
  ]);

  const enrichedEvents = await enrichEventsList(events);

  return createPaginatedResult(enrichedEvents, total, paginationOptions);
}

async function enrichEventsList(events: any[]) {
  return Promise.all(
    events.map(async (event) => ({
      ...event,
      averageRating: await getAverageRating(event.id),
      lowestPrice: event.ticketTypes[0]?.price ?? 0,
    }))
  );
}

export async function getUpcomingEvents(limit: number = 10) {
  const events = await prisma.event.findMany({
    where: {
      status: 'PUBLISHED',
      startDate: { gt: new Date() },
    },
    include: eventListInclude,
    orderBy: { startDate: 'asc' },
    take: limit,
  });

  return events.map((event) => ({
    ...event,
    lowestPrice: event.ticketTypes[0]?.price ?? 0,
  }));
}

export async function getOrganizerEvents(
  organizerId: string,
  pagination: PaginationParams
) {
  const paginationOptions = parsePaginationParams(pagination);
  const { skip, take, orderBy } = toPrismaQuery(paginationOptions);

  const [events, total] = await Promise.all([
    prisma.event.findMany({
      where: { organizerId },
      include: {
        category: true,
        location: true,
        ticketTypes: true,
        _count: {
          select: {
            reviews: true,
            transactions: true,
          },
        },
      },
      orderBy,
      skip,
      take,
    }),
    prisma.event.count({ where: { organizerId } }),
  ]);

  return createPaginatedResult(events, total, paginationOptions);
}
