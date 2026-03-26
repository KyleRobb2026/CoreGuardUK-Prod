const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'demo', // Try with demo first to test API keys
  api_key: '625518352369413',
  api_secret: 'dJjuq9gg8ycG5i3kCtE_OYnZmsk'
});

// Upload the image from IBB URL
async function uploadImage() {
  try {
    console.log('Uploading image to Cloudinary...');
    
    const result = await cloudinary.uploader.upload(
      'https://i.ibb.co/ZRmjPt68/The-Future-of-Security-Management-Starts-Here-Website.png',
      {
        folder: 'coreguard',
        public_id: 'hero-background',
        resource_type: 'image',
        format: 'auto',
        quality: 'auto:good',
        crop: 'fill'
      }
    );
    
    console.log('Upload successful!');
    console.log('URL:', result.secure_url);
    console.log('Public ID:', result.public_id);
    
    return result.secure_url;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
}

uploadImage();
