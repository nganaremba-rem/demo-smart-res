const Redis = require('redis');
const logger = require('../utils/logger');

const redisClient = Redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (error) => {
  logger.error('Redis Client Error:', error);
});

redisClient.on('connect', () => {
  logger.info('Redis Client Connected');
});

const connect = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error('Redis Connection Error:', error);
    process.exit(1);
  }
};

const disconnect = async () => {
  await redisClient.disconnect();
};

module.exports = {
  client: redisClient,
  connect,
  disconnect,
};
