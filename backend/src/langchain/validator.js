/**
 * Response Validator
 * Validates Gemini JSON output for correctness and completeness.
 * 
 * Per Engineering Constitution Article 6: AI must be deterministic where possible.
 * Per Response Validator spec: validate JSON, ensure mandatory fields, detect hallucinations.
 * 
 * This module NEVER calls Gemini or external APIs.
 */

const logger = require('../utils/logger');

const VALID_RECOMMENDATIONS = ['BUY', 'HOLD', 'PASS'];
const REQUIRED_FIELDS = [
  'companySummary',
  'financialSummary',
  'riskSummary',
  'recommendation',
  'reasoning',
  'swot',
];

/**
 * Attempts to extract JSON from a raw Gemini text response.
 * Gemini sometimes wraps JSON in markdown code blocks — this handles that.
 * 
 * @param {string} rawText - Raw text from Gemini
 * @returns {object|null} Parsed JSON or null if parsing fails
 */
const extractJSON = (rawText) => {
  if (!rawText || typeof rawText !== 'string') return null;

  // Try direct parse first
  try {
    return JSON.parse(rawText.trim());
  } catch {
    // Try extracting from markdown code block
    const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        // Fall through
      }
    }

    // Try finding raw JSON object
    const objectMatch = rawText.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        // Fall through
      }
    }
  }

  return null;
};

/**
 * Validates that the parsed response contains all required fields
 * and that the recommendation is valid.
 * 
 * @param {object} parsed - Parsed JSON from Gemini
 * @returns {{ valid: boolean, issues: string[] }}
 */
const validateFields = (parsed) => {
  const issues = [];

  // Check required fields
  for (const field of REQUIRED_FIELDS) {
    if (!parsed[field]) {
      issues.push(`Missing required field: ${field}`);
    }
  }

  // Validate recommendation value
  if (parsed.recommendation && !VALID_RECOMMENDATIONS.includes(parsed.recommendation)) {
    issues.push(`Invalid recommendation value: "${parsed.recommendation}". Must be BUY, HOLD, or PASS.`);
    // Attempt to fix common issues
    const upper = String(parsed.recommendation).toUpperCase();
    if (VALID_RECOMMENDATIONS.includes(upper)) {
      parsed.recommendation = upper;
      issues.pop(); // Remove the error since we fixed it
    }
  }

  // Validate SWOT structure if present
  if (parsed.swot) {
    const swotFields = ['strengths', 'weaknesses', 'opportunities', 'threats'];
    for (const field of swotFields) {
      if (!Array.isArray(parsed.swot[field])) {
        parsed.swot[field] = [];
        issues.push(`SWOT.${field} was not an array — defaulted to empty`);
      }
    }
  }

  return { valid: issues.length === 0, issues };
};

/**
 * Applies safe defaults for any missing optional fields.
 * This ensures the response is always complete for the frontend.
 */
const applyDefaults = (parsed) => {
  return {
    companySummary: parsed.companySummary || 'Analysis unavailable.',
    financialSummary: parsed.financialSummary || 'Financial analysis unavailable.',
    riskSummary: parsed.riskSummary || 'Risk analysis unavailable.',
    competitorSummary: parsed.competitorSummary || 'Competitor analysis unavailable.',
    swot: {
      strengths: parsed.swot?.strengths || [],
      weaknesses: parsed.swot?.weaknesses || [],
      opportunities: parsed.swot?.opportunities || [],
      threats: parsed.swot?.threats || [],
    },
    recommendation: VALID_RECOMMENDATIONS.includes(parsed.recommendation)
      ? parsed.recommendation
      : 'HOLD',
    reasoning: parsed.reasoning || 'Reasoning unavailable.',
    keyMetrics: parsed.keyMetrics || {},
    limitations: parsed.limitations || [],
    evidenceQuality: parsed.evidenceQuality || 'low',
  };
};

/**
 * Main validation function.
 * Parses, validates, and normalizes the Gemini response.
 * 
 * @param {string} rawResponse - Raw text response from Gemini
 * @returns {{ success: boolean, data: object|null, issues: string[], parseError: boolean }}
 */
const validateResponse = (rawResponse) => {
  logger.info('[Validator] Validating Gemini response');

  // Step 1: Parse JSON
  const parsed = extractJSON(rawResponse);
  if (!parsed) {
    logger.error('[Validator] Failed to parse JSON from Gemini response');
    return {
      success: false,
      data: null,
      issues: ['Response is not valid JSON'],
      parseError: true,
    };
  }

  // Step 2: Validate fields
  const { valid, issues } = validateFields(parsed);
  if (!valid) {
    logger.warn('[Validator] Validation issues found:', issues);
  }

  // Step 3: Apply defaults for missing optional fields
  const normalized = applyDefaults(parsed);

  logger.info(`[Validator] Validation complete. Valid: ${valid}, Issues: ${issues.length}`);

  return {
    success: true,  // As long as we could parse, we return something
    data: normalized,
    issues,
    parseError: false,
  };
};

module.exports = { validateResponse };
