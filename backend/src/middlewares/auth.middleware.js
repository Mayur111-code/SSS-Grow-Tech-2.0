import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import User from '../models/User.js';
import { tokenService } from '../services/token.service.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  let token = null;

  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies && req.cookies[process.env.JWT_COOKIE_NAME || 'sss_token']) {
    token = req.cookies[process.env.JWT_COOKIE_NAME || 'sss_token'];
  }

  if (!token) {
    throw new ApiError(401, 'Authentication required. Please login.');
  }

  const payload = tokenService.verifyAccessToken(token);
  const user = await User.findById(payload.sub).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(401, 'User not found. Please login again.');
  }

  req.user = user;
  next();
});

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, 'Authentication required.'));
  }
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, 'You do not have permission to perform this action.'));
  }
  next();
};

export default authenticate;
