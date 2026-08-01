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

  const reqUploaded = (url) => url && typeof url === 'string' && url.includes('cloudinary.com');

  const create = asyncHandler(async (req, res) => {
    const body = { ...req.body };
    const fileFields = Object.keys(req.files || {});
    for (const field of fileFields) {
      const files = Array.isArray(req.files[field]) ? req.files[field] : [req.files[field]];
      if (files.length === 1) {
        body[field] = files[0].path;
      }
    }
    for (const field of imageFields) {
      if (body[field] && typeof body[field] === 'string' && !body[field].includes('cloudinary.com') && body[field].startsWith('/')) {
        const result = await cloudinaryService.uploadImage({ path: body[field] });
        body[field] = result.url;
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
    const fileFields = Object.keys(req.files || {});
    for (const field of fileFields) {
      const files = Array.isArray(req.files[field]) ? req.files[field] : [req.files[field]];
      if (files.length === 1) {
        if (files[0].path) {
          body[field] = files[0].path;
        }
      }
    }
    for (const field of imageFields) {
      if (body[field] && typeof body[field] === 'string' && !body[field].includes('cloudinary.com') && body[field].startsWith('/')) {
        const result = await cloudinaryService.uploadImage({ path: body[field] });
        body[field] = result.url;
      }
    }
    if (body.featured !== undefined) body.featured = parseBoolean(body.featured);
    if (body.isActive !== undefined) body.isActive = parseBoolean(body.isActive);

    if (slugSource && body[slugSource] && body[slugSource] !== existing[slugSource]) {
      body.slug = await generateSlug(Model, body[slugSource], id);
    }

    const oldDoc = existing.toObject ? existing.toObject() : existing;
    for (const field of imageFields) {
      if (body[field] && oldDoc[field] && body[field] !== oldDoc[field] && reqUploaded(oldDoc[field])) {
        await cloudinaryService.deleteFile(oldDoc[field]);
      }
    }
    const doc = await Model.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    res.status(200).json(new ApiResponse(200, doc, 'Resource updated successfully'));
  });

  const remove = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doc = await Model.findById(id);
    if (!doc) throw new ApiError(404, 'Resource not found');
    if (reqUploaded(doc.cover)) await cloudinaryService.deleteFile(doc.cover);
    if (reqUploaded(doc.image)) await cloudinaryService.deleteFile(doc.image);
    if (reqUploaded(doc.thumbnail)) await cloudinaryService.deleteFile(doc.thumbnail);
    if (reqUploaded(doc.banner)) await cloudinaryService.deleteFile(doc.banner);
    if (reqUploaded(doc.icon)) await cloudinaryService.deleteFile(doc.icon);
    if (reqUploaded(doc.avatar)) await cloudinaryService.deleteFile(doc.avatar);
    if (Array.isArray(doc.gallery) && doc.gallery.length) {
      await cloudinaryService.deleteMany(doc.gallery.filter((g) => g && typeof g === 'string' && g.includes('cloudinary.com')));
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
      if (reqUploaded(doc.cover)) await cloudinaryService.deleteFile(doc.cover);
      if (reqUploaded(doc.image)) await cloudinaryService.deleteFile(doc.image);
      if (reqUploaded(doc.thumbnail)) await cloudinaryService.deleteFile(doc.thumbnail);
      if (reqUploaded(doc.banner)) await cloudinaryService.deleteFile(doc.banner);
      if (reqUploaded(doc.icon)) await cloudinaryService.deleteFile(doc.icon);
      if (reqUploaded(doc.avatar)) await cloudinaryService.deleteFile(doc.avatar);
      if (Array.isArray(doc.gallery) && doc.gallery.length) {
        await cloudinaryService.deleteMany(doc.gallery.filter((g) => g && typeof g === 'string' && g.includes('cloudinary.com')));
      }
    }
    await Model.deleteMany({ _id: { $in: ids } });
    res.status(200).json(new ApiResponse(200, { deleted: ids.length }, `${ids.length} resource(s) deleted successfully`));
  });

  return { list, getAll, getOne, getBySlug, create, update, remove, toggleStatus, bulkDelete };
};

export default createCrudController;

