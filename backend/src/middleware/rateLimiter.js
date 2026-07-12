/**
 * Rate limiter middleware.
 * Per Engineering Constitution Article 13: Security — validate and protect every request.
 * Prevents API abuse and protects Gemini API quota.
 */

const rateLimit = require('express-rate-limit');
const config = require('../config/env');
const { error } = require('../utils/responseFormatter');

const rateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,   // 15 minutes by default
  max: config.rateLimit.max,             // 100 requests per window by default
  standardHeaders: true,
  legacyHeaders: false,

  // Return structured JSON error (not default HTML)
  handler: (req, res) => {
    return res.status(429).json(
      error('RATE_LIMITED', 'Too many requests. Please wait before trying again.', false)
    );
  },
});

module.exports = rateLimiter;
