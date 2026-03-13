import { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';
import cloudinary from '../configs/cloudinary';
import { ApiError } from '../utils/ApiError';

export interface UploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
}

class CloudinaryService {
  // Upload image from buffer
  async uploadImage(
    buffer: Buffer,
    folder: string,
    publicId?: string
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        folder: `event-management/${folder}`,
        resource_type: 'image' as const,
        transformation: [{ quality: 'auto' }, { fetch_format: 'auto' }],
        ...(publicId && { public_id: publicId }),
      };

      cloudinary.uploader
        .upload_stream(
          uploadOptions,
          (
            error: UploadApiErrorResponse | undefined,
            result: UploadApiResponse | undefined
          ) => {
            if (error) {
              reject(ApiError.internal(`Upload gagal: ${error.message}`));
              return;
            }

            if (!result) {
              reject(ApiError.internal('Upload gagal: Tidak ada response'));
              return;
            }

            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
              format: result.format,
            });
          }
        )
        .end(buffer);
    });
  }

  // Upload profile image
  async uploadProfileImage(
    buffer: Buffer,
    userId: string
  ): Promise<UploadResult> {
    return this.uploadImage(buffer, 'profiles', `profile-${userId}`);
  }

  // Upload event image
  async uploadEventImage(
    buffer: Buffer,
    eventId: string
  ): Promise<UploadResult> {
    return this.uploadImage(buffer, 'events', `event-${eventId}`);
  }

  // Upload payment proof
  async uploadPaymentProof(
    buffer: Buffer,
    transactionId: string
  ): Promise<UploadResult> {
    return this.uploadImage(buffer, 'payments', `payment-${transactionId}`);
  }

  // Delete image by public ID
  async deleteImage(publicId: string): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete image:', error);
      // Don't throw error, just log it
    }
  }

  // Delete images by prefix (folder)
  async deleteByPrefix(prefix: string): Promise<void> {
    try {
      await cloudinary.api.delete_resources_by_prefix(
        `event-management/${prefix}`
      );
    } catch (error) {
      console.error('Failed to delete images by prefix:', error);
    }
  }
}

export const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
