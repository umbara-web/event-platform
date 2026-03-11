// src/services/voucher.service.ts

import prisma from '../configs/database.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/index.js';
import { calculateDiscount, generateVoucherCode } from '../utils/helpers.js';
import type { CreateVoucherInput } from '../types/event.types.js';

export interface VoucherValidationResult {
  isValid: boolean;
  voucherId: string;
  discountAmount: number;
  message?: string;
}

class VoucherService {
  /**
   * Create a voucher for an event
   */
  async createVoucher(organizerId: string, data: CreateVoucherInput) {
    // Verify event belongs to organizer
    const event = await prisma.event.findUnique({
      where: { id: data.eventId },
    });

    if (!event) {
      throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
    }

    if (event.organizerId !== organizerId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    // Generate voucher code if not provided
    const code = data.code || generateVoucherCode(event.name);

    // Check if code already exists
    const existingVoucher = await prisma.voucher.findUnique({
      where: { code },
    });

    if (existingVoucher) {
      throw ApiError.conflict('Kode voucher sudah digunakan');
    }

    const voucher = await prisma.voucher.create({
      data: {
        eventId: data.eventId,
        code,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchase: data.minPurchase ?? 0,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        startDate: data.startDate,
        endDate: data.endDate,
      },
      include: {
        event: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return voucher;
  }

  /**
   * Update a voucher
   */
  async updateVoucher(
    voucherId: string,
    organizerId: string,
    data: Partial<CreateVoucherInput>
  ) {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: { event: true },
    });

    if (!voucher) {
      throw ApiError.notFound(MESSAGES.VOUCHER.NOT_FOUND);
    }

    if (voucher.event.organizerId !== organizerId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    const updatedVoucher = await prisma.voucher.update({
      where: { id: voucherId },
      data: {
        ...(data.discountType && { discountType: data.discountType }),
        ...(data.discountValue !== undefined && {
          discountValue: data.discountValue,
        }),
        ...(data.minPurchase !== undefined && {
          minPurchase: data.minPurchase,
        }),
        ...(data.maxDiscount !== undefined && {
          maxDiscount: data.maxDiscount,
        }),
        ...(data.usageLimit !== undefined && { usageLimit: data.usageLimit }),
        ...(data.startDate && { startDate: data.startDate }),
        ...(data.endDate && { endDate: data.endDate }),
      },
    });

    return updatedVoucher;
  }

  /**
   * Delete a voucher
   */
  async deleteVoucher(voucherId: string, organizerId: string): Promise<void> {
    const voucher = await prisma.voucher.findUnique({
      where: { id: voucherId },
      include: { event: true },
    });

    if (!voucher) {
      throw ApiError.notFound(MESSAGES.VOUCHER.NOT_FOUND);
    }

    if (voucher.event.organizerId !== organizerId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    if (voucher.usedCount > 0) {
      throw ApiError.badRequest(
        'Tidak dapat menghapus voucher yang sudah digunakan'
      );
    }

    await prisma.voucher.delete({
      where: { id: voucherId },
    });
  }

  /**
   * Validate voucher for a transaction
   */
  async validateVoucher(
    code: string,
    eventId: string,
    totalAmount: number
  ): Promise<VoucherValidationResult> {
    const now = new Date();

    const voucher = await prisma.voucher.findUnique({
      where: { code },
    });

    if (!voucher) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: MESSAGES.VOUCHER.NOT_FOUND,
      };
    }

    // Check if voucher is for this event
    if (voucher.eventId !== eventId) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: MESSAGES.VOUCHER.NOT_APPLICABLE,
      };
    }

    // Check if voucher is active
    if (!voucher.isActive) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: MESSAGES.VOUCHER.INVALID,
      };
    }

    // Check validity period
    if (now < voucher.startDate || now > voucher.endDate) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: MESSAGES.VOUCHER.EXPIRED,
      };
    }

    // Check usage limit
    if (voucher.usedCount >= voucher.usageLimit) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: MESSAGES.VOUCHER.USAGE_LIMIT_REACHED,
      };
    }

    // Check minimum purchase
    if (totalAmount < voucher.minPurchase) {
      return {
        isValid: false,
        voucherId: '',
        discountAmount: 0,
        message: `Minimum pembelian Rp${voucher.minPurchase.toLocaleString('id-ID')}`,
      };
    }

    // Calculate discount
    const discountAmount = calculateDiscount(
      totalAmount,
      voucher.discountType,
      voucher.discountValue,
      voucher.maxDiscount
    );

    return {
      isValid: true,
      voucherId: voucher.id,
      discountAmount,
    };
  }

  /**
   * Use voucher
   */
  async useVoucher(voucherId: string, tx?: any): Promise<void> {
    const prismaClient = tx || prisma;

    await prismaClient.voucher.update({
      where: { id: voucherId },
      data: {
        usedCount: { increment: 1 },
      },
    });
  }

  /**
   * Refund voucher usage
   */
  async refundVoucher(transactionId: string, tx?: any): Promise<void> {
    const prismaClient = tx || prisma;

    const transactionVoucher = await prismaClient.transactionVoucher.findUnique(
      {
        where: { transactionId },
      }
    );

    if (transactionVoucher) {
      await prismaClient.voucher.update({
        where: { id: transactionVoucher.voucherId },
        data: {
          usedCount: { decrement: 1 },
        },
      });
    }
  }

  /**
   * Get vouchers for an event
   */
  async getEventVouchers(eventId: string, organizerId: string) {
    // Verify event belongs to organizer
    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw ApiError.notFound(MESSAGES.EVENT.NOT_FOUND);
    }

    if (event.organizerId !== organizerId) {
      throw ApiError.forbidden(MESSAGES.AUTH.FORBIDDEN);
    }

    const vouchers = await prisma.voucher.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return vouchers;
  }
}

export const voucherService = new VoucherService();
export default voucherService;
