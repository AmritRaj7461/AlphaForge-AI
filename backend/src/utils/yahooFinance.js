/**
 * Yahoo Finance Keyless Utility
 * Fetches company profile, statistics, and financial data without an API key
 * by dynamically resolving session cookies and crumbs.
 */

const axios = require('axios');
const logger = require('./logger');

let cachedCookie = null;
let cachedCrumb = null;
let cacheExpiry = 0;

/**
 * Resolves or returns cached Yahoo Finance session cookie and crumb.
 * @returns {Promise<{ cookie: string, crumb: string }>}
 */
async function getAuthHeaders() {
  const now = Date.now();
  if (cachedCookie && cachedCrumb && now < cacheExpiry) {
    return { cookie: cachedCookie, crumb: cachedCrumb };
  }

  logger.info('[YahooFinance] Fetching fresh session cookie and crumb');
  const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

  // 1. Visit fc.yahoo.com to set session cookies
  const r1 = await axios.get('https://fc.yahoo.com', {
    headers: { 'User-Agent': agent },
    timeout: 5000
  }).catch(err => err.response);

  const cookie = r1?.headers?.['set-cookie']?.map(c => c.split(';')[0]).join('; ');
  if (!cookie) {
    throw new Error('Failed to obtain Yahoo Finance session cookie');
  }

  // 2. Fetch getcrumb using the obtained cookie
  const r2 = await axios.get('https://query1.finance.yahoo.com/v1/test/getcrumb', {
    headers: { 'User-Agent': agent, 'Cookie': cookie },
    timeout: 5000
  });

  const crumb = r2.data;
  if (!crumb) {
    throw new Error('Failed to obtain Yahoo Finance crumb');
  }

  cachedCookie = cookie;
  cachedCrumb = crumb;
  cacheExpiry = now + 30 * 60 * 1000; // Cache headers for 30 minutes

  logger.info('[YahooFinance] Fresh cookie and crumb resolved successfully');
  return { cookie, crumb };
}

/**
 * Retrieves the quote summary for a given ticker symbol.
 * Includes profile, financial data, key statistics, and summary details.
 * 
 * @param {string} symbol - Ticker symbol (e.g., "SONATSOFTW.NS" or "AAPL")
 * @returns {Promise<object|null>} Summary object or null on failure
 */
async function fetchQuoteSummary(symbol) {
  try {
    const { cookie, crumb } = await getAuthHeaders();
    const agent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
    const url = `https://query1.finance.yahoo.com/v10/finance/quoteSummary/${symbol}`;
    
    const res = await axios.get(url, {
      params: {
        modules: 'assetProfile,financialData,defaultKeyStatistics,summaryDetail,price,earnings',
        crumb: crumb
      },
      headers: {
        'User-Agent': agent,
        'Cookie': cookie
      },
      timeout: 8000
    });

    return res.data?.quoteSummary?.result?.[0] || null;
  } catch (err) {
    logger.warn(`[YahooFinance] Failed to fetch quoteSummary for ${symbol}: ${err.message}`);
    return null;
  }
}

module.exports = {
  fetchQuoteSummary
};
