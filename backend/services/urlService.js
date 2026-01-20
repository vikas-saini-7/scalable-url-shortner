const urlRepository = require('../repositories/urlRepository');
const redis = require('../config/redis');
const config = require('../config/env');
const { encode } = require('../utils/base62');
const { isValidUrl } = require('../utils/validator');
const { AppError } = require('../middlewares/errorHandler');

/**
 * Create a shortened URL
 * @param {string} longUrl - Original long URL
 * @param {string} userId - User ID
 * @param {Date|null} expiresAt - Optional expiration date
 * @returns {Object} Created URL with short code
 */
async function createShortUrl(longUrl, userId, expiresAt = null) {
  // Validate URL
  if (!isValidUrl(longUrl)) {
    throw new AppError('Invalid URL format', 400);
  }
  
  // Create URL record (without short_code initially)
  const urlRecord = await urlRepository.createUrl({
    userId,
    longUrl,
    expiresAt,
  });
  
  // Generate short code from auto-incremented ID
  const shortCode = encode(urlRecord.id);
  
  // Update record with generated short code
  await urlRepository.updateShortCode(urlRecord.id, shortCode);
  
  // Cache the mapping
  await redis.set(
    shortCode,
    longUrl,
    { EX: config.cache.ttl }
  );
  
  return {
    shortCode,
    longUrl,
    shortUrl: `${config.app.baseUrl}/${shortCode}`,
    expiresAt,
  };
}

/**
 * Get long URL by short code
 * Cache-aside pattern: check cache first, then DB
 * @param {string} shortCode - Short code
 * @returns {Object} URL data
 */
async function getLongUrl(shortCode) {
  // Try cache first
  const cachedUrl = await redis.get(shortCode);
  
  if (cachedUrl) {
    console.log('Cache hit for:', shortCode);
    return { longUrl: cachedUrl, fromCache: true };
  }
  
  console.log('Cache miss for:', shortCode);
  
  // Fallback to database
  const urlRecord = await urlRepository.getUrlByShortCode(shortCode);
  
  if (!urlRecord) {
    throw new AppError('URL not found', 404);
  }
  
  // Check if expired
  if (urlRecord.expires_at && new Date(urlRecord.expires_at) < new Date()) {
    throw new AppError('URL has expired', 410);
  }
  
  // Update cache for next time
  await redis.set(
    shortCode,
    urlRecord.long_url,
    { EX: config.cache.ttl }
  );
  
  return { longUrl: urlRecord.long_url, fromCache: false };
}

/**
 * Increment click count (non-blocking)
 * @param {string} shortCode - Short code
 */
async function trackClick(shortCode) {
  // Fire and forget - don't wait for completion
  urlRepository.incrementClickCount(shortCode).catch(err => {
    console.error('Failed to track click:', err);
  });
}

/**
 * Get all URLs for a user
 * @param {string} userId - User ID
 * @returns {Array} User's URLs
 */
async function getUserUrls(userId) {
  const urls = await urlRepository.getUrlsByUserId(userId);
  
  return urls.map(url => ({
    shortCode: url.short_code,
    longUrl: url.long_url,
    shortUrl: `${config.app.baseUrl}/${url.short_code}`,
    clickCount: url.click_count,
    createdAt: url.created_at,
    expiresAt: url.expires_at,
    isExpired: url.expires_at && new Date(url.expires_at) < new Date(),
  }));
}

/**
 * Get statistics for a specific URL
 * @param {string} shortCode - Short code
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Object} URL statistics
 */
async function getUrlStats(shortCode, userId) {
  const stats = await urlRepository.getUrlStats(shortCode, userId);
  
  if (!stats) {
    throw new AppError('URL not found or unauthorized', 404);
  }
  
  return {
    shortCode: stats.short_code,
    longUrl: stats.long_url,
    shortUrl: `${config.app.baseUrl}/${stats.short_code}`,
    clickCount: stats.click_count,
    createdAt: stats.created_at,
    expiresAt: stats.expires_at,
    isExpired: stats.expires_at && new Date(stats.expires_at) < new Date(),
  };
}

module.exports = {
  createShortUrl,
  getLongUrl,
  trackClick,
  getUserUrls,
  getUrlStats,
};
