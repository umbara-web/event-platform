/// <reference types="jest" />

import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset } from 'jest-mock-extended';
// import dotenv from 'dotenv';
import path from 'path';
import { prismaMock } from './prismaMock';

// Mock Redis client so tests don't need a real Redis connection
jest.mock('../src/configs/redis', () => ({
  redisClient: {
    isOpen: false,
    sendCommand: jest.fn().mockResolvedValue(null),
    connect: jest.fn().mockResolvedValue(undefined),
    quit: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  },
  connectRedis: jest.fn().mockResolvedValue(undefined),
  disconnectRedis: jest.fn().mockResolvedValue(undefined),
}));

// Mock rate limiter middleware to bypass Redis dependency in API tests
// All limiter functions are used directly as middleware in routes (not as limiter()),
// so all must be plain (req, res, next) => next() functions
jest.mock('../src/middlewares/rateLimiter.middleware', () => {
  const passThrough = (_req: any, _res: any, next: any) => next();
  return {
    __esModule: true,
    apiLimiter: passThrough,
    authLimiter: passThrough,
    passwordResetLimiter: passThrough,
    default: {
      apiLimiter: passThrough,
      authLimiter: passThrough,
      passwordResetLimiter: passThrough,
    },
  };
});

// Mock BullMQ to prevent ioredis connections during tests
jest.mock('bullmq', () => ({
  Queue: jest.fn().mockImplementation(() => ({
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    close: jest.fn().mockResolvedValue(undefined),
    obliterate: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
  Worker: jest.fn().mockImplementation(() => ({
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
  QueueEvents: jest.fn().mockImplementation(() => ({
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  })),
}));

// Mock email queue
jest.mock('../src/queues/email.queue', () => ({
  __esModule: true,
  emailQueue: {
    add: jest.fn().mockResolvedValue({ id: 'mock-job-id' }),
    close: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
  },
}));

// Mock email service
jest.mock('../src/services/email.service', () => ({
  __esModule: true,
  default: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    sendTransactionAcceptedEmail: jest.fn().mockResolvedValue(undefined),
    sendTransactionRejectedEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  },
  emailService: {
    sendWelcomeEmail: jest.fn().mockResolvedValue(undefined),
    sendTransactionAcceptedEmail: jest.fn().mockResolvedValue(undefined),
    sendTransactionRejectedEmail: jest.fn().mockResolvedValue(undefined),
    sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
  },
}));

// Mock bullmq config
jest.mock('../src/configs/bullmq', () => ({
  __esModule: true,
  bullmqConnection: {
    host: 'localhost',
    port: 6379,
    maxRetriesPerRequest: null,
  },
}));

// Load .env.test SEBELUM mock apapun
// dotenv.config({ path: path.resolve(__dirname, '../.env.test') });

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
