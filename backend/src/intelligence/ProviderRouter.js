/**
 * Provider Router
 * Selects and manages the fallback order of data providers (Alpha Vantage, FMP, Yahoo Finance, Static)
 * based on the resolved market/region of a company.
 */

const PROVIDERS = {
  ALPHA_VANTAGE: 'alpha_vantage',
  FMP: 'fmp',
  YAHOO_FINANCE: 'yahoo_finance',
  NSE: 'nse',
  BSE: 'bse',
  STATIC: 'static'
};

const DEFAULT_ROUTE_USA = [
  PROVIDERS.ALPHA_VANTAGE,
  PROVIDERS.FMP,
  PROVIDERS.YAHOO_FINANCE,
  PROVIDERS.STATIC
];

const DEFAULT_ROUTE_INDIA = [
  PROVIDERS.NSE,
  PROVIDERS.BSE,
  PROVIDERS.YAHOO_FINANCE,
  PROVIDERS.FMP,
  PROVIDERS.STATIC
];

const DEFAULT_ROUTE_GLOBAL = [
  PROVIDERS.YAHOO_FINANCE,
  PROVIDERS.STATIC
];

/**
 * Returns the fallback chain of providers to query.
 * 
 * @param {string} market - The resolved market (e.g. "USA", "India")
 * @returns {Array<string>} Fallback array of provider strings
 */
function getProviderChain(market) {
  const m = (market || 'USA').trim().toUpperCase();

  switch (m) {
    case 'USA':
      return DEFAULT_ROUTE_USA;
    case 'INDIA':
      return DEFAULT_ROUTE_INDIA;
    default:
      return DEFAULT_ROUTE_GLOBAL;
  }
}

module.exports = {
  PROVIDERS,
  getProviderChain
};
