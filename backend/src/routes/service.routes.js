import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listServices,
  getAllServices,
  getService,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
  bulkDeleteServices,
} from '../controllers/service.controller.js';
import { createServiceSchema, updateServiceSchema } from '../validators/service.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllServices);
router.get('/slug/:slug', getServiceBySlug);
router.get('/:id', validate(idParamSchema, 'params'), getService);

router.use(authenticate, authorize('admin'));
router.get('/', listServices);
router.post('/', upload.single('image'), validate(createServiceSchema), createService);
router.patch('/:id', validate(idParamSchema, 'params'), upload.single('image'), validate(updateServiceSchema), updateService);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleServiceStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteServices);
router.delete('/:id', validate(idParamSchema, 'params'), deleteService);

export default router;

