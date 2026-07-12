/**
 * Gemini LLM client configuration.
 * ARGUS is the ONLY component that calls Gemini — this module is only imported by argus.js.
 * Per Engineering Constitution Article 5: ARGUS is the Brain.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('./env');
const logger = require('../utils/logger');

let geminiClient = null;
let geminiModel = null;

/**
 * Initializes the Gemini client.
 * Returns null if no API key is configured (fallback will handle this case).
 */
const initGemini = () => {
  if (!config.hasGeminiKey()) {
    logger.warn('[Gemini] No API key configured — running in mock mode');
    return null;
  }

  try {
    geminiClient = new GoogleGenerativeAI(config.gemini.apiKey);
    geminiModel = geminiClient.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: {
        temperature: 0.3,       // Lower temperature for more consistent, factual responses
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });

    logger.info(`[Gemini] Client initialized with model: ${config.gemini.model}`);
    return geminiModel;
  } catch (error) {
    logger.error('[Gemini] Failed to initialize client:', error.message);
    return null;
  }
};

/**
 * Returns the initialized Gemini model instance.
 * Lazily initializes on first call.
 */
const getGeminiModel = () => {
  if (!geminiModel) {
    geminiModel = initGemini();
  }
  return geminiModel;
};

/**
 * Sends a prompt to Gemini and returns the text response.
 * This is the ONLY function that directly communicates with Gemini.
 * 
 * @param {string} prompt - The full constructed prompt
 * @returns {Promise<string>} - Raw text response from Gemini
 */
const callGemini = async (prompt) => {
  const model = getGeminiModel();

  if (!model) {
    throw new Error('GEMINI_UNAVAILABLE');
  }

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

module.exports = { callGemini, getGeminiModel };
