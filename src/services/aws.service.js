const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const { BadRequestError } = require('../utils/errors');
const logger = require('../utils/logger');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

const uploadToS3 = async (file, folder) => {
  try {
    const fileExtension = file.originalname.split('.').pop();
    const key = `${folder}/${uuidv4()}.${fileExtension}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    const result = await s3.upload(params).promise();

    return {
      url: result.Location,
      key: result.Key,
    };
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new BadRequestError('File upload failed');
  }
};

const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('/').pop();

    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
  } catch (error) {
    logger.error('S3 delete error:', error);
    // Don't throw error as file deletion failure shouldn't affect the main flow
  }
};

const getSignedUrl = async (key, expiresIn = 3600) => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    };

    return await s3.getSignedUrlPromise('getObject', params);
  } catch (error) {
    logger.error('S3 signed URL error:', error);
    throw new BadRequestError('Failed to generate signed URL');
  }
};

module.exports = {
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
};
