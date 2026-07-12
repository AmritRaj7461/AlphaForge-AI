/**
 * Centralized logger utility.
 * Provides structured logging with timestamps and log levels.
 * Per Engineering Constitution Article 9: Never log secrets.
 */

const config = require('../config/env');

const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

const currentLevel = config.isDev ? LOG_LEVELS.debug : LOG_LEVELS.info;

const formatMessage = (level, message, data) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (data !== undefined) {
    // Never log objects that might contain API keys or secrets
    const safeData = typeof data === 'object' ? JSON.stringify(data, null, 2) : data;
    return `${prefix} ${message} ${safeData}`;
  }

  return `${prefix} ${message}`;
};

const logger = {
  error: (message, data) => {
    if (LOG_LEVELS.error <= currentLevel) {
      console.error(formatMessage('error', message, data));
    }
  },

  warn: (message, data) => {
    if (LOG_LEVELS.warn <= currentLevel) {
      console.warn(formatMessage('warn', message, data));
    }
  },

  info: (message, data) => {
    if (LOG_LEVELS.info <= currentLevel) {
      console.log(formatMessage('info', message, data));
    }
  },

  debug: (message, data) => {
    if (LOG_LEVELS.debug <= currentLevel) {
      console.log(formatMessage('debug', message, data));
    }
  },
};

module.exports = logger;
