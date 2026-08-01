import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listUsers,
  getUser,
  updateUser,
  toggleUserStatus,
  changeUserRole,
  deleteUser,
  bulkDeleteUsers,
  getDashboardStats,
} from '../controllers/user.controller.js';
import { bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStats);
router.get('/', listUsers);
router.get('/:id', getUser);
router.patch('/:id', upload.single('avatar'), updateUser);
router.patch('/:id/toggle-status', toggleUserStatus);
router.patch('/:id/role', changeUserRole);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteUsers);
router.delete('/:id', deleteUser);

export default router;

