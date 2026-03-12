// Mock config values for testing
export const config = {
  nodeEnv: 'test',
  port: 8000,
  apiVersion: 'v1',
  appName: 'Event Management Platform',
  isDevelopment: false,
  isProduction: false,
  isTest: true,
  databaseUrl: 'postgresql://test:test@localhost:5432/test_db',
  jwt: {
    accessSecret: 'test-access-secret-key-min-32-chars!!',
    refreshSecret: 'test-refresh-secret-key-min-32-chars!!',
    accessExpiresIn: '15m',
    refreshExpiresIn: '7d',
  },
  cloudinary: {
    cloudName: 'test-cloud',
    apiKey: 'test-api-key',
    apiSecret: 'test-api-secret',
  },
  email: {
    host: 'smtp.test.com',
    port: 587,
    user: 'test@test.com',
    pass: 'test-pass',
    from: 'noreply@test.com',
  },
  frontendUrl: 'http://localhost:3000',
  rateLimit: {
    windowMs: 900000,
    maxRequests: 100,
  },
  referral: {
    points: 10000,
    couponDiscountPercentage: 10,
  },
  expiry: {
    pointsMonths: 3,
    couponMonths: 3,
  },
  transaction: {
    paymentDeadlineHours: 2,
    confirmationDays: 3,
  },
} as const;

export type Config = typeof config;
export default config;
