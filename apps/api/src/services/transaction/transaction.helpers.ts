import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import type { Event, TicketTier } from '@prisma/client';

type EventWithTickets = Event & { ticketTypes: TicketTier[] };

export interface ItemWithPrice {
  ticketTierId: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tier: TicketTier;
}

export function validateEventStatus(event: Event, now: Date): void {
  if (event.status !== 'PUBLISHED') {
    throw ApiError.badRequest(MESSAGES.EVENT.NOT_PUBLISHED);
  }

  if (event.startDate < now) {
    throw ApiError.badRequest(MESSAGES.EVENT.ALREADY_STARTED);
  }
}

export function validateTicketAvailability(
  tier: TicketTier,
  quantity: number,
  now: Date
): void {
  if (now < tier.salesStartDate || now > tier.salesEndDate) {
    throw ApiError.badRequest(
      `Penjualan tiket ${tier.name} belum/sudah berakhir`
    );
  }

  const availableSeats = tier.quota - tier.soldCount;
  if (quantity > availableSeats) {
    throw ApiError.badRequest(
      `Tiket ${tier.name} hanya tersisa ${availableSeats} kursi`
    );
  }

  if (quantity > tier.maxPerUser) {
    throw ApiError.badRequest(
      `Maksimal pembelian tiket ${tier.name} adalah ${tier.maxPerUser}`
    );
  }
}

export function calculateItemsTotal(
  items: Array<{ ticketTierId: string; quantity: number }>,
  event: EventWithTickets,
  now: Date
): { totalAmount: number; itemsWithPrices: ItemWithPrice[] } {
  let totalAmount = 0;
  const itemsWithPrices: ItemWithPrice[] = [];

  for (const item of items) {
    const tier = event.ticketTypes.find((t) => t.id === item.ticketTierId);

    if (!tier) {
      throw ApiError.badRequest('Jenis tiket tidak ditemukan');
    }

    validateTicketAvailability(tier, item.quantity, now);

    const subtotal = tier.price * item.quantity;
    totalAmount += subtotal;

    itemsWithPrices.push({
      ticketTierId: item.ticketTierId,
      quantity: item.quantity,
      unitPrice: tier.price,
      subtotal,
      tier,
    });
  }

  return { totalAmount, itemsWithPrices };
}

export async function validateTransactionOwnership(
  transactionId: string,
  userId: string
) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  if (transaction.userId !== userId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  return transaction;
}

export async function validateOrganizerAccess(
  transactionId: string,
  organizerId: string
) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { event: true },
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  if (transaction.event.organizerId !== organizerId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  return transaction;
}
