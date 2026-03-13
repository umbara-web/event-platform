import prisma from '../configs/database';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';
import { calculateDiscount, addMonths } from '../utils/helpers';
import config from '../configs/index';

export interface CouponValidationResult {
  isValid: boolean;
  userCouponId: string;
  discountAmount: number;
  message?: string;
}

class CouponService {
  // Validate and calculate coupon discount
  async validateCoupon(
    userId: string,
    couponId: string,
    totalAmount: number
  ): Promise<CouponValidationResult> {
    const now = new Date();

    // Find user's coupon
    const userCoupon = await prisma.userCoupon.findFirst({
      where: {
        id: couponId,
        userId,
        isUsed: false,
        expiresAt: { gt: now },
      },
      include: {
        coupon: true,
      },
    });

    if (!userCoupon) {
      return {
        isValid: false,
        userCouponId: '',
        discountAmount: 0,
        message: MESSAGES.COUPON.NOT_FOUND,
      };
    }

    const { coupon } = userCoupon;

    // Check if coupon is active
    if (!coupon.isActive) {
      return {
        isValid: false,
        userCouponId: '',
        discountAmount: 0,
        message: MESSAGES.COUPON.INVALID,
      };
    }

    // Check coupon validity period
    if (now < coupon.startDate || now > coupon.endDate) {
      return {
        isValid: false,
        userCouponId: '',
        discountAmount: 0,
        message: MESSAGES.COUPON.EXPIRED,
      };
    }

    // Check minimum purchase
    if (totalAmount < coupon.minPurchase) {
      return {
        isValid: false,
        userCouponId: '',
        discountAmount: 0,
        message: `Minimum pembelian ${coupon.minPurchase}`,
      };
    }

    // Calculate discount
    const discountAmount = calculateDiscount(
      totalAmount,
      coupon.discountType,
      coupon.discountValue,
      coupon.maxDiscount
    );

    return {
      isValid: true,
      userCouponId: userCoupon.id,
      discountAmount,
    };
  }

  // Use coupon (mark as used)
  async useCoupon(userCouponId: string, tx?: any): Promise<void> {
    const prismaClient = tx || prisma;

    await prismaClient.userCoupon.update({
      where: { id: userCouponId },
      data: {
        isUsed: true,
        usedAt: new Date(),
      },
    });

    // Increment coupon usage count
    const userCoupon = await prismaClient.userCoupon.findUnique({
      where: { id: userCouponId },
    });

    if (userCoupon) {
      await prismaClient.coupon.update({
        where: { id: userCoupon.couponId },
        data: {
          usedCount: { increment: 1 },
        },
      });
    }
  }

  // Refund coupon (when transaction is cancelled/rejected)
  async refundCoupon(transactionId: string, tx?: any): Promise<void> {
    const prismaClient = tx || prisma;

    const transactionCoupon = await prismaClient.transactionCoupon.findUnique({
      where: { transactionId },
      include: { userCoupon: true },
    });

    if (transactionCoupon) {
      // Restore user coupon with new expiry
      await prismaClient.userCoupon.update({
        where: { id: transactionCoupon.userCouponId },
        data: {
          isUsed: false,
          usedAt: null,
          expiresAt: addMonths(new Date(), config.expiry.couponMonths),
        },
      });

      // Decrement coupon usage count
      await prismaClient.coupon.update({
        where: { id: transactionCoupon.userCoupon.couponId },
        data: {
          usedCount: { decrement: 1 },
        },
      });
    }
  }

  // Get user's available coupons
  async getUserCoupons(userId: string) {
    const now = new Date();

    const userCoupons = await prisma.userCoupon.findMany({
      where: {
        userId,
        isUsed: false,
        expiresAt: { gt: now },
        coupon: {
          isActive: true,
          endDate: { gt: now },
        },
      },
      include: {
        coupon: {
          select: {
            id: true,
            code: true,
            discountType: true,
            discountValue: true,
            minPurchase: true,
            maxDiscount: true,
            startDate: true,
            endDate: true,
          },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return userCoupons;
  }

  // Expire old coupons (called by cron job)
  async expireCoupons(): Promise<number> {
    const now = new Date();

    const result = await prisma.userCoupon.updateMany({
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

export const couponService = new CouponService();
export default couponService;
