const dotenv = require('dotenv');

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  database: {
    url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/urlshortener',
  },
  
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
  },
  
  auth: {
    secret: process.env.AUTH_SECRET || 'development-secret-change-in-production',
  },
  
  app: {
    baseUrl: process.env.BASE_URL || 'http://localhost:5000',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  },
  
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX) || 10,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
  },
  
  cache: {
    ttl: parseInt(process.env.CACHE_TTL) || 3600, // 1 hour in seconds
  },
};

module.exports = config;
