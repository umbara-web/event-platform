import prisma from '../configs/database.js';
import { ApiError } from '../utils/ApiError.js';
import { MESSAGES } from '../constants/index.js';
import cloudinaryService from './cloudinary.service.js';
import type { UpdateProfileInput } from '../validators/user.validator.js';

class UserService {
  // Get user profile
  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        role: true,
        referralCode: true,
        createdAt: true,
        _count: {
          select: {
            referrals: true,
            transactions: true,
            reviews: true,
          },
        },
      },
    });

    if (!user) {
      throw ApiError.notFound(MESSAGES.USER.NOT_FOUND);
    }

    return user;
  }

  // Update user profile
  async updateProfile(userId: string, data: UpdateProfileInput) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.firstName && { firstName: data.firstName }),
        ...(data.lastName && { lastName: data.lastName }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        role: true,
        referralCode: true,
      },
    });

    return user;
  }

  // Upload profile image
  async uploadProfileImage(userId: string, file: Express.Multer.File) {
    // Upload to cloudinary
    const result = await cloudinaryService.uploadProfileImage(
      file.buffer,
      userId
    );

    // Update user profile image
    const user = await prisma.user.update({
      where: { id: userId },
      data: { profileImage: result.url },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        role: true,
      },
    });

    return user;
  }

  // Get user points balance
  async getPointsBalance(userId: string) {
    const now = new Date();

    const points = await prisma.point.findMany({
      where: {
        userId,
        isUsed: false,
        expiresAt: { gt: now },
      },
      orderBy: { expiresAt: 'asc' },
    });

    const totalBalance = points.reduce((sum, point) => sum + point.amount, 0);

    return {
      totalBalance,
      points: points.map((p) => ({
        id: p.id,
        amount: p.amount,
        expiresAt: p.expiresAt,
        source: p.source,
        createdAt: p.createdAt,
      })),
    };
  }

  // Get user coupons
  async getUserCoupons(userId: string, includeUsed: boolean = false) {
    const now = new Date();

    const userCoupons = await prisma.userCoupon.findMany({
      where: {
        userId,
        ...(includeUsed ? {} : { isUsed: false }),
        expiresAt: { gt: now },
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
          },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    return userCoupons.map((uc) => ({
      id: uc.id,
      couponId: uc.coupon.id,
      code: uc.coupon.code,
      discountType: uc.coupon.discountType,
      discountValue: uc.coupon.discountValue,
      minPurchase: uc.coupon.minPurchase,
      maxDiscount: uc.coupon.maxDiscount,
      isUsed: uc.isUsed,
      expiresAt: uc.expiresAt,
    }));
  }

  // Get organizer profile (public)
  async getOrganizerProfile(organizerId: string) {
    const organizer = await prisma.user.findUnique({
      where: { id: organizerId, role: 'ORGANIZER' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        createdAt: true,
        organizedEvents: {
          where: { status: 'PUBLISHED' },
          select: {
            id: true,
            name: true,
            slug: true,
            imageUrl: true,
            startDate: true,
            _count: {
              select: { reviews: true },
            },
          },
          orderBy: { startDate: 'desc' },
          take: 10,
        },
      },
    });

    if (!organizer) {
      throw ApiError.notFound(MESSAGES.USER.NOT_FOUND);
    }

    // Get average rating across all events
    const ratings = await prisma.review.aggregate({
      where: {
        event: { organizerId },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    return {
      ...organizer,
      averageRating: ratings._avg.rating ?? 0,
      totalReviews: ratings._count.rating,
    };
  }

  // Get user transactions history
  async getTransactionHistory(userId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              imageUrl: true,
              startDate: true,
              venue: true,
            },
          },
          items: {
            include: {
              ticketTier: {
                select: {
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    return {
      transactions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    };
  }
}

export const userService = new UserService();
export default userService;
