import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

const accessSecret = process.env.JWT_SECRET || 'sss_access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'sss_refresh_secret';
const accessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const refreshExpiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

export const tokenService = {
  generateAccessToken(userId) {
    return jwt.sign({ sub: userId.toString() }, accessSecret, {
      expiresIn: accessExpiresIn,
    });
  },

  generateRefreshToken(userId) {
    return jwt.sign({ sub: userId.toString() }, refreshSecret, {
      expiresIn: refreshExpiresIn,
    });
  },

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, accessSecret);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired token');
    }
  },

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, refreshSecret);
    } catch (error) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }
  },

  getAccessCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 15 * 60 * 1000,
      path: '/',
    };
  },

  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    };
  },
};

export default tokenService;
