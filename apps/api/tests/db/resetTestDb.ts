import { prisma } from '../../src/lib/prisma';

export async function resetTestDatabase() {
  await prisma.transactionPoint.deleteMany();
  await prisma.transactionCoupon.deleteMany();
  await prisma.transactionVoucher.deleteMany();
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();

  await prisma.ticketTier.deleteMany();
  await prisma.event.deleteMany();

  await prisma.user.deleteMany();
}
