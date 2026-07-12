/**
 * AlphaForge AI — Express Backend Server
 * 
 * Entry point for the backend application.
 * Assembles middleware, routes, and error handling.
 * 
 * Per Engineering Constitution:
 * - Article 10: All APIs accept JSON, return JSON
 * - Article 13: Security middleware (Helmet, CORS, Rate Limiting)
 * - Article 11: Global error handler
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const config = require('./src/config/env');
const logger = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');
const rateLimiter = require('./src/middleware/rateLimiter');

// Routes
const analyzeRouter = require('./src/routes/analyze');
const chatRouter = require('./src/routes/chat');
const healthRouter = require('./src/routes/health');

const app = express();

// ─── Security Middleware ───────────────────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS — allow requests from the frontend only
app.use(cors({
  origin: config.frontendUrl,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Request Processing ────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logging (dev: detailed, prod: combined)
app.use(morgan(config.isDev ? 'dev' : 'combined'));

// ─── Rate Limiting ─────────────────────────────────────────────────────────────
app.use('/api/', rateLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/analyze', analyzeRouter);
app.use('/api/chat', chatRouter);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found.`,
    timestamp: new Date().toISOString(),
  });
});

// ─── Global Error Handler ──────────────────────────────────────────────────────
// Must be LAST middleware — catches all unhandled errors
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────────
const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`AlphaForge AI Backend started on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
  logger.info(`Frontend URL: ${config.frontendUrl}`);
  logger.info(`Gemini: ${config.hasGeminiKey() ? 'API key configured' : 'Running in mock mode'}`);
  logger.info(`Alpha Vantage: ${config.hasAlphaVantageKey() ? 'API key configured' : 'Running in mock mode'}`);
  logger.info(`NewsAPI: ${config.hasNewsApiKey() ? 'API key configured' : 'Running in mock mode'}`);
});

module.exports = app;
