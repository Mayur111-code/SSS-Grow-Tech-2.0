import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  applyToJob,
  listApplications,
  getApplication,
  getMyApplications,
  updateApplicationStatus,
  deleteApplication,
  bulkDeleteApplications,
} from '../controllers/application.controller.js';
import { applyCareerSchema, updateApplicationStatusSchema } from '../validators/career.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/my', authenticate, getMyApplications);
router.post('/apply', authenticate, upload.single('resume'), validate(applyCareerSchema), applyToJob);

router.use(authenticate, authorize('admin'));
router.get('/', listApplications);
router.get('/:id', validate(idParamSchema, 'params'), getApplication);
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateApplicationStatusSchema), updateApplicationStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteApplications);
router.delete('/:id', validate(idParamSchema, 'params'), deleteApplication);

export default router;

