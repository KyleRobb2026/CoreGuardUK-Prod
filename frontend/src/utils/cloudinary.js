import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dlfqjfbnk',
  api_key: '625518352369413',
  api_secret: 'dJjuq9gg8ycG5i3kCtE_OYnZmsk'
});

// Upload image to Cloudinary
export async function uploadImage(file, folder = 'coreguard') {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: folder,
      resource_type: 'image',
      format: 'auto',
      quality: 'auto:good'
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// Get optimized image URL
export function getOptimizedUrl(publicId, options = {}) {
  const defaultOptions = {
    format: 'auto',
    quality: 'auto:good',
    crop: 'fill',
    ...options
  };
  
  return cloudinary.url(publicId, defaultOptions);
}
