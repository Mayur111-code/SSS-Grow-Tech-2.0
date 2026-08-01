import createCrudController from './crud.controller.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Blog from '../models/Blog.js';

const options = {
  slugSource: 'title',
  searchFields: ['title', 'excerpt', 'content', 'author'],
  populate: ['category'],
  imageFields: ['thumbnail', 'banner'],
  publicFilter: { status: 'published' },
};

const controller = createCrudController(Blog, options);

export const listBlogs = controller.list;
export const getAllBlogs = controller.getAll;
export const getBlog = controller.getOne;
export const getBlogBySlug = controller.getBySlug;
export const createBlog = controller.create;
export const updateBlog = controller.update;
export const deleteBlog = controller.remove;
export const toggleBlogStatus = controller.toggleStatus;
export const bulkDeleteBlogs = controller.bulkDelete;

export const incrementBlogViews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true });
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
  }
  res.status(200).json(new ApiResponse(200, { views: blog.views }, 'Views updated'));
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const blog = await Blog.findById(id);
  if (!blog) {
    return res.status(404).json(new ApiResponse(404, null, 'Blog not found'));
  }
  const filter = { _id: { $ne: id }, status: 'published' };
  if (blog.category) filter.category = blog.category;
  const items = await Blog.find(filter).sort('-createdAt').limit(3).select('title slug thumbnail excerpt publishDate author');
  res.status(200).json(new ApiResponse(200, { items }, 'Related blogs retrieved'));
});
