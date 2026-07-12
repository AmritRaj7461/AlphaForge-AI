/**
 * News Tool
 * Retrieves recent news articles and applies sentiment heuristic classification.
 * Decoupled from duplicate company name aliases.
 */

const axios = require('axios');
const logger = require('../utils/logger');
const config = require('../config/env');

/**
 * Classifies headline sentiment using keyword heuristics.
 */
const classifySentiment = (title, description) => {
  const text = `${title} ${description || ''}`.toLowerCase();

  const positiveKeywords = [
    'record', 'growth', 'profit', 'gain', 'surge', 'rally', 'beat', 'strong',
    'rise', 'up', 'higher', 'increase', 'boost', 'expand', 'win', 'success',
    'breakthrough', 'launch', 'partnership', 'upgrade', 'outperform', 'positive',
    'advancement', 'innovate', 'innovation', 'bullish'
  ];

  const negativeKeywords = [
    'fall', 'drop', 'loss', 'decline', 'miss', 'cut', 'layoff', 'lawsuit',
    'probe', 'investigation', 'concern', 'risk', 'weak', 'down', 'lower',
    'decrease', 'warning', 'crash', 'fail', 'negative', 'downgrade', 'sell',
    'subpoena', 'antitrust', 'bearish', 'disappoint'
  ];

  const posScore = positiveKeywords.filter((w) => text.includes(w)).length;
  const negScore = negativeKeywords.filter((w) => text.includes(w)).length;

  if (posScore > negScore) return 'positive';
  if (negScore > posScore) return 'negative';
  return 'neutral';
};

// Curated fallback news mapped only to canonical ticker symbols
const MOCK_NEWS = {
  AAPL: [
    { title: 'Apple Reports Record Q4 Revenue Driven by iPhone 16 Sales', source: 'Bloomberg', sentiment: 'positive', publishedAt: '2 days ago', url: '#' },
    { title: 'Apple Intelligence Features Roll Out to More Countries', source: 'Reuters', sentiment: 'positive', publishedAt: '3 days ago', url: '#' },
    { title: 'Apple Vision Pro Sales Disappoint Analysts Amid High Price Point', source: 'WSJ', sentiment: 'negative', publishedAt: '5 days ago', url: '#' },
    { title: 'Apple Expands Manufacturing Operations in India', source: 'Financial Times', sentiment: 'positive', publishedAt: '1 week ago', url: '#' },
    { title: 'EU Antitrust Regulators Continue App Store Investigation', source: 'CNBC', sentiment: 'negative', publishedAt: '1 week ago', url: '#' }
  ],
  MSFT: [
    { title: 'Microsoft Azure Revenue Grows 31% on AI Cloud Demand', source: 'Bloomberg', sentiment: 'positive', publishedAt: '1 day ago', url: '#' },
    { title: 'Microsoft Copilot Integration Drives Office 365 Enterprise Growth', source: 'Reuters', sentiment: 'positive', publishedAt: '3 days ago', url: '#' },
    { title: 'Microsoft Teams Premium Features Gain Enterprise Adoption', source: 'TechCrunch', sentiment: 'positive', publishedAt: '5 days ago', url: '#' },
    { title: 'Microsoft Faces Regulatory Scrutiny Over Activision Game Prices', source: 'FT', sentiment: 'negative', publishedAt: '1 week ago', url: '#' }
  ],
  NVDA: [
    { title: 'NVIDIA Blackwell GPU Demand Exceeds Supply, Revenue Triples', source: 'Bloomberg', sentiment: 'positive', publishedAt: '1 day ago', url: '#' },
    { title: 'NVIDIA Partners with Leading Cloud Providers for AI Infrastructure', source: 'Reuters', sentiment: 'positive', publishedAt: '2 days ago', url: '#' },
    { title: 'NVIDIA Stock Faces Valuation Concerns at 50x Earnings', source: 'WSJ', sentiment: 'negative', publishedAt: '4 days ago', url: '#' }
  ],
  TSLA: [
    { title: 'Tesla Deliveries Miss Estimates Amid EV Market Slowdown', source: 'Bloomberg', sentiment: 'negative', publishedAt: '2 days ago', url: '#' },
    { title: 'Tesla Cybertruck Production Ramps Up at Gigafactory Texas', source: 'Reuters', sentiment: 'positive', publishedAt: '4 days ago', url: '#' },
    { title: 'Tesla FSD V13 Shows Significant Autonomous Driving Improvements', source: 'TechCrunch', sentiment: 'positive', publishedAt: '5 days ago', url: '#' }
  ],
  AMZN: [
    { title: 'Amazon AWS Growth Accelerates on Generative AI Services', source: 'Bloomberg', sentiment: 'positive', publishedAt: '1 day ago', url: '#' },
    { title: 'Amazon Prime Membership Reaches All-Time High Globally', source: 'Reuters', sentiment: 'positive', publishedAt: '3 days ago', url: '#' },
    { title: 'Amazon Faces Worker Unionization Efforts at Multiple Warehouses', source: 'WSJ', sentiment: 'negative', publishedAt: '5 days ago', url: '#' }
  ],
  GOOGL: [
    { title: 'Google Search Revenue Grows Despite AI Competition Concerns', source: 'Bloomberg', sentiment: 'positive', publishedAt: '1 day ago', url: '#' },
    { title: 'Google Gemini Ultra Outperforms Rivals on Multiple AI Benchmarks', source: 'TechCrunch', sentiment: 'positive', publishedAt: '3 days ago', url: '#' },
    { title: 'Department of Justice Antitrust Case Threatens Google Search Dominance', source: 'WSJ', sentiment: 'negative', publishedAt: '5 days ago', url: '#' }
  ],
  META: [
    { title: 'Meta Q3 Profit Surges 35% on Robust AI Ad Targeting', source: 'Bloomberg', sentiment: 'positive', publishedAt: '2 days ago', url: '#' },
    { title: 'Meta Announces Partnerships for Llama 3 Open-Source Integration', source: 'Reuters', sentiment: 'positive', publishedAt: '4 days ago', url: '#' }
  ],
  NFLX: [
    { title: 'Netflix Subscriptions Outperform Estimates on Password Sharing Crackdown', source: 'Bloomberg', sentiment: 'positive', publishedAt: '1 day ago', url: '#' },
    { title: 'Netflix Expands Ad-Supported Tier Globally with Record Active Users', source: 'Reuters', sentiment: 'positive', publishedAt: '3 days ago', url: '#' }
  ]
};

