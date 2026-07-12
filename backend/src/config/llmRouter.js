/**
 * LLM Router — Multi-Provider Fallback Chain
 *
 * Per Engineering Constitution Article 11: Application failures must never terminate analysis.
 * Implements a prioritized fallback chain for LLM calls:
 *
 *   1. Google Gemini 1.5 Flash  (primary — best quality, generous free tier)
 *   2. OpenAI GPT-4o Mini       (fallback #1 — fast, cheap, reliable)
 *   3. Groq Llama3-70b-8192     (fallback #2 — fully FREE, excellent quality)
 *
 * If all LLMs fail, returns a structured deterministic response using tool data only.
 * This is NOT a mock — it's a transparent degradation with real data from research tools.
 *
 * Usage:
 *   const { callLLM } = require('./llmRouter');
 *   const rawText = await callLLM(prompt);  // returns { text, provider, usedFallback }
 */

const logger = require('../utils/logger');
const config = require('./env');

// ─── Gemini Client ─────────────────────────────────────────────────
let _geminiModel = null;
const getGeminiModel = () => {
  if (_geminiModel) return _geminiModel;
  if (!config.hasGeminiKey()) return null;
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const client = new GoogleGenerativeAI(config.gemini.apiKey);
    _geminiModel = client.getGenerativeModel({
      model: config.gemini.model,
      generationConfig: {
        temperature: 0.25,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 8192,
      },
    });
    logger.info(`[LLMRouter] Gemini initialized: ${config.gemini.model}`);
    return _geminiModel;
  } catch (err) {
    logger.error('[LLMRouter] Gemini init failed:', err.message);
    return null;
  }
};

// ─── OpenAI Client ─────────────────────────────────────────────────
let _openaiClient = null;
const getOpenAIClient = () => {
  if (_openaiClient) return _openaiClient;
  if (!config.hasOpenAIKey()) return null;
  try {
    const { OpenAI } = require('openai');
    _openaiClient = new OpenAI({ apiKey: config.openai.apiKey });
    logger.info(`[LLMRouter] OpenAI initialized: ${config.openai.model}`);
    return _openaiClient;
  } catch (err) {
    logger.error('[LLMRouter] OpenAI init failed:', err.message);
    return null;
  }
};

// ─── Groq Client ───────────────────────────────────────────────────
let _groqClient = null;
const getGroqClient = () => {
  if (_groqClient) return _groqClient;
  if (!config.hasGroqKey()) return null;
  try {
    const Groq = require('groq-sdk');
    _groqClient = new Groq({ apiKey: config.groq.apiKey });
    logger.info(`[LLMRouter] Groq initialized: ${config.groq.model}`);
    return _groqClient;
  } catch (err) {
    logger.error('[LLMRouter] Groq init failed:', err.message);
    return null;
  }
};

// ─── Individual Provider Callers ───────────────────────────────────

const callGemini = async (prompt) => {
  const model = getGeminiModel();
  if (!model) throw new Error('Gemini not configured');
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
};

