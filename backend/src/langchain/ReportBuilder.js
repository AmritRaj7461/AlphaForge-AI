/**
 * Report Builder
 * Formats and compiles raw metrics, AI reasoning outputs, evidence checklists,
 * tool health tracking, and provider details into a unified dashboard-ready JSON schema.
 * Preserves backward compatibility with original frontend dashboard properties.
 */

const logger = require('../utils/logger');
const { extractEvidence } = require('./ExplainabilityEngine');

/**
 * Builds the final structured analysis report for the frontend.
 * 
 * @param {object} resolvedCompany - Canonical company details
 * @param {object} aggregatedData - Merged tool outputs
 * @param {object} validationResult - JSON validation object from validator
 * @param {object} toolHealth - Health metrics for each research tool
 * @param {object} providerStatus - Latency and success tracking of active feeds
 * @param {object} confidence - Quantitative confidence details
 * @param {string} provider - LLM provider name used
 * @returns {object} Canonical frontend-ready JSON report
 */
function buildReport(resolvedCompany, aggregatedData, validationResult, toolHealth, providerStatus, confidence, provider) {
  logger.info(`[ReportBuilder] Formatting final report for ${resolvedCompany.name}`);

  const aiData = validationResult.data || {};
  const recommendation = aiData.recommendation || 'HOLD';

  // Inject explainability evidence
  const evidence = extractEvidence(aggregatedData, recommendation);

  // Data Freshness & Market Metadata
  const freshness = {
    lastUpdated: new Date().toISOString(),
    currency: resolvedCompany.marketMeta.currency,
    exchange: resolvedCompany.marketMeta.exchange,
    market: resolvedCompany.marketMeta.market,
    country: resolvedCompany.marketMeta.country,
    region: resolvedCompany.marketMeta.region,
    financialStatementDate: 'TTM (Latest Publicly Reported)'
  };

  return {
    success: true,
    company: aggregatedData.company || { name: resolvedCompany.name, ticker: resolvedCompany.symbol },
    financials: aggregatedData.finance,
    news: aggregatedData.news || [],
    competitors: aggregatedData.competitors || [],
    risk: aggregatedData.risk || {},
    
    // Original dashboard keys for backward compatibility
    analysis: aiData,
    recommendation: recommendation,
    confidence: confidence.score,
    confidenceLevel: confidence.level,
    confidenceBreakdown: confidence.breakdown,
    reasoning: aiData.reasoning || 'Analysis unavailable.',
    swot: aiData.swot,
    limitations: aiData.limitations || [],
    dataQuality: {
      companyDataAvailable: !!aggregatedData.company,
      financeDataAvailable: !!aggregatedData.finance,
      newsDataAvailable: aggregatedData.news && aggregatedData.news.length > 0,
      riskDataAvailable: !!aggregatedData.risk,
      competitorDataAvailable: aggregatedData.competitors && aggregatedData.competitors.length > 0,
      failedTools: Object.keys(toolHealth).filter(k => toolHealth[k].status === 'failed')
    },
    validationIssues: validationResult.issues || [],
    llmProvider: provider,
    usedMockData: provider === 'deterministic',
    generatedAt: new Date().toISOString(),

    // V1.1 Enhancements
    evidence,
    toolHealth,
    providerStatus,
    freshness
  };
}

module.exports = {
  buildReport
};
