import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listCategories,
  getAllCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  bulkDeleteCategories,
} from '../controllers/category.controller.js';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllCategories);
router.get('/:id', validate(idParamSchema, 'params'), getCategory);

router.use(authenticate, authorize('admin'));
router.get('/', listCategories);
router.post('/', upload.single('icon'), validate(createCategorySchema), createCategory);
router.patch('/:id', validate(idParamSchema, 'params'), upload.single('icon'), validate(updateCategorySchema), updateCategory);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleCategoryStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteCategories);
router.delete('/:id', validate(idParamSchema, 'params'), deleteCategory);

export default router;

