import prisma from '../../configs/database.js';
import { ApiError } from '../../utils/ApiError.js';
import { MESSAGES } from '../../constants/index.js';
import config from '../../configs/index.js';
import { addDays } from '../../utils/helpers.js';
import cloudinaryService from '../cloudinary.service.js';
import emailService from '../email.service.js';
import { validateTransactionOwnership } from './transaction.helpers.js';
import { restoreTransaction } from './transaction-cancel.service.js';

export async function uploadPaymentProof(
  transactionId: string,
  userId: string,
  file: Express.Multer.File
) {
  const transaction = await validateTransactionOwnership(transactionId, userId);

  validatePaymentStatus(transaction);

  const result = await cloudinaryService.uploadPaymentProof(
    file.buffer,
    transactionId
  );

  return updateTransactionWithProof(transactionId, result.url);
}

function validatePaymentStatus(transaction: {
  status: string;
  paymentDeadline: Date | null;
}): void {
  if (transaction.status !== 'WAITING_PAYMENT') {
    throw ApiError.badRequest(MESSAGES.TRANSACTION.INVALID_STATUS);
  }

  if (transaction.paymentDeadline && transaction.paymentDeadline < new Date()) {
    throw ApiError.badRequest(MESSAGES.TRANSACTION.PAYMENT_DEADLINE_PASSED);
  }
}

async function updateTransactionWithProof(
  transactionId: string,
  paymentProofUrl: string
) {
  const now = new Date();
  const confirmDeadline = addDays(now, config.transaction.confirmationDays);

  return prisma.transaction.update({
    where: { id: transactionId },
    data: {
      paymentProof: paymentProofUrl,
      status: 'WAITING_CONFIRMATION',
      paidAt: now,
      confirmDeadline,
    },
    include: {
      items: {
        include: {
          ticketTier: true,
        },
      },
      event: true,
    },
  });
}

export async function confirmTransaction(
  transactionId: string,
  organizerId: string,
  data: { action: 'accept' | 'reject'; rejectionReason?: string }
) {
  const transaction = await getTransactionForConfirmation(
    transactionId,
    organizerId
  );

  if (data.action === 'accept') {
    return acceptTransaction(transaction);
  }

  return rejectTransaction(transaction, data.rejectionReason);
}

async function getTransactionForConfirmation(
  transactionId: string,
  organizerId: string
) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: {
      event: true,
      user: true,
      items: {
        include: {
          ticketTier: true,
        },
      },
    },
  });

  if (!transaction) {
    throw ApiError.notFound(MESSAGES.TRANSACTION.NOT_FOUND);
  }

  if (transaction.event.organizerId !== organizerId) {
    throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
  }

  if (transaction.status !== 'WAITING_CONFIRMATION') {
    throw ApiError.badRequest(MESSAGES.TRANSACTION.INVALID_STATUS);
  }

  return transaction;
}

async function acceptTransaction(transaction: any) {
  const updatedTransaction = await prisma.transaction.update({
    where: { id: transaction.id },
    data: {
      status: 'COMPLETED',
      confirmedAt: new Date(),
    },
    include: {
      event: true,
      items: true,
    },
  });

  await emailService.sendTransactionAcceptedEmail(transaction.user.email, {
    customerName: transaction.user.firstName,
    eventName: transaction.event.name,
    invoiceNumber: transaction.invoiceNumber,
    totalAmount: transaction.finalAmount,
  });

  return updatedTransaction;
}

async function rejectTransaction(transaction: any, rejectionReason?: string) {
  const updatedTransaction = await restoreTransaction(
    transaction.id,
    'REJECTED',
    { rejectionReason }
  );

  await emailService.sendTransactionRejectedEmail(transaction.user.email, {
    customerName: transaction.user.firstName,
    eventName: transaction.event.name,
    invoiceNumber: transaction.invoiceNumber,
    totalAmount: transaction.finalAmount,
    reason: rejectionReason,
  });

  return updatedTransaction;
}
