const db = require('../config/database');

/**
 * Create a new URL mapping
 * @param {Object} urlData - URL data
 * @returns {Object} Created URL record with generated ID
 */
async function createUrl(urlData) {
  const { userId, longUrl, expiresAt } = urlData;
  
  const result = await db.query(
    `INSERT INTO urls (user_id, long_url, expires_at) 
     VALUES ($1, $2, $3) 
     RETURNING id`,
    [userId, longUrl, expiresAt || null]
  );
  
  return result.rows[0];
}

/**
 * Update short code for a URL
 * @param {number} id - URL ID
 * @param {string} shortCode - Generated short code
 */
async function updateShortCode(id, shortCode) {
  await db.query(
    'UPDATE urls SET short_code = $1 WHERE id = $2',
    [shortCode, id]
  );
}

/**
 * Get URL by short code
 * @param {string} shortCode - Short code
 * @returns {Object|null} URL record or null
 */
async function getUrlByShortCode(shortCode) {
  const result = await db.query(
    'SELECT * FROM urls WHERE short_code = $1',
    [shortCode]
  );
  
  return result.rows[0] || null;
}

/**
 * Get all URLs for a user
 * @param {string} userId - User ID
 * @returns {Array} Array of URL records
 */
async function getUrlsByUserId(userId) {
  const result = await db.query(
    `SELECT id, short_code, long_url, click_count, created_at, expires_at
     FROM urls 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [userId]
  );
  
  return result.rows;
}

/**
 * Increment click count for a URL
 * @param {string} shortCode - Short code
 */
async function incrementClickCount(shortCode) {
  await db.query(
    'UPDATE urls SET click_count = click_count + 1 WHERE short_code = $1',
    [shortCode]
  );
}

/**
 * Get URL statistics by short code
 * @param {string} shortCode - Short code
 * @param {string} userId - User ID (for ownership verification)
 * @returns {Object|null} URL statistics or null
 */
async function getUrlStats(shortCode, userId) {
  const result = await db.query(
    `SELECT short_code, long_url, click_count, created_at, expires_at
     FROM urls 
     WHERE short_code = $1 AND user_id = $2`,
    [shortCode, userId]
  );
  
  return result.rows[0] || null;
}

module.exports = {
  createUrl,
  updateShortCode,
  getUrlByShortCode,
  getUrlsByUserId,
  incrementClickCount,
  getUrlStats,
};
