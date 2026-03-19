import config from './configs/index';
import { connectDatabase, disconnectDatabase } from './configs/database';
import { connectRedis, disconnectRedis } from './configs/redis';
import { initializeScheduler } from './jobs/scheduler';
import emailTransporter from './configs/email';

const startWorker = async (): Promise<void> => {
  try {
    console.log('Starting background worker...');

    // Connect to database
    await connectDatabase();

    // Connect to Redis Cache
    await connectRedis();

    // Verify email transporter
    await emailTransporter.verifyConnection();

    // Initialize scheduled jobs
    initializeScheduler();

    console.log(`
╔══════════════════════════════════════════════════════════════════════════════════╗
║                                                                                  ║
║   🚀 ${config.appName} Background Worker                                         ║
║   Environment: ${config.nodeEnv}                                                 ║
║   Status: Running cron jobs & task scheduler                                     ║
║                                                                                  ║
╚══════════════════════════════════════════════════════════════════════════════════╝
    `);

    // Graceful shutdown
    const shutdown = async (signal: string): Promise<void> => {
      console.log(`\n${signal} received. Shutting down worker gracefully...`);

      // Force shutdown after 10 seconds
      setTimeout(() => {
        console.error(
          'Could not close connections in time, forcefully shutting down worker'
        );
        process.exit(1);
      }, 10000);

      await disconnectRedis();
      await disconnectDatabase();
      console.log('Database and Cache connections closed. Worker stopped.');
      process.exit(0);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start worker:', error);
    process.exit(1);
  }
};

startWorker();
