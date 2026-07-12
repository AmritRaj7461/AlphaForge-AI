/**
 * Finance Tool
 * Retrieves raw financial data from various providers.
 * Decoupled from formatting, local mock databases, and normalization.
 */

const axios = require('axios');
const config = require('../config/env');
const yahooFinance = require('../utils/yahooFinance');
const { getRegistryEntry } = require('../intelligence/CompanyRegistry');
const { normalizeFinance } = require('../intelligence/DataNormalizer');

/**
 * Fetches raw financial metrics for a company from a specified provider.
 * 
 * @param {string} provider - "alpha_vantage", "fmp", "yahoo_finance", "static"
 * @param {string} symbol - Canonical ticker symbol
 * @returns {Promise<object|null>} Raw JSON payload or null
 */
async function fetchRawData(provider, symbol) {
  const cleanSymbol = symbol.toUpperCase().trim();

  switch (provider) {
    case 'alpha_vantage': {
      if (!config.hasAlphaVantageKey()) return null;
      const res = await axios.get(config.alphaVantage.baseUrl, {
        params: { function: 'OVERVIEW', symbol: cleanSymbol, apikey: config.alphaVantage.apiKey },
        timeout: config.analysis.timeoutMs
      });
      const d = res.data;
      if (d && d.Symbol && !d.Information && !d.Note) return d;
      return null;
    }

    case 'fmp': {
      if (!config.hasFmpKey()) return null;
      const [profileRes, ratiosRes, incomeRes] = await Promise.allSettled([
        axios.get(`${config.fmp.baseUrl}/profile`, {
          params: { symbol: cleanSymbol, apikey: config.fmp.apiKey },
          timeout: config.analysis.timeoutMs
        }),
        axios.get(`${config.fmp.baseUrl}/ratios-ttm`, {
          params: { symbol: cleanSymbol, apikey: config.fmp.apiKey },
          timeout: config.analysis.timeoutMs
        }),
        axios.get(`${config.fmp.baseUrl}/income-statement`, {
          params: { symbol: cleanSymbol, period: 'annual', limit: 2, apikey: config.fmp.apiKey },
          timeout: config.analysis.timeoutMs
        })
      ]);

      const profile = profileRes.status === 'fulfilled' && Array.isArray(profileRes.value.data) && profileRes.value.data[0]
        ? profileRes.value.data[0]
        : null;
      const ratios = ratiosRes.status === 'fulfilled' && Array.isArray(ratiosRes.value.data) && ratiosRes.value.data[0]
        ? ratiosRes.value.data[0]
        : null;
      const income = incomeRes.status === 'fulfilled' && Array.isArray(incomeRes.value.data) && incomeRes.value.data[0]
        ? incomeRes.value.data[0]
        : null;

      if (profile || ratios || income) {
        return { profile, ratios, income };
      }
      return null;
    }

    case 'nse': {
      if (!cleanSymbol.endsWith('.NS')) return null;
      return await yahooFinance.fetchQuoteSummary(cleanSymbol);
    }

    case 'bse': {
      if (!cleanSymbol.endsWith('.BO')) return null;
      return await yahooFinance.fetchQuoteSummary(cleanSymbol);
    }

    case 'yahoo_finance': {
      return await yahooFinance.fetchQuoteSummary(cleanSymbol);
    }

    case 'static': {
      const entry = getRegistryEntry(cleanSymbol);
      return entry ? entry.financials : null;
    }

    default:
      return null;
  }
}

/**
 * Backward compatible execute wrapper
 */
async function execute({ company }) {
  const symbol = company.toUpperCase().trim();
  const provider = config.hasAlphaVantageKey() 
    ? 'alpha_vantage' 
    : (config.hasFmpKey() ? 'fmp' : 'yahoo_finance');

  const raw = await fetchRawData(provider, symbol);
  const data = normalizeFinance(provider, raw, symbol, { currency: 'USD' });
  return { success: !!data, data };
}

module.exports = {
  fetchRawData,
  execute
};
