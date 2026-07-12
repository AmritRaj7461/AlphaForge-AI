/**
 * Ticker Resolver Utility
 * Resolves user inputs (company names, search queries, raw text) into valid tickers and names.
 * Uses Alpha Vantage SYMBOL_SEARCH and FMP search APIs.
 */

const axios = require('axios');
const logger = require('./logger');
const config = require('../config/env');

const KNOWN_RESOLUTIONS = {
  'apple': { symbol: 'AAPL', name: 'Apple Inc.' },
  'microsoft': { symbol: 'MSFT', name: 'Microsoft Corporation' },
  'google': { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  'alphabet': { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  'nvidia': { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  'tesla': { symbol: 'TSLA', name: 'Tesla, Inc.' },
  'amazon': { symbol: 'AMZN', name: 'Amazon.com, Inc.' },
  'meta': { symbol: 'META', name: 'Meta Platforms, Inc.' },
  'netflix': { symbol: 'NFLX', name: 'Netflix, Inc.' },
  'tata consultancy services': { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Limited' },
  'tcs': { symbol: 'TCS.BSE', name: 'Tata Consultancy Services Limited' }
};

/**
 * Resolves a search term to a structured symbol and company name.
 * 
 * @param {string} input - User query (e.g. "Apple" or "TCS")
 * @returns {Promise<{ symbol: string, name: string }>}
 */
const resolveTicker = async (input) => {
  const cleanInput = input.trim();
  const lowerInput = cleanInput.toLowerCase();

  // 1. Check curated list
  if (KNOWN_RESOLUTIONS[lowerInput]) {
    logger.info(`[TickerResolver] Curved resolution match: "${cleanInput}" -> ${KNOWN_RESOLUTIONS[lowerInput].symbol}`);
    return KNOWN_RESOLUTIONS[lowerInput];
  }

  // If input looks like a clean US ticker (e.g. AAPL, MSFT, TSLA, TCS)
  const isPotentialTicker = /^[A-Z.]{1,6}$/i.test(cleanInput);

  // 2. Try FMP Search API if key configured
  if (config.hasFmpKey()) {
    try {
      const endpoint = isPotentialTicker ? 'search-symbol' : 'search-name';
      logger.info(`[TickerResolver] Querying FMP ${endpoint} for "${cleanInput}"`);
      const res = await axios.get(`${config.fmp.baseUrl}/${endpoint}`, {
        params: { query: cleanInput, apikey: config.fmp.apiKey },
        timeout: 4000
      });

      const matches = res.data;
      if (Array.isArray(matches) && matches.length > 0) {
        // Find best match
        const best = matches[0];
        logger.info(`[TickerResolver] FMP resolved "${cleanInput}" -> ${best.symbol} (${best.name})`);
        return { symbol: best.symbol, name: best.name };
      }
    } catch (err) {
      logger.warn(`[TickerResolver] FMP lookup failed: ${err.message}`);
    }
  }

  // 3. Try Alpha Vantage SYMBOL_SEARCH
  if (config.hasAlphaVantageKey()) {
    try {
      logger.info(`[TickerResolver] Querying Alpha Vantage SYMBOL_SEARCH for "${cleanInput}"`);
      const res = await axios.get(config.alphaVantage.baseUrl, {
        params: {
          function: 'SYMBOL_SEARCH',
          keywords: cleanInput,
          apikey: config.alphaVantage.apiKey
        },
        timeout: 4000
      });

      const matches = res.data?.bestMatches || [];
      if (matches.length > 0) {
        const best = matches[0];
        const symbol = best['1. symbol'];
        const name = best['2. name'];
        logger.info(`[TickerResolver] Alpha Vantage resolved "${cleanInput}" -> ${symbol} (${name})`);
        return { symbol, name };
      }
    } catch (err) {
      logger.warn(`[TickerResolver] Alpha Vantage lookup failed: ${err.message}`);
    }
  }

  // 4. Default Fallback
  logger.warn(`[TickerResolver] Could not resolve "${cleanInput}" — returning input directly`);
  return { symbol: cleanInput.toUpperCase(), name: cleanInput };
};

module.exports = { resolveTicker };
