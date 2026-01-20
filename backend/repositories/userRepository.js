const db = require('../config/database');

/**
 * Find or create user
 * @param {Object} userData - User data from auth provider
 * @returns {Object} User record
 */
async function findOrCreateUser(userData) {
  const { id, email, name } = userData;
  
  // Check if user exists
  const existingUser = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [id]
  );
  
  if (existingUser.rows.length > 0) {
    return existingUser.rows[0];
  }
  
  // Create new user
  const newUser = await db.query(
    'INSERT INTO users (id, email, name) VALUES ($1, $2, $3) RETURNING *',
    [id, email, name]
  );
  
  return newUser.rows[0];
}

/**
 * Get user by ID
 * @param {string} userId - User ID
 * @returns {Object|null} User record or null
 */
async function getUserById(userId) {
  const result = await db.query(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  );
  
  return result.rows[0] || null;
}

module.exports = {
  findOrCreateUser,
  getUserById,
};
