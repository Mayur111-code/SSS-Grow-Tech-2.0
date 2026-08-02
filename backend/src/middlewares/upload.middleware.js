import multer from 'multer';
import path from 'path';
import { ApiError } from '../utils/ApiError.js';

const ALLOWED_IMAGE_MIMES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
const ALLOWED_IMAGE_EXTS = /png|jpe?g|webp|svg/;
const ALLOWED_DOC_MIMES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const ALLOWED_DOC_EXTS = /pdf|docx?/;

const fileFilter = (req, file, cb) => {
  const ext = (path.extname(file.originalname) || '').toLowerCase();
  const isImage = ALLOWED_IMAGE_MIMES.includes(file.mimetype) || ALLOWED_IMAGE_EXTS.test(ext);
  const isDoc = ALLOWED_DOC_MIMES.includes(file.mimetype) || ALLOWED_DOC_EXTS.test(ext);
  if (isImage) {
    file.mediaType = 'image';
    return cb(null, true);
  }
  if (isDoc) {
    file.mediaType = 'document';
    return cb(null, true);
  }
  return cb(new ApiError(400, 'File type not supported. Upload an image (png, jpg, jpeg, webp, svg) or document (pdf, doc, docx).'), false);
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadImage = upload.single('image');
export const uploadBanner = upload.single('banner');
export const uploadThumbnail = upload.single('thumbnail');
export const uploadCover = upload.single('cover');
export const uploadIcon = upload.single('icon');
export const uploadResume = upload.single('resume');
export const uploadGallery = upload.array('gallery', 12);
export const uploadMultiple = upload.array('files', 12);

export default upload;
