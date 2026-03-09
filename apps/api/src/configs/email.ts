import nodemailer, { Transporter } from 'nodemailer';
import config from './index.js';

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailTransporter {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.port === 465,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });
  }

  async sendMail(options: EmailOptions): Promise<void> {
    const mailOptions = {
      from: config.email.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      console.log('✅ Email transporter is ready');
      return true;
    } catch (error) {
      console.error('❌ Email transporter verification failed:', error);
      return false;
    }
  }
}

export const emailTransporter = new EmailTransporter();
export default emailTransporter;
