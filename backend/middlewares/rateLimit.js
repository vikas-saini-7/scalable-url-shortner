const redis = require('../config/redis');
const config = require('../config/env');
const { AppError } = require('./errorHandler');

/**
 * IP-based rate limiting middleware using Redis
 * Limits number of requests per IP within a time window
 */
async function rateLimitMiddleware(req, res, next) {
  try {
    // If Redis is not available, skip rate limiting
    if (!redis.isConnected()) {
      return next();
    }
    
    const ip = req.ip || req.connection.remoteAddress;
    const key = `ratelimit:${ip}`;
    
    const current = await redis.incr(key);
    
    if (current === 1) {
      // First request, set expiration
      await redis.expire(key, Math.floor(config.rateLimit.windowMs / 1000));
    }
    
    if (current > config.rateLimit.max) {
      throw new AppError('Rate limit exceeded. Please try again later.', 429);
    }
    
    // Add rate limit headers
    res.setHeader('X-RateLimit-Limit', config.rateLimit.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, config.rateLimit.max - current));
    
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = rateLimitMiddleware;
