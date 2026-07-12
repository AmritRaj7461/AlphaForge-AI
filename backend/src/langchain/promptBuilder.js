/**
 * Prompt Builder
 * Constructs the full structured prompt sent to Gemini.
 * 
 * Per Prompt Engineering Handbook: Structure is always:
 *   System Prompt → Company Info → Financials → News → Risk → Competitors
 *   → Required JSON Schema → Reasoning Instructions
 * 
 * Per Implementation Contract: Prompt Builder NEVER calls APIs.
 * Per AI Principles: Always specify structured JSON output format.
 */

const logger = require('../utils/logger');

/**
 * The system prompt that establishes ARGUS's permanent behavior.
 * Per System-Prompt.md specification.
 */
const SYSTEM_PROMPT = `You are ARGUS (Autonomous Research & Guidance Utility System), an AI Investment Research Analyst working inside AlphaForge AI.

You are NOT a stock predictor. You are NOT a financial advisor.

Your responsibility is to analyze structured company information and generate an explainable, evidence-based investment research report.

CRITICAL RULES:
- NEVER invent financial data or numbers not provided to you
- NEVER hallucinate company details
- NEVER assume unavailable information — mark it as "Data unavailable"
- ALWAYS explain WHY you reached each conclusion
- ALWAYS mention uncertainty when evidence is insufficient
- ALWAYS base recommendations on the data provided
- Output ONLY valid JSON — no markdown, no prose outside the JSON structure`;

/**
 * Builds the complete analysis prompt from aggregated research data.
 * 
 * @param {object} aggregatedData - Output from the aggregator
 * @returns {string} Complete prompt string ready to send to Gemini
 */
const buildAnalysisPrompt = (aggregatedData) => {
  logger.info('[PromptBuilder] Building analysis prompt');

  const { company, finance, news, risk, competitors, dataQuality } = aggregatedData;

  // Format sections only if data is available
  const companySection = company
    ? `COMPANY INFORMATION:
Name: ${company.name || 'N/A'}
Ticker: ${company.ticker || 'N/A'}
Sector: ${company.sector || 'N/A'}
Industry: ${company.industry || 'N/A'}
Headquarters: ${company.headquarters || 'N/A'}
Website: ${company.website || 'N/A'}
Description: ${company.description || 'N/A'}`
    : 'COMPANY INFORMATION: Data unavailable';

  const financeSection = finance
    ? `FINANCIAL METRICS:
Revenue: ${finance.revenue || 'N/A'}
Net Income: ${finance.netIncome || 'N/A'}
EPS: ${finance.eps || 'N/A'}
PE Ratio: ${finance.peRatio || 'N/A'}
ROE: ${finance.roe || 'N/A'}
ROA: ${finance.roa || 'N/A'}
Market Cap: ${finance.marketCap || 'N/A'}
Total Debt: ${finance.debt || 'N/A'}
Operating Cash Flow: ${finance.cashFlow || 'N/A'}
Revenue Growth (YoY): ${finance.revenueGrowth || 'N/A'}
Gross Margin: ${finance.grossMargin || 'N/A'}
Profit Margin: ${finance.profitMargin || 'N/A'}`
    : 'FINANCIAL METRICS: Data unavailable — note this significantly reduces analysis confidence';

  const newsSection = news && news.length > 0
    ? `RECENT NEWS (${news.length} articles):
${news.slice(0, 8).map((n, i) =>
      `${i + 1}. [${n.sentiment?.toUpperCase() || 'NEUTRAL'}] ${n.title} (${n.source}, ${n.publishedAt || 'Recent'})`
    ).join('\n')}`
    : 'RECENT NEWS: No recent news available';

  const riskSection = risk
    ? `RISK ASSESSMENT:
Business Risk: ${risk.businessRisk || 'N/A'}
Financial Risk: ${risk.financialRisk || 'N/A'}
Operational Risk: ${risk.operationalRisk || 'N/A'}
Macroeconomic Risk: ${risk.macroRisk || 'N/A'}
Overall Risk Level: ${risk.overallRisk || 'N/A'}
Key Risk Factors: ${(risk.keyFactors || []).join('; ') || 'N/A'}`
    : 'RISK ASSESSMENT: Data unavailable';

  const competitorSection = competitors && competitors.length > 0
    ? `COMPETITOR ANALYSIS (${competitors.length} competitors):
${competitors.slice(0, 5).map((c) =>
      `- ${c.name} (${c.ticker || 'N/A'}): Market Cap ${c.marketCap || 'N/A'}, PE ${c.peRatio || 'N/A'}`
    ).join('\n')}`
    : 'COMPETITOR ANALYSIS: Data unavailable';

  const dataAvailabilityNote = dataQuality.failedTools.length > 0
    ? `\nDATA AVAILABILITY NOTE: The following data sources were unavailable: ${dataQuality.failedTools.join(', ')}. Adjust confidence and note limitations accordingly.`
    : '';

  const jsonSchema = `
REQUIRED JSON OUTPUT (return ONLY this JSON, no other text):
{
  "companySummary": "2-3 sentence overview of the company and its business",
  "financialSummary": "Analysis of financial health, key metrics, and trends",
  "riskSummary": "Summary of main investment risks",
  "competitorSummary": "Competitive position and market standing",
  "swot": {
    "strengths": ["strength 1", "strength 2", "strength 3"],
    "weaknesses": ["weakness 1", "weakness 2"],
    "opportunities": ["opportunity 1", "opportunity 2"],
    "threats": ["threat 1", "threat 2"]
  },
  "recommendation": "BUY",
  "reasoning": "Detailed explanation of WHY this recommendation was made, referencing specific data points",
  "keyMetrics": {
    "revenueGrowth": "positive/negative/neutral",
    "profitability": "strong/moderate/weak",
    "debtLevel": "low/moderate/high",
    "marketPosition": "leader/challenger/follower"
  },
  "limitations": ["limitation 1", "limitation 2"],
  "evidenceQuality": "high/medium/low"
}

IMPORTANT: recommendation must be exactly one of: "BUY", "HOLD", or "PASS"
IMPORTANT: Return ONLY the JSON object, no markdown code blocks, no prose`;

  const instructions = `
ANALYSIS INSTRUCTIONS:
1. Summarize the company based on the provided information
2. Analyze financial performance using the metrics provided — reference specific numbers
3. Assess growth potential based on available data
4. Evaluate investment risks comprehensively  
5. Compare market position against competitors if data available
6. Produce a thorough SWOT analysis
7. Make a clear recommendation: BUY, HOLD, or PASS
8. Explain every conclusion with specific evidence from the data
9. List all assumptions you had to make due to missing data
10. Be honest about data limitations — do not fabricate financial data to fill gaps
11. PROFILE FALLBACK: If the company profile (description, sector, industry) is unavailable or marked as Unknown, you are authorized to use your internal pre-trained knowledge to describe what the company does, its sector, and its industry, so the report remains complete. Do NOT fabricate financial numbers, but do explain the company's business model.`;

  const fullPrompt = [
    SYSTEM_PROMPT,
    '',
    companySection,
    '',
    financeSection,
    '',
    newsSection,
    '',
    riskSection,
    '',
    competitorSection,
    dataAvailabilityNote,
    '',
    jsonSchema,
    instructions,
  ].join('\n');

  logger.debug(`[PromptBuilder] Prompt length: ${fullPrompt.length} characters`);
  return fullPrompt;
};

