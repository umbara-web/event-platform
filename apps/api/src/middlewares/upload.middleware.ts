import multer, { FileFilterCallback, StorageEngine } from 'multer';
import { Request } from 'express';
import { UPLOAD } from '../constants/index.js';
import { ApiError } from '../utils/ApiError.js';

// Memory storage for Cloudinary upload
const storage: StorageEngine = multer.memoryStorage();

// File filter function
const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
): void => {
  if (UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      ApiError.badRequest(
        `Tipe file tidak diizinkan. Gunakan: ${UPLOAD.ALLOWED_IMAGE_TYPES.join(', ')}`
      )
    );
  }
};

// Create multer instance
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: UPLOAD.MAX_FILE_SIZE,
  },
});

// Single file upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Multiple files upload
export const uploadMultiple = (fieldName: string, maxCount: number) =>
  upload.array(fieldName, maxCount);

// Multiple fields upload
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields);

export default {
  uploadSingle,
  uploadMultiple,
  uploadFields,
};
