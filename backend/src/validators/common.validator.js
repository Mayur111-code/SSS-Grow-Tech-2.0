import { z } from 'zod';

const seoSchema = z
  .object({
    title: z.string().max(200).optional().nullable().default(''),
    description: z.string().max(500).optional().nullable().default(''),
    keywords: z.string().max(500).optional().nullable().default(''),
  })
  .optional()
  .nullable();

const imageObject = z.object({
  url: z.string().max(1000).optional().nullable(),
  publicId: z.string().max(500).optional().nullable(),
});

export const imageField = z
  .union([imageObject, z.string().max(1000)])
  .optional()
  .nullable()
  .transform((value) => {
    if (value == null || value === '') return null;
    if (typeof value === 'string') return { url: value, publicId: '' };
    return { url: value.url || '', publicId: value.publicId || '' };
  });

export const imageFields = z.array(imageField).optional().nullable().default([]);

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
