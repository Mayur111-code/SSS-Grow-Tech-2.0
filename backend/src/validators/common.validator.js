import { z } from 'zod';

const seoSchema = z
  .object({
    title: z.string().max(200).optional().nullable().default(''),
    description: z.string().max(500).optional().nullable().default(''),
    keywords: z.string().max(500).optional().nullable().default(''),
  })
  .optional()
  .nullable();

export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1, 'Slug is required'),
});

export const bulkDeleteSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, 'Select at least one item to delete'),
});

export const statusToggleSchema = z.object({
  status: z.string().min(1, 'Status is required'),
});

export { seoSchema };
export default { idParamSchema, slugParamSchema, bulkDeleteSchema, statusToggleSchema };
