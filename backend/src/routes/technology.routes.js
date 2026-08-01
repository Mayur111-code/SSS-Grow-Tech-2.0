import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listTechnologies,
  getAllTechnologies,
  getTechnology,
  createTechnology,
  updateTechnology,
  deleteTechnology,
  toggleTechnologyStatus,
  bulkDeleteTechnologies,
} from '../controllers/technology.controller.js';
import { createTechnologySchema, updateTechnologySchema } from '../validators/technology.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllTechnologies);
router.get('/:id', validate(idParamSchema, 'params'), getTechnology);

router.use(authenticate, authorize('admin'));
router.get('/', listTechnologies);
router.post('/', upload.single('icon'), validate(createTechnologySchema), createTechnology);
router.patch('/:id', validate(idParamSchema, 'params'), upload.single('icon'), validate(updateTechnologySchema), updateTechnology);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleTechnologyStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteTechnologies);
router.delete('/:id', validate(idParamSchema, 'params'), deleteTechnology);

export default router;

