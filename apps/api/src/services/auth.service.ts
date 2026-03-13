import { Role } from '@prisma/client';
import prisma from '../configs/database';
import { ApiError } from '../utils/ApiError';
import { MESSAGES } from '../constants/index';
import config from '../configs/index';
import {
  generateTokenPair,
  verifyRefreshToken,
  getRefreshTokenExpiry,
} from '../utils/jwt';
import {
  hashPassword,
  comparePassword,
  generateRandomToken,
} from '../utils/hash';
import { generateReferralCode } from '../utils/referralCode';
import { addMonths, addHours } from '../utils/helpers';
import emailService from './email.service';
import type {
  RegisterInput,
  LoginInput,
  TokenPair,
  JWTPayload,
} from '../types/index';

class AuthService {
  // Register a new user
  async register(
    data: RegisterInput
  ): Promise<{ user: JWTPayload; tokens: TokenPair }> {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw ApiError.conflict(MESSAGES.AUTH.EMAIL_EXISTS);
    }

    // Validate referral code if provided
    let referrer = null;
    if (data.referralCode) {
      referrer = await prisma.user.findUnique({
        where: { referralCode: data.referralCode },
      });

      if (!referrer) {
        throw ApiError.badRequest(MESSAGES.AUTH.REFERRAL_NOT_FOUND);
      }
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Generate unique referral code
    let referralCode = generateReferralCode();
    let isUnique = false;

    while (!isUnique) {
      const existing = await prisma.user.findUnique({
        where: { referralCode },
      });
      if (!existing) {
        isUnique = true;
      } else {
        referralCode = generateReferralCode();
      }
    }

    // Create user with transaction (to handle referral rewards)
    const user = await prisma.$transaction(async (tx) => {
      // Create user
      const newUser = await tx.user.create({
        data: {
          email: data.email,
          password: hashedPassword,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          referralCode,
          referredById: referrer?.id,
        },
      });

      // If registered with referral code, give rewards
      if (referrer) {
        // Give points to referrer (10,000 points, expires in 3 months)
        await tx.point.create({
          data: {
            userId: referrer.id,
            amount: config.referral.points,
            expiresAt: addMonths(new Date(), config.expiry.pointsMonths),
            source: 'REFERRAL',
          },
        });

        // Create system coupon if not exists
        let systemCoupon = await tx.coupon.findFirst({
          where: {
            isSystemGenerated: true,
            discountType: 'PERCENTAGE',
            discountValue: config.referral.couponDiscountPercentage,
          },
        });

        if (!systemCoupon) {
          systemCoupon = await tx.coupon.create({
            data: {
              code: `WELCOME${config.referral.couponDiscountPercentage}`,
              discountType: 'PERCENTAGE',
              discountValue: config.referral.couponDiscountPercentage,
              minPurchase: 0,
              startDate: new Date(),
              endDate: addMonths(new Date(), 12), // System coupon valid for 1 year
              isActive: true,
              isSystemGenerated: true,
            },
          });
        }

        // Give coupon to new user (expires in 3 months)
        await tx.userCoupon.create({
          data: {
            userId: newUser.id,
            couponId: systemCoupon.id,
            expiresAt: addMonths(new Date(), config.expiry.couponMonths),
          },
        });
      }

      return newUser;
    });

    // Generate tokens
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const tokens = generateTokenPair(payload);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, {
      name: user.firstName,
      referralCode: user.referralCode,
    });

    return { user: payload, tokens };
  }

  // Login user
  async login(
    data: LoginInput
  ): Promise<{ user: JWTPayload; tokens: TokenPair }> {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Verify password
    const isPasswordValid = await comparePassword(data.password, user.password);

    if (!isPasswordValid) {
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    // Generate tokens
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const tokens = generateTokenPair(payload);

    // Save refresh token
    await prisma.refreshToken.create({
      data: {
        token: tokens.refreshToken,
        userId: user.id,
        expiresAt: getRefreshTokenExpiry(),
      },
    });

    return { user: payload, tokens };
  }

  // Refresh access token
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if refresh token exists in database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      // Delete expired token if exists
      if (storedToken) {
        await prisma.refreshToken.delete({
          where: { id: storedToken.id },
        });
      }
      throw ApiError.unauthorized(MESSAGES.AUTH.INVALID_TOKEN);
    }

    // Generate new tokens
    const newPayload: JWTPayload = {
      id: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
      firstName: storedToken.user.firstName,
      lastName: storedToken.user.lastName,
    };

    const tokens = generateTokenPair(newPayload);

    // Delete old refresh token and create new one
    await prisma.$transaction([
      prisma.refreshToken.delete({
        where: { id: storedToken.id },
      }),
      prisma.refreshToken.create({
        data: {
          token: tokens.refreshToken,
          userId: storedToken.userId,
          expiresAt: getRefreshTokenExpiry(),
        },
      }),
    ]);

    return tokens;
  }

  // Logout user
  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  // Logout from all devices
  async logoutAll(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });
  }

  // Request password reset
  async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return;
    }

    // Generate reset token
    const resetToken = generateRandomToken();
    const resetTokenExp = addHours(new Date(), 1); // 1 hour expiry

    // Save reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExp,
      },
    });

    // Send reset email
    const resetLink = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    await emailService.sendPasswordResetEmail(user.email, {
      name: user.firstName,
      resetLink,
    });
  }

  // Reset password with token
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw ApiError.badRequest(MESSAGES.AUTH.INVALID_TOKEN);
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExp: null,
      },
    });

    // Logout from all devices
    await this.logoutAll(user.id);
  }

  // Change password
  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw ApiError.notFound(MESSAGES.USER.NOT_FOUND);
    }

    // Verify current password
    const isPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      throw ApiError.badRequest('Password saat ini tidak valid');
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Logout from all devices
    await this.logoutAll(userId);
  }
}

export const authService = new AuthService();
export default authService;