/**
 * Main execute function for the News Tool.
 */
const execute = async ({ company, symbol }) => {
  const querySymbol = symbol || company;
  logger.info(`[NewsTool] Fetching news for: ${company} (${querySymbol})`);
  
  const cleanSymbol = querySymbol.split('.')[0].toUpperCase().trim();

  // ── Tier 1: NewsAPI Query ──
  if (config.hasNewsApiKey()) {
    try {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const fromDate = sevenDaysAgo.toISOString().split('T')[0];
      const searchQuery = `"${cleanSymbol}" OR "${company}"`;

      const response = await axios.get(`${config.newsApi.baseUrl}/everything`, {
        params: {
          q: searchQuery,
          from: fromDate,
          language: 'en',
          sortBy: 'relevance',
          pageSize: 10,
          apiKey: config.newsApi.apiKey,
        },
        timeout: config.analysis.timeoutMs,
      });

      const articles = response.data?.articles || [];

      if (articles.length > 0) {
        logger.info(`[NewsTool] NewsAPI returned ${articles.length} articles for ${company}`);
        return articles.map((a) => ({
          title: a.title || 'Untitled',
          source: a.source?.name || 'Unknown',
          url: a.url || '#',
          publishedAt: a.publishedAt
            ? new Date(a.publishedAt).toLocaleDateString()
            : 'Recent',
          sentiment: classifySentiment(a.title, a.description),
          description: a.description || '',
        }));
      }

      logger.warn(`[NewsTool] NewsAPI returned no articles for search: ${searchQuery}`);
    } catch (err) {
      logger.warn(`[NewsTool] NewsAPI request failed: ${err.message}`);
    }
  }

  // ── Tier 2: Curated Fallback News ──
  const mockNews = MOCK_NEWS[cleanSymbol];
  if (mockNews) {
    logger.info(`[NewsTool] ✓ Using curated fallback news data for ticker: ${cleanSymbol}`);
    return mockNews.map(n => ({ ...n, description: n.title }));
  }

  logger.warn(`[NewsTool] No news articles found for: ${company} — returning empty list`);
  return [];
};

module.exports = { execute };
