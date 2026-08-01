import createCrudController from './crud.controller.js';
import Career from '../models/Career.js';

const options = {
  slugSource: 'title',
  searchFields: ['title', 'description', 'department', 'location'],
  populate: [],
  publicFilter: { status: 'open' },
};

const controller = createCrudController(Career, options);

export const listCareers = controller.list;
export const getAllCareers = controller.getAll;
export const getCareer = controller.getOne;
export const getCareerBySlug = controller.getBySlug;
export const createCareer = controller.create;
export const updateCareer = controller.update;
export const deleteCareer = controller.remove;
export const toggleCareerStatus = controller.toggleStatus;
export const bulkDeleteCareers = controller.bulkDelete;
