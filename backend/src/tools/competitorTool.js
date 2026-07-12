/**
 * Competitor Tool
 * Identifies and returns competitor comparison data.
 * Decoupled from duplicate company name aliases.
 */

const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/env');

// Curated competitor sets mapped only to canonical ticker symbols
const COMPETITOR_MAP = {
  AAPL: [
    { name: 'Samsung Electronics', ticker: '005930.KS', sector: 'Technology', marketCap: '$380B', peRatio: '18.5', revenueGrowth: '+3.1%' },
    { name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Technology', marketCap: '$3.30T', peRatio: '36.8', revenueGrowth: '+16.0%' },
    { name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', marketCap: '$2.30T', peRatio: '22.8', revenueGrowth: '+14.0%' },
    { name: 'Meta Platforms', ticker: 'META', sector: 'Technology', marketCap: '$1.54T', peRatio: '29.1', revenueGrowth: '+22.0%' },
  ],
  MSFT: [
    { name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Technology', marketCap: '$2.30T', peRatio: '22.8', revenueGrowth: '+14.0%' },
    { name: 'Amazon.com', ticker: 'AMZN', sector: 'Technology', marketCap: '$2.02T', peRatio: '43.1', revenueGrowth: '+11.0%' },
    { name: 'Oracle Corporation', ticker: 'ORCL', sector: 'Technology', marketCap: '$450B', peRatio: '38.2', revenueGrowth: '+6.0%' },
    { name: 'Salesforce', ticker: 'CRM', sector: 'Technology', marketCap: '$280B', peRatio: '42.5', revenueGrowth: '+9.0%' },
  ],
  NVDA: [
    { name: 'Advanced Micro Devices', ticker: 'AMD', sector: 'Technology', marketCap: '$240B', peRatio: '38.4', revenueGrowth: '+9.0%' },
    { name: 'Intel Corporation', ticker: 'INTC', sector: 'Technology', marketCap: '$90B', peRatio: 'N/A', revenueGrowth: '-16.0%' },
    { name: 'Broadcom Inc.', ticker: 'AVGO', sector: 'Technology', marketCap: '$800B', peRatio: '25.3', revenueGrowth: '+51.0%' },
    { name: 'Qualcomm', ticker: 'QCOM', sector: 'Technology', marketCap: '$180B', peRatio: '19.8', revenueGrowth: '+9.0%' },
  ],
  TSLA: [
    { name: 'BYD Company Limited', ticker: 'BYDDY', sector: 'Consumer Cyclical', marketCap: '$95B', peRatio: '14.2', revenueGrowth: '+27.0%' },
    { name: 'Ford Motor Company', ticker: 'F', sector: 'Consumer Cyclical', marketCap: '$50B', peRatio: '12.1', revenueGrowth: '-0.6%' },
    { name: 'General Motors', ticker: 'GM', sector: 'Consumer Cyclical', marketCap: '$55B', peRatio: '5.8', revenueGrowth: '+9.0%' },
    { name: 'Rivian Automotive', ticker: 'RIVN', sector: 'Consumer Cyclical', marketCap: '$14B', peRatio: 'N/A', revenueGrowth: '+52.0%' },
  ],
  AMZN: [
    { name: 'Walmart Inc.', ticker: 'WMT', sector: 'Consumer Defensive', marketCap: '$540B', peRatio: '28.1', revenueGrowth: '+5.4%' },
    { name: 'Target Corporation', ticker: 'TGT', sector: 'Consumer Defensive', marketCap: '$65B', peRatio: '16.2', revenueGrowth: '+1.5%' },
    { name: 'eBay Inc.', ticker: 'EBAY', sector: 'Consumer Cyclical', marketCap: '$24B', peRatio: '15.4', revenueGrowth: '+2.1%' }
  ],
  GOOGL: [
    { name: 'Microsoft Corporation', ticker: 'MSFT', sector: 'Technology', marketCap: '$3.30T', peRatio: '36.8', revenueGrowth: '+16.0%' },
    { name: 'Meta Platforms', ticker: 'META', sector: 'Communication Services', marketCap: '$1.54T', peRatio: '29.1', revenueGrowth: '+22.0%' },
    { name: 'Baidu, Inc.', ticker: 'BIDU', sector: 'Communication Services', marketCap: '$35B', peRatio: '12.1', revenueGrowth: '-1.2%' }
  ],
  META: [
    { name: 'Alphabet Inc.', ticker: 'GOOGL', sector: 'Communication Services', marketCap: '$2.30T', peRatio: '22.8', revenueGrowth: '+14.0%' },
    { name: 'Snap Inc.', ticker: 'SNAP', sector: 'Communication Services', marketCap: '$15B', peRatio: 'N/A', revenueGrowth: '+15.5%' },
    { name: 'Pinterest, Inc.', ticker: 'PINS', sector: 'Communication Services', marketCap: '$28B', peRatio: '24.2', revenueGrowth: '+12.1%' }
  ],
  NFLX: [
    { name: 'Walt Disney Company', ticker: 'DIS', sector: 'Communication Services', marketCap: '$185B', peRatio: '45.1', revenueGrowth: '+4.2%' },
    { name: 'Paramount Global', ticker: 'PARA', sector: 'Communication Services', marketCap: '$10B', peRatio: '12.4', revenueGrowth: '-2.1%' },
    { name: 'Warner Bros. Discovery', ticker: 'WBD', sector: 'Communication Services', marketCap: '$22B', peRatio: 'N/A', revenueGrowth: '-5.0%' }
  ],
  'TCS.BSE': [
    { name: 'Infosys Limited', ticker: 'INFY.NS', sector: 'Technology', marketCap: '₹5.8T', peRatio: '25.2', revenueGrowth: '+6.1%' },
    { name: 'Wipro Limited', ticker: 'WIPRO.NS', sector: 'Technology', marketCap: '₹2.4T', peRatio: '22.1', revenueGrowth: '+3.4%' },
    { name: 'HCL Technologies', ticker: 'HCLTECH.NS', sector: 'Technology', marketCap: '₹3.8T', peRatio: '24.5', revenueGrowth: '+8.2%' },
    { name: 'Cognizant Technology Solutions', ticker: 'CTSH', sector: 'Technology', marketCap: '$38B', peRatio: '17.2', revenueGrowth: '+2.1%' }
  ],
  'SONATSOFTW.NS': [
    { name: 'LTIMindtree Limited', ticker: 'LTIM.NS', sector: 'Technology', marketCap: '₹1.5T', peRatio: '28.2', revenueGrowth: '+7.1%' },
    { name: 'Persistent Systems Limited', ticker: 'PERSISTENT.NS', sector: 'Technology', marketCap: '₹680B', peRatio: '32.1', revenueGrowth: '+14.0%' },
    { name: 'Tata Elxsi Limited', ticker: 'TATAELXSI.NS', sector: 'Technology', marketCap: '₹450B', peRatio: '42.1', revenueGrowth: '+5.5%' },
    { name: 'KPIT Technologies Limited', ticker: 'KPITTECH.NS', sector: 'Technology', marketCap: '₹380B', peRatio: '52.4', revenueGrowth: '+18.2%' }
  ]
};

const formatMarketCap = (val) => {
  if (!val) return 'N/A';
  const n = parseFloat(val);
  if (isNaN(n)) return 'N/A';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(1)}T`;
  if (n >= 1e9)  return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6)  return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
};

const fetchPeerDetails = async (ticker, fmpKey) => {
  try {
    const [profileRes, ratiosRes] = await Promise.all([
      axios.get(`${config.fmp.baseUrl}/profile`, {
        params: { symbol: ticker, apikey: fmpKey },
        timeout: 5000,
      }),
      axios.get(`${config.fmp.baseUrl}/ratios-ttm`, {
        params: { symbol: ticker, apikey: fmpKey },
        timeout: 5000,
      })
    ]);

    const p = profileRes.status === 'fulfilled' && Array.isArray(profileRes.value.data) && profileRes.value.data[0]
      ? profileRes.value.data[0]
      : {};
    const r = ratiosRes.status === 'fulfilled' && Array.isArray(ratiosRes.value.data) && ratiosRes.value.data[0]
      ? ratiosRes.value.data[0]
      : {};

    const pe = r.peRatioTTM ? parseFloat(r.peRatioTTM).toFixed(1) : (p.pe ? parseFloat(p.pe).toFixed(1) : 'N/A');
    const growth = r.revenueGrowthTTM ? `${(r.revenueGrowthTTM * 100).toFixed(1)}%` : 'N/A';

    return {
      name: p.companyName || ticker,
      ticker: ticker,
      sector: p.sector || 'N/A',
      marketCap: p.mktCap ? formatMarketCap(p.mktCap) : 'N/A',
      peRatio: pe !== 'NaN' ? pe : 'N/A',
      revenueGrowth: growth,
    };
  } catch (err) {
    logger.warn(`[CompetitorTool] Failed to fetch details for peer ${ticker}: ${err.message}`);
    return { name: ticker, ticker: ticker, sector: 'N/A', marketCap: 'N/A', peRatio: 'N/A', revenueGrowth: 'N/A' };
  }
};

/**
 * Main execute function for the Competitor Tool.
 */
const execute = async ({ company }) => {
  const symbol = company.toUpperCase().trim();
  logger.info(`[CompetitorTool] Fetching competitor data for: ${symbol}`);

  // ── Tier 1: FMP API peer retrieval ──
  if (config.hasFmpKey()) {
    try {
      const response = await axios.get(
        `${config.fmp.baseUrl}/stock-peers`,
        {
          params: { symbol, apikey: config.fmp.apiKey },
          timeout: config.analysis.timeoutMs,
        }
      );

      const peers = response.data;
      if (Array.isArray(peers) && peers.length > 0) {
        let peerSymbols = [];
        if (peers[0] && Array.isArray(peers[0].peersList)) {
          peerSymbols = peers[0].peersList;
        } else if (typeof peers[0] === 'string') {
          peerSymbols = peers;
        }

        if (peerSymbols.length > 0) {
          // Take top 4 peers
          const topPeers = peerSymbols.slice(0, 4);
          const detailPromises = topPeers.map(peer => fetchPeerDetails(peer, config.fmp.apiKey));
          return await Promise.all(detailPromises);
        }
      }
    } catch (err) {
      logger.warn(`[CompetitorTool] FMP peer query failed: ${err.message}`);
    }
  }

  // ── Tier 2: Curated Fallback Peers ──
  const mockPeers = COMPETITOR_MAP[symbol];
  if (mockPeers) {
    logger.info(`[CompetitorTool] ✓ Using curated fallback peers for: ${symbol}`);
    return mockPeers;
  }

  // Tier 3: Sector-level Fallback
  logger.warn(`[CompetitorTool] No competitors found for: ${symbol} — returning empty list`);
  return [];
};

module.exports = { execute };
