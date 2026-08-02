import { z } from 'zod';
import { seoSchema, imageField } from './common.validator.js';

const createBlogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200),
  excerpt: z.string().max(500).optional().nullable().default(''),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  thumbnail: imageField,
  banner: imageField,
  author: z.string().max(100).optional().nullable().default('SSS Grow Tech'),
  tags: z.array(z.string()).optional().nullable().default([]),
  category: z.string().min(1).optional().nullable().default(null),
  seo: seoSchema,
  publishDate: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
  status: z.enum(['published', 'draft']).optional().default('published'),
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
});

const updateBlogSchema = createBlogSchema.partial();

export { createBlogSchema, updateBlogSchema };
export default { createBlogSchema, updateBlogSchema };
