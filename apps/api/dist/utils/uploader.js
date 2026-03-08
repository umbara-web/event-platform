"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploader = uploader;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];
const MAX_FILE_SIZE = 1024 * 1024;
function uploader() {
    const storage = multer_1.default.memoryStorage();
    function fileFilter(_req, file, cb) {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        if (!ALLOWED_EXTENSIONS.includes(ext)) {
            return cb(new Error("Only image files (jpg, jpeg, png, webp) are allowed"));
        }
        cb(null, true);
    }
    return (0, multer_1.default)({ storage, fileFilter, limits: { fileSize: MAX_FILE_SIZE } });
}
