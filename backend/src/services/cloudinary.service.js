import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';

const FOLDER = 'sss-grow-tech';

const isConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || '';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  const hasPlaceholder = cloudName === 'demo' || !cloudName || apiKey.includes('your_') || apiSecret.includes('your_');
  return !hasPlaceholder && Boolean(cloudName && apiKey && apiSecret);
};

export const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  if (!url.includes('cloudinary.com')) return null;
  const parts = url.split('/');
  const versionIndex = parts.findIndex((p) => /^v\d+$/.test(p));
  if (versionIndex !== -1 && versionIndex < parts.length - 1) {
    const withExt = parts.slice(versionIndex + 1).join('/');
    return withExt.replace(/\.[^.]+$/, '');
  }
  return null;
};

const uploadBuffer = async ({ buffer, folder = FOLDER, resourceType = 'image' }) => {
  if (!isConfigured()) {
    throw new ApiError(500, 'Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET.');
  }
  if (!buffer || buffer.length === 0) {
    throw new ApiError(400, 'No file provided to upload');
  }
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, timeout: 60000 },
      (error, result) => {
        if (error) {
          reject(new ApiError(500, `Upload to Cloudinary failed: ${error.message}`));
          return;
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

export const uploadImage = async ({ buffer, folder = FOLDER }) => {
  if (buffer && buffer.length > 5 * 1024 * 1024) {
    throw new ApiError(400, 'Image is too large. Maximum file size is 5MB.');
  }
  return uploadBuffer({ buffer, folder, resourceType: 'image' });
};

export const uploadResume = async ({ buffer, folder = `${FOLDER}/resumes` }) => {
  return uploadBuffer({ buffer, folder, resourceType: 'auto' });
};

export const deleteImage = async (publicId) => {
  if (!publicId) return { skipped: true };
  if (!isConfigured()) return { skipped: true };
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { deleted: result.result === 'ok' };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete cloudinary file:', error.message);
    return { failed: true };
  }
};

export const deleteFile = async (ref) => {
  if (!ref) return { skipped: true };
  if (typeof ref === 'object' && ref.publicId) {
    return deleteImage(ref.publicId);
  }
  if (typeof ref === 'string') {
    const publicId = extractPublicId(ref);
    if (!publicId) return { skipped: true };
    return deleteImage(publicId);
  }
  return { skipped: true };
};

export const deleteMany = async (refs = []) => {
  const results = [];
  for (const ref of refs) {
    results.push(await deleteFile(ref));
  }
  return results;
};

export const cloudinaryService = { uploadFile: uploadBuffer, uploadImage, uploadResume, deleteFile, deleteImage, deleteMany, isConfigured, extractPublicId };

export default cloudinaryService;
