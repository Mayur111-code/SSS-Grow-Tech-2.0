import { z } from 'zod';

const createContactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().max(30).optional().nullable().default(''),
  subject: z.string().min(3, 'Subject must be at least 3 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(3000),
  type: z.enum(['contact', 'quote']).optional().default('contact'),
});

const replyContactSchema = z.object({
  reply: z.string().min(1, 'Reply is required').max(3000),
  status: z.enum(['pending', 'processing', 'resolved', 'closed']).optional(),
});

const updateContactStatusSchema = z.object({
  status: z.enum(['pending', 'processing', 'resolved', 'closed']),
});

export { createContactSchema, replyContactSchema, updateContactStatusSchema };
export default { createContactSchema, replyContactSchema, updateContactStatusSchema };
