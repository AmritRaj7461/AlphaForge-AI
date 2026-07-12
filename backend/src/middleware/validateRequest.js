/**
 * Zod-based request validation middleware factory.
 * Per Engineering Constitution Article 10: Validate every request.
 * Per Engineering Constitution Article 13: Sanitize every input.
 * 
 * Usage: router.post('/route', validateRequest(schema), controller)
 */

const { z } = require('zod');
const { error } = require('../utils/responseFormatter');

/**
 * Creates a middleware that validates the request body against a Zod schema.
 * @param {z.ZodSchema} schema - Zod schema to validate against
 */
const validateRequest = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    const issues = result.error.issues.map((i) => ({
      field: i.path.join('.'),
      message: i.message,
    }));

    return res.status(400).json({
      success: false,
      code: 'INVALID_REQUEST',
      message: 'Request validation failed.',
      errors: issues,
      timestamp: new Date().toISOString(),
    });
  }

  // Attach validated (and coerced) data to request
  req.validatedBody = result.data;
  return next();
};

module.exports = validateRequest;
