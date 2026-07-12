/**
 * Zod validation schemas for all API endpoints.
 * Per Engineering Constitution Article 10: Accept JSON, validate every request.
 */

const { z } = require('zod');

/**
 * Schema for POST /api/analyze
 * Accepts company name or stock ticker symbol.
 */
const analyzeRequestSchema = z.object({
  company: z
    .string()
    .min(1, 'Company name is required.')
    .max(100, 'Company name is too long.')
    .trim(),
});

/**
 * Schema for POST /api/chat
 * Requires a sessionId from a prior analysis and the user question.
 */
const chatRequestSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'Session ID is required.')
    .uuid('Invalid session ID format.'),
  question: z
    .string()
    .min(1, 'Question cannot be empty.')
    .max(500, 'Question is too long (max 500 characters).')
    .trim(),
});

/**
 * Expected structure of a valid ARGUS analysis response.
 * Used internally by the response validator.
 */
const analysisResponseSchema = z.object({
  companySummary: z.string(),
  financialSummary: z.string(),
  riskSummary: z.string(),
  competitorSummary: z.string(),
  swot: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    opportunities: z.array(z.string()),
    threats: z.array(z.string()),
  }),
  recommendation: z.enum(['BUY', 'HOLD', 'PASS']),
  reasoning: z.string(),
  limitations: z.array(z.string()),
});

module.exports = {
  analyzeRequestSchema,
  chatRequestSchema,
  analysisResponseSchema,
};
