import createCrudController from './crud.controller.js';
import FAQ from '../models/FAQ.js';

const options = {
  searchFields: ['question', 'answer', 'category'],
  publicFilter: { status: 'active' },
};

const controller = createCrudController(FAQ, options);

export const listFaqs = controller.list;
export const getAllFaqs = controller.getAll;
export const getFaq = controller.getOne;
export const createFaq = controller.create;
export const updateFaq = controller.update;
export const deleteFaq = controller.remove;
export const toggleFaqStatus = controller.toggleStatus;
export const bulkDeleteFaqs = controller.bulkDelete;
