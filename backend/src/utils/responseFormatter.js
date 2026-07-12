/**
 * Standardized API response formatter.
 * Per Engineering Constitution Article 10: All APIs must use consistent response formats.
 * Per API Contract: Every response is { success, data/error, timestamp }
 */

/**
 * Creates a successful JSON response envelope.
 * @param {object} data - The payload to return
 * @returns {object} Standardized success response
 */
const success = (data) => ({
  success: true,
  ...data,
  generatedAt: new Date().toISOString(),
});

/**
 * Creates a structured error JSON response.
 * Per Engineering Constitution Article 11: Never expose stack traces.
 * 
 * @param {string} code - Machine-readable error code
 * @param {string} message - Human-readable error message  
 * @param {boolean} fallback - Whether fallback data is included
 * @returns {object} Standardized error response
 */
const error = (code, message, fallback = false) => ({
  success: false,
  code,
  message,
  fallback,
  timestamp: new Date().toISOString(),
});

/**
 * Maps common error codes to HTTP status codes.
 */
const ERROR_STATUS_MAP = {
  INVALID_REQUEST: 400,
  COMPANY_NOT_FOUND: 404,
  RATE_LIMITED: 429,
  PROVIDER_UNAVAILABLE: 503,
  INTERNAL_ERROR: 500,
  API_TIMEOUT: 504,
  VALIDATION_FAILED: 422,
};

const getStatusCode = (code) => ERROR_STATUS_MAP[code] || 500;

module.exports = { success, error, getStatusCode };
