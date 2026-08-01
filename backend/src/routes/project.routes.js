import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';
import {
  listProjects,
  getAllProjects,
  getProject,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
  toggleProjectStatus,
  bulkDeleteProjects,
} from '../controllers/project.controller.js';
import { createProjectSchema, updateProjectSchema } from '../validators/project.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/public', getAllProjects);
router.get('/slug/:slug', getProjectBySlug);
router.get('/:id', validate(idParamSchema, 'params'), getProject);

router.use(authenticate, authorize('admin'));
router.get('/', listProjects);
router.post('/', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 12 }]), validate(createProjectSchema), createProject);
router.patch('/:id', validate(idParamSchema, 'params'), upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'gallery', maxCount: 12 }]), validate(updateProjectSchema), updateProject);
router.patch('/:id/toggle-status', validate(idParamSchema, 'params'), toggleProjectStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteProjects);
router.delete('/:id', validate(idParamSchema, 'params'), deleteProject);

export default router;

