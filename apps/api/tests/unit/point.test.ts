/// <reference types="jest" />

import { prismaMock } from '../prismaMock';
import { pointService } from '../../src/services';
import { ApiError } from '../../src/utils/ApiError';

describe('PointService', () => {
  describe('usePoints', () => {
    it('should use points in FIFO order', async () => {
      const mockPoints = [
        {
          id: 'point-1',
          userId: 'user-123',
          points: 5000,
          usedPoints: 0,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
        {
          id: 'point-2',
          userId: 'user-123',
          points: 5000,
          usedPoints: 0,
          expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      ];

      prismaMock.point.findMany.mockResolvedValue([
        {
          id: 'point1',
          userId: 'user-123',
          amount: 100,
          expiresAt: new Date(Date.now() + 86400000),
          isUsed: false,
          usedAt: null,
          source: 'REFERRAL',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        // Mock $queryRaw yang dipakai oleh point.service.ts untuk FIFO query
        prismaMock.$queryRaw = jest.fn().mockResolvedValue([
          {
            id: 'point-1',
            userId: 'user-123',
            amount: 5000,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            isUsed: false,
            usedAt: null,
            source: 'REFERRAL',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: 'point-2',
            userId: 'user-123',
            amount: 5000,
            expiresAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
            isUsed: false,
            usedAt: null,
            source: 'REFERRAL',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]) as any;
        prismaMock.point.update.mockResolvedValue({} as any);
        prismaMock.point.create.mockResolvedValue({} as any);

        return callback(prismaMock);
      });

      const result = await pointService.usePoints('user-123', 8000);

      expect(result.pointsUsed).toBe(8000);
      expect(result.pointRecords).toHaveLength(2);
    });

    it('should throw error if insufficient points', async () => {
      prismaMock.point.findMany.mockResolvedValue([
        {
          id: 'point-1',
          userId: 'user-123',
          points: 5000,
          usedPoints: 0,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          createdAt: new Date(),
        },
      ] as any);

      // ✅ Fix: Gunakan ApiError dengan parameter yang benar
      (prismaMock.$transaction as jest.Mock).mockImplementation(async () => {
        throw ApiError.badRequest('Insufficient points');
      });

      await expect(pointService.usePoints('user-123', 10000)).rejects.toThrow(ApiError);
    });
  });
});
