/**
 * Session Cache
 * In-memory store for analysis sessions.
 * Allows chat follow-up to reference the previous analysis context.
 * Per Blueprint V1: No database persistence — sessions are in-memory.
 */

const logger = require('../utils/logger');

// Map of sessionId -> analysis result
const sessions = new Map();

// Maximum sessions to keep in memory (prevent memory leaks)
const MAX_SESSIONS = 100;
const SESSION_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Stores an analysis result keyed by session ID.
 */
const set = (sessionId, data) => {
  // Evict oldest session if at capacity
  if (sessions.size >= MAX_SESSIONS) {
    const oldestKey = sessions.keys().next().value;
    sessions.delete(oldestKey);
    logger.debug(`[SessionCache] Evicted oldest session: ${oldestKey}`);
  }

  sessions.set(sessionId, {
    data,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });

  logger.debug(`[SessionCache] Stored session: ${sessionId}`);
};

/**
 * Retrieves analysis data by session ID.
 * Returns null if session doesn't exist or has expired.
 */
const get = (sessionId) => {
  const session = sessions.get(sessionId);

  if (!session) {
    return null;
  }

  // Check TTL
  if (Date.now() > session.expiresAt) {
    sessions.delete(sessionId);
    logger.debug(`[SessionCache] Session expired: ${sessionId}`);
    return null;
  }

  return session.data;
};

const size = () => sessions.size;

module.exports = { set, get, size };
