import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  getMyNotifications,
  markRead,
  markAllRead,
  deleteNotification,
  clearAll,
} from '../controllers/notification.controller.js';

const router = Router();

router.use(authenticate);
router.get('/', getMyNotifications);
router.patch('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/clear', clearAll);
router.delete('/:id', deleteNotification);

export default router;

