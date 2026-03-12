/// <reference types="jest" />

import { prismaMock } from '../prismaMock';
import { authService } from '../../src/services/auth.service';
import { ApiError } from '../../src/utils/ApiError';
import { createMockUser } from '../helpers/testUtils';
import * as hashUtils from '../../src/utils/hash';

// ✅ Mock referralCode untuk menghindari uuid error
jest.mock('../../src/utils/referralCode', () => ({
  generateReferralCode: jest.fn(() => 'REF-TESTCODE'),
}));

jest.mock('../../src/utils/hash', () => ({
  hashPassword: jest.fn().mockResolvedValue('$2a$12$hashedpassword'),
  comparePassword: jest.fn(),
  generateRandomToken: jest.fn().mockReturnValue('random-token'),
}));

jest.mock('../../src/services/email.service', () => ({
  __esModule: true,
  default: {
    sendWelcomeEmail: jest.fn(),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

describe('AuthService', () => {
  describe('register', () => {
    const registerData = {
      email: 'newuser@example.com',
      password: 'Password123',
      firstName: 'New',
      lastName: 'User',
      role: 'CUSTOMER' as const,
    };

    it('should register a new user successfully', async () => {
      const mockUser = createMockUser({
        email: registerData.email,
        firstName: registerData.firstName,
        lastName: registerData.lastName,
        referralCode: 'REF-TESTCODE',
      });

      prismaMock.user.findUnique.mockResolvedValue(null);

      (prismaMock.$transaction as jest.Mock).mockImplementation(async (callback: any) => {
        prismaMock.user.create.mockResolvedValue(mockUser);
        prismaMock.refreshToken.create.mockResolvedValue({
          id: 'refresh-token-id',
          token: 'refresh-token',
          userId: mockUser.id,
          expiresAt: new Date(),
          createdAt: new Date(),
        });
        return callback(prismaMock);
      });

      const result = await authService.register(registerData);

      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(registerData.email);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    it('should throw error if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue(createMockUser());

      await expect(authService.register(registerData)).rejects.toThrow(ApiError);
    });

    it('should throw error if referral code is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

      await expect(
        authService.register({
          ...registerData,
          referralCode: 'INVALID-CODE',
        })
      ).rejects.toThrow(ApiError);
    });
  });

  describe('login', () => {
    const loginData = {
      email: 'test@example.com',
      password: 'Password123',
    };

    it('should login successfully with correct credentials', async () => {
      const mockUser = createMockUser();

      prismaMock.user.findUnique.mockResolvedValue(mockUser);
      (
        hashUtils.comparePassword as jest.MockedFunction<typeof hashUtils.comparePassword>
      ).mockResolvedValue(true);
      prismaMock.refreshToken.create.mockResolvedValue({
        id: 'refresh-token-id',
        token: 'refresh-token',
        userId: mockUser.id,
        expiresAt: new Date(),
        createdAt: new Date(),
      });

      const result = await authService.login(loginData);

      expect(result.user).toBeDefined();
      expect(result.tokens).toBeDefined();
    });

    it('should throw error with incorrect email', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(ApiError);
    });

    it('should throw error with incorrect password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(createMockUser());
      (
        hashUtils.comparePassword as jest.MockedFunction<typeof hashUtils.comparePassword>
      ).mockResolvedValue(false);

      await expect(authService.login(loginData)).rejects.toThrow(ApiError);
    });
  });

  describe('logout', () => {
    it('should delete refresh token on logout', async () => {
      prismaMock.refreshToken.deleteMany.mockResolvedValue({ count: 1 });

      await authService.logout('refresh-token');

      expect(prismaMock.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { token: 'refresh-token' },
      });
    });
  });
});
