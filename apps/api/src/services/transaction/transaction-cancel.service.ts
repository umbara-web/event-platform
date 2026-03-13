import prisma from '../../configs/database';
import { ApiError } from '../../utils/ApiError';
import { MESSAGES } from '../../constants/index';
import pointService from '../point.service';
import couponService from '../coupon.service';
import voucherService from '../voucher.service';
import { validateTransactionOwnership } from './transaction.helpers';
import type { TransactionStatus } from '@prisma/client';

export async function cancelTransaction(transactionId: string, userId: string) {
  const transaction = await getTransactionForCancel(transactionId, userId);

  return restoreTransaction(transaction.id, 'CANCELLED');
}

async function getTransactionForCancel(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { items: true },
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  if (transaction.userId !== userId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  const validStatuses = ['WAITING_PAYMENT', 'WAITING_CONFIRMATION'];
  if (!validStatuses.includes(transaction.status)) {
    throw ApiError.badRequest(MESSAGES.TRANSACTION.INVALID_STATUS);
  }

  return transaction;
}

export async function restoreTransaction(
  transactionId: string,
  newStatus: TransactionStatus,
  additionalData?: { rejectionReason?: string }
) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { items: true },
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  return prisma.$transaction(async (tx) => {
    const statusData = buildStatusData(newStatus, additionalData);

    const updated = await tx.transaction.update({
      where: { id: transactionId },
      data: statusData,
    });

    await restoreTicketSeats(tx, transaction.items);
    await refundAllDiscounts(transactionId, transaction.pointsUsed);

    return updated;
  });
}

function buildStatusData(
  status: TransactionStatus,
  additionalData?: { rejectionReason?: string }
) {
  const now = new Date();
  const baseData = { status };

  switch (status) {
    case 'CANCELLED':
      return { ...baseData, cancelledAt: now };
    case 'REJECTED':
      return {
        ...baseData,
        rejectedAt: now,
        rejectionReason: additionalData?.rejectionReason,
      };
    case 'EXPIRED':
      return { ...baseData, expiredAt: now };
    default:
      return baseData;
  }
}

async function restoreTicketSeats(tx: any, items: any[]): Promise<void> {
  for (const item of items) {
    await tx.ticketType.update({
      // ✅ FIXED
      where: { id: item.ticketTypeId }, // ✅ FIXED
      data: {
        soldCount: { decrement: item.quantity },
      },
    });
  }
}

async function refundAllDiscounts(
  transactionId: string,
  pointsUsed: number
): Promise<void> {
  // ✅ FIXED: Functions hanya menerima 1 parameter
  if (pointsUsed > 0) {
    await pointService.refundPoints(transactionId);
  }

  await voucherService.refundVoucher(transactionId);
  await couponService.refundCoupon(transactionId);
}
