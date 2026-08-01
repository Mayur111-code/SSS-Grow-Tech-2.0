import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listBlogs,
  getAllBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleBlogStatus,
  bulkDeleteBlogs,
  incrementBlogViews,
  getRelatedBlogs,
} from '../controllers/blog.controller.js';
import { createBlogSchema, updateBlogSchema } from '../validators/blog.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllBlogs);
router.get('/slug/:slug', getBlogBySlug);
router.get('/related/:id', getRelatedBlogs);
router.post('/:id/views', incrementBlogViews);
router.get('/:id', validate(idParamSchema, 'params'), getBlog);

router.use(authenticate, authorize('admin'));
router.get('/', listBlogs);
router.post('/', upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(createBlogSchema), createBlog);
router.patch('/:id', validate(idParamSchema, 'params'), upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), validate(updateBlogSchema), updateBlog);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleBlogStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteBlogs);
router.delete('/:id', validate(idParamSchema, 'params'), deleteBlog);

export default router;

