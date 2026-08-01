import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { contactLimiter } from '../middlewares/rateLimiter.js';
import {
  createContact,
  listContacts,
  getContact,
  getMyContacts,
  replyToContact,
  updateContactStatus,
  deleteContact,
  bulkDeleteContacts,
} from '../controllers/contact.controller.js';
import { createContactSchema, replyContactSchema, updateContactStatusSchema } from '../validators/contact.validator.js';
import { idParamSchema, bulkDeleteSchema } from '../validators/common.validator.js';

const router = Router();

router.get('/my', authenticate, getMyContacts);
router.post('/send', authenticate, contactLimiter, validate(createContactSchema), createContact);

router.use(authenticate, authorize('admin'));
router.get('/', listContacts);
router.get('/:id', validate(idParamSchema, 'params'), getContact);
router.post('/:id/reply', validate(idParamSchema, 'params'), validate(replyContactSchema), replyToContact);
router.patch('/:id/status', validate(idParamSchema, 'params'), validate(updateContactStatusSchema), updateContactStatus);
router.delete('/bulk-delete', validate(bulkDeleteSchema), bulkDeleteContacts);
router.delete('/:id', validate(idParamSchema, 'params'), deleteContact);

export default router;

