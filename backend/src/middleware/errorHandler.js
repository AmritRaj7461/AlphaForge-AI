/**
 * Global error handling middleware.
 * Per Engineering Constitution Article 11: Never expose stack traces.
 * Per Engineering Constitution Article 10: All APIs must handle errors gracefully.
 * 
 * This middleware catches all unhandled errors and returns structured JSON.
 * Stack traces are NEVER exposed to the client.
 */

const logger = require('../utils/logger');
const { error, getStatusCode } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  // Log the full error internally (safe — not sent to client)
  logger.error(`[ErrorHandler] ${req.method} ${req.path}`, {
    message: err.message,
    code: err.code,
    // Stack trace logged internally only, never sent to client
    stack: err.stack,
  });

  // Determine error code and status
  const code = err.code || 'INTERNAL_ERROR';
  const statusCode = err.statusCode || getStatusCode(code);
  const message = err.publicMessage || 'An unexpected error occurred. Please try again.';

  return res.status(statusCode).json(error(code, message, err.fallback || false));
};

module.exports = errorHandler;
