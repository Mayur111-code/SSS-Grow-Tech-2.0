import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import { uploadImage, uploadResume, deleteUpload } from '../controllers/upload.controller.js';

const router = Router();

router.use(authenticate);
router.post('/image', upload.single('image'), uploadImage);
router.post('/resume', authorize('admin', 'user'), upload.single('resume'), uploadResume);
router.delete('/', deleteUpload);

export default router;

