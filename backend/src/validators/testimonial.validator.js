import { z } from 'zod';

const createTestimonialSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  role: z.string().max(100).optional().nullable().default(''),
  company: z.string().max(100).optional().nullable().default(''),
  avatar: z.string().max(500).optional().nullable().default(''),
  content: z.string().min(10, 'Testimonial content must be at least 10 characters').max(1000),
  rating: z.number().int().min(1).max(5).optional().default(5),
  status: z.enum(['active', 'inactive']).optional().default('active'),
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
});

const updateTestimonialSchema = createTestimonialSchema.partial();

export { createTestimonialSchema, updateTestimonialSchema };
export default { createTestimonialSchema, updateTestimonialSchema };
