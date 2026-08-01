import cloudinary from '../config/cloudinary.js';
import { ApiError } from '../utils/ApiError.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.resolve(__dirname, '../../uploads');

const isConfigured = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'demo';
  const apiKey = process.env.CLOUDINARY_API_KEY || '';
  const apiSecret = process.env.CLOUDINARY_API_SECRET || '';
  const hasPlaceholder = cloudName === 'demo' || apiKey.includes('your_') || apiSecret.includes('your_');
  return !hasPlaceholder && Boolean(cloudName && apiKey && apiSecret);
};

const publicUrlFor = (localPath) => {
  const base = process.env.API_BASE_URL || 'http://localhost:5000';
  const filename = path.basename(localPath);
  return `${base}/uploads/${filename}`;
};

const extractPublicId = (url) => {
  if (!url) return null;
  const parts = url.split('/');
  const last = parts[parts.length - 1];
  if (!last) return null;
  return last.replace(/\.[^.]+$/, '');
};

export const uploadFile = async ({ path: filePath, folder = 'sss-grow-tech', resourceType = 'auto' }) => {
  if (!filePath || !fs.existsSync(filePath)) {
    throw new ApiError(400, 'No file provided to upload');
  }

  if (!isConfigured()) {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(filePath);
    const dest = path.join(uploadsDir, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    fs.copyFileSync(filePath, dest);
    fs.unlink(filePath, () => {});
    return { url: publicUrlFor(dest), publicId: `local:${path.basename(dest)}` };
  }

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    resource_type: resourceType,
    overwrite: true,
  });
  fs.unlink(filePath, () => {});
  return { url: result.secure_url, publicId: result.public_id };
};

export const uploadImage = async ({ path: filePath, folder = 'sss-grow-tech' }) => {
  return uploadFile({ path: filePath, folder, resourceType: 'image' });
};

export const uploadResume = async ({ path: filePath, folder = 'sss-grow-tech/resumes' }) => {
  return uploadFile({ path: filePath, folder, resourceType: 'auto' });
};

export const deleteFile = async (url) => {
  if (!url) return { skipped: true };
  if (url.includes('/uploads/')) {
    const filename = path.basename(new URL(url).pathname);
    const localPath = path.join(uploadsDir, filename);
    if (fs.existsSync(localPath)) {
      fs.unlinkSync(localPath);
      return { deleted: true };
    }
    return { skipped: true };
  }
  if (!url.includes('cloudinary.com') || !isConfigured()) {
    return { skipped: true };
  }
  try {
    const publicId = extractPublicId(url);
    if (!publicId) return { skipped: true };
    await cloudinary.uploader.destroy(publicId.split('/').slice(0, 2).join('/'));
    return { deleted: true };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to delete cloudinary file:', error.message);
    return { failed: true };
  }
};

export const deleteMany = async (urls = []) => {
  const results = [];
  for (const url of urls) {
    results.push(await deleteFile(url));
  }
  return results;
};

export const cloudinaryService = { uploadFile, uploadImage, uploadResume, deleteFile, deleteMany, isConfigured };

export default cloudinaryService;
