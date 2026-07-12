/**
 * ARGUS — Autonomous Research & Guidance Utility System
 *
 * ARGUS is the central intelligence of AlphaForge AI.
 * Orchestrates the complete research → reasoning → recommendation workflow.
 * 
 * Pipeline:
 *   1. Resolve input query to canonical resolvedCompany object
 *   2. Delegate tool execution to ToolManager (parallel fetches + fallback chains)
 *   3. Estimate missing financial metrics via LLM if needed
 *   4. Build prompt, run LLM Router fallback chain
 *   5. Validate response, calculate quantitative confidence breakdown
 *   6. Compile report via ReportBuilder
 */

const logger = require('../utils/logger');
const { resolve } = require('../intelligence/CompanyResolver');
const { executeAll } = require('./ToolManager');
const { buildAnalysisPrompt, buildChatPrompt } = require('./promptBuilder');
const { validateResponse } = require('./validator');
const { calculateConfidence } = require('./confidenceEngine');
const { callLLM, callLLMForChat } = require('../config/llmRouter');
const { buildReport } = require('./ReportBuilder');

/**
 * Main ARGUS analysis pipeline.
 */
const analyze = async (companyInput) => {
  logger.info(`[ARGUS] Starting analysis pipeline for input: "${companyInput}"`);

  // ─── Step 1: Validate & Resolve Ticker ───────────────────────────
  if (!companyInput || typeof companyInput !== 'string' || companyInput.trim().length === 0) {
    throw Object.assign(new Error('Invalid company input'), {
      code: 'INVALID_REQUEST',
      publicMessage: 'Please provide a valid company name or ticker symbol.',
      statusCode: 400,
    });
  }

  const resolvedCompany = await resolve(companyInput);
  logger.info(`[ARGUS] Resolved to Symbol: "${resolvedCompany.symbol}", Name: "${resolvedCompany.name}", Market: ${resolvedCompany.marketMeta.market}`);

  // ─── Step 2: Execute Research Tools via ToolManager ──────────────
  const { aggregatedData, toolHealth, providerStatus } = await executeAll(resolvedCompany);

  // ─── Step 3: Map missing metrics to 'Unavailable' (No Hallucination) ──
  const isMissing = (val) => {
    if (val === null || val === undefined) return true;
    const s = String(val).trim().toLowerCase();
    return s === '' || s === 'n/a' || s === 'null' || s === 'none' || s === 'unavailable';
  };

  let financialsObj = aggregatedData.finance || {};
  const allFinancialKeys = [
    'revenue', 'netIncome', 'eps', 'peRatio', 'roe', 'roa',
    'marketCap', 'debt', 'cashFlow', 'revenueGrowth', 'grossMargin', 'profitMargin', 'dividendYield', 'beta'
  ];
  for (const key of allFinancialKeys) {
    if (isMissing(financialsObj[key])) {
      financialsObj[key] = 'Unavailable';
    }
  }
  aggregatedData.finance = financialsObj;

  // Ensure company name is set correctly rather than just the symbol
  if (!aggregatedData.company || aggregatedData.company.name === resolvedCompany.symbol) {
    aggregatedData.company = { name: resolvedCompany.name, ticker: resolvedCompany.symbol };
  }

  // Assemble dataQuality for compatibility
  aggregatedData.dataQuality = {
    companyDataAvailable: !!aggregatedData.company,
    financeDataAvailable: !!aggregatedData.finance,
    newsDataAvailable: aggregatedData.news && aggregatedData.news.length > 0,
    riskDataAvailable: !!aggregatedData.risk,
    competitorDataAvailable: aggregatedData.competitors && aggregatedData.competitors.length > 0,
    failedTools: Object.keys(toolHealth).filter(k => toolHealth[k].status === 'failed')
  };

  // ─── Step 4: Build Prompt ────────────────────────────────────────
  const prompt = buildAnalysisPrompt(aggregatedData);

  // ─── Step 5: Call LLM via Fallback Chain ─────────────────────────
  logger.info('[ARGUS] Invoking LLM via fallback chain (Gemini → OpenAI → Groq)');
  const { text: rawLLMResponse, provider } = await callLLM(prompt, aggregatedData);

  // ─── Step 6: Validate Response ───────────────────────────────────
  const validationResult = validateResponse(rawLLMResponse);

  // ─── Step 7: Calculate Confidence ───────────────────────────────
  const confidence = calculateConfidence(aggregatedData, validationResult);
  if (provider === 'deterministic') {
    confidence.score = Math.max(10, confidence.score - 30);
    confidence.level = confidence.score >= 60 ? 'High' : confidence.score >= 40 ? 'Moderate' : 'Low';
  }

  // ─── Step 8: Compile & Format Report ─────────────────────────────
  return buildReport(resolvedCompany, aggregatedData, validationResult, toolHealth, providerStatus, confidence, provider);
};

/**
 * Processes a follow-up chat question using an existing analysis context.
 */
const chat = async (context, question) => {
  logger.info(`[ARGUS] Processing chat follow-up: "${question.substring(0, 60)}..."`);

  const prompt = buildChatPrompt(context, question);
  const { text: rawResponse } = await callLLMForChat(prompt, context);

  const parsed = (() => {
    try {
      const match = rawResponse.match(/\{[\s\S]*\}/);
      return match ? JSON.parse(match[0]) : null;
    } catch {
      return null;
    }
  })();

  return {
    answer: parsed?.answer || 'I could not process your question. Please try rephrasing.',
    confidence: parsed?.confidence || 50,
    referencedSections: parsed?.referencedSections || [],
  };
};

module.exports = { analyze, chat };
