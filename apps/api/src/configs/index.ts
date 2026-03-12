import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Environment variables validation schema
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('8000').transform(Number),
  API_VERSION: z.string().default('v1'),
  APP_NAME: z.string().default('Event Management Platform'),

  // Database
  DATABASE_URL: z.string().url(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  // Email
  SMTP_HOST: z.string(),
  SMTP_PORT: z.string().transform(Number),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  EMAIL_FROM: z.string(),

  // Frontend URL
  FRONTEND_URL: z.string().url(),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform(Number),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform(Number),

  // Points & Coupon Configuration
  REFERRAL_POINTS: z.string().default('10000').transform(Number),
  REFERRAL_COUPON_DISCOUNT_PERCENTAGE: z.string().default('10').transform(Number),
  POINTS_EXPIRY_MONTHS: z.string().default('3').transform(Number),
  COUPON_EXPIRY_MONTHS: z.string().default('3').transform(Number),

  // Transaction Configuration
  PAYMENT_DEADLINE_HOURS: z.string().default('2').transform(Number),
  ORGANIZER_CONFIRMATION_DAYS: z.string().default('3').transform(Number),
});

// Validate and parse environment variables
const parseEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missingVars = result.error.issues.map((issue) => issue.path.join('.')).join(', ');
    throw new Error(`❌ Missing or invalid environment variables: ${missingVars}`);
  }

  return result.data;
};

// Test default values — digunakan saat NODE_ENV=test agar tidak perlu env vars asli
const getTestDefaults = () => ({
  NODE_ENV: 'test' as const,
  PORT: 8000,
  API_VERSION: 'v1',
  APP_NAME: 'Event Management Platform',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  JWT_ACCESS_SECRET: 'test-access-secret-key-min-32-chars!!',
  JWT_REFRESH_SECRET: 'test-refresh-secret-key-min-32-chars!!',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  CLOUDINARY_CLOUD_NAME: 'test-cloud',
  CLOUDINARY_API_KEY: 'test-api-key',
  CLOUDINARY_API_SECRET: 'test-api-secret',
  SMTP_HOST: 'smtp.test.com',
  SMTP_PORT: 587,
  SMTP_USER: 'test@test.com',
  SMTP_PASS: 'test-pass',
  EMAIL_FROM: 'noreply@test.com',
  FRONTEND_URL: 'http://localhost:3000',
  RATE_LIMIT_WINDOW_MS: 900000,
  RATE_LIMIT_MAX_REQUESTS: 100,
  REFERRAL_POINTS: 10000,
  REFERRAL_COUPON_DISCOUNT_PERCENTAGE: 10,
  POINTS_EXPIRY_MONTHS: 3,
  COUPON_EXPIRY_MONTHS: 3,
  PAYMENT_DEADLINE_HOURS: 2,
  ORGANIZER_CONFIRMATION_DAYS: 3,
});

const env = process.env.NODE_ENV === 'test' ? getTestDefaults() : parseEnv();

// Export configuration object
export const config = {
  // Application
  nodeEnv: env.NODE_ENV,
  port: env.PORT,
  apiVersion: env.API_VERSION,
  appName: env.APP_NAME,
  isDevelopment: env.NODE_ENV === 'development',
  isProduction: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  // Database
  databaseUrl: env.DATABASE_URL,

  // JWT
  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  // Cloudinary
  cloudinary: {
    cloudName: env.CLOUDINARY_CLOUD_NAME,
    apiKey: env.CLOUDINARY_API_KEY,
    apiSecret: env.CLOUDINARY_API_SECRET,
  },

  // Email
  email: {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
    from: env.EMAIL_FROM,
  },

  // Frontend URL
  frontendUrl: env.FRONTEND_URL,

  // Rate Limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },

  // Business Logic
  referral: {
    points: env.REFERRAL_POINTS,
    couponDiscountPercentage: env.REFERRAL_COUPON_DISCOUNT_PERCENTAGE,
  },

  expiry: {
    pointsMonths: env.POINTS_EXPIRY_MONTHS,
    couponMonths: env.COUPON_EXPIRY_MONTHS,
  },

  transaction: {
    paymentDeadlineHours: env.PAYMENT_DEADLINE_HOURS,
    confirmationDays: env.ORGANIZER_CONFIRMATION_DAYS,
  },
} as const;

export type Config = typeof config;
export default config;
