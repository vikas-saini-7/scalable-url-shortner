const { createClient } = require('redis');
const config = require('./env');

const redisClient = createClient({
  url: config.redis.url,
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

redisClient.on('error', (err) => {
  console.error('⚠️  Redis error:', err.message);
});

// Gracefully handle Redis being unavailable
let isRedisConnected = false;

redisClient.connect().then(() => {
  isRedisConnected = true;
}).catch((err) => {
  console.error('⚠️  Redis connection failed, caching disabled:', err.message);
  isRedisConnected = false;
});

// Wrapper methods with fallback
const safeRedisGet = async (key) => {
  if (!isRedisConnected) return null;
  try {
    return await redisClient.get(key);
  } catch (err) {
    console.error('Redis GET error:', err.message);
    return null;
  }
};

const safeRedisSet = async (key, value, options) => {
  if (!isRedisConnected) return;
  try {
    await redisClient.set(key, value, options);
  } catch (err) {
    console.error('Redis SET error:', err.message);
  }
};

const safeRedisIncr = async (key) => {
  if (!isRedisConnected) return null;
  try {
    return await redisClient.incr(key);
  } catch (err) {
    console.error('Redis INCR error:', err.message);
    return null;
  }
};

const safeRedisExpire = async (key, seconds) => {
  if (!isRedisConnected) return;
  try {
    await redisClient.expire(key, seconds);
  } catch (err) {
    console.error('Redis EXPIRE error:', err.message);
  }
};

module.exports = {
  client: redisClient,
  get: safeRedisGet,
  set: safeRedisSet,
  incr: safeRedisIncr,
  expire: safeRedisExpire,
  isConnected: () => isRedisConnected,
};
