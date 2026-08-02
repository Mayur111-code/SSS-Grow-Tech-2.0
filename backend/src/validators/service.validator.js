import { z } from 'zod';
import { seoSchema, imageField } from './common.validator.js';

const createServiceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(120),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters').max(300),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: imageField,
  icon: z.string().max(500).optional().nullable().default(''),
  category: z.string().min(1).optional().nullable().default(null),
  features: z.array(z.string()).optional().nullable().default([]),
  technologies: z.array(z.string()).optional().nullable().default([]),
  seo: seoSchema,
  status: z.enum(['active', 'inactive']).optional().default('active'),
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
  sortOrder: z.number().optional().nullable().default(0),
});

const updateServiceSchema = createServiceSchema.partial();

export { createServiceSchema, updateServiceSchema };
export default { createServiceSchema, updateServiceSchema };
