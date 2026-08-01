import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getPaginateOptions, getPaginationMeta } from '../utils/paginate.js';
import Contact from '../models/Contact.js';
import { sendContactReplyEmail } from '../services/email.service.js';

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, phone, subject, message, type } = req.body;
  const contact = await Contact.create({
    user: req.user?._id || null,
    name,
    email,
    phone: phone || '',
    subject,
    message,
    type: type || 'contact',
  });
  res.status(201).json(new ApiResponse(201, contact, 'Message sent successfully. We will get back to you soon.'));
});

export const listContacts = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = getPaginateOptions(req, {
    searchFields: ['name', 'email', 'subject', 'message'],
  });
  const total = await Contact.countDocuments(filter);
  const items = await Contact.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email avatar')
    .lean();
  res.status(200).json(new ApiResponse(200, { items, pagination: getPaginationMeta(page, limit, total) }, 'Contacts retrieved'));
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id).populate('user', 'name email avatar');
  if (!contact) throw new ApiError(404, 'Contact not found');
  res.status(200).json(new ApiResponse(200, contact, 'Contact retrieved'));
});

export const getMyContacts = asyncHandler(async (req, res) => {
  const items = await Contact.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json(new ApiResponse(200, { items }, 'My messages retrieved'));
});

export const replyToContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, 'Contact not found');
  contact.reply = req.body.reply;
  contact.status = req.body.status || 'resolved';
  contact.repliedAt = new Date();
  contact.adminNotes = req.body.adminNotes !== undefined ? req.body.adminNotes : contact.adminNotes;
  await contact.save();
  await sendContactReplyEmail(contact, req.body.reply);
  res.status(200).json(new ApiResponse(200, contact, 'Reply sent successfully'));
});

export const updateContactStatus = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, 'Contact not found');
  contact.status = req.body.status;
  await contact.save();
  res.status(200).json(new ApiResponse(200, contact, 'Contact status updated'));
});

export const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) throw new ApiError(404, 'Contact not found');
  await Contact.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Contact deleted successfully'));
});

export const bulkDeleteContacts = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  await Contact.deleteMany({ _id: { $in: ids } });
  res.status(200).json(new ApiResponse(200, { deleted: ids.length }, 'Contacts deleted successfully'));
});
