import createCrudController from './crud.controller.js';
import Technology from '../models/Technology.js';

const options = {
  slugSource: 'name',
  searchFields: ['name', 'category'],
  publicFilter: { isActive: true },
};

const controller = createCrudController(Technology, options);

export const listTechnologies = controller.list;
export const getAllTechnologies = controller.getAll;
export const getTechnology = controller.getOne;
export const createTechnology = controller.create;
export const updateTechnology = controller.update;
export const deleteTechnology = controller.remove;
export const toggleTechnologyStatus = controller.toggleStatus;
export const bulkDeleteTechnologies = controller.bulkDelete;
