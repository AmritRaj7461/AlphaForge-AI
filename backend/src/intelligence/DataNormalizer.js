/**
 * Data Normalizer
 * Standardizes raw outputs from all different data providers (Alpha Vantage, FMP, Yahoo Finance, Static)
 * into a single canonical JSON schema for profiles and financials.
 */

// Helper to format values into user-friendly strings with currency support
const fmt = {
  money: (val, currency = 'USD') => {
    if (val === null || val === undefined || val === 'None' || val === 'null') return null;
    const n = parseFloat(val);
    if (isNaN(n)) return null;

    const symbolMap = {
      'USD': '$',
      'INR': '₹',
      'EUR': '€',
      'GBP': '£',
      'JPY': '¥',
      'CAD': 'CA$',
      'AUD': 'A$',
      'KRW': '₩'
    };
    const curSymbol = symbolMap[currency] || (currency + ' ');

    if (Math.abs(n) >= 1e12) return `${curSymbol}${(n / 1e12).toFixed(2)}T`;
    if (Math.abs(n) >= 1e9)  return `${curSymbol}${(n / 1e9).toFixed(2)}B`;
    if (Math.abs(n) >= 1e6)  return `${curSymbol}${(n / 1e6).toFixed(2)}M`;
    return `${curSymbol}${n.toFixed(2)}`;
  },
  pct: (val) => {
    if (val === null || val === undefined || val === 'None') return null;
    const n = parseFloat(val);
    return isNaN(n) ? null : `${(n * 100).toFixed(2)}%`;
  },
  pctDirect: (val) => {
    if (val === null || val === undefined || val === 'None') return null;
    const n = parseFloat(val);
    return isNaN(n) ? null : `${n.toFixed(2)}%`;
  }
};

/**
 * Normalizes company profile data.
 * Returns: { name, ticker, sector, industry, headquarters, website, description, exchange, currency, country, employees, _source }
 */
function normalizeProfile(provider, data, symbol = '') {
  if (!data) return null;

  switch (provider) {
    case 'alpha_vantage':
      return {
        name: data.Name || null,
        ticker: data.Symbol || symbol,
        sector: data.Sector || 'Unknown',
        industry: data.Industry || 'Unknown',
        headquarters: data.Address || 'Unknown',
        website: null,
        description: data.Description || 'No description available.',
        exchange: data.Exchange || null,
        currency: data.Currency || 'USD',
        country: data.Country || null,
        employees: data.FullTimeEmployees || null,
        _source: 'alpha_vantage'
      };

    case 'fmp':
      return {
        name: data.companyName || null,
        ticker: data.symbol || symbol,
        sector: data.sector || 'Unknown',
        industry: data.industry || 'Unknown',
        headquarters: data.city && data.country ? `${data.city}, ${data.country}` : (data.country || 'Unknown'),
        website: data.website || null,
        description: data.description || 'No description available.',
        exchange: data.exchangeShortName || null,
        currency: data.currency || 'USD',
        country: data.country || null,
        employees: data.fullTimeEmployees ? String(data.fullTimeEmployees) : null,
        _source: 'fmp'
      };

    case 'nse':
    case 'bse':
    case 'yahoo_finance': {
      const p = data.assetProfile || {};
      const price = data.price || {};
      const currency = price.currency || p.currency || 'USD';
      return {
        name: price.longName || price.shortName || symbol,
        ticker: symbol,
        sector: p.sector || 'Unknown',
        industry: p.industry || 'Unknown',
        headquarters: p.city && p.country ? `${p.city}, ${p.country}` : (p.country || 'Unknown'),
        website: p.website || null,
        description: p.longBusinessSummary || 'No description available.',
        exchange: price.exchangeName || null,
        currency: currency,
        country: p.country || null,
        employees: p.fullTimeEmployees ? String(p.fullTimeEmployees) : null,
        _source: provider
      };
    }

    case 'static':
      return {
        ...data,
        _source: 'static'
      };

    default:
      return null;
  }
}

/**
 * Normalizes financial ratios and metrics.
 * Returns: { revenue, netIncome, eps, peRatio, roe, roa, marketCap, debt, cashFlow, revenueGrowth, grossMargin, profitMargin, dividendYield, beta, priceToBook, week52High, week52Low, _source }
 */
