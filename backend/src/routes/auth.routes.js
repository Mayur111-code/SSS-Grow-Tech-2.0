import { Router } from 'express';
import { authLimiter } from '../middlewares/rateLimiter.js';
import { validate } from '../middlewares/validate.middleware.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
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
} from '../controllers/auth.controller.js';
import {
  registerSchema,
  loginSchema,
  googleLoginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
  refreshTokenSchema,
  updateProfileSchema,
  saveProjectSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', validate(googleLoginSchema), googleLogin);
router.post('/logout', logout);
router.post('/refresh-token', validate(refreshTokenSchema), refreshToken);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);

router.use(authenticate);
router.get('/me', getMe);
router.patch('/profile', upload.single('avatar'), validate(updateProfileSchema), updateProfile);
router.post('/change-password', validate(changePasswordSchema), changePassword);
router.delete('/account', deleteAccount);
router.post('/save-project', validate(saveProjectSchema), saveProject);
router.get('/saved-projects', getSavedProjects);

export default router;

