import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { getSettings, updateSettings, getPublicSettings } from '../controllers/settings.controller.js';
import { settingsSchema } from '../validators/settings.validator.js';

const router = Router();

router.get('/public', getPublicSettings);
router.use(authenticate, authorize('admin'));
router.get('/', getSettings);
router.patch('/', validate(settingsSchema), updateSettings);

export default router;

