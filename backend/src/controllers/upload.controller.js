import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { cloudinaryService } from '../services/cloudinary.service.js';
import fs from 'fs';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file?.path) throw new ApiError(400, 'No image provided');
  const result = await cloudinaryService.uploadImage({ path: req.file.path });
  fs.unlink(req.file.path, () => {});
  res.status(201).json(new ApiResponse(201, { url: result.url, publicId: result.publicId }, 'Image uploaded successfully'));
});

export const uploadResume = asyncHandler(async (req, res) => {
  if (!req.file?.path) throw new ApiError(400, 'No file provided');
  const result = await cloudinaryService.uploadResume({ path: req.file.path });
  fs.unlink(req.file.path, () => {});
  res.status(201).json(new ApiResponse(201, { url: result.url, publicId: result.publicId }, 'File uploaded successfully'));
});

export const deleteUpload = asyncHandler(async (req, res) => {
  const { url } = req.body;
  if (!url) throw new ApiError(400, 'URL is required');
  await cloudinaryService.deleteFile(url);
  res.status(200).json(new ApiResponse(200, null, 'File deleted successfully'));
});
