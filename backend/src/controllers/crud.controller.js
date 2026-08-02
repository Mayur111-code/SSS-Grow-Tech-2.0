import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getPaginateOptions, getPaginationMeta } from '../utils/paginate.js';
import { generateSlug } from '../utils/slugify.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

const parseBoolean = (value) => {
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  return value;
};

export const createCrudController = (Model, options = {}) => {
  const { slugSource = 'title', populate = [], searchFields = ['title'], imageFields = [], manyImageFields = [], publicFilter = {} } = options;

  const list = asyncHandler(async (req, res) => {
    const { page, limit, skip, sort, filter } = getPaginateOptions(req, { searchFields });
    const total = await Model.countDocuments(filter);
    let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
    for (const p of populate) query = query.populate(p);
    const data = await query.lean();
    res.status(200).json(new ApiResponse(200, { items: data, pagination: getPaginationMeta(page, limit, total) }, 'List retrieved successfully'));
  });

  const getAll = asyncHandler(async (req, res) => {
    const filter = { ...publicFilter };
    let query = Model.find(filter).sort('-createdAt');
    for (const p of populate) query = query.populate(p);
    const data = await query.lean();
    res.status(200).json(new ApiResponse(200, { items: data, pagination: getPaginationMeta(1, data.length, data.length) }, 'List retrieved successfully'));
  });

  const getOne = asyncHandler(async (req, res) => {
    const { id } = req.params;
    let query = Model.findById(id);
    for (const p of populate) query = query.populate(p);
    const data = await query.lean();
    if (!data) throw new ApiError(404, 'Resource not found');
    res.status(200).json(new ApiResponse(200, data, 'Resource retrieved successfully'));
  });

  const getBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    let query = Model.findOne({ slug });
    for (const p of populate) query = query.populate(p);
    const data = await query.lean();
    if (!data) throw new ApiError(404, 'Resource not found');
    res.status(200).json(new ApiResponse(200, data, 'Resource retrieved successfully'));
  });

  const toImageRef = (value) => {
    if (!value) return null;
    if (typeof value === 'object') {
      const url = value.url || '';
      const publicId = value.publicId || '';
      if (url && url.includes('cloudinary.com') && !publicId) {
        return { url, publicId: cloudinaryService.extractPublicId(url) || '' };
      }
      return { url, publicId };
    }
    if (typeof value === 'string') {
      if (value.includes('cloudinary.com')) {
        return { url: value, publicId: cloudinaryService.extractPublicId(value) || '' };
      }
      return value;
    }
    return null;
  };

  const hasImage = (ref) => Boolean(ref && typeof ref === 'object' && (ref.publicId || (ref.url && ref.url.includes('cloudinary.com'))));

  const create = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    const files = req.files || {};
    for (const field of imageFields) {
      const uploaded = files[field];
      if (uploaded && uploaded.length) {
        const result = await cloudinaryService.uploadImage({ buffer: uploaded[0].buffer });
        body[field] = { url: result.url, publicId: result.publicId };
      } else {
        body[field] = toImageRef(body[field]);
      }
    }
    for (const field of manyImageFields) {
      const uploaded = files[field];
      if (uploaded && uploaded.length) {
        const refs = [];
        for (const file of uploaded) {
          const result = await cloudinaryService.uploadImage({ buffer: file.buffer });
          refs.push({ url: result.url, publicId: result.publicId });
        }
        body[field] = refs;
      } else if (Array.isArray(body[field])) {
        body[field] = body[field].map((item) => toImageRef(item)).filter(Boolean);
      } else {
        body[field] = [];
      }
    }
    if (slugSource && body[slugSource]) {
      body.slug = await generateSlug(Model, body[slugSource]);
    }
    if (body.featured !== undefined) body.featured = parseBoolean(body.featured);
    const doc = await Model.create(body);
    res.status(201).json(new ApiResponse(201, doc, 'Resource created successfully'));
  });

  const update = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const existing = await Model.findById(id);
    if (!existing) throw new ApiError(404, 'Resource not found');

    const body = { ...req.body };
    const files = req.files || {};
    for (const field of imageFields) {
      const uploaded = files[field];
      if (uploaded && uploaded.length) {
        const result = await cloudinaryService.uploadImage({ buffer: uploaded[0].buffer });
        body[field] = { url: result.url, publicId: result.publicId };
      } else if (body[field] !== undefined) {
        body[field] = toImageRef(body[field]);
      }
    }
    for (const field of manyImageFields) {
      const uploaded = files[field];
      if (uploaded && uploaded.length) {
        const refs = [];
        for (const file of uploaded) {
          const result = await cloudinaryService.uploadImage({ buffer: file.buffer });
          refs.push({ url: result.url, publicId: result.publicId });
        }
        body[field] = refs;
      } else if (Array.isArray(body[field])) {
        body[field] = body[field].map((item) => toImageRef(item)).filter(Boolean);
      }
    }
    if (body.featured !== undefined) body.featured = parseBoolean(body.featured);
    if (body.isActive !== undefined) body.isActive = parseBoolean(body.isActive);

    if (slugSource && body[slugSource] && body[slugSource] !== existing[slugSource]) {
      body.slug = await generateSlug(Model, body[slugSource], id);
    }

    const oldDoc = existing.toObject ? existing.toObject() : existing;
    for (const field of imageFields) {
      const oldRef = toImageRef(oldDoc[field]);
      const newRef = body[field] !== undefined ? toImageRef(body[field]) : oldRef;
      if (hasImage(oldRef) && (!hasImage(newRef) || oldRef.publicId !== newRef.publicId)) {
        await cloudinaryService.deleteImage(oldRef.publicId);
      }
    }
    for (const field of manyImageFields) {
      if (body[field] === undefined) continue;
      const oldList = (oldDoc[field] || []).map((item) => toImageRef(item)).filter(hasImage);
      const newList = (Array.isArray(body[field]) ? body[field] : []).map((item) => toImageRef(item)).filter(hasImage);
      const newIds = new Set(newList.map((item) => item.publicId).filter(Boolean));
      for (const oldItem of oldList) {
        if (oldItem.publicId && !newIds.has(oldItem.publicId)) {
          await cloudinaryService.deleteImage(oldItem.publicId);
        }
      }
    }
    const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    res.status(200).json(new ApiResponse(200, doc, 'Resource updated successfully'));
  });

  const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'Resource not found');
    const obj = doc.toObject ? doc.toObject() : doc;
    for (const field of imageFields) {
      const ref = toImageRef(obj[field]);
      if (hasImage(ref)) await cloudinaryService.deleteImage(ref.publicId);
    }
    for (const field of manyImageFields) {
      for (const item of obj[field] || []) {
        const ref = toImageRef(item);
        if (hasImage(ref)) await cloudinaryService.deleteImage(ref.publicId);
      }
    }
    await Model.findByIdAndDelete(id);
    res.status(200).json(new ApiResponse(200, null, 'Resource deleted successfully'));
  });

  const toggleStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'Resource not found');
    const statusField = options.statusField || 'status';
    const statusValues = options.statusValues || ['active', 'inactive'];
    const currentIndex = statusValues.indexOf(doc[statusField]);
    const nextStatus = statusValues[(currentIndex + 1) % statusValues.length];
    doc[statusField] = nextStatus;
    await doc.save();
    res.status(200).json(new ApiResponse(200, doc, `Status changed to ${nextStatus}`));
  });

  const bulkDelete = asyncHandler(async (req, res) => {
    const { ids } = req.body;
    const docs = await Model.find({ _id: { $in: ids } });
    for (const doc of docs) {
      const obj = doc.toObject ? doc.toObject() : doc;
      for (const field of imageFields) {
        const ref = toImageRef(obj[field]);
        if (hasImage(ref)) await cloudinaryService.deleteImage(ref.publicId);
      }
      for (const field of manyImageFields) {
        for (const item of obj[field] || []) {
          const ref = toImageRef(item);
          if (hasImage(ref)) await cloudinaryService.deleteImage(ref.publicId);
        }
      }
    }
    await Model.deleteMany({ _id: { $in: ids } });
    res.status(200).json(new ApiResponse(200, { deleted: ids.length }, `${ids.length} resource(s) deleted successfully`));
  });

  return { list, getAll, getOne, getBySlug, create, update, remove, toggleStatus, bulkDelete };
};

export default createCrudController;

