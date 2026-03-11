import prisma from '../configs/database.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/index.js';
import { addMonths } from '../utils/helpers.js';
import config from '../configs/index.js';
import { Point, Prisma } from '@prisma/client';

export interface PointUsageResult {
  pointsUsed: number;
  pointRecords: Array<{
    pointId: string;
    amount: number;
  }>;
}

class PointService {
  //  Get available points for a user
  async getAvailablePoints(userId: string): Promise<number> {
    const now = new Date();

    const result = await prisma.point.aggregate({
      where: {
        userId,
        isUsed: false,
        expiresAt: { gt: now },
      },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  }

  // Get detailed points with expiry
  async getPointsDetail(userId: string) {
    const now = new Date();

    const points = await prisma.point.findMany({
      where: {
        userId,
        isUsed: false,
        expiresAt: { gt: now },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return points;
  }

  // Use points for a transaction (FIFO - First In First Out based on expiry)
  async usePoints(userId: string, amount: number): Promise<PointUsageResult> {
    return prisma.$transaction(async (tx) => {
      const now = new Date();

      const availablePoints = await tx.$queryRaw<Point[]>`
      SELECT * FROM "Point"
      WHERE "userId" = ${userId}
      AND "isUsed" = false
      AND "expiresAt" > NOW()
      ORDER BY "expiresAt" ASC
      FOR UPDATE
    `;

      const totalAvailable = availablePoints.reduce(
        (sum, p) => sum + p.amount,
        0
      );

      if (totalAvailable < amount) {
        throw ApiError.badRequest(MESSAGES.TRANSACTION.INSUFFICIENT_POINTS);
      }

      let remaining = amount;
      const pointRecords: { pointId: string; amount: number }[] = [];

      for (const point of availablePoints) {
        if (remaining <= 0) break;

        const useAmount = Math.min(point.amount, remaining);
        remaining -= useAmount;

        if (useAmount === point.amount) {
          await tx.point.update({
            where: { id: point.id },
            data: {
              isUsed: true,
              usedAt: now,
            },
          });
        } else {
          await tx.point.update({
            where: { id: point.id },
            data: {
              amount: point.amount - useAmount,
            },
          });

          await tx.point.create({
            data: {
              userId,
              amount: useAmount,
              expiresAt: point.expiresAt,
              source: point.source,
              isUsed: true,
              usedAt: now,
            },
          });
        }

        pointRecords.push({
          pointId: point.id,
          amount: useAmount,
        });
      }

      return {
        pointsUsed: amount,
        pointRecords,
      };
    });
  }

  // Refund points (when transaction is cancelled/rejected)
  async refundPoints(
    transactionId: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const prismaClient = tx || prisma;

    // Get points used in this transaction
    const usedPoints = await prismaClient.transactionPoint.findMany({
      where: { transactionId },
      include: { point: true },
    });

    for (const usedPoint of usedPoints) {
      // Create new point record as refund
      await prismaClient.point.create({
        data: {
          userId: usedPoint.point.userId,
          amount: usedPoint.amount,
          expiresAt: addMonths(new Date(), config.expiry.pointsMonths), // New 3-month expiry
          source: 'REFUND',
        },
      });
    }
  }

  // Award referral points
  async awardReferralPoints(
    userId: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const prismaClient = tx || prisma;

    await prismaClient.point.create({
      data: {
        userId,
        amount: config.referral.points,
        expiresAt: addMonths(new Date(), config.expiry.pointsMonths),
        source: 'REFERRAL',
      },
    });
  }

  // Expire old points (called by cron job)
  async expirePoints(): Promise<number> {
    const now = new Date();

    const result = await prisma.point.updateMany({
      where: {
        isUsed: false,
        expiresAt: { lte: now },
      },
      data: {
        isUsed: true,
        usedAt: now,
      },
    });

    return result.count;
  }
}

export const pointService = new PointService();
export default pointService;
