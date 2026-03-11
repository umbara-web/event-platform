/// <reference types="jest" />

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
import dotenv from 'dotenv';
import path from 'path';
import { prismaMock } from './prismaMock';

// Load .env.test SEBELUM mock apapun
dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

// ✅ PENTING: Mock uuid SEBELUM import apapun yang menggunakannya
jest.mock('uuid', () => {
  return {
    v4: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx',
    __esModule: true,
  };
});

// Mock cloudinary service
jest.mock('../src/services/cloudinary.service', () => ({
  __esModule: true,
  default: {
    uploadEventImage: jest.fn().mockResolvedValue({
      url: 'https://cloudinary.com/image.jpg',
      publicId: 'public-id',
    }),
    deleteByPrefix: jest.fn().mockResolvedValue(undefined),
  },
  cloudinaryService: {
    uploadEventImage: jest.fn().mockResolvedValue({
      url: 'https://cloudinary.com/image.jpg',
      publicId: 'public-id',
    }),
    deleteByPrefix: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock voucher service
jest.mock('../src/services/voucher.service', () => ({
  __esModule: true,
  default: {
    refundVoucher: jest.fn().mockResolvedValue(undefined),
  },
  voucherService: {
    refundVoucher: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock coupon service
jest.mock('../src/services/coupon.service', () => ({
  __esModule: true,
  default: {
    refundCoupon: jest.fn().mockResolvedValue(undefined),
  },
  couponService: {
    refundCoupon: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock('../src/lib/prisma', () => ({ prisma: prismaMock }));

jest.mock('../src/configs/database', () => ({
  __esModule: true,
  default: prismaMock,
  prisma: prismaMock,
}));

beforeEach(() => {
  mockReset(prismaMock);
  jest.clearAllMocks();
});

jest.setTimeout(10000);

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
