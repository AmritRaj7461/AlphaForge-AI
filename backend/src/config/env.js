/**
 * Environment configuration loader and validator.
 * All environment variables are accessed through this module — never directly from process.env.
 * This ensures a single place for validation and defaults.
 */

const dotenv = require('dotenv');
dotenv.config();

const config = {
  // Server
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',

  // Primary LLM: Gemini
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  },

  // Fallback LLM #1: OpenAI
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  },

  // Fallback LLM #2: Groq (free tier)
  groq: {
    apiKey: process.env.GROQ_API_KEY || '',
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  },

  // Alpha Vantage (Financial Data)
  alphaVantage: {
    apiKey: process.env.ALPHA_VANTAGE_API_KEY || '',
    baseUrl: process.env.ALPHA_VANTAGE_BASE_URL || 'https://www.alphavantage.co/query',
  },

  // NewsAPI
  newsApi: {
    apiKey: process.env.NEWS_API_KEY || '',
    baseUrl: process.env.NEWS_API_BASE_URL || 'https://newsapi.org/v2',
  },

  // Financial Modeling Prep (company, financials, competitor peers)
  fmp: {
    apiKey: process.env.FMP_API_KEY || '',
    baseUrl: process.env.FMP_BASE_URL || 'https://financialmodelingprep.com/stable',
  },

  // CORS
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',

  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },

  // Analysis settings
  analysis: {
    maxRetries: parseInt(process.env.MAX_RETRIES, 10) || 2,
    timeoutMs: parseInt(process.env.REQUEST_TIMEOUT_MS, 10) || 15000,
  },
};

// ─── API Key Validators ─────────────────────────────────────────────
const PLACEHOLDER_PATTERN = /^your_.*_here$/;

config.hasGeminiKey = () =>
  Boolean(config.gemini.apiKey && !PLACEHOLDER_PATTERN.test(config.gemini.apiKey));

config.hasOpenAIKey = () =>
  Boolean(config.openai.apiKey && !PLACEHOLDER_PATTERN.test(config.openai.apiKey));

config.hasGroqKey = () =>
  Boolean(config.groq.apiKey && !PLACEHOLDER_PATTERN.test(config.groq.apiKey));

config.hasAlphaVantageKey = () =>
  Boolean(config.alphaVantage.apiKey && !PLACEHOLDER_PATTERN.test(config.alphaVantage.apiKey));

config.hasNewsApiKey = () =>
  Boolean(config.newsApi.apiKey && !PLACEHOLDER_PATTERN.test(config.newsApi.apiKey));

config.hasFmpKey = () =>
  Boolean(config.fmp.apiKey && !PLACEHOLDER_PATTERN.test(config.fmp.apiKey));

/** True if at least one LLM is configured */
config.hasAnyLLM = () =>
  config.hasGeminiKey() || config.hasOpenAIKey() || config.hasGroqKey();

module.exports = config;
