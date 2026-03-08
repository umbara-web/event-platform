import { Request } from "express";
import multer from "multer";
import path from "path";

const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 1024 * 1024;

export function uploader() {
  const storage = multer.memoryStorage();

  function fileFilter(
    _req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(
        new Error("Only image files (jpg, jpeg, png, webp) are allowed")
      );
    }

    cb(null, true);
  }

  return multer({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });
}
