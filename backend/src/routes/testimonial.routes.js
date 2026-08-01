import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listTestimonials,
  getAllTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialStatus,
  bulkDeleteTestimonials,
} from '../controllers/testimonial.controller.js';
import { createTestimonialSchema, updateTestimonialSchema } from '../validators/testimonial.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllTestimonials);
router.get('/:id', validate(idParamSchema, 'params'), getTestimonial);

router.use(authenticate, authorize('admin'));
router.get('/', listTestimonials);
router.post('/', upload.single('avatar'), validate(createTestimonialSchema), createTestimonial);
router.patch('/:id', validate(idParamSchema, 'params'), upload.single('avatar'), validate(updateTestimonialSchema), updateTestimonial);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleTestimonialStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteTestimonials);
router.delete('/:id', validate(idParamSchema, 'params'), deleteTestimonial);

export default router;

