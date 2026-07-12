/**
 * Company Resolver
 * Resolves search keywords, symbols, and company names to a canonical company object.
 * Integrates Fuzzy Matcher, Registry, Market Resolver, and fallback API searches.
 */

const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/env');
const { getRegistryEntry } = require('./CompanyRegistry');
const { findBestMatch } = require('./FuzzyMatcher');
const { resolveMarket } = require('./MarketResolver');

/**
 * Resolves a raw user input query to a canonical company structure.
 * 
 * @param {string} input - User query (e.g. "Nvidea" or "SONATSOFTW.NS")
 * @returns {Promise<{ symbol: string, name: string, marketMeta: object, registry: boolean, confidence: number }>}
 */
async function resolve(input) {
  if (!input || typeof input !== 'string' || input.trim().length === 0) {
    throw new Error('Invalid query input for resolution');
  }

  const query = input.trim();
  logger.info(`[CompanyResolver] Resolving query: "${query}"`);

  // 1. Check Fuzzy Match against Registry Aliases
  const bestTicker = findBestMatch(query);
  if (bestTicker) {
    const entry = getRegistryEntry(bestTicker);
    const marketMeta = resolveMarket(bestTicker);

    if (entry) {
      logger.info(`[CompanyResolver] Registry fuzzy match resolved "${query}" -> ${bestTicker} (${entry.profile.name})`);
      return {
        symbol: bestTicker,
        name: entry.profile.name,
        marketMeta,
        registry: true,
        confidence: 0.98
      };
    } else {
      // It is a known curated alias without a static registry entry (fetched live from fallbacks)
      const nameMap = {
        'SONATSOFTW.NS': 'Sonata Software Limited',
        'PAYTM.BO': 'One97 Communications (Paytm)',
        'INFY.NS': 'Infosys Limited'
      };
      
      logger.info(`[CompanyResolver] Curated alias match resolved "${query}" -> ${bestTicker} (resolving live)`);
      return {
        symbol: bestTicker,
        name: nameMap[bestTicker] || query,
        marketMeta,
        registry: false,
        confidence: 0.95
      };
    }
  }

  const isPotentialTicker = /^[A-Z.]{1,10}$/i.test(query);
  const cleanInput = query.toUpperCase();

  // 2. Try FMP Search API
  if (config.hasFmpKey()) {
    try {
      const endpoint = isPotentialTicker ? 'search-symbol' : 'search-name';
      logger.info(`[CompanyResolver] Querying FMP ${endpoint} for "${query}"`);
      
      const res = await axios.get(`${config.fmp.baseUrl}/${endpoint}`, {
        params: { query, apikey: config.fmp.apiKey },
        timeout: 4000
      });

      const matches = res.data;
      if (Array.isArray(matches) && matches.length > 0) {
        const best = matches[0];
        const marketMeta = resolveMarket(best.symbol);
        logger.info(`[CompanyResolver] FMP API resolved "${query}" -> ${best.symbol} (${best.name})`);
        return {
          symbol: best.symbol,
          name: best.name,
          marketMeta,
          registry: false,
          confidence: 0.85
        };
      }
    } catch (err) {
      logger.warn(`[CompanyResolver] FMP search lookup failed: ${err.message}`);
    }
  }

  // 3. Try Alpha Vantage SYMBOL_SEARCH
  if (config.hasAlphaVantageKey()) {
    try {
      logger.info(`[CompanyResolver] Querying Alpha Vantage SYMBOL_SEARCH for "${query}"`);
      const res = await axios.get(config.alphaVantage.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: query,
          apikey: config.alphaVantage.apiKey
        },
        timeout: 4000
      });

      const matches = res.data?.bestMatches || [];
      if (matches.length > 0) {
        const best = matches[0];
        const symbol = best['1. symbol'];
        const name = best['2. name'];
        const marketMeta = resolveMarket(symbol);
        logger.info(`[CompanyResolver] Alpha Vantage resolved "${query}" -> ${symbol} (${name})`);
        return {
          symbol,
          name,
          marketMeta,
          registry: false,
          confidence: 0.80
        };
      }
    } catch (err) {
      logger.warn(`[CompanyResolver] Alpha Vantage search lookup failed: ${err.message}`);
    }
  }

  // 4. Default Fallback
  logger.warn(`[CompanyResolver] Could not resolve "${query}" — returning raw fallback`);
  const marketMeta = resolveMarket(cleanInput);
  return {
    symbol: cleanInput,
    name: query,
    marketMeta,
    registry: false,
    confidence: 0.50
  };
}

module.exports = {
  resolve
};
