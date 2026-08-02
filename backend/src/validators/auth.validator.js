import { z } from 'zod';
import { imageField } from './common.validator.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const googleLoginSchema = z.object({
  token: z.string().min(1, 'Google token is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('Please provide a valid email'),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters').max(72),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required').optional(),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80).optional(),
  phone: z.string().max(30).optional().nullable(),
  company: z.string().max(100).optional().nullable(),
  bio: z.string().max(1000).optional().nullable(),
  avatar: imageField,
});

export const saveProjectSchema = z.object({
  projectId: z.string().min(1, 'Project ID is required'),
});

export default { registerSchema, loginSchema, googleLoginSchema, forgotPasswordSchema, resetPasswordSchema, changePasswordSchema, refreshTokenSchema, updateProfileSchema, saveProjectSchema };
