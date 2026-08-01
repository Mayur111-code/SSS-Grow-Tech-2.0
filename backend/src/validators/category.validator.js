import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  description: z.string().max(500).optional().nullable().default(''),
  type: z.enum(['service', 'project', 'blog', 'general']).optional().default('general'),
  icon: z.string().max(500).optional().nullable().default(''),
  color: z.string().max(20).optional().nullable().default('#4f46e5'),
  isActive: z.union([z.boolean(), z.string()]).optional().default(true),
  sortOrder: z.number().optional().nullable().default(0),
});

const updateCategorySchema = createCategorySchema.partial();

export { createCategorySchema, updateCategorySchema };
export default { createCategorySchema, updateCategorySchema };
