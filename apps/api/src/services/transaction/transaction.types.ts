import { Prisma, PrismaClient } from '@prisma/client';

// Transaction client type untuk parameter tx
export type TransactionClient = Omit<
  PrismaClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export const eventWithTicketsInclude = {
  ticketTypes: true,
  organizer: true,
} satisfies Prisma.EventInclude;

export const transactionItemsInclude = {
  items: {
    include: {
      ticketTier: true,
    },
  },
} satisfies Prisma.TransactionInclude;

export const transactionDetailInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      profileImage: true,
    },
  },
  event: {
    include: {
      organizer: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      location: true,
    },
  },
  items: {
    include: {
      ticketTier: true,
    },
  },
  usedVoucher: {
    include: {
      voucher: true,
    },
  },
  usedCoupon: {
    include: {
      userCoupon: {
        include: {
          coupon: true,
        },
      },
    },
  },
} satisfies Prisma.TransactionInclude;

export const transactionListInclude = {
  user: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  event: {
    select: {
      id: true,
      name: true,
      imageUrl: true,
      startDate: true,
    },
  },
  items: {
    include: {
      ticketTier: {
        select: {
          name: true,
          price: true,
        },
      },
    },
  },
} satisfies Prisma.TransactionInclude;
