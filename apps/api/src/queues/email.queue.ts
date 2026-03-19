import { Queue } from 'bullmq';
import { bullmqConnection } from '../configs/bullmq';

export type EmailJobName = 'sendEmail';

export interface EmailJobData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const emailQueue = new Queue<EmailJobData, void, EmailJobName>('emailQueue', {
  connection: bullmqConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});
