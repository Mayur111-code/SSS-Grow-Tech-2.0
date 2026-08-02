import createCrudController from './crud.controller.js';
import Category from '../models/Category.js';

const options = {
  slugSource: 'name',
  searchFields: ['name', 'description', 'type'],
  publicFilter: { isActive: true },
};

const controller = createCrudController(Category, options);

export const listCategories = controller.list;
export const getAllCategories = controller.getAll;
export const getCategory = controller.getOne;
export const createCategory = controller.create;
export const updateCategory = controller.update;
export const deleteCategory = controller.remove;
export const toggleCategoryStatus = controller.toggleStatus;
export const bulkDeleteCategories = controller.bulkDelete;
