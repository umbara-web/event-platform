import prisma from '../../configs/database';
import emailService from '../email.service';
import { restoreTransaction } from './transaction-cancel.service';

export async function expireTransactions(): Promise<number> {
  const expiredTransactions = await findExpiredTransactions();

  for (const transaction of expiredTransactions) {
    await restoreTransaction(transaction.id, 'EXPIRED');
  }

  return expiredTransactions.length;
}

async function findExpiredTransactions() {
  return prisma.transaction.findMany({
    where: {
      status: 'WAITING_PAYMENT',
      paymentDeadline: { lte: new Date() },
    },
    include: { items: true },
  });
}

export async function autoCancelTransactions(): Promise<number> {
  const staleTransactions = await findStaleTransactions();

  for (const transaction of staleTransactions) {
    await processStaleTransaction(transaction);
  }

  return staleTransactions.length;
}

async function findStaleTransactions() {
  return prisma.transaction.findMany({
    where: {
      status: 'WAITING_CONFIRMATION',
      confirmDeadline: { lte: new Date() },
    },
    include: {
      items: true,
      user: true,
      event: true,
    },
  });
}

async function processStaleTransaction(transaction: any): Promise<void> {
  await restoreTransaction(transaction.id, 'CANCELLED');

  await emailService.sendTransactionRejectedEmail(transaction.user.email, {
    customerName: transaction.user.firstName,
    eventName: transaction.event.name,
    invoiceNumber: transaction.invoiceNumber,
    totalAmount: transaction.finalAmount,
    reason:
      'Transaksi dibatalkan otomatis karena tidak dikonfirmasi dalam 3 hari',
  });
}
