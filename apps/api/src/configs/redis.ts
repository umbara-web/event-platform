import { createClient } from 'redis';
import config from './index';

export const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log('✅ Redis connected successfully');
    }
  } catch (error) {
    console.error('❌ Failed to connect to Redis:', error);
    process.exit(1);
  }
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient.isOpen) {
      await redisClient.quit();
      console.log('✅ Redis disconnected gracefully');
    }
  } catch (error) {
    console.error('❌ Error during Redis disconnection:', error);
  }
};
