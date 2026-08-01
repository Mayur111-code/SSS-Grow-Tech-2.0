import { mongoose } from 'mongoose';

const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const getPaginateOptions = (req, defaults = {}) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 100);
  const sortBy = req.query.sortBy || defaults.sortBy || '-createdAt';
  const search = req.query.search || defaults.search || '';
  const status = req.query.status || defaults.status || '';
  const category = req.query.category || defaults.category || '';
  const featured = req.query.featured || defaults.featured || '';

  const searchParts = {};
  if (search) {
    const escaped = escapeRegExp(search);
    const orConditions = (defaults.searchFields || ['title']).map((field) => ({
      [field]: { $regex: escaped, $options: 'i' },
    }));
    if (orConditions.length) searchParts.$or = orConditions;
  }
  if (status && ['active', 'inactive', 'published', 'draft', 'pending', 'approved', 'rejected', 'archived', 'processing', 'resolved'].includes(status)) {
    searchParts.status = status;
  }
  if (category) searchParts.category = category;
  if (featured === 'true') searchParts.featured = true;
  if (featured === 'false') searchParts.featured = false;

  const skip = (page - 1) * limit;
  const sortParts = {};
  String(sortBy)
    .split(',')
    .forEach((field) => {
      const trimmed = field.trim();
      if (!trimmed) return;
      if (trimmed.startsWith('-')) sortParts[trimmed.slice(1)] = -1;
      else sortParts[trimmed] = 1;
    });

  return { page, limit, skip, sort: sortParts, filter: searchParts };
};

export const getPaginationMeta = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit) || 0,
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

export default { getPaginateOptions, getPaginationMeta };
