const mongoose = require('mongoose');
const redis = require('../services/redis.service');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('MongoDB connected successfully');

    // Connect to Redis
    await redis.connect();
    logger.info('Redis connected successfully');
  } catch (error) {
    logger.error('Database connection error:', error);
    process.exit(1);
  }
};

module.exports = { connectDB };
