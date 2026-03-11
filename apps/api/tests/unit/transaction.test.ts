/// <reference types="jest" />

import { TransactionStatus } from '@prisma/client';
import { prismaMock } from '../prismaMock';
import { transactionService } from '../../src/services';
import { ApiError } from '../../src/utils/ApiError';
import {
  createMockUser,
  createMockEvent,
  createMockTicketTier,
  createMockTransaction,
} from '../helpers/testUtils';

describe('TransactionService', () => {
  describe('createTransaction', () => {
    const userId = 'user-123';
    const transactionData = {
      eventId: 'event-123',
      items: [
        {
          ticketTierId: 'tier-123',
          quantity: 2,
        },
      ],
    };

    it('should create transaction successfully', async () => {
      const mockTicketTier = createMockTicketTier('event-123');

      // ✅ Fix: Pastikan ticketTypes memiliki struktur yang benar
      const mockEvent = {
        ...createMockEvent('organizer-123'),
        ticketTypes: [
          {
            ...mockTicketTier,
            id: 'tier-123', // ✅ Pastikan ID sama dengan transactionData
            availableSeats: 100,
            soldCount: 0,
          },
        ],
      };

      const mockUser = createMockUser();
      const mockTransaction = createMockTransaction(userId, 'event-123', {
        items: [
          {
            id: 'item-123',
            ticketTierId: 'tier-123',
            quantity: 2,
            price: 100000,
            subtotal: 200000,
          },
        ],
      });

      prismaMock.event.findUnique.mockResolvedValue(mockEvent as any);
      prismaMock.user.findUnique.mockResolvedValue(mockUser as any);

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        prismaMock.transaction.create.mockResolvedValue(mockTransaction as any);
        return callback(prismaMock);
      });

      const result = await transactionService.createTransaction(userId, transactionData);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should throw error if insufficient seats', async () => {
      const mockTicketTier = createMockTicketTier('event-123');
      const mockEvent = {
        ...createMockEvent('organizer-123'),
        ticketTypes: [
          {
            ...mockTicketTier,
            id: 'tier-123',
            availableSeats: 0,
            soldCount: 100,
            quota: 100,
          },
        ],
      };

      prismaMock.event.findUnique.mockResolvedValue(mockEvent as any);

      await expect(transactionService.createTransaction(userId, transactionData)).rejects.toThrow(
        ApiError
      );
    });
  });

  describe('cancelTransaction', () => {
    it('should cancel transaction and refund everything', async () => {
      // ✅ Fix: Gunakan status yang valid untuk cancel
      const mockTransaction = {
        id: 'transaction-123',
        userId: 'user-123',
        eventId: 'event-123',
        status: TransactionStatus.WAITING_PAYMENT,
        voucherUsageId: null,
        couponUsageId: null,
        pointsUsed: 0,
        items: [],
      };

      prismaMock.transaction.findUnique.mockResolvedValue(mockTransaction as any);
      prismaMock.transaction.update.mockResolvedValue({
        ...mockTransaction,
        status: 'CANCELLED',
      } as any);

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        return callback(prismaMock);
      });

      await transactionService.cancelTransaction('transaction-123', 'user-123');

      expect(prismaMock.transaction.update).toHaveBeenCalled();
    });

    it('should throw error if transaction status is not valid for cancel', async () => {
      const mockTransaction = {
        id: 'transaction-123',
        userId: 'user-123',
        eventId: 'event-123',
        status: 'COMPLETED', // ✅ Status yang tidak bisa di-cancel
        items: [],
      };

      prismaMock.transaction.findUnique.mockResolvedValue(mockTransaction as any);

      await expect(
        transactionService.cancelTransaction('transaction-123', 'user-123')
      ).rejects.toThrow(ApiError);
    });
  });
});
