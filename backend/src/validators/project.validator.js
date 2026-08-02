import { z } from 'zod';
import { seoSchema, imageField, imageFields } from './common.validator.js';

const createProjectSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  client: z.string().max(150).optional().nullable().default(''),
  industry: z.string().max(150).optional().nullable().default(''),
  location: z.string().max(150).optional().nullable().default(''),
  year: z.number().int().min(2000).max(2100).optional().nullable(),
  duration: z.string().max(100).optional().nullable().default(''),
  category: z.string().min(1).optional().nullable().default(null),
  technologies: z.array(z.string()).optional().nullable().default([]),
  features: z.array(z.string()).optional().nullable().default([]),
  gallery: imageFields,
  cover: imageField,
  liveUrl: z.string().max(500).optional().nullable().default(''),
  githubUrl: z.string().max(500).optional().nullable().default(''),
  seo: seoSchema,
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
  status: z.enum(['published', 'draft', 'archived']).optional().default('published'),
});

const updateProjectSchema = createProjectSchema.partial();

export { createProjectSchema, updateProjectSchema };
export default { createProjectSchema, updateProjectSchema };
