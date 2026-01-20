/**
 * Centralized error handling middleware
 * Catches all errors and returns consistent error responses
 */
function errorHandler(err, req, res, next) {
  console.error('Error:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  
  // Don't expose internal errors in production
  const responseMessage = statusCode === 500 && process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : message;
  
  res.status(statusCode).json({
    success: false,
    message: responseMessage,
  });
}

/**
 * Custom error class with status code
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

module.exports = { errorHandler, AppError };
