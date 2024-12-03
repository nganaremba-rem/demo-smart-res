const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFile = async (file) => {
  try {
    // Convert the buffer to base64
    const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
      'base64'
    )}`;

    // Upload to cloudinary
    const result = await cloudinary.uploader.upload(base64File, {
      resource_type: 'auto',
      folder: 'smart-restaurant',
    });

    return result.secure_url;
  } catch (error) {
    throw new Error(`Could not upload file: ${error.message}`);
  }
};

const deleteFile = async (fileUrl) => {
  try {
    // Get public ID from URL
    const publicId = `smart-restaurant/${
      fileUrl.split('/').slice(-1)[0].split('.')[0]
    }`;
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new Error(`Could not delete file: ${error.message}`);
  }
};

module.exports = {
  uploadFile,
  deleteFile,
};
