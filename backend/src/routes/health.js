/**
 * Health Check Route
 * GET /api/health — Returns service status
 */

const express = require('express');
const router = express.Router();
const config = require('../config/env');
const sessionCache = require('../cache/sessionCache');

router.get('/', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    version: '1.0.0',
    environment: config.nodeEnv,
    services: {
      gemini: config.hasGeminiKey() ? 'configured' : 'mock mode',
      alphaVantage: config.hasAlphaVantageKey() ? 'configured' : 'mock mode',
      newsApi: config.hasNewsApiKey() ? 'configured' : 'mock mode',
      fmp: config.hasFmpKey() ? 'configured' : 'not configured',
    },
    activeSessions: sessionCache.size(),
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
