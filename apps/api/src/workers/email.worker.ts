import { Worker, Job } from 'bullmq';
import { bullmqConnection } from '../configs/bullmq';
import emailTransporter from '../configs/email';
import { EmailJobData, EmailJobName } from '../queues/email.queue';

export const emailWorker = new Worker<EmailJobData, void, EmailJobName>(
  'emailQueue',
  async (job: Job<EmailJobData, void, EmailJobName>) => {
    console.log(`✉️  [EMAIL WORKER] Processing job ${job.id} → ${job.data.to}`);
    await emailTransporter.sendMail(job.data);
  },
  {
    connection: bullmqConnection,
    concurrency: 5,
  }
);

emailWorker.on('completed', (job) => {
  console.log(`✅ [EMAIL WORKER] Job ${job.id} completed — Email sent to ${job.data.to}`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`❌ [EMAIL WORKER] Job ${job?.id} failed:`, err.message);
});
