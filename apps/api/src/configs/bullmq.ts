import { ConnectionOptions } from 'bullmq';
import config from './index';

// Parse REDIS_URL into BullMQ ConnectionOptions
// BullMQ creates its own internal ioredis connection — we just provide the config
const redisUrl = new URL(config.redisUrl);

export const bullmqConnection: ConnectionOptions = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port) || 6379,
  password: redisUrl.password || undefined,
  maxRetriesPerRequest: null, // Required by BullMQ
};
