import emailTransporter from '../configs/email.js';
import config from '../configs/index.js';
import { formatRupiah } from '../utils/helpers.js';

interface TransactionEmailData {
  customerName: string;
  eventName: string;
  invoiceNumber: string;
  totalAmount: number;
  reason?: string;
}

interface WelcomeEmailData {
  name: string;
  referralCode: string;
}

interface PasswordResetEmailData {
  name: string;
  resetLink: string;
}

class EmailService {
  private async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    try {
      await emailTransporter.sendMail({ to, subject, html });
    } catch (error) {
      console.error('Failed to send email:', error);
      // Don't throw error, just log it to prevent transaction failures
    }
  }

  // Send welcome email
  async sendWelcomeEmail(to: string, data: WelcomeEmailData): Promise<void> {
    const subject = `Selamat Datang di ${config.appName}!`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .referral-code { background: #e0e7ff; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0; }
            .code { font-size: 24px; font-weight: bold; color: #4f46e5; letter-spacing: 2px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>${config.appName}</h1>
            </div>
            <div class="content">
              <h2>Halo ${data.name}! 👋</h2>
              <p>Selamat datang di ${config.appName}! Kami senang Anda bergabung dengan kami.</p>
              <p>Berikut adalah kode referral unik Anda:</p>
              <div class="referral-code">
                <span class="code">${data.referralCode}</span>
              </div>
              <p>Bagikan kode ini ke teman-teman Anda dan dapatkan <strong>10.000 poin</strong> setiap kali ada yang mendaftar menggunakan kode Anda!</p>
              <p>Teman yang menggunakan kode Anda juga akan mendapat <strong>diskon 10%</strong> untuk transaksi pertama mereka.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${config.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }

  // Send transaction accepted email
  async sendTransactionAcceptedEmail(
    to: string,
    data: TransactionEmailData
  ): Promise<void> {
    const subject = `Transaksi Anda Telah Dikonfirmasi - ${data.invoiceNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .success-icon { font-size: 48px; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="success-icon">✅</div>
              <h1>Pembayaran Dikonfirmasi!</h1>
            </div>
            <div class="content">
              <h2>Halo ${data.customerName}!</h2>
              <p>Kabar baik! Pembayaran Anda telah dikonfirmasi oleh penyelenggara.</p>
              <div class="details">
                <p><strong>No. Invoice:</strong> ${data.invoiceNumber}</p>
                <p><strong>Event:</strong> ${data.eventName}</p>
                <p><strong>Total Pembayaran:</strong> ${formatRupiah(data.totalAmount)}</p>
              </div>
              <p>Tiket Anda sudah aktif dan dapat digunakan untuk menghadiri event.</p>
              <p>Sampai jumpa di event! 🎉</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${config.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }

  // Send transaction rejected email
  async sendTransactionRejectedEmail(
    to: string,
    data: TransactionEmailData
  ): Promise<void> {
    const subject = `Transaksi Ditolak - ${data.invoiceNumber}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .reason { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Transaksi Ditolak</h1>
            </div>
            <div class="content">
              <h2>Halo ${data.customerName},</h2>
              <p>Mohon maaf, transaksi Anda tidak dapat diproses.</p>
              <div class="details">
                <p><strong>No. Invoice:</strong> ${data.invoiceNumber}</p>
                <p><strong>Event:</strong> ${data.eventName}</p>
              </div>
              ${
                data.reason
                  ? `
                <div class="reason">
                  <strong>Alasan Penolakan:</strong>
                  <p>${data.reason}</p>
                </div>
              `
                  : ''
              }
              <p>Jika Anda telah menggunakan poin atau kupon, semuanya telah dikembalikan ke akun Anda.</p>
              <p>Silakan coba lakukan transaksi kembali atau hubungi penyelenggara untuk informasi lebih lanjut.</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${config.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }

  // Send password reset email
  async sendPasswordResetEmail(
    to: string,
    data: PasswordResetEmailData
  ): Promise<void> {
    const subject = `Reset Password - ${config.appName}`;
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #4f46e5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Password</h1>
            </div>
            <div class="content">
              <h2>Halo ${data.name},</h2>
              <p>Kami menerima permintaan untuk reset password akun Anda.</p>
              <p>Klik tombol di bawah untuk membuat password baru:</p>
              <p style="text-align: center;">
                <a href="${data.resetLink}" class="button">Reset Password</a>
              </p>
              <div class="warning">
                <strong>⚠️ Penting:</strong>
                <p>Link ini hanya berlaku selama 1 jam. Jika Anda tidak meminta reset password, abaikan email ini.</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${config.appName}. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await this.sendEmail(to, subject, html);
  }
}

export const emailService = new EmailService();
export default emailService;
