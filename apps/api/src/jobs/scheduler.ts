import cron from 'node-cron';
import { expireTransactionsJob } from './expireTransactions.job';
import { autoCancelTransactionsJob } from './autoCancelTransactions.job';
import { expirePointsJob } from './expirePoints.job';
import { expireCouponsJob } from './expireCoupons.job';

export const initializeScheduler = (): void => {
  console.log('🕐 Initializing scheduled jobs...');

  // Run every 5 minutes - Expire transactions waiting for payment
  cron.schedule('*/5 * * * *', () => {
    console.log('Running: Expire transactions job');
    expireTransactionsJob();
  });

  // Run every hour - Auto-cancel unconfirmed transactions
  cron.schedule('0 * * * *', () => {
    console.log('Running: Auto-cancel transactions job');
    autoCancelTransactionsJob();
  });

  // Run daily at midnight - Expire points
  cron.schedule('0 0 * * *', () => {
    console.log('Running: Expire points job');
    expirePointsJob();
  });

  // Run daily at midnight - Expire coupons
  cron.schedule('0 0 * * *', () => {
    console.log('Running: Expire coupons job');
    expireCouponsJob();
  });

  console.log('✅ Scheduled jobs initialized');
};

export default initializeScheduler;
