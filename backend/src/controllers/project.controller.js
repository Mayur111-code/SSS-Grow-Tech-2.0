import createCrudController from './crud.controller.js';
import Project from '../models/Project.js';

const options = {
  slugSource: 'title',
  searchFields: ['title', 'description', 'client', 'industry'],
  populate: ['category', 'technologies'],
  imageFields: ['cover'],
  manyImageFields: ['gallery'],
  publicFilter: { status: 'published' },
};

const controller = createCrudController(Project, options);

export const listProjects = controller.list;
export const getAllProjects = controller.getAll;
export const getProject = controller.getOne;
export const getProjectBySlug = controller.getBySlug;
export const createProject = controller.create;
export const updateProject = controller.update;
export const deleteProject = controller.remove;
export const toggleProjectStatus = controller.toggleStatus;
export const bulkDeleteProjects = controller.bulkDelete;
