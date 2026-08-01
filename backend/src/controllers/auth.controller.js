import crypto from 'crypto';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import User from '../models/User.js';
import { tokenService } from '../services/token.service.js';
import { sendResetPasswordEmail, sendWelcomeEmail } from '../services/email.service.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie(process.env.JWT_COOKIE_NAME || 'sss_token', accessToken, tokenService.getAccessCookieOptions());
  res.cookie(process.env.JWT_REFRESH_COOKIE_NAME || 'sss_refresh_token', refreshToken, tokenService.getRefreshCookieOptions());
};

const clearAuthCookies = (res) => {
  res.clearCookie(process.env.JWT_COOKIE_NAME || 'sss_token', { ...tokenService.getAccessCookieOptions(), maxAge: 0 });
  res.clearCookie(process.env.JWT_REFRESH_COOKIE_NAME || 'sss_refresh_token', { ...tokenService.getRefreshCookieOptions(), maxAge: 0 });
};

const createAuthResponse = async (user) => {
  const accessToken = tokenService.generateAccessToken(user._id);
  const refreshToken = tokenService.generateRefreshToken(user._id);
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken, user: user.toPublicJSON() };
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const user = await User.create({ name, email, password, isVerified: true });
  const { accessToken, refreshToken } = await createAuthResponse(user);
  setAuthCookies(res, accessToken, refreshToken);
  await sendWelcomeEmail(user);
  res.status(201).json(new ApiResponse(201, { user: user.toPublicJSON(), accessToken, refreshToken }, 'Account created successfully'));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshToken');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated. Contact support.');
  const { accessToken, refreshToken } = await createAuthResponse(user);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json(new ApiResponse(200, { user: user.toPublicJSON(), accessToken, refreshToken }, 'Login successful'));
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies[process.env.JWT_REFRESH_COOKIE_NAME || 'sss_refresh_token'];
  if (req.user?._id) {
    await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });
  } else if (refreshToken) {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    await User.findByIdAndUpdate(payload.sub, { $unset: { refreshToken: 1 } });
  }
  clearAuthCookies(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out successfully'));
});

const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies[process.env.JWT_REFRESH_COOKIE_NAME || 'sss_refresh_token'];
  if (!refreshToken) throw new ApiError(401, 'Refresh token is required');

  let payload;
  try {
    payload = tokenService.verifyRefreshToken(refreshToken);
  } catch (error) {
    clearAuthCookies(res);
    throw new ApiError(401, 'Session expired. Please login again.');
  }

  const user = await User.findById(payload.sub).select('+refreshToken');
  if (!user || user.refreshToken !== refreshToken) {
    clearAuthCookies(res);
    throw new ApiError(401, 'Invalid refresh token. Please login again.');
  }
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated.');

  const { accessToken, refreshToken: newRefreshToken } = await createAuthResponse(user);
  setAuthCookies(res, accessToken, newRefreshToken);
  res.status(200).json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken, user: user.toPublicJSON() }, 'Token refreshed'));
});

const googleLogin = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) throw new ApiError(400, 'Google token is required');

  let payload;
  if (typeof fetch !== 'undefined') {
    const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token)}`);
    if (!response.ok) throw new ApiError(401, 'Invalid Google token');
    payload = await response.json();
  } else {
    throw new ApiError(500, 'Google verification unavailable');
  }

  const { email, name, picture, sub } = payload;
  if (!email) throw new ApiError(401, 'Could not retrieve email from Google');

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name: name || email.split('@')[0],
      email,
      avatar: picture || '',
      googleId: sub,
      isVerified: true,
    });
  } else {
    user.googleId = sub;
    if (picture && !user.avatar) user.avatar = picture;
    await user.save();
  }
  if (!user.isActive) throw new ApiError(403, 'Your account has been deactivated.');

  const { accessToken, refreshToken } = await createAuthResponse(user);
  setAuthCookies(res, accessToken, refreshToken);
  res.status(200).json(new ApiResponse(200, { user: user.toPublicJSON(), accessToken, refreshToken }, 'Google login successful'));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(200).json(new ApiResponse(200, null, 'If an account exists with this email, a reset link has been sent.'));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
  await sendResetPasswordEmail(user, resetUrl);
  res.status(200).json(new ApiResponse(200, null, 'Password reset link sent to your email.'));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new ApiError(400, 'Invalid or expired reset token');

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, 'Password reset successful. You can now login.'));
});

const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!user || !(await user.comparePassword(currentPassword))) {
    throw new ApiError(400, 'Current password is incorrect');
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json(new ApiResponse(200, null, 'Password changed successfully'));
});

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('savedProjects')
    .select('-password -refreshToken');
  res.status(200).json(new ApiResponse(200, user.toPublicJSON(), 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'phone', 'company', 'bio'];
  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (req.file && req.file.path) {
    const result = await cloudinaryService.uploadImage({ path: req.file.path });
    const current = await User.findById(req.user._id);
    if (current.avatar && current.avatar.includes('cloudinary.com')) {
      await cloudinaryService.deleteFile(current.avatar);
    }
    updates.avatar = result.url;
  } else if (req.body.avatar !== undefined) {
    updates.avatar = req.body.avatar;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true })
    .select('-password -refreshToken');
  res.status(200).json(new ApiResponse(200, user.toPublicJSON(), 'Profile updated successfully'));
});

const deleteAccount = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user.avatar && user.avatar.includes('cloudinary.com')) {
    await cloudinaryService.deleteFile(user.avatar);
  }
  await User.findByIdAndDelete(req.user._id);
  clearAuthCookies(res);
  res.status(200).json(new ApiResponse(200, null, 'Account deleted successfully'));
});

const saveProject = asyncHandler(async (req, res) => {
  const { projectId } = req.body;
  const user = await User.findById(req.user._id);
  const exists = user.savedProjects.some((id) => id.toString() === projectId);
  if (exists) {
    user.savedProjects = user.savedProjects.filter((id) => id.toString() !== projectId);
    await user.save();
    return res.status(200).json(new ApiResponse(200, { saved: false }, 'Project removed from saved'));
  }
  user.savedProjects.push(projectId);
  await user.save();
  res.status(200).json(new ApiResponse(200, { saved: true }, 'Project saved successfully'));
});

const getSavedProjects = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedProjects');
  res.status(200).json(new ApiResponse(200, { items: user.savedProjects }, 'Saved projects retrieved'));
});

export {
  register,
  login,
  logout,
  refreshToken,
  googleLogin,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateProfile,
  deleteAccount,
  saveProject,
  getSavedProjects,
};
