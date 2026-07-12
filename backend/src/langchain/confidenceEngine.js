/**
 * Confidence Engine
 * Calculates an evidence-based confidence score (0-100) for an analysis.
 * 
 * Per Engineering Constitution Article 12: Confidence is calculated INTERNALLY.
 * Gemini NEVER generates confidence scores.
 * 
 * Weights per Confidence Engine specification:
 *   Financial Data:   40%
 *   News Coverage:    20%
 *   Risk Assessment:  15%
 *   Competitor Data:  10%
 *   Validation:       15%
 */

const logger = require('../utils/logger');

const WEIGHTS = {
  financial: 40,
  news: 20,
  risk: 15,
  competitor: 10,
  validation: 15,
};

/**
 * Scores the financial data completeness (0-100).
 * More key metrics present = higher score.
 */
const scoreFinancialData = (finance) => {
  if (!finance) return 0;

  const keyMetrics = [
    'revenue', 'netIncome', 'eps', 'peRatio', 'roe',
    'marketCap', 'cashFlow', 'revenueGrowth', 'debt',
  ];

  const available = keyMetrics.filter((m) => finance[m] !== null && finance[m] !== undefined && finance[m] !== 'N/A');
  return Math.round((available.length / keyMetrics.length) * 100);
};

/**
 * Scores news coverage quality (0-100).
 * More recent articles with sentiment = higher score.
 */
const scoreNewsCoverage = (news) => {
  if (!news || news.length === 0) return 0;
  if (news.length >= 8) return 100;
  if (news.length >= 5) return 80;
  if (news.length >= 3) return 60;
  return 40;
};

/**
 * Scores risk assessment completeness (0-100).
 */
const scoreRiskAssessment = (risk) => {
  if (!risk) return 0;

  const fields = ['businessRisk', 'financialRisk', 'operationalRisk', 'macroRisk', 'overallRisk'];
  const available = fields.filter((f) => risk[f] !== null && risk[f] !== undefined);
  return Math.round((available.length / fields.length) * 100);
};

/**
 * Scores competitor data availability (0-100).
 */
const scoreCompetitorData = (competitors) => {
  if (!competitors || competitors.length === 0) return 0;
  if (competitors.length >= 4) return 100;
  if (competitors.length >= 2) return 70;
  return 40;
};

/**
 * Scores validation quality (0-100).
 * More validation issues = lower score. Parse errors = very low score.
 */
const scoreValidation = (validationResult) => {
  if (!validationResult) return 0;
  if (validationResult.parseError) return 10;

  const issues = validationResult.issues?.length || 0;
  if (issues === 0) return 100;
  if (issues <= 2) return 80;
  if (issues <= 4) return 60;
  return 30;
};

/**
 * Calculates the overall confidence score with interpretation.
 * 
 * @param {object} aggregatedData - Tool outputs from aggregator
 * @param {object} validationResult - Result from response validator
 * @returns {{ score: number, level: string, breakdown: object }}
 */
const calculateConfidence = (aggregatedData, validationResult) => {
  const { finance, news, risk, competitors, dataQuality } = aggregatedData;
  const failedCount = dataQuality?.failedTools?.length || 0;

  const scores = {
    financial: scoreFinancialData(finance),
    news: scoreNewsCoverage(news),
    risk: scoreRiskAssessment(risk),
    competitor: scoreCompetitorData(competitors),
    validation: scoreValidation(validationResult),
  };

  // Weighted average
  const weightedScore =
    (scores.financial * WEIGHTS.financial +
     scores.news * WEIGHTS.news +
     scores.risk * WEIGHTS.risk +
     scores.competitor * WEIGHTS.competitor +
     scores.validation * WEIGHTS.validation) / 100;

  let finalScore = Math.round(Math.max(0, Math.min(100, weightedScore)));

  // Calculate explainable deductions
  const deductions = [];

  // 1. Cap at 98% to prevent absolute certainty bias
  if (finalScore > 98) {
    deductions.push({ reason: 'Statistical cap to prevent absolute certainty bias', points: finalScore - 98 });
    finalScore = 98;
  }

  // 2. Fallback provider check (e.g. if _source contains 'fallback', 'static', 'yahoo_finance')
  const financeSource = finance?._source || '';
  if (financeSource.includes('yahoo_finance') || financeSource.includes('static') || financeSource.includes('stub')) {
    const penalty = 5;
    deductions.push({ reason: 'Usage of fallback data feeds (Yahoo Finance / Static Registry)', points: penalty });
    finalScore = Math.max(0, finalScore - penalty);
  }

  // 3. Missing essential metrics
  const missingFinancials = [];
  const keyMetrics = ['revenue', 'netIncome', 'eps', 'peRatio', 'roe', 'roa', 'marketCap', 'cashFlow', 'debt', 'grossMargin', 'profitMargin'];
  if (finance) {
    for (const key of keyMetrics) {
      if (!finance[key] || finance[key] === 'N/A' || finance[key] === 'Unavailable') {
        missingFinancials.push(key);
      }
    }
  } else {
    missingFinancials.push(...keyMetrics);
  }

  if (missingFinancials.length > 0) {
    const penalty = Math.min(15, missingFinancials.length * 2);
    deductions.push({ reason: `Missing financial pillars / incomplete ratios (${missingFinancials.slice(0, 3).join(', ')}${missingFinancials.length > 3 ? '...' : ''})`, points: penalty });
    finalScore = Math.max(0, finalScore - penalty);
  }

  // 4. Limited news
  const newsCount = news?.length || 0;
  if (newsCount < 5) {
    const penalty = newsCount === 0 ? 10 : (5 - newsCount) * 2;
    deductions.push({ reason: `Limited news coverage (${newsCount} recent articles)`, points: penalty });
    finalScore = Math.max(0, finalScore - penalty);
  }

  // 5. Limited competitors
  const competitorCount = competitors?.length || 0;
  if (competitorCount < 3) {
    const penalty = competitorCount === 0 ? 5 : 3;
    deductions.push({ reason: `Limited competitor comparison peer set`, points: penalty });
    finalScore = Math.max(0, finalScore - penalty);
  }

  // 6. Failed tools
  if (failedCount > 0) {
    const penalty = failedCount * 5;
    deductions.push({ reason: `Failed data collection sources: ${dataQuality.failedTools.join(', ')}`, points: penalty });
    finalScore = Math.max(0, finalScore - penalty);
  }

  // Final adjusted score capped between 10% and 98%
  const adjustedScore = Math.max(10, Math.min(98, finalScore));

  const adjustedLevel = adjustedScore >= 90 ? 'Very High'
    : adjustedScore >= 75 ? 'High'
    : adjustedScore >= 60 ? 'Moderate'
    : 'Low';

  logger.info(`[ConfidenceEngine] Score: ${adjustedScore} (${adjustedLevel}) | Breakdown:`, scores);

  return {
    score: adjustedScore,
    level: adjustedLevel,
    breakdown: {
      ...scores,
      weights: WEIGHTS,
      failedToolsPenalty: failedCount * 5,
      deductions
    },
  };
};

module.exports = { calculateConfidence };
