import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import config from '../../configs/index';
import {
  generateInvoiceNumber,
  addHours,
  addDays,
} from '../../utils/helpers';
import pointService from '../point.service';
import couponService from '../coupon.service';
import voucherService from '../voucher.service';
import {
  validateEventStatus,
  calculateItemsTotal,
  type ItemWithPrice,
} from './transaction.helpers';
import {
  eventWithTicketsInclude,
  type TransactionClient,
} from './transaction.types';
import type { CreateTransactionInput } from '../../types/transaction.types';

interface DiscountResult {
  discountAmount: number;
  voucherValidation: any;
  couponValidation: any;
}

export async function createTransaction(
  userId: string,
  data: CreateTransactionInput
) {
  const now = new Date();
  const event = await getEventWithTickets(data.eventId);
  validateEventStatus(event, now);

  const { totalAmount, itemsWithPrices } = calculateItemsTotal(
    data.items,
    event,
    now
  );
  const discounts = await calculateDiscounts(data, totalAmount, userId);
  const pointsToUse = await calculatePointsToUse(
    data,
    userId,
    totalAmount - discounts.discountAmount
  );
  const finalAmount = Math.max(
    0,
    totalAmount - discounts.discountAmount - pointsToUse
  );

  return executeTransactionCreation({
    userId,
    data,
    now,
    totalAmount,
    discounts,
    pointsToUse,
    finalAmount,
    itemsWithPrices,
  });
}

async function getEventWithTickets(eventId: string) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: eventWithTicketsInclude,
  });

  if (!event) {
    throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
  }

  return event;
}

async function calculateDiscounts(
  data: CreateTransactionInput,
  totalAmount: number,
  userId: string
): Promise<DiscountResult> {
  let discountAmount = 0;
  let voucherValidation = null;
  let couponValidation = null;

  if (data.voucherCode) {
    voucherValidation = await voucherService.validateVoucher(
      data.voucherCode,
      data.eventId,
      totalAmount
    );

    if (!voucherValidation.isValid) {
      throw ApiError.badRequest(
        voucherValidation.message || MESSAGES.VOUCHER.INVALID
      );
    }

    discountAmount += voucherValidation.discountAmount;
  }

  if (data.couponId) {
    couponValidation = await couponService.validateCoupon(
      userId,
      data.couponId,
      totalAmount - discountAmount
    );

    if (!couponValidation.isValid) {
      throw ApiError.badRequest(
        couponValidation.message || MESSAGES.COUPON.INVALID
      );
    }

    discountAmount += couponValidation.discountAmount;
  }

  return { discountAmount, voucherValidation, couponValidation };
}

async function calculatePointsToUse(
  data: CreateTransactionInput,
  userId: string,
  remainingAmount: number
) {
  if (!data.usePoints || !data.pointsToUse || data.pointsToUse <= 0) return 0;

  const availablePoints = await pointService.getAvailablePoints(userId);

  if (data.pointsToUse > availablePoints) {
    throw ApiError.badRequest(MESSAGES.TRANSACTION.INSUFFICIENT_POINTS);
  }

  return Math.min(data.pointsToUse, remainingAmount);
}

interface TransactionCreationParams {
  userId: string;
  data: CreateTransactionInput;
  now: Date;
  totalAmount: number;
  discounts: DiscountResult;
  pointsToUse: number;
  finalAmount: number;
  itemsWithPrices: ItemWithPrice[];
}

async function executeTransactionCreation(params: TransactionCreationParams) {
  const {
    userId,
    data,
    now,
    totalAmount,
    discounts,
    pointsToUse,
    finalAmount,
    itemsWithPrices,
  } = params;
  const invoiceNumber = generateInvoiceNumber();
  const isFreeTransaction = finalAmount === 0;

  return prisma.$transaction(async (tx) => {
    const newTransaction = await createTransactionRecord(tx, {
      invoiceNumber,
      userId,
      eventId: data.eventId,
      totalAmount,
      discountAmount: discounts.discountAmount,
      pointsUsed: pointsToUse,
      finalAmount,
      isFreeTransaction,
      now,
      itemsWithPrices,
    });

    await updateTicketSoldCounts(tx, itemsWithPrices);
    await recordDiscountUsage(tx, newTransaction.id, discounts);
    await recordPointsUsage(tx, newTransaction.id, userId, pointsToUse);

    return newTransaction;
  });
}

async function createTransactionRecord(
  tx: TransactionClient,
  params: {
    invoiceNumber: string;
    userId: string;
    eventId: string;
    totalAmount: number;
    discountAmount: number;
    pointsUsed: number;
    finalAmount: number;
    isFreeTransaction: boolean;
    now: Date;
    itemsWithPrices: ItemWithPrice[];
  }
) {
  const {
    invoiceNumber,
    userId,
    eventId,
    totalAmount,
    discountAmount,
    pointsUsed,
    finalAmount,
    isFreeTransaction,
    now,
    itemsWithPrices,
  } = params;
  const paymentDeadline = addHours(
    now,
    config.transaction.paymentDeadlineHours
  );
  const confirmDeadline = addDays(now, config.transaction.confirmationDays);

  return tx.transaction.create({
    data: {
      invoiceNumber,
      userId,
      eventId,
      status: isFreeTransaction ? 'WAITING_CONFIRMATION' : 'WAITING_PAYMENT',
      totalAmount,
      discountAmount,
      pointsUsed,
      finalAmount,
      paymentDeadline,
      confirmDeadline: isFreeTransaction ? confirmDeadline : undefined,
      paidAt: isFreeTransaction ? now : undefined,
      items: {
        create: itemsWithPrices.map((item) => ({
          ticketTierId: item.ticketTierId, // ✅ FIELD NAME, BUKAN RELATIONSHIP
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.subtotal,
        })),
      },
    },
    include: {
      items: { include: { ticketTier: true } },
      event: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          startDate: true,
          venue: true,
        },
      },
    },
  });
}

async function updateTicketSoldCounts(
  tx: TransactionClient,
  items: ItemWithPrice[]
): Promise<void> {
  for (const item of items) {
    await tx.ticketTier.update({
      // ✅ TABLE NAME (SINGLE)
      where: { id: item.ticketTierId },
      data: { soldCount: { increment: item.quantity } },
    });
  }
}

async function recordDiscountUsage(
  tx: TransactionClient,
  transactionId: string,
  discounts: DiscountResult
): Promise<void> {
  if (discounts.voucherValidation?.isValid) {
    await tx.transactionVoucher.create({
      data: {
        transactionId,
        voucherId: discounts.voucherValidation.voucherId,
        discountAmount: discounts.voucherValidation.discountAmount,
      },
    });
    await voucherService.useVoucher(discounts.voucherValidation.voucherId);
  }

  if (discounts.couponValidation?.isValid) {
    await tx.transactionCoupon.create({
      data: {
        transactionId,
        userCouponId: discounts.couponValidation.userCouponId,
        discountAmount: discounts.couponValidation.discountAmount,
      },
    });
    await couponService.useCoupon(discounts.couponValidation.userCouponId);
  }
}

async function recordPointsUsage(
  tx: TransactionClient,
  transactionId: string,
  userId: string,
  pointsToUse: number
): Promise<void> {
  if (pointsToUse <= 0) return;
  const pointUsageResult = await pointService.usePoints(userId, pointsToUse);

  for (const record of pointUsageResult.pointRecords) {
    await tx.transactionPoint.create({
      data: { transactionId, pointId: record.pointId, amount: record.amount },
    });
  }
}