/**
 * Builds a follow-up chat prompt using the existing analysis context.
 * Per Chat Wireframe: Chat uses report context, no complete re-analysis.
 * 
 * @param {object} context - Previous analysis result
 * @param {string} question - User's follow-up question
 * @returns {string} Chat prompt
 */
const buildChatPrompt = (context, question) => {
  logger.info('[PromptBuilder] Building chat prompt');

  const financialsStr = context.financials
    ? Object.entries(context.financials)
        .filter(([_, val]) => val !== null && val !== undefined)
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ')
    : 'None';

  const newsStr = context.news && context.news.length > 0
    ? context.news.slice(0, 5).map((n, i) => `${i + 1}. [${n.sentiment}] ${n.title} (${n.source})`).join('\n')
    : 'None';

  const riskStr = context.risk
    ? `Business Risk: ${context.risk.businessRisk || 'N/A'}\nFinancial Risk: ${context.risk.financialRisk || 'N/A'}\nOperational Risk: ${context.risk.operationalRisk || 'N/A'}\nMacroeconomic Risk: ${context.risk.macroRisk || 'N/A'}\nKey Factors: ${(context.risk.keyFactors || []).join('; ')}`
    : 'None';

  const competitorsStr = context.competitors && context.competitors.length > 0
    ? context.competitors.map(c => `- ${c.name} (${c.ticker || 'N/A'}): MC ${c.marketCap || 'N/A'}, PE ${c.peRatio || 'N/A'}`).join('\n')
    : 'None';

  const swotStr = context.swot
    ? `Strengths: ${(context.swot.strengths || []).join(', ')}\nWeaknesses: ${(context.swot.weaknesses || []).join(', ')}\nOpportunities: ${(context.swot.opportunities || []).join(', ')}\nThreats: ${(context.swot.threats || []).join(', ')}`
    : 'None';

  return `${SYSTEM_PROMPT}

You previously analyzed ${context.company?.name || 'this company'} and produced this detailed research context:

Company: ${context.company?.name || 'N/A'} (${context.company?.ticker || 'N/A'})
Sector: ${context.company?.sector || 'N/A'}
Industry: ${context.company?.industry || 'N/A'}
Description: ${context.company?.description || 'N/A'}

Recommendation: ${context.recommendation || 'N/A'}
Confidence Score: ${context.confidence || 'N/A'}%
Thesis Reasoning: ${context.reasoning || 'N/A'}

FINANCIAL DETAILS:
${financialsStr}

SWOT ANALYSIS:
${swotStr}

RECENT NEWS SENTIMENT:
${newsStr}

RISK EVALUATION:
${riskStr}

COMPETITOR COMPARISON:
${competitorsStr}

The user now has a follow-up question. Answer concisely, referencing the detailed financial metrics, news, risks, and competitor context provided above.
Do NOT perform new research or invent facts. If the information needed is not in the context above, state that it is not available.

USER QUESTION: ${question}

Respond in this JSON format:
{
  "answer": "Your detailed answer here",
  "referencedSections": ["which sections of the report this relates to"],
  "confidence": 75
}

Return ONLY the JSON, no other text.`;
};

module.exports = { buildAnalysisPrompt, buildChatPrompt };
