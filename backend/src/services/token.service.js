import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';
import { sessionConfig } from '../config/session.js';

const accessSecret = process.env.JWT_SECRET || 'sss_access_secret';
const refreshSecret = process.env.JWT_REFRESH_SECRET || 'sss_refresh_secret';
const accessExpiresIn = sessionConfig.accessTokenTtl;
const refreshExpiresIn = sessionConfig.refreshTokenTtl;

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
      maxAge: sessionConfig.accessCookieMaxAgeMs,
      path: '/',
    };
  },

  getRefreshCookieOptions() {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: sessionConfig.refreshCookieMaxAgeMs,
      path: '/',
    };
  },
};

export default tokenService;
