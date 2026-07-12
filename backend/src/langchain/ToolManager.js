/**
 * Tool Manager
 * Central executor for all research tools. Runs tools in parallel, orchestrates 
 * market-aware provider fallback loops, measures latency, and generates health reports.
 */

const logger = require('../utils/logger');
const { getProviderChain, PROVIDERS } = require('../intelligence/ProviderRouter');
const { normalizeProfile, normalizeFinance } = require('../intelligence/DataNormalizer');
const yahooFinance = require('../utils/yahooFinance');

// Import Tools
const companyTool = require('../tools/companyTool');
const financeTool = require('../tools/financeTool');
const newsTool = require('../tools/newsTool');
const competitorTool = require('../tools/competitorTool');
const riskTool = require('../tools/riskTool');

/**
 * Helper to measure execution time of a promise
 * @param {Function} promiseFn 
 * @returns {Promise<{ result: any, latencyMs: number }>}
 */
async function measureTime(promiseFn) {
  const start = Date.now();
  const result = await promiseFn();
  const latencyMs = Date.now() - start;
  return { result, latencyMs };
}

/**
 * Executes a single tool through its prioritized provider chain
 * 
 * @param {string} toolName - "company" or "finance"
 * @param {object} resolvedCompany - Canonical company resolution object
 * @param {Function} fetchFn - Function to fetch raw data: (provider) => Promise<any>
 * @param {Function} normalizeFn - Function to normalize raw data: (provider, data) => any
 * @returns {Promise<{ data: any, status: string, provider: string, latencyMs: number, error: string|null }>}
 */
async function executeWithFallbackChain(toolName, resolvedCompany, fetchFn, normalizeFn) {
  const providers = getProviderChain(resolvedCompany.marketMeta.market);
  let finalData = null;
  let status = 'failed';
  let usedProvider = 'none';
  let totalLatency = 0;
  let lastError = null;

  for (let i = 0; i < providers.length; i++) {
    const provider = providers[i];
    usedProvider = provider;
    
    try {
      logger.info(`[ToolManager] [${toolName}] Attempting provider: "${provider}" for ${resolvedCompany.symbol}`);
      const { result, latencyMs } = await measureTime(() => fetchFn(provider));
      totalLatency += latencyMs;

      if (result) {
        finalData = normalizeFn(provider, result);
        if (finalData) {
          // Post-Fetch Fallback Merge: fill in missing fields from yahoo_finance keyless lookup
          if (toolName === 'finance' && provider !== 'yahoo_finance') {
            const missingKeys = ['revenue', 'netIncome', 'marketCap', 'peRatio', 'roe', 'roa', 'eps', 'debt', 'cashFlow', 'revenueGrowth', 'grossMargin', 'profitMargin'].filter(
              k => !finalData[k] || finalData[k] === 'N/A' || finalData[k] === 'Data unavailable'
            );
            if (missingKeys.length > 0) {
              logger.info(`[ToolManager] [finance] ${missingKeys.length} metrics missing from ${provider}. Querying yahoo_finance as fallback merge.`);
              try {
                const yfRaw = await yahooFinance.fetchQuoteSummary(resolvedCompany.symbol);
                if (yfRaw) {
                  const yfNorm = normalizeFinance('yahoo_finance', yfRaw, resolvedCompany.symbol, resolvedCompany.marketMeta);
                  if (yfNorm) {
                    for (const key of missingKeys) {
                      if (yfNorm[key] && yfNorm[key] !== 'N/A' && yfNorm[key] !== 'Data unavailable') {
                        finalData[key] = yfNorm[key];
                      }
                    }
                    finalData._source = `${finalData._source}+yahoo_finance`;
                  }
                }
              } catch (yfErr) {
                logger.warn(`[ToolManager] [finance] Fallback merge via yahoo_finance failed: ${yfErr.message}`);
              }
            }
          }

          status = i === 0 ? 'completed' : 'fallback';
          break;
        }
      }
      logger.warn(`[ToolManager] [${toolName}] Provider "${provider}" returned empty data for ${resolvedCompany.symbol}`);
    } catch (err) {
      lastError = err.message;
      logger.warn(`[ToolManager] [${toolName}] Provider "${provider}" failed: ${err.message}`);
    }
  }

  // If all providers failed, try to generate a minimal stub
  if (!finalData) {
    logger.error(`[ToolManager] [${toolName}] All providers failed for ${resolvedCompany.symbol}. Generating stub.`);
    usedProvider = 'stub';
    status = 'failed';
    finalData = normalizeFn('static', null); // Static normalizer fallback will handle nulls
  }

  return {
    data: finalData,
    status,
    provider: usedProvider,
    latencyMs: totalLatency,
    error: lastError
  };
}

