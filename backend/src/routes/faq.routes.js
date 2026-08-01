import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  listFaqs,
  getAllFaqs,
  getFaq,
  createFaq,
  updateFaq,
  deleteFaq,
  toggleFaqStatus,
  bulkDeleteFaqs,
} from '../controllers/faq.controller.js';
import { createFaqSchema, updateFaqSchema } from '../validators/faq.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllFaqs);
router.get('/:id', validate(idParamSchema, 'params'), getFaq);

router.use(authenticate, authorize('admin'));
router.get('/', listFaqs);
router.post('/', validate(createFaqSchema), createFaq);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateFaqSchema), updateFaq);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleFaqStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteFaqs);
router.delete('/:id', validate(idParamSchema, 'params'), deleteFaq);

export default router;

