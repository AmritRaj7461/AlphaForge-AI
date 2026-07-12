/**
 * Chat Controller
 * Thin controller for follow-up chat requests.
 */

const chatService = require('../services/chatService');
const analysisService = require('../services/analysisService');
const { success, error } = require('../utils/responseFormatter');
const logger = require('../utils/logger');

/**
 * POST /api/chat
 * Handles follow-up questions using cached analysis context.
 */
const handleChat = async (req, res, next) => {
  const { sessionId, question } = req.validatedBody;

  logger.info(`[ChatController] Chat request for session: ${sessionId}`);

  try {
    // Retrieve analysis context from session cache
    const context = analysisService.getSessionContext(sessionId);

    if (!context) {
      return res.status(404).json(
        error('SESSION_NOT_FOUND', 'Analysis session not found or has expired. Please perform a new analysis first.', false)
      );
    }

    const response = await chatService.handleFollowUp(context, question);

    return res.status(200).json(success(response));
  } catch (err) {
    next(err);
  }
};

module.exports = { handleChat };
