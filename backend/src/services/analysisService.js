/**
 * Analysis Service
 * Coordinates the complete analysis workflow.
 * 
 * Per Services Specification: Services contain business logic.
 * Controllers must remain thin and delegate all processing to services.
 * 
 * This service is the bridge between controllers and ARGUS.
 */

const { v4: uuidv4 } = require('uuid');
const argus = require('../langchain/argus');
const sessionCache = require('../cache/sessionCache');
const logger = require('../utils/logger');

/**
 * Analyzes a company by delegating to ARGUS.
 * Stores the result in session cache for follow-up chat.
 * 
 * @param {string} company - Company name or ticker
 * @returns {Promise<{ sessionId: string, report: object }>}
 */
const analyzeCompany = async (company) => {
  logger.info(`[AnalysisService] Starting analysis for: ${company}`);

  // If running in mock/demo mode, add a brief delay to allow the loading screen stages to render
  const config = require('../config/env');
  if (!config.hasGeminiKey()) {
    logger.info(`[AnalysisService] Mock mode detected — adding 2.5s delay to demonstrate loading screen stages`);
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  // ARGUS performs the complete research and reasoning pipeline
  const report = await argus.analyze(company);

  // Generate a session ID for follow-up chat
  const sessionId = uuidv4();
  sessionCache.set(sessionId, report);

  logger.info(`[AnalysisService] Analysis complete. Session: ${sessionId}`);

  return { sessionId, report };
};

/**
 * Retrieves cached session context for chat follow-up.
 * 
 * @param {string} sessionId - UUID from previous analysis
 * @returns {object|null} Previous analysis data or null
 */
const getSessionContext = (sessionId) => {
  return sessionCache.get(sessionId);
};

module.exports = { analyzeCompany, getSessionContext };
