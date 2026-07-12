/**
 * Fuzzy Matcher Utility
 * Resolves typos and spelling variations (e.g. "Nvidea" or "Aapple")
 * to canonical registry aliases using Levenshtein distance.
 */

const { ALIASES } = require('./CompanyRegistry');

/**
 * Computes the Levenshtein distance between two strings.
 * @param {string} a 
 * @param {string} b 
 * @returns {number} Distance score (lower is closer)
 */
function getLevenshteinDistance(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Finds the best canonical ticker matching the query string.
 * Supports exact matches, substring matches, and fuzzy matches.
 * 
 * @param {string} input - User query (e.g., "Aapple")
 * @returns {string|null} Ticker symbol (e.g. "AAPL") or null
 */
function findBestMatch(input) {
  if (!input) return null;
  const query = input.trim().toLowerCase();

  // 1. Direct Alias Match
  if (ALIASES[query]) return ALIASES[query];

  // 2. Substring Match (e.g., "nvidia corp" -> "NVIDIA")
  for (const alias of Object.keys(ALIASES)) {
    if (query.length >= 3 && (alias.includes(query) || query.includes(alias))) {
      return ALIASES[alias];
    }
  }

  // 3. Levenshtein Distance Match
  let bestMatch = null;
  let minDistance = Infinity;

  for (const alias of Object.keys(ALIASES)) {
    const dist = getLevenshteinDistance(query, alias);
    if (dist < minDistance) {
      minDistance = dist;
      bestMatch = alias;
    }
  }

  // Define distance threshold (e.g. max 2 typos for short terms, up to 30% length for longer terms)
  const maxAllowedDistance = Math.max(2, Math.floor(query.length * 0.35));
  if (minDistance <= maxAllowedDistance && bestMatch) {
    return ALIASES[bestMatch];
  }

  return null;
}

module.exports = {
  findBestMatch,
  getLevenshteinDistance
};
