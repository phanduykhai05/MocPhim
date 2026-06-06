import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    const port = this.config.get<number>('MAIL_PORT', 465);
    this.transporter = nodemailer.createTransport({
      host: this.config.get('MAIL_HOST', 'smtp.gmail.com'),
      port,
      secure: port !== 587,
      family: 4, // Force IPv4 — Render blocks IPv6 outbound (not in @types/nodemailer)
      auth: {
        user: this.config.get('MAIL_USER'),
        pass: this.config.get('MAIL_PASS'),
      },
      connectionTimeout: 15000,
      greetingTimeout: 15000,
      socketTimeout: 20000,
    } as any);
  }

  async sendVerificationEmail(email: string, name: string, token: string) {
    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const verifyUrl = `${frontendUrl}/auth/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"MocPhim" <${this.config.get('MAIL_FROM', 'noreply@mocphim.com')}>`,
        to: email,
        subject: 'Xác nhận email đăng ký tài khoản',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e50914;">Chào mừng đến với MocPhim, ${name}!</h2>
            <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấn nút bên dưới để xác nhận email của bạn.</p>
            <a href="${verifyUrl}" style="display: inline-block; background: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Xác nhận email
            </a>
            <p style="color: #888; font-size: 14px;">Link có hiệu lực trong 24 giờ. Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.</p>
          </div>
        `,
      });
    } catch (err: any) {
      this.logger.error(`Failed to send verification email to ${email}: ${err.message}`);
      throw err;
    }
  }

  async sendResetPasswordEmail(email: string, name: string, token: string) {
    const frontendUrl = this.config.get('FRONTEND_URL', 'http://localhost:3000');
    const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: `"MocPhim" <${this.config.get('MAIL_FROM', 'noreply@mocphim.com')}>`,
        to: email,
        subject: 'Đặt lại mật khẩu MocPhim',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #e50914;">Đặt lại mật khẩu</h2>
            <p>Xin chào ${name}, chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #e50914; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 16px 0;">
              Đặt lại mật khẩu
            </a>
            <p style="color: #888; font-size: 14px;">Link có hiệu lực trong 15 phút. Nếu bạn không yêu cầu đặt lại mật khẩu, hãy bỏ qua email này.</p>
          </div>
        `,
      });
    } catch (err: any) {
      this.logger.error(`Failed to send reset password email to ${email}: ${err.message}`);
      throw err;
    }
  }
}
