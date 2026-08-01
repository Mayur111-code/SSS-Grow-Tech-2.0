import createCrudController from './crud.controller.js';
import Service from '../models/Service.js';

const options = {
  slugSource: 'title',
  searchFields: ['title', 'shortDescription', 'description'],
  populate: ['category', 'technologies'],
  imageFields: ['image'],
  publicFilter: { status: 'active' },
};

const controller = createCrudController(Service, options);

export const listServices = controller.list;
export const getAllServices = controller.getAll;
export const getService = controller.getOne;
export const getServiceBySlug = controller.getBySlug;
export const createService = controller.create;
export const updateService = controller.update;
export const deleteService = controller.remove;
export const toggleServiceStatus = controller.toggleStatus;
export const bulkDeleteServices = controller.bulkDelete;
