/**
 * Market Resolver
 * Determines the country, exchange, market, currency, and region of a ticker symbol.
 */

/**
 * Resolves market metadata for a ticker symbol.
 * 
 * @param {string} symbol - Ticker symbol (e.g. "AAPL", "TCS.BSE", "005930.KS")
 * @returns {object} Market metadata containing { country, exchange, market, currency, region }
 */
function resolveMarket(symbol) {
  if (!symbol || typeof symbol !== 'string') {
    return {
      country: 'USA',
      exchange: 'NASDAQ/NYSE',
      market: 'USA',
      currency: 'USD',
      region: 'North America'
    };
  }

  const s = symbol.trim().toUpperCase();

  // 1. Indian Equities Suffixes
  if (s.endsWith('.NS') || s.endsWith('.NSE')) {
    return {
      country: 'India',
      exchange: 'NSE',
      market: 'India',
      currency: 'INR',
      region: 'Asia'
    };
  }
  if (s.endsWith('.BO') || s.endsWith('.BSE')) {
    return {
      country: 'India',
      exchange: 'BSE',
      market: 'India',
      currency: 'INR',
      region: 'Asia'
    };
  }

  // 2. Korean Equities Suffixes
  if (s.endsWith('.KS') || s.endsWith('.KSE')) {
    return {
      country: 'South Korea',
      exchange: 'KRX',
      market: 'Korea',
      currency: 'KRW',
      region: 'Asia'
    };
  }

  // 3. Japan Equities Suffixes
  if (s.endsWith('.T') || s.endsWith('.JT')) {
    return {
      country: 'Japan',
      exchange: 'TSE',
      market: 'Japan',
      currency: 'JPY',
      region: 'Asia'
    };
  }

  // 4. Australia Equities Suffixes
  if (s.endsWith('.AX')) {
    return {
      country: 'Australia',
      exchange: 'ASX',
      market: 'Australia',
      currency: 'AUD',
      region: 'Oceania'
    };
  }

  // 5. European Equities Suffixes
  if (s.endsWith('.DE') || s.endsWith('.PA') || s.endsWith('.AS') || s.endsWith('.MI') || s.endsWith('.MC')) {
    return {
      country: 'Europe',
      exchange: 'EURONEXT/XETRA',
      market: 'Europe',
      currency: 'EUR',
      region: 'Europe'
    };
  }

  // 6. UK/London Equities Suffixes
  if (s.endsWith('.L') || s.endsWith('.IL')) {
    return {
      country: 'United Kingdom',
      exchange: 'LSE',
      market: 'UK',
      currency: 'GBP',
      region: 'Europe'
    };
  }

  // 7. Canadian Equities Suffixes
  if (s.endsWith('.TO') || s.endsWith('.V')) {
    return {
      country: 'Canada',
      exchange: 'TSX',
      market: 'Canada',
      currency: 'CAD',
      region: 'North America'
    };
  }

  // 8. Default Curated Non-US mappings (in case raw ticker is passed)
  if (s === 'TCS' || s === 'TATA') {
    return {
      country: 'India',
      exchange: 'NSE/BSE',
      market: 'India',
      currency: 'INR',
      region: 'Asia'
    };
  }

  // 9. Global Default: USA
  return {
    country: 'USA',
    exchange: 'NASDAQ/NYSE',
    market: 'USA',
    currency: 'USD',
    region: 'North America'
  };
}

module.exports = {
  resolveMarket
};
