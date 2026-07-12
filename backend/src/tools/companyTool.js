/**
 * Company Tool
 * Retrieves raw company profile information from various providers.
 * Decoupled from alias handling, fuzzy matching, and normalization.
 */

const axios = require('axios');
const config = require('../config/env');
const yahooFinance = require('../utils/yahooFinance');
const { getRegistryEntry } = require('../intelligence/CompanyRegistry');
const { normalizeProfile } = require('../intelligence/DataNormalizer');

/**
 * Fetches raw profile data for a company from a specified provider.
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
      if (d && d.Name && !d.Information && !d.Note) return d;
      return null;
    }

    case 'fmp': {
      if (!config.hasFmpKey()) return null;
      const res = await axios.get(`${config.fmp.baseUrl}/profile`, {
        params: { symbol: cleanSymbol, apikey: config.fmp.apiKey },
        timeout: config.analysis.timeoutMs
      });
      const profiles = res.data;
      if (Array.isArray(profiles) && profiles.length > 0 && profiles[0].companyName) {
        return profiles[0];
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
      return entry ? entry.profile : null;
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
  const data = normalizeProfile(provider, raw, symbol);
  return { success: !!data, data };
}

module.exports = {
  fetchRawData,
  execute
};