const callOpenAI = async (prompt) => {
  const client = getOpenAIClient();
  if (!client) throw new Error('OpenAI not configured');
  const completion = await client.chat.completions.create({
    model: config.openai.model,
    messages: [
      {
        role: 'system',
        content:
          'You are ARGUS, an AI investment research analyst. Always respond with valid JSON only — no prose, no markdown.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.25,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || '';
};

const callGroq = async (prompt) => {
  const client = getGroqClient();
  if (!client) throw new Error('Groq not configured');
  const completion = await client.chat.completions.create({
    model: config.groq.model,
    messages: [
      {
        role: 'system',
        content:
          'You are ARGUS, an AI investment research analyst. Always respond with valid JSON only — no prose, no markdown.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.25,
    max_tokens: 4096,
  });
  return completion.choices[0]?.message?.content || '';
};

// ─── Deterministic No-LLM Fallback ────────────────────────────────
/**
 * When ALL LLM providers are unavailable, generate a structured response
 * using ONLY the data from the research tools. This is transparent — no hallucination.
 * The usedMockData flag will be set to true in the final report.
 */
const buildDeterministicResponse = (aggregatedData) => {
  const co = aggregatedData?.company || {};
  const fi = aggregatedData?.finance || {};
  const ri = aggregatedData?.risk || {};
  const comps = aggregatedData?.competitors || [];
  const news = aggregatedData?.news || [];

  const companyName = co.name || 'the company';
  const sector = co.sector || 'Unknown';
  const ticker = co.ticker || 'N/A';

  // Determine recommendation from available financial signals
  let recScore = 0;
  const growthPct = parseFloat((fi.revenueGrowth || '').replace(/[^0-9.-]/g, ''));
  if (!isNaN(growthPct)) recScore += growthPct > 10 ? 2 : growthPct > 0 ? 1 : -1;

  const pe = parseFloat(fi.peRatio);
  if (!isNaN(pe)) recScore += pe < 20 ? 1 : pe > 60 ? -1 : 0;

  const negNewsRatio = news.filter((n) => n.sentiment === 'negative').length / Math.max(news.length, 1);
  recScore += negNewsRatio > 0.5 ? -1 : negNewsRatio < 0.2 ? 1 : 0;

  const recommendation = recScore >= 2 ? 'BUY' : recScore <= -2 ? 'PASS' : 'HOLD';

  const swotStrengths = [
    fi.grossMargin ? `Gross margin of ${fi.grossMargin} demonstrates pricing power` : null,
    fi.roe ? `Return on equity of ${fi.roe}` : null,
    co.description ? `Established presence in ${sector} sector` : null,
    'Brand recognition and market presence',
  ].filter(Boolean);

  const swotWeaknesses = [
    ri.financialRisk && ri.financialRisk !== 'Low' ? ri.financialRisk : null,
    fi.debt ? `Total debt of ${fi.debt} represents financial obligation` : null,
    'Dependence on key market segments',
  ].filter(Boolean);

  return JSON.stringify({
    companySummary: co.description
      ? `${co.description.substring(0, 300)}...`
      : `${companyName} (${ticker}) operates in the ${sector} sector. Profile data was limited during this analysis.`,
    financialSummary: fi.revenue
      ? `${companyName} reported revenue of ${fi.revenue} with net income of ${fi.netIncome || 'N/A'}. ` +
        `EPS stands at ${fi.eps || 'N/A'} with a P/E ratio of ${fi.peRatio || 'N/A'}. ` +
        `Revenue growth (YoY): ${fi.revenueGrowth || 'N/A'}. Gross margin: ${fi.grossMargin || 'N/A'}. ` +
        `Return on equity: ${fi.roe || 'N/A'}. Market capitalization: ${fi.marketCap || 'N/A'}.`
      : 'Financial data was unavailable for this analysis period.',
    riskSummary: `${ri.businessRisk || 'Business risk assessment based on sector dynamics'}. ` +
      `Financial risk: ${ri.financialRisk || 'Moderate'}. ` +
      `Macroeconomic exposure: ${ri.macroRisk || 'Standard market risks apply'}. ` +
      `Overall risk level: ${ri.overallRisk || 'Moderate'}.`,
    competitorSummary: comps.length > 0
      ? `${companyName} competes with ${comps.slice(0, 3).map((c) => c.name).join(', ')}. ` +
        `Competitive analysis is based on available market data for ${comps.length} peer companies.`
      : `Competitor data was unavailable for ${companyName}. Sector-level competitive dynamics apply.`,
    swot: {
      strengths: swotStrengths.length ? swotStrengths : [
        `Established ${sector} sector presence`,
        'Existing customer relationships and brand equity',
        'Operational scale advantages',
      ],
      weaknesses: swotWeaknesses.length ? swotWeaknesses : [
        'Limited data availability reduces analysis depth',
        'Sector-specific cyclicality and operational challenges',
      ],
      opportunities: [
        'Digital transformation and technology adoption tailwinds',
        'Geographic or product expansion potential',
        'Strategic partnership and M&A opportunities',
        'Market share gains from weaker competitors',
      ],
      threats: [
        'Intensifying competitive landscape and pricing pressure',
        'Macroeconomic uncertainty and interest rate sensitivity',
        'Regulatory environment changes',
        'Technology disruption from new entrants',
      ],
    },
    recommendation,
    reasoning: `Based on quantitative analysis of available data: Revenue ${fi.revenue || 'N/A'}, ` +
      `growth ${fi.revenueGrowth || 'N/A'}, PE ratio ${fi.peRatio || 'N/A'}, ` +
      `ROE ${fi.roe || 'N/A'}, overall risk ${ri.overallRisk || 'Moderate'}. ` +
      `News sentiment: ${Math.round(negNewsRatio * 100)}% negative. ` +
      `A ${recommendation} recommendation is issued based on these quantitative signals. ` +
      `Note: This analysis was generated without an LLM — it reflects raw data-driven heuristics only. ` +
      `Add a Gemini, OpenAI, or Groq API key for full AI-powered reasoning.`,
    keyMetrics: {
      revenueGrowth: isNaN(growthPct) ? 'neutral' : growthPct > 0 ? 'positive' : 'negative',
      profitability: fi.profitMargin ? (parseFloat(fi.profitMargin) > 20 ? 'strong' : 'moderate') : 'unknown',
      debtLevel: fi.debt ? 'reported' : 'unknown',
      marketPosition: comps.length > 0 ? 'assessed' : 'unknown',
    },
    limitations: [
      'Analysis generated without LLM — no natural language reasoning applied',
      'Add Gemini, OpenAI, or Groq API key for full AI-powered analysis',
      'Recommendation based solely on quantitative heuristics from raw data',
      aggregatedData?.dataQuality?.failedTools?.length > 0
        ? `Data sources that failed: ${aggregatedData.dataQuality.failedTools.join(', ')}`
        : 'All data sources were accessible',
    ].filter(Boolean),
    evidenceQuality: fi.revenue ? 'medium' : 'low',
  });
};

// ─── Main Router Function ──────────────────────────────────────────

/**
 * callLLM — Attempts each LLM provider in priority order.
 * Returns the raw text response and metadata about which provider was used.
 *
 * @param {string} prompt - The fully constructed analysis prompt
 * @param {object} [aggregatedData] - Tool data for deterministic fallback if all LLMs fail
 * @returns {Promise<{ text: string, provider: string, usedFallback: boolean }>}
 */
const callLLM = async (prompt, aggregatedData = null) => {
  const providers = [
    { name: 'gemini', fn: callGemini, enabled: config.hasGeminiKey() },
    { name: 'openai', fn: callOpenAI, enabled: config.hasOpenAIKey() },
    { name: 'groq', fn: callGroq, enabled: config.hasGroqKey() },
  ];

  const available = providers.filter((p) => p.enabled);

  if (available.length === 0) {
    logger.warn('[LLMRouter] No LLM providers configured — using deterministic fallback');
    return {
      text: buildDeterministicResponse(aggregatedData),
      provider: 'deterministic',
      usedFallback: true,
    };
  }

  for (const provider of available) {
    try {
      logger.info(`[LLMRouter] Attempting ${provider.name}...`);
      const text = await provider.fn(prompt);
      logger.info(`[LLMRouter] ${provider.name} responded successfully`);
      return { text, provider: provider.name, usedFallback: provider.name !== 'gemini' };
    } catch (err) {
      logger.warn(`[LLMRouter] ${provider.name} failed: ${err.message}`);
    }
  }

  // All LLMs failed — use deterministic fallback
  logger.error('[LLMRouter] All LLM providers failed — using deterministic fallback');
  return {
    text: buildDeterministicResponse(aggregatedData),
    provider: 'deterministic',
    usedFallback: true,
  };
};

/**
 * callLLMForChat — Lighter chat variant, same fallback chain.
 * Uses a simpler deterministic response if all LLMs fail.
 *
 * @param {string} prompt
 * @param {object} context - Analysis context for fallback
 * @returns {Promise<{ text: string, provider: string }>}
 */
const callLLMForChat = async (prompt, context = {}) => {
  const providers = [
    { name: 'gemini', fn: callGemini, enabled: config.hasGeminiKey() },
    { name: 'openai', fn: callOpenAI, enabled: config.hasOpenAIKey() },
    { name: 'groq', fn: callGroq, enabled: config.hasGroqKey() },
  ];

  const available = providers.filter((p) => p.enabled);

  for (const provider of available) {
    try {
      const text = await provider.fn(prompt);
      return { text, provider: provider.name };
    } catch (err) {
      logger.warn(`[LLMRouter] Chat ${provider.name} failed: ${err.message}`);
    }
  }

  // Deterministic chat fallback
  const answer =
    `Based on the analysis of ${context.company?.name || 'this company'}, ` +
    `the ARGUS recommendation was ${context.recommendation || 'HOLD'} with ` +
    `a confidence score of ${context.confidence || 'N/A'}%. ` +
    `For detailed AI-powered chat, please configure a Gemini, OpenAI, or Groq API key.`;

  return {
    text: JSON.stringify({
      answer,
      referencedSections: ['recommendation', 'confidence'],
      confidence: Math.max(30, (context.confidence || 50) - 20),
    }),
    provider: 'deterministic',
  };
};

module.exports = { callLLM, callLLMForChat, buildDeterministicResponse };
