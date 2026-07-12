/**
 * Chat Service
 * Handles follow-up chat questions using ARGUS with analysis context.
 * 
 * Per Chat spec: No complete re-analysis. Context-aware responses only.
 * ARGUS handles the actual LLM interaction.
 */

const argus = require('../langchain/argus');
const logger = require('../utils/logger');

/**
 * Processes a follow-up question using previous analysis context.
 * 
 * @param {object} context - Previous analysis report from session cache
 * @param {string} question - User's follow-up question
 * @returns {Promise<object>} Chat response
 */
const handleFollowUp = async (context, question) => {
  logger.info(`[ChatService] Processing follow-up for company: ${context.company?.name || 'unknown'}`);

  const response = await argus.chat(context, question);

  return {
    answer: response.answer,
    confidence: response.confidence,
    referencedSections: response.referencedSections,
    company: context.company?.name || 'N/A',
  };
};

module.exports = { handleFollowUp };
