import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getPaginateOptions, getPaginationMeta } from '../utils/paginate.js';
import User from '../models/User.js';
import { cloudinaryService } from '../services/cloudinary.service.js';

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = getPaginateOptions(req, { searchFields: ['name', 'email'] });
  const total = await User.countDocuments(filter);
  const items = await User.find(filter).sort(sort).skip(skip).limit(limit).select('-password -refreshToken').lean();
  res.status(200).json(new ApiResponse(200, { items, pagination: getPaginationMeta(page, limit, total) }, 'Users retrieved'));
});

const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password -refreshToken').populate('savedProjects');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, user.toPublicJSON(), 'User retrieved'));
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const existing = await User.findById(id);
  if (!existing) throw new ApiError(404, 'User not found');

  const allowed = ['name', 'email', 'phone', 'company', 'bio', 'role', 'isActive', 'isVerified'];
  const updates = {};
  for (const field of allowed) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (req.body.avatar !== undefined) updates.avatar = req.body.avatar;
  if (req.file?.path) {
    const result = await cloudinaryService.uploadImage({ path: req.file.path });
    if (existing.avatar?.includes('cloudinary.com')) await cloudinaryService.deleteFile(existing.avatar);
    updates.avatar = result.url;
  }

  const user = await User.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).select('-password -refreshToken');
  res.status(200).json(new ApiResponse(200, user.toPublicJSON(), 'User updated successfully'));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  user.isActive = !user.isActive;
  await user.save();
  res.status(200).json(new ApiResponse(200, { isActive: user.isActive }, `User ${user.isActive ? 'activated' : 'deactivated'}`));
});

const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!['admin', 'user'].includes(role)) throw new ApiError(400, 'Invalid role');
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password -refreshToken');
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, user.toPublicJSON(), 'User role updated'));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  if (user.avatar?.includes('cloudinary.com')) await cloudinaryService.deleteFile(user.avatar);
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'User deleted successfully'));
});

const bulkDeleteUsers = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const users = await User.find({ _id: { $in: ids } });
  for (const user of users) {
    if (user.avatar?.includes('cloudinary.com')) await cloudinaryService.deleteFile(user.avatar);
  }
  await User.deleteMany({ _id: { $in: ids } });
  res.status(200).json(new ApiResponse(200, { deleted: ids.length }, 'Users deleted successfully'));
});

const getDashboardStats = asyncHandler(async (req, res) => {
  const [users, services, projects, blogs, testimonials, careers, applications, contacts, faqs, technologies, categories] =
    await Promise.all([
      User.countDocuments(),
      (await import('../models/Service.js')).default.countDocuments(),
      (await import('../models/Project.js')).default.countDocuments(),
      (await import('../models/Blog.js')).default.countDocuments(),
      (await import('../models/Testimonial.js')).default.countDocuments(),
      (await import('../models/Career.js')).default.countDocuments(),
      (await import('../models/Application.js')).default.countDocuments(),
      (await import('../models/Contact.js')).default.countDocuments(),
      (await import('../models/FAQ.js')).default.countDocuments(),
      (await import('../models/Technology.js')).default.countDocuments(),
      (await import('../models/Category.js')).default.countDocuments(),
    ]);

  const recentContacts = await (await import('../models/Contact.js')).default.find().sort('-createdAt').limit(5).lean();
  const recentApplications = await (await import('../models/Application.js')).default.find().sort('-createdAt').limit(5).populate('career', 'title').lean();

  res.status(200).json(
    new ApiResponse(200, {
      counts: { users, services, projects, blogs, testimonials, careers, applications, contacts, faqs, technologies, categories },
      recentContacts,
      recentApplications,
    }, 'Dashboard stats retrieved')
  );
});

export { listUsers, getUser, updateUser, toggleUserStatus, changeUserRole, deleteUser, bulkDeleteUsers, getDashboardStats };
