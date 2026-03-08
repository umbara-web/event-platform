import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { Readable } from "stream";
import {
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
  CLOUDINARY_CLOUD_NAME,
} from "../configs/env.config";

cloudinary.config({
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  cloud_name: CLOUDINARY_CLOUD_NAME,
});

function bufferToStream(buffer: Buffer) {
  const readable = new Readable();
  readable._read = () => {};
  readable.push(buffer);
  readable.push(null);
  return readable;
}

export function extractPublicId(url: string) {
  const urlParts = url.split("/");
  const publicIdWithExt = urlParts[urlParts.length - 1];
  const publicId = publicIdWithExt.split(".")[0];

  return publicId;
}

export function cloudinaryUpload(
  file: Express.Multer.File,
  folder?: string
): Promise<UploadApiResponse> {
  return new Promise((resolve, reject) => {
    const readableStream = bufferToStream(file.buffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (err, result) => {
        if (err) return reject(err);

        if (!result) return reject(new Error("Upload Failed"));

        resolve(result);
      }
    );

    readableStream.pipe(uploadStream);
  });
}

export async function cloudinaryRemove(url: string) {
  const publicId = extractPublicId(url);

  return await cloudinary.uploader.destroy(publicId);
}
