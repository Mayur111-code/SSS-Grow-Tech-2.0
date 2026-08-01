import { z } from 'zod';

const createCareerSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(150),
  department: z.string().max(100).optional().nullable().default(''),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship', 'freelance', 'remote']).optional().default('full-time'),
  location: z.string().max(100).optional().nullable().default('Remote'),
  experience: z.string().max(100).optional().nullable().default(''),
  salary: z.string().max(100).optional().nullable().default(''),
  description: z.string().min(10, 'Job description must be at least 10 characters'),
  responsibilities: z.array(z.string()).optional().nullable().default([]),
  requirements: z.array(z.string()).optional().nullable().default([]),
  benefits: z.array(z.string()).optional().nullable().default([]),
  applicationDeadline: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
  status: z.enum(['open', 'closed']).optional().default('open'),
  featured: z.union([z.boolean(), z.string()]).optional().default(false),
});

const updateCareerSchema = createCareerSchema.partial();

const applyCareerSchema = z.object({
  careerId: z.string().min(1, 'Career ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().max(30).optional().nullable().default(''),
  portfolioUrl: z.string().max(500).optional().nullable().default(''),
  coverLetter: z.string().max(3000).optional().nullable().default(''),
  resumeUrl: z.string().max(500).optional().nullable().default(''),
  resumePublicId: z.string().max(500).optional().nullable().default(''),
});

const updateApplicationStatusSchema = z.object({
  status: z.enum(['pending', 'reviewing', 'shortlisted', 'rejected', 'hired']),
  notes: z.string().max(1000).optional().nullable().default(''),
});

export { createCareerSchema, updateCareerSchema, applyCareerSchema, updateApplicationStatusSchema };
export default { createCareerSchema, updateCareerSchema, applyCareerSchema, updateApplicationStatusSchema };
