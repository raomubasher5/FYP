const ApiResponse = require('../utils/apiResponse');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  // In production, suppress stack trace
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] [${req.method} ${req.url}]:`, err.message);
  }

  return ApiResponse.error(res, message, statusCode, err.details || null);
};

module.exports = errorHandler;
