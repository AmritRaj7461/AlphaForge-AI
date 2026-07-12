/**
 * Analysis Controller
 * Thin controller — receives request, delegates to service, returns response.
 * Per Coding Standards: Controllers remain thin. Business logic belongs in Services.
 */

const analysisService = require('../services/analysisService');
const { success, error, getStatusCode } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * POST /api/analyze
 * Triggers a full company analysis via ARGUS.
 */
const analyzeCompany = async (req, res, next) => {
  const { company } = req.validatedBody;

  logger.info(`[AnalysisController] Received analysis request for: "${company}"`);

  try {
    const { sessionId, report } = await analysisService.analyzeCompany(company);

    return res.status(200).json(success({
      sessionId,
      ...report,
    }));
  } catch (err) {
    // Pass to global error handler
    next(err);
  }
};

module.exports = { analyzeCompany };
