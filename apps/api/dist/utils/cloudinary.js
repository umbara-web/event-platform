"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractPublicId = extractPublicId;
exports.cloudinaryUpload = cloudinaryUpload;
exports.cloudinaryRemove = cloudinaryRemove;
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const env_config_1 = require("../configs/env.config");
cloudinary_1.v2.config({
    api_key: env_config_1.CLOUDINARY_API_KEY,
    api_secret: env_config_1.CLOUDINARY_API_SECRET,
    cloud_name: env_config_1.CLOUDINARY_CLOUD_NAME,
});
function bufferToStream(buffer) {
    const readable = new stream_1.Readable();
    readable._read = () => { };
    readable.push(buffer);
    readable.push(null);
    return readable;
}
function extractPublicId(url) {
    const urlParts = url.split("/");
    const publicIdWithExt = urlParts[urlParts.length - 1];
    const publicId = publicIdWithExt.split(".")[0];
    return publicId;
}
function cloudinaryUpload(file, folder) {
    return new Promise((resolve, reject) => {
        const readableStream = bufferToStream(file.buffer);
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder }, (err, result) => {
            if (err)
                return reject(err);
            if (!result)
                return reject(new Error("Upload Failed"));
            resolve(result);
        });
        readableStream.pipe(uploadStream);
    });
}
async function cloudinaryRemove(url) {
    const publicId = extractPublicId(url);
    return await cloudinary_1.v2.uploader.destroy(publicId);
}
