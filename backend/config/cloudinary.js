import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    Readable.from([fileBuffer]).pipe(stream);
  });
};

export const extractPublicId = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const parts = url.split('/upload/');
  if (parts.length < 2) return null;
  const path = parts[1];
  const cleanPath = path.replace(/^v\d+\//, '');
  const dotIndex = cleanPath.lastIndexOf('.');
  if (dotIndex !== -1) {
    return cleanPath.substring(0, dotIndex);
  }
  return cleanPath;
};

export const deleteFromCloudinary = async (url) => {
  try {
    const publicId = extractPublicId(url);
    if (!publicId) return null;

    const isVideo = url.includes('/video/') || url.endsWith('.mp4') || url.endsWith('.webm');
    const resourceType = isVideo ? 'video' : 'image';

    const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    return result;
  } catch (error) {
    console.error('Failed to delete file from Cloudinary:', error.message);
    return null;
  }
};

export default cloudinary;
