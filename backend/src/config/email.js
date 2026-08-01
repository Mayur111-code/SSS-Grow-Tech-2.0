import { ApiError } from '../utils/ApiError.js';

const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 465,
  secure: String(process.env.SMTP_SECURE) === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
};

export const getEmailTransporter = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return null;
  }
  return { config: emailConfig };
};

export const assertEmailConfigured = () => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new ApiError(500, 'Email service is not configured');
  }
};
