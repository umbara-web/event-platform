import { Prisma } from '@prisma/client';

export const eventBaseInclude = {
  category: true,
  location: true,
  organizer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  },
  ticketTypes: true,
} satisfies Prisma.EventInclude;

export const eventDetailInclude = {
  ...eventBaseInclude,
  ticketTypes: {
    orderBy: { price: 'asc' as const },
  },
  vouchers: {
    where: {
      isActive: true,
      endDate: { gt: new Date() },
      startDate: { lte: new Date() },
    },
    select: {
      id: true,
      code: true,
      discountType: true,
      discountValue: true,
      minPurchase: true,
      maxDiscount: true,
      usageLimit: true,
      usedCount: true,
      endDate: true,
    },
  },
  _count: {
    select: { reviews: true },
  },
} satisfies Prisma.EventInclude;

export const eventListInclude = {
  category: true,
  location: true,
  organizer: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      profileImage: true,
    },
  },
  ticketTypes: {
    orderBy: { price: 'asc' as const },
    take: 1,
  },
  _count: {
    select: { reviews: true },
  },
} satisfies Prisma.EventInclude;