function normalizeFinance(provider, data, symbol = '', marketMeta = {}) {
  if (!data) return null;
  const currency = marketMeta.currency || 'USD';

  switch (provider) {
    case 'alpha_vantage': {
      const grossMarginCalculated = data.GrossProfitTTM && data.RevenueTTM 
        ? fmt.pct(parseFloat(data.GrossProfitTTM) / parseFloat(data.RevenueTTM)) 
        : null;
      const netIncomeCalculated = data.RevenueTTM && data.ProfitMargin
        ? fmt.money(parseFloat(data.RevenueTTM) * parseFloat(data.ProfitMargin), currency)
        : null;

      return {
        revenue:       fmt.money(data.RevenueTTM, currency),
        netIncome:     data.NetIncomeTTM && data.NetIncomeTTM !== 'None' ? fmt.money(data.NetIncomeTTM, currency) : netIncomeCalculated,
        eps:           data.EPS !== 'None' ? `${currency === 'INR' ? '₹' : '$'}${parseFloat(data.EPS).toFixed(2)}` : null,
        peRatio:       data.PERatio !== 'None' ? data.PERatio : null,
        roe:           fmt.pct(data.ReturnOnEquityTTM),
        roa:           fmt.pct(data.ReturnOnAssetsTTM),
        marketCap:     fmt.money(data.MarketCapitalization, currency),
        debt:          data.TotalDebt && data.TotalDebt !== 'None' ? fmt.money(data.TotalDebt, currency) : null,
        cashFlow:      data.OperatingCashflowTTM && data.OperatingCashflowTTM !== 'None' ? fmt.money(data.OperatingCashflowTTM, currency) : null,
        revenueGrowth: fmt.pct(data.QuarterlyRevenueGrowthYOY),
        grossMargin:   data.GrossProfitMarginTTM && data.GrossProfitMarginTTM !== 'None' ? fmt.pct(data.GrossProfitMarginTTM) : grossMarginCalculated,
        profitMargin:  fmt.pct(data.ProfitMargin),
        dividendYield: data.DividendYield !== 'None' ? `${(parseFloat(data.DividendYield) * 100).toFixed(2)}%` : 'N/A',
        beta:          data.Beta !== 'None' ? String(parseFloat(data.Beta).toFixed(2)) : null,
        priceToBook:   data.PriceToBookRatio !== 'None' ? String(parseFloat(data.PriceToBookRatio).toFixed(2)) : null,
        week52High:    data['52WeekHigh'] ? `${currency === 'INR' ? '₹' : '$'}${parseFloat(data['52WeekHigh']).toFixed(2)}` : null,
        week52Low:     data['52WeekLow'] ? `${currency === 'INR' ? '₹' : '$'}${parseFloat(data['52WeekLow']).toFixed(2)}` : null,
        _source:       'alpha_vantage'
      };
    }

    case 'fmp': {
      const p = data.profile || {};
      const r = data.ratios || {};
      const inc = data.income || {};
      const fmpCurrency = p.currency || currency;
      const fmpMarketCap = p.marketCap || p.mktCap || null;
      return {
        revenue:       inc.revenue ? fmt.money(inc.revenue, fmpCurrency) : null,
        netIncome:     inc.netIncome ? fmt.money(inc.netIncome, fmpCurrency) : null,
        eps:           inc.eps ? `${fmpCurrency === 'INR' ? '₹' : '$'}${parseFloat(inc.eps).toFixed(2)}` : (r.netIncomePerShareTTM ? `${fmpCurrency === 'INR' ? '₹' : '$'}${parseFloat(r.netIncomePerShareTTM).toFixed(2)}` : null),
        peRatio:       r.priceToEarningsRatioTTM ? String(parseFloat(r.priceToEarningsRatioTTM).toFixed(2)) : null,
        roe:           null,
        roa:           null,
        marketCap:     fmpMarketCap ? fmt.money(fmpMarketCap, fmpCurrency) : null,
        debt:          null,
        cashFlow:      r.freeCashFlowPerShareTTM && p.price && fmpMarketCap ? fmt.money(r.freeCashFlowPerShareTTM * (fmpMarketCap / p.price), fmpCurrency) : null,
        revenueGrowth: null,
        grossMargin:   r.grossProfitMarginTTM ? `${(r.grossProfitMarginTTM * 100).toFixed(2)}%` : null,
        profitMargin:  r.netProfitMarginTTM ? `${(r.netProfitMarginTTM * 100).toFixed(2)}%` : null,
        dividendYield: p.lastDiv && parseFloat(p.lastDiv) > 0
          ? `${(parseFloat(p.lastDiv) / parseFloat(p.price || 1) * 100).toFixed(2)}%`
          : 'N/A',
        beta:          p.beta ? String(parseFloat(p.beta).toFixed(2)) : null,
        priceToBook:   r.priceToBookRatioTTM ? String(parseFloat(r.priceToBookRatioTTM).toFixed(2)) : null,
        week52High:    p['52WeekHigh'] ? `${fmpCurrency === 'INR' ? '₹' : '$'}${p['52WeekHigh']}` : null,
        week52Low:     p['52WeekLow']  ? `${fmpCurrency === 'INR' ? '₹' : '$'}${p['52WeekLow']}` : null,
        _source:       'fmp'
      };
    }

    case 'nse':
    case 'bse':
    case 'yahoo_finance': {
      const fd = data.financialData || {};
      const ks = data.defaultKeyStatistics || {};
      const sd = data.summaryDetail || {};
      const price = data.price || {};
      const earnings = data.earnings || {};
      const yfCurrency = fd.financialCurrency || sd.currency || price.currency || currency;

      // Last year's net income from earnings chart if available
      const yearlyEarns = earnings.financialsChart?.yearly;
      const lastYearEarn = yearlyEarns && yearlyEarns.length > 0 ? yearlyEarns[yearlyEarns.length - 1]?.netIncome?.raw : null;

      const netIncomeCalculated = fd.totalRevenue?.raw && fd.profitMargins?.raw 
        ? fmt.money(fd.totalRevenue.raw * fd.profitMargins.raw, yfCurrency) 
        : null;

      return {
        revenue:       fmt.money(fd.totalRevenue?.raw, yfCurrency),
        netIncome:     lastYearEarn ? fmt.money(lastYearEarn, yfCurrency) : (ks.netIncomeToCommon?.raw ? fmt.money(ks.netIncomeToCommon.raw, yfCurrency) : netIncomeCalculated),
        eps:           ks.trailingEps?.raw ? `${yfCurrency === 'INR' ? '₹' : '$'}${parseFloat(ks.trailingEps.raw).toFixed(2)}` : null,
        peRatio:       sd.trailingPE?.raw ? String(parseFloat(sd.trailingPE.raw).toFixed(2)) : (sd.forwardPE?.raw ? String(parseFloat(sd.forwardPE.raw).toFixed(2)) : null),
        roe:           fmt.pct(fd.returnOnEquity?.raw),
        roa:           fmt.pct(fd.returnOnAssets?.raw),
        marketCap:     fmt.money(sd.marketCap?.raw || price.marketCap?.raw, yfCurrency),
        debt:          fmt.money(fd.totalDebt?.raw, yfCurrency),
        cashFlow:      fmt.money(fd.operatingCashflow?.raw, yfCurrency),
        revenueGrowth: fmt.pct(fd.revenueGrowth?.raw),
        grossMargin:   fmt.pct(fd.grossMargins?.raw),
        profitMargin:  fmt.pct(fd.profitMargins?.raw),
        dividendYield: sd.dividendYield?.raw ? fmt.pct(sd.dividendYield.raw) : 'N/A',
        beta:          sd.beta?.raw ? String(parseFloat(sd.beta.raw).toFixed(2)) : null,
        priceToBook:   sd.priceToBook?.raw || ks.priceToBook?.raw ? String(parseFloat(sd.priceToBook?.raw || ks.priceToBook?.raw).toFixed(2)) : null,
        week52High:    sd.fiftyTwoWeekHigh?.raw ? `${yfCurrency === 'INR' ? '₹' : '$'}${parseFloat(sd.fiftyTwoWeekHigh.raw).toFixed(2)}` : null,
        week52Low:     sd.fiftyTwoWeekLow?.raw ? `${yfCurrency === 'INR' ? '₹' : '$'}${parseFloat(sd.fiftyTwoWeekLow.raw).toFixed(2)}` : null,
        _source:       provider
      };
    }

    case 'static':
      return {
        ...data,
        _source: 'static'
      };

    default:
      return null;
  }
}

module.exports = {
  fmt,
  normalizeProfile,
  normalizeFinance
};
