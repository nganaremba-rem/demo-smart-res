const Redis = require('ioredis');
const logger = require('../utils/logger');

const redis = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: 3,
  enableReadyCheck: true,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on('error', (error) => {
  logger.error('Redis error:', error);
});

redis.on('connect', () => {
  logger.info('Redis connected');
});

const DEFAULT_EXPIRY = 3600; // 1 hour

const set = async (key, value, expiry = DEFAULT_EXPIRY) => {
  try {
    const serialized = JSON.stringify(value);
    if (expiry) {
      await redis.setex(key, expiry, serialized);
    } else {
      await redis.set(key, serialized);
    }
  } catch (error) {
    logger.error('Redis set error:', error);
  }
};

const get = async (key) => {
  try {
    const value = await redis.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    logger.error('Redis get error:', error);
    return null;
  }
};

const del = async (key) => {
  try {
    await redis.del(key);
  } catch (error) {
    logger.error('Redis delete error:', error);
  }
};

const clearPattern = async (pattern) => {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length) {
      await redis.del(...keys);
    }
  } catch (error) {
    logger.error('Redis clear pattern error:', error);
  }
};

module.exports = {
  redis,
  set,
  get,
  del,
  clearPattern,
};
