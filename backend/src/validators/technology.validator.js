import { z } from 'zod';

const createTechnologySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  category: z.enum(['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'AI', 'Design', 'Cloud', 'Other']).optional().default('Other'),
  icon: z.string().max(500).optional().nullable().default(''),
  color: z.string().max(20).optional().nullable().default('#4f46e5'),
  proficiency: z.number().int().min(0).max(100).optional().default(80),
  isActive: z.union([z.boolean(), z.string()]).optional().default(true),
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
  sortOrder: z.number().optional().nullable().default(0),
});

const updateTechnologySchema = createTechnologySchema.partial();

export { createTechnologySchema, updateTechnologySchema };
export default { createTechnologySchema, updateTechnologySchema };
