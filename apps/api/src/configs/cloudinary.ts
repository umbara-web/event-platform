// src/config/cloudinary.ts

import { v2 as cloudinary, ConfigOptions } from 'cloudinary';
import config from './index.js';

// Configure Cloudinary
const cloudinaryConfig: ConfigOptions = {
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
  secure: true,
};

cloudinary.config(cloudinaryConfig);

export { cloudinary };
export default cloudinary;
