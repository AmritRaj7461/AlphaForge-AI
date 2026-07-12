/**
 * Fallback Engine
 * Per Engineering Constitution Article 11: Application failures must never terminate analysis.
 * Strategy: Primary → Retry → Partial Result → Reduce Confidence → Continue
 * 
 * Individual tool failures are ISOLATED. Other tools continue running.
 * User always receives a report, even if partial.
 */

const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Executes a function with retry logic.
 * If all retries fail, returns the fallback value (null/empty) and marks as failed.
 * 
 * @param {Function} fn - Async function to execute
 * @param {string} toolName - Name for logging
 * @param {*} fallbackValue - Value to return if all retries fail
 * @returns {Promise<{ data: *, failed: boolean, error: string|null }>}
 */
const withFallback = async (fn, toolName, fallbackValue = null) => {
  const maxRetries = config.analysis.maxRetries;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(`[FallbackEngine] ${toolName} — attempt ${attempt}/${maxRetries}`);
      const data = await fn();
      logger.info(`[FallbackEngine] ${toolName} — succeeded on attempt ${attempt}`);
      return { data, failed: false, error: null };
    } catch (err) {
      logger.warn(`[FallbackEngine] ${toolName} — attempt ${attempt} failed: ${err.message}`);

      if (attempt === maxRetries) {
        logger.error(`[FallbackEngine] ${toolName} — all retries exhausted, using fallback`);
        return {
          data: fallbackValue,
          failed: true,
          error: err.message,
        };
      }

      // Brief wait before retry
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }
  }
};

/**
 * Runs all tool functions in parallel using Promise.allSettled.
 * This ensures one tool failure does NOT block other tools.
 * Returns results map with { data, failed, error } for each tool.
 * 
 * @param {object} tools - Map of { toolName: asyncFunction }
 * @returns {Promise<object>} - Map of { toolName: { data, failed, error } }
 */
const runToolsInParallel = async (tools) => {
  const toolNames = Object.keys(tools);
  const toolFunctions = Object.values(tools);

  logger.info(`[FallbackEngine] Running ${toolNames.length} tools in parallel: ${toolNames.join(', ')}`);

  const results = await Promise.allSettled(
    toolFunctions.map((fn, i) => withFallback(fn, toolNames[i]))
  );

  const resultMap = {};
  toolNames.forEach((name, i) => {
    const result = results[i];
    if (result.status === 'fulfilled') {
      resultMap[name] = result.value;
    } else {
      // This should never happen because withFallback catches all errors
      logger.error(`[FallbackEngine] ${name} — unexpected rejection`);
      resultMap[name] = { data: null, failed: true, error: result.reason?.message };
    }
  });

  const failedTools = toolNames.filter((n) => resultMap[n].failed);
  if (failedTools.length > 0) {
    logger.warn(`[FallbackEngine] Failed tools (partial report will be generated): ${failedTools.join(', ')}`);
  }

  return resultMap;
};

module.exports = { withFallback, runToolsInParallel };
