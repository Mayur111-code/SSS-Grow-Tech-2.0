import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiError } from '../utils/ApiError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.resolve(__dirname, '../../uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedImages = /png|jpg|jpeg|webp|svg|gif/;
  const allowedDocs = /pdf|doc|docx/;
  const isImage = allowedImages.test(file.mimetype) || allowedImages.test(path.extname(file.originalname).toLowerCase());
  const isDoc = allowedDocs.test(file.mimetype) || allowedDocs.test(path.extname(file.originalname).toLowerCase());
  const isAllowed = isImage || isDoc;
  if (!isAllowed) {
    return cb(new ApiError(400, 'File type not supported. Upload an image (png, jpg, jpeg, webp, svg) or document (pdf, doc, docx).'), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage,
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
