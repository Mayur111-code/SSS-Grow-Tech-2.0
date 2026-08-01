import { z } from 'zod';

const createFaqSchema = z.object({
  question: z.string().min(3, 'Question must be at least 3 characters').max(300),
  answer: z.string().min(10, 'Answer must be at least 10 characters'),
  category: z.string().max(100).optional().nullable().default('General'),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  sortOrder: z.number().optional().nullable().default(0),
});

const updateFaqSchema = createFaqSchema.partial();

export { createFaqSchema, updateFaqSchema };
export default { createFaqSchema, updateFaqSchema };
