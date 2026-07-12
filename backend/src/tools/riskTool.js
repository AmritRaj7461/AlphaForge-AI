/**
 * Risk Tool
 * Evaluates investment risks based on financial metrics and news sentiment.
 * 
 * Per Risk Tool Specification:
 * - Assesses: Business Risk, Financial Risk, Operational Risk, Macroeconomic Risk
 * - Derived from financial ratios and news — no external API required
 * - NEVER calls LLMs
 * - Returns structured risk assessment
 */

const logger = require('../utils/logger');

/**
 * Assesses business risk dynamically based on sector and description.
 */
const assessBusinessRisk = (sector, industry) => {
  const s = (sector || 'Unknown').toLowerCase();
  const ind = (industry || 'Unknown').toLowerCase();

  if (s.includes('technology') || s.includes('tech')) {
    if (ind.includes('semiconductor')) {
      return 'High business risk due to extreme cyclicality, high capital expenditures, and intense global competition.';
    }
    return 'Moderate to elevated business risk. High innovation rate requires continuous R&D and exposes company to rapid technology obsolescence.';
  }
  if (s.includes('communication') || s.includes('internet')) {
    return 'Elevated business risk from shifting user attention, advertising cycle dependency, and content cost inflation.';
  }
  if (s.includes('consumer cyclical') || s.includes('automotive') || s.includes('retail')) {
    return 'High business risk tied to consumer discretionary spending, inventory management, and raw material cost fluctuations.';
  }
  if (s.includes('financial') || s.includes('bank')) {
    return 'Moderate to high risk related to interest rate volatility, credit default risks, and stringent capital regulatory requirements.';
  }
  if (s.includes('healthcare') || s.includes('biotech')) {
    return 'High risk from clinical trial failure rates, patent expiration cliffs, and strict FDA regulatory approvals.';
  }
  if (s.includes('energy') || s.includes('utilities')) {
    return 'Moderate risk driven by commodity price volatility, environmental compliance, and high capital asset leverage.';
  }
  return 'Moderate business risk typical of standard corporate operations in the sector.';
};

/**
 * Assesses operational risk dynamically.
 */
const assessOperationalRisk = (employees, country) => {
  const empCount = parseInt(String(employees || '').replace(/[^0-9]/g, ''), 10);
  
  if (!isNaN(empCount)) {
    if (empCount > 100000) {
      return 'Elevated operational risk due to global organization scale, supply chain complexity, and labor coordination.';
    }
    if (empCount < 500) {
      return 'Moderate risk reflecting key-person dependency and limited administrative redundancy of a smaller workforce.';
    }
  }
  return 'Moderate operational risk relating to execution speed, talent retention, and operational overhead.';
};

/**
 * Assesses macroeconomic risk dynamically based on sector.
 */
const assessMacroRisk = (sector) => {
  const s = (sector || 'Unknown').toLowerCase();

  if (s.includes('technology') || s.includes('communication')) {
    return 'Geopolitical trade tensions affecting cross-border supply chains and export control regulations.';
  }
  if (s.includes('consumer cyclical') || s.includes('real estate')) {
    return 'High sensitivity to interest rate hikes and shifts in consumer confidence/discretionary spending.';
  }
  if (s.includes('energy') || s.includes('basic materials')) {
    return 'High commodity price volatility, global trade tariffs, and FX translation headwinds.';
  }
  if (s.includes('financial')) {
    return 'Central bank rate policies, liquidity market squeezes, and macroeconomic credit expansion dynamics.';
  }
  return 'Standard sensitivity to inflation, FX currency fluctuations, and global GDP growth rates.';
};

/**
 * Main execute function for the Risk Tool.
 * Generates dynamic risk assessment by looking at the company's financials, news, and profile.
 * 
 * @param {{ company: string, financials: object, news: Array, profile: object }} input
 * @returns {Promise<object>} Risk assessment
 */
const execute = async ({ company, financials, news, profile }) => {
  logger.info(`[RiskTool] Performing dynamic risk assessment for: ${company}`);

  const sector = profile?.sector || financials?.sector || 'Unknown';
  const industry = profile?.industry || 'Unknown';
  const employees = profile?.employees || null;

  // 1. Dynamic Business Risk
  const businessRisk = assessBusinessRisk(sector, industry);

  // 2. Dynamic Financial Risk
  const finRiskLevel = assessFinancialRisk(financials);
  const financialRisk = finRiskLevel === 'Low'
    ? 'Low financial risk: strong balance sheet indicators, healthy margins, or low relative debt.'
    : finRiskLevel === 'Moderate'
    ? 'Moderate financial risk: standard leverage ratios and normal valuation levels.'
    : finRiskLevel === 'Elevated'
    ? 'Elevated financial risk: high leverage ratios or premium valuation multiples.'
    : 'High financial risk: potential operating losses, high debt-to-revenue ratios, or excessive valuation premium.';

  // 3. Dynamic Operational Risk
  const operationalRisk = assessOperationalRisk(employees);

  // 4. Dynamic Macroeconomic Risk
  const macroRisk = assessMacroRisk(sector);

  // 5. Dynamic News Sentiment Risk
  const newsRiskLevel = assessNewsRisk(news);

  // 6. Dynamic Key Factors Identification
  const keyFactors = identifyKeyFactors(financials, news, profile);

  // 7. Calculate Overall Risk mathematically
  const overallRisk = calculateOverallRisk(finRiskLevel, newsRiskLevel, 'Moderate');

  return {
    businessRisk,
    financialRisk,
    operationalRisk,
    macroRisk,
    overallRisk,
    keyFactors
  };
};

