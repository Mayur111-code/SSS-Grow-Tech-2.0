import { ApiError } from '../utils/ApiError.js';
import { getEmailTransporter } from '../config/email.js';

const transporterOptions = () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE) === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
});

const sendMail = async ({ to, subject, html, text }) => {
  const nodemailer = (await import('nodemailer')).default;
  const transporter = nodemailer.createTransport(transporterOptions());
  const from = process.env.MAIL_FROM || 'SSS Grow Tech <sssgrowtech@gmail.com>';
  const info = await transporter.sendMail({ to, subject, html, text, from });
  return info;
};

export const sendEmail = async (options) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    // eslint-disable-next-line no-console
    console.warn('SMTP not configured - skipping email send for:', options.to);
    return { skipped: true };
  }
  try {
    return await sendMail(options);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Email send failed:', error.message);
    return { failed: true };
  }
};

export const sendWelcomeEmail = async (user, password) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#4f46e5">Welcome to SSS Grow Tech</h2>
      <p>Hi ${user.name},</p>
      <p>Your account has been created successfully.</p>
      <p>Your email: <strong>${user.email}</strong></p>
      ${password ? `<p>Your temporary password: <strong>${password}</strong></p>
      <p>Please change it after your first login.</p>` : ''}
      <p><a href="${process.env.CLIENT_URL || 'http://localhost:3000'}/login">Login to your account</a></p>
    </div>
  `;
  return sendEmail({ to: user.email, subject: 'Welcome to SSS Grow Tech', html });
};

export const sendResetPasswordEmail = async (user, resetUrl) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#4f46e5">Reset your password</h2>
      <p>Hi ${user.name},</p>
      <p>You requested to reset your password. Click the link below to reset it:</p>
      <p><a href="${resetUrl}" style="display:inline-block;background:#4f46e5;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none">Reset Password</a></p>
      <p>This link expires in 1 hour.</p>
      <p>If you didn't request this, you can ignore this email.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject: 'Reset Your Password - SSS Grow Tech', html });
};

export const sendContactReplyEmail = async (contact, reply) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#4f46e5">Re: ${contact.subject}</h2>
      <p>Hi ${contact.name},</p>
      <p>Thank you for contacting SSS Grow Tech.</p>
      <div style="border-left:4px solid #4f46e5;padding:12px 16px;background:#f5f5ff;border-radius:6px;margin:16px 0">
        ${reply}
      </div>
      <p>Best regards,<br/>SSS Grow Tech Team</p>
    </div>
  `;
  return sendEmail({ to: contact.email, subject: `Re: ${contact.subject}`, html });
};

export const sendApplicationEmail = async (application, career) => {
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px">
      <h2 style="color:#4f46e5">Application Received</h2>
      <p>Hi ${application.name},</p>
      <p>We have received your application for the <strong>${career?.title}</strong> position at SSS Grow Tech.</p>
      <p>Our team will review your application and get back to you soon.</p>
      <p>Best regards,<br/>SSS Grow Tech HR Team</p>
    </div>
  `;
  return sendEmail({ to: application.email, subject: 'Application Received - SSS Grow Tech', html });
};

export { getEmailTransporter };
