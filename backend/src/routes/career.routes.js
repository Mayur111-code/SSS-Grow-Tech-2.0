import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
  listCareers,
  getAllCareers,
  getCareer,
  getCareerBySlug,
  createCareer,
  updateCareer,
  deleteCareer,
  toggleCareerStatus,
  bulkDeleteCareers,
} from '../controllers/career.controller.js';
import { createCareerSchema, updateCareerSchema } from '../validators/career.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllCareers);
router.get('/slug/:slug', getCareerBySlug);
router.get('/:id', validate(idParamSchema, 'params'), getCareer);

router.use(authenticate, authorize('admin'));
router.get('/', listCareers);
router.post('/', validate(createCareerSchema), createCareer);
router.patch('/:id', validate(idParamSchema, 'params'), validate(updateCareerSchema), updateCareer);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleCareerStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteCareers);
router.delete('/:id', validate(idParamSchema, 'params'), deleteCareer);

export default router;