/**
 * Calculates overall risk level from component assessments.
 */
const calculateOverallRisk = (financialRisk, newsRisk, operationalRisk) => {
  const riskScores = {
    'Low': 1, 'Moderate': 2, 'Elevated': 3, 'High': 4, 'Unknown': 2
  };

  const getScore = (val) => {
    if (!val) return 2;
    const str = String(val).trim();
    if (str.startsWith('Low')) return 1;
    if (str.startsWith('Elevated')) return 3;
    if (str.startsWith('High')) return 4;
    return 2; // Moderate or Unknown
  };

  const fScore = getScore(financialRisk);
  const nScore = getScore(newsRisk);
  const oScore = getScore(operationalRisk);

  const avg = (fScore + nScore + oScore) / 3;

  if (avg <= 1.5) return 'Low';
  if (avg <= 2.5) return 'Moderate';
  if (avg <= 3.5) return 'Elevated';
  return 'High';
};

/**
 * Determines financial risk level from key financial metrics.
 */
const assessFinancialRisk = (finance) => {
  if (!finance) return 'Unknown';

  let riskPoints = 0;

  // Debt assessment
  const revenue = parseFloat(String(finance.revenue || '').replace(/[^0-9.]/g, ''));
  const debt = parseFloat(String(finance.debt || '').replace(/[^0-9.]/g, ''));
  if (revenue > 0 && debt > 0) {
    const debtRatio = debt / revenue;
    if (debtRatio > 1.5) riskPoints += 2;
    else if (debtRatio > 0.8) riskPoints += 1;
  }

  // Profitability assessment
  const profitMargin = parseFloat(String(finance.profitMargin || '').replace(/[^0-9.-]/g, ''));
  if (!isNaN(profitMargin)) {
    if (profitMargin < 0) riskPoints += 2;
    else if (profitMargin < 6) riskPoints += 1;
  }

  // Valuation premium (P/E Ratio)
  const pe = parseFloat(finance.peRatio);
  if (!isNaN(pe)) {
    if (pe > 60) riskPoints += 2;
    else if (pe > 30) riskPoints += 1;
  }

  // Revenue growth deceleration
  const growth = parseFloat(String(finance.revenueGrowth || '').replace(/[^0-9.-]/g, ''));
  if (!isNaN(growth) && growth < 0) {
    riskPoints += 1;
  }

  if (riskPoints <= 1) return 'Low';
  if (riskPoints <= 3) return 'Moderate';
  if (riskPoints <= 5) return 'Elevated';
  return 'High';
};

/**
 * Determines sentiment-based risk from news articles.
 */
const assessNewsRisk = (news) => {
  if (!news || news.length === 0) return 'Unknown';

  const negativeCount = news.filter((n) => n.sentiment === 'negative').length;
  const ratio = negativeCount / news.length;

  if (ratio > 0.5) return 'High';
  if (ratio > 0.3) return 'Elevated';
  if (ratio > 0.1) return 'Moderate';
  return 'Low';
};

/**
 * Generates key risk factors based on available data.
 */
const identifyKeyFactors = (finance, news, profile) => {
  const factors = [];

  if (finance) {
    const pe = parseFloat(finance.peRatio);
    if (!isNaN(pe) && pe > 40) {
      factors.push(`Valuation premium (PE: ${finance.peRatio}) creates downside susceptibility on earnings misses.`);
    }

    const growth = parseFloat(String(finance.revenueGrowth || '').replace(/[^0-9.-]/g, ''));
    if (!isNaN(growth) && growth < 0) {
      factors.push(`Decelerating revenue growth (${finance.revenueGrowth}) raises growth thesis concerns.`);
    }

    const debt = parseFloat(String(finance.debt || '').replace(/[^0-9.]/g, ''));
    if (!isNaN(debt) && debt > 50) {
      factors.push('Substantial balance sheet debt obligations.');
    }
  }

  if (news && news.length > 0) {
    const negativeNews = news.filter((n) => n.sentiment === 'negative').slice(0, 2);
    negativeNews.forEach((n) => {
      factors.push(`News concern: ${n.title}`);
    });
  }

  // Standard falls
  if (factors.length < 3) {
    factors.push('Industry-specific regulatory and policy adjustments.');
    factors.push('Competitive pressure on market share and product margins.');
  }

  return factors.slice(0, 5);
};

module.exports = {
  execute,
  assessFinancialRisk,
  assessNewsRisk,
  identifyKeyFactors,
  assessBusinessRisk,
  assessOperationalRisk,
  assessMacroRisk,
  calculateOverallRisk
};