/**
 * Main execution entry point.
 * Runs all tools in parallel and returns aggregated results with health metadata.
 * 
 * @param {object} resolvedCompany - Resolved canonical company object
 * @returns {Promise<object>} Tool execution report
 */
async function executeAll(resolvedCompany) {
  const symbol = resolvedCompany.symbol;
  const name = resolvedCompany.name;

  logger.info(`[ToolManager] Executing research tools in parallel for: ${name} (${symbol})`);

  // Define parallel tasks
  const companyTask = executeWithFallbackChain(
    'company',
    resolvedCompany,
    (provider) => companyTool.fetchRawData(provider, symbol),
    (provider, data) => normalizeProfile(provider, data, symbol)
  );

  const financeTask = executeWithFallbackChain(
    'finance',
    resolvedCompany,
    (provider) => financeTool.fetchRawData(provider, symbol),
    (provider, data) => normalizeFinance(provider, data, symbol, resolvedCompany.marketMeta)
  );

  const newsTask = measureTime(async () => {
    try {
      return await newsTool.execute({ company: name, symbol });
    } catch (err) {
      logger.warn(`[ToolManager] [news] Tool failed: ${err.message}`);
      return [];
    }
  });

  const competitorTask = measureTime(async () => {
    try {
      return await competitorTool.execute({ company: symbol });
    } catch (err) {
      logger.warn(`[ToolManager] [competitor] Tool failed: ${err.message}`);
      return [];
    }
  });

  // Run first 4 tools in parallel
  const [companyRes, financeRes, newsRes, competitorRes] = await Promise.all([
    companyTask,
    financeTask,
    newsTask,
    competitorTask
  ]);

  // Invoking risk tool with the fetched company profile and financial metrics
  const riskTask = measureTime(async () => {
    try {
      return await riskTool.execute({
        company: name,
        financials: financeRes.data,
        news: newsRes.result,
        profile: companyRes.data
      });
    } catch (err) {
      logger.warn(`[ToolManager] [risk] Tool failed: ${err.message}`);
      return null;
    }
  });

  const riskRes = await riskTask;

  // Compile health and provider tracking status
  const toolHealth = {
    company: {
      status: companyRes.status,
      provider: companyRes.provider,
      latencyMs: companyRes.latencyMs,
      error: companyRes.error
    },
    finance: {
      status: financeRes.status,
      provider: financeRes.provider,
      latencyMs: financeRes.latencyMs,
      error: financeRes.error
    },
    news: {
      status: newsRes.result && newsRes.result.length > 0 ? 'completed' : 'failed',
      provider: 'news_api',
      latencyMs: newsRes.latencyMs,
      error: newsRes.result ? null : 'No news found'
    },
    competitor: {
      status: competitorRes.result && competitorRes.result.length > 0 ? 'completed' : 'failed',
      provider: 'fmp',
      latencyMs: competitorRes.latencyMs,
      error: competitorRes.result ? null : 'No competitors found'
    },
    risk: {
      status: riskRes.result ? 'completed' : 'failed',
      provider: 'rules_engine',
      latencyMs: riskRes.latencyMs,
      error: riskRes.result ? null : 'Risk assessment failed'
    }
  };

  // Provider summary
  const successList = Object.values(toolHealth).filter(h => h.status !== 'failed');
  const successRate = successList.length / Object.keys(toolHealth).length;
  const fallbackCount = Object.values(toolHealth).filter(h => h.status === 'fallback').length;

  const providerStatus = {
    activeProviders: [...new Set(Object.values(toolHealth).map(h => h.provider).filter(p => p !== 'none' && p !== 'stub'))],
    fallbackCount,
    successRate,
    lastUpdated: new Date().toISOString()
  };

  // Compile final aggregated data
  const aggregatedData = {
    company: companyRes.data,
    finance: financeRes.data,
    news: newsRes.result,
    competitors: competitorRes.result,
    risk: riskRes.result
  };

  logger.info(`[ToolManager] Parallel execution complete. Success Rate: ${(successRate * 100).toFixed(0)}%`);

  return {
    aggregatedData,
    toolHealth,
    providerStatus
  };
}

module.exports = {
  executeAll
};
