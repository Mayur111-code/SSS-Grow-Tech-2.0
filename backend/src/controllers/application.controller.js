import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getPaginateOptions, getPaginationMeta } from '../utils/paginate.js';
import Application from '../models/Application.js';
import Career from '../models/Career.js';
import { cloudinaryService } from '../services/cloudinary.service.js';
import { sendApplicationEmail } from '../services/email.service.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const { careerId, name, email, phone, portfolioUrl, coverLetter } = req.body;
  const career = await Career.findById(careerId);
  if (!career) throw new ApiError(404, 'Job not found');
  if (career.status !== 'open') throw new ApiError(400, 'This position is no longer accepting applications');

  const existing = await Application.findOne({ user: req.user._id, career: careerId });
  if (existing) throw new ApiError(409, 'You have already applied for this position');

  let resume = req.body.resumeUrl || '';
  let resumePublicId = req.body.resumePublicId || '';
  if (req.file?.path) {
    const result = await cloudinaryService.uploadResume({ path: req.file.path });
    resume = result.url;
    resumePublicId = result.publicId;
  }
  if (!resume) throw new ApiError(400, 'Resume is required (PDF, DOC, DOCX)');

  const application = await Application.create({
    user: req.user._id,
    career: careerId,
    name,
    email,
    phone: phone || '',
    portfolioUrl: portfolioUrl || '',
    coverLetter: coverLetter || '',
    resume,
    resumePublicId,
  });

  await sendApplicationEmail(application, career);
  res.status(201).json(new ApiResponse(201, application, 'Application submitted successfully'));
});

export const listApplications = asyncHandler(async (req, res) => {
  const { page, limit, skip, sort, filter } = getPaginateOptions(req, {
    searchFields: ['name', 'email', 'phone'],
  });
  const total = await Application.countDocuments(filter);
  const items = await Application.find(filter)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .populate('career', 'title slug department')
    .populate('user', 'name email avatar')
    .lean();
  res.status(200).json(new ApiResponse(200, { items, pagination: getPaginationMeta(page, limit, total) }, 'Applications retrieved'));
});

export const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id)
    .populate('career', 'title slug department')
    .populate('user', 'name email avatar');
  if (!application) throw new ApiError(404, 'Application not found');
  res.status(200).json(new ApiResponse(200, application, 'Application retrieved'));
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const items = await Application.find({ user: req.user._id })
    .sort('-createdAt')
    .populate('career', 'title slug department location type');
  res.status(200).json(new ApiResponse(200, { items }, 'My applications retrieved'));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  application.status = req.body.status;
  if (req.body.notes !== undefined) application.notes = req.body.notes;
  await application.save();
  res.status(200).json(new ApiResponse(200, application, 'Application status updated'));
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  if (application.resumePublicId) {
    await cloudinaryService.deleteFile(application.resume);
  }
  await Application.findByIdAndDelete(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Application deleted successfully'));
});

export const bulkDeleteApplications = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  const applications = await Application.find({ _id: { $in: ids } });
  for (const application of applications) {
    if (application.resumePublicId) {
      await cloudinaryService.deleteFile(application.resume);
    }
  }
  await Application.deleteMany({ _id: { $in: ids } });
  res.status(200).json(new ApiResponse(200, { deleted: ids.length }, 'Applications deleted successfully'));
});
