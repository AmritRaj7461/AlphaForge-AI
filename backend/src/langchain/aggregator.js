/**
 * Data Aggregator
 * Merges all research tool outputs into a single normalized structure
 * ready for the Prompt Builder.
 * 
 * Per Component Architecture: Aggregator merges, normalizes, removes duplicates,
 * and prepares prompt input. It has NO business logic.
 */

const logger = require('../utils/logger');

/**
 * Aggregates results from all research tools into a unified data object.
 * Handles partial data gracefully — missing sections are marked but don't fail.
 * 
 * @param {object} toolResults - Output from FallbackEngine.runToolsInParallel
 * @returns {object} Normalized aggregated data ready for prompt building
 */
const aggregate = (toolResults) => {
  logger.info('[Aggregator] Aggregating tool results');

  const { company, finance, news, risk, competitor } = toolResults;

  const aggregated = {
    company: company?.data || null,
    finance: finance?.data || null,
    news: news?.data || [],
    risk: risk?.data || null,
    competitors: competitor?.data || [],

    // Track which tools failed for confidence calculation and reporting
    dataQuality: {
      companyDataAvailable: !company?.failed && company?.data !== null,
      financeDataAvailable: !finance?.failed && finance?.data !== null,
      newsDataAvailable: !news?.failed && (news?.data?.length > 0),
      riskDataAvailable: !risk?.failed && risk?.data !== null,
      competitorDataAvailable: !competitor?.failed && (competitor?.data?.length > 0),
      failedTools: Object.entries(toolResults)
        .filter(([, result]) => result.failed)
        .map(([name]) => name),
    },
  };

  logger.info('[Aggregator] Data quality:', aggregated.dataQuality);

  return aggregated;
};

module.exports = { aggregate };
