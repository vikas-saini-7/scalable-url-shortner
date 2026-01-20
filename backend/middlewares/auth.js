const { AppError } = require('./errorHandler');
const config = require('../config/env');

/**
 * Middleware to verify authentication
 * Expects user information in request headers from NextAuth
 */
async function authMiddleware(req, res, next) {
  try {
    // In a real-world scenario with NextAuth, you would verify the session token
    // For this implementation, we'll use a simple header-based auth
    const userId = req.headers['x-user-id'];
    const userEmail = req.headers['x-user-email'];
    
    if (!userId || !userEmail) {
      throw new AppError('Unauthorized - Please log in', 401);
    }
    
    // Attach user info to request object
    req.user = {
      id: userId,
      email: userEmail,
    };
    
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authMiddleware;
