import createCrudController from './crud.controller.js';
import Testimonial from '../models/Testimonial.js';

const options = {
  searchFields: ['name', 'role', 'company', 'content'],
  imageFields: ['avatar'],
  publicFilter: { status: 'active' },
};

const controller = createCrudController(Testimonial, options);

export const listTestimonials = controller.list;
export const getAllTestimonials = controller.getAll;
export const getTestimonial = controller.getOne;
export const createTestimonial = controller.create;
export const updateTestimonial = controller.update;
export const deleteTestimonial = controller.remove;
export const toggleTestimonialStatus = controller.toggleStatus;
export const bulkDeleteTestimonials = controller.bulkDelete;
