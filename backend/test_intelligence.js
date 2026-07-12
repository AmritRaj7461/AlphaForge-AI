/**
 * Verification Script for Company Intelligence Layer
 */

const { findBestMatch } = require('./src/intelligence/FuzzyMatcher');
const { resolveMarket } = require('./src/intelligence/MarketResolver');
const { getProviderChain } = require('./src/intelligence/ProviderRouter');
const { resolve } = require('./src/intelligence/CompanyResolver');
const { normalizeProfile, normalizeFinance } = require('./src/intelligence/DataNormalizer');

async function runTests() {
  console.log('=== Running Intelligence Layer Verification ===\n');

  // 1. Test Fuzzy Matcher
  console.log('1. Testing FuzzyMatcher:');
  const fuzzyTests = [
    { input: 'Nvidea', expected: 'NVDA' },
    { input: 'Aapple', expected: 'AAPL' },
    { input: 'Sonata', expected: 'SONATSOFTW.NS' },
    { input: 'Tcs', expected: 'TCS.BSE' }
  ];

  for (const t of fuzzyTests) {
    const match = findBestMatch(t.input);
    const pass = match === t.expected;
    console.log(`  - Match "${t.input}" -> Got: "${match}" | Expected: "${t.expected}" | ${pass ? '✅ PASS' : '❌ FAIL'}`);
  }
  console.log('');

  // 2. Test Market Resolver
  console.log('2. Testing MarketResolver:');
  const marketTests = [
    { symbol: 'AAPL', expectedCurrency: 'USD', expectedMarket: 'USA' },
    { symbol: 'SONATSOFTW.NS', expectedCurrency: 'INR', expectedMarket: 'India' },
    { symbol: '005930.KS', expectedCurrency: 'KRW', expectedMarket: 'Korea' }
  ];

  for (const t of marketTests) {
    const res = resolveMarket(t.symbol);
    const pass = res.currency === t.expectedCurrency && res.market === t.expectedMarket;
    console.log(`  - Resolve "${t.symbol}" -> Currency: "${res.currency}", Market: "${res.market}" | ${pass ? '✅ PASS' : '❌ FAIL'}`);
  }
  console.log('');

  // 3. Test Provider Router
  console.log('3. Testing ProviderRouter:');
  const routerTests = [
    { market: 'USA', expectedFirst: 'alpha_vantage' },
    { market: 'India', expectedFirst: 'yahoo_finance' }
  ];

  for (const t of routerTests) {
    const chain = getProviderChain(t.market);
    const pass = chain[0] === t.expectedFirst;
    console.log(`  - Route "${t.market}" -> Chain: [${chain.join(', ')}] | ${pass ? '✅ PASS' : '❌ FAIL'}`);
  }
  console.log('');

  // 4. Test Normalizers
  console.log('4. Testing DataNormalizer (FMP Mock):');
  const rawProfileFmp = {
    companyName: 'Apple Inc.',
    symbol: 'AAPL',
    sector: 'Technology',
    industry: 'Unknown',
    city: 'Cupertino',
    country: 'US',
    fullTimeEmployees: 164000
  };
  const normProfile = normalizeProfile('fmp', rawProfileFmp, 'AAPL');
  const passProfile = normProfile && normProfile.name === 'Apple Inc.' && normProfile.employees === '164000';
  console.log(`  - Normalize Profile: ${passProfile ? '✅ PASS' : '❌ FAIL'}`, normProfile);

  const rawFinanceFmp = {
    profile: { mktCap: 3010000000000, currency: 'USD' },
    ratios: { priceToEarningsRatioTTM: 31.2, grossProfitMarginTTM: 0.455 },
    income: { revenue: 383300000000, netIncome: 97000000000, eps: 6.13 }
  };
  const normFinance = normalizeFinance('fmp', rawFinanceFmp, 'AAPL', { currency: 'USD' });
  const passFinance = normFinance && normFinance.marketCap === '$3.01T' && normFinance.peRatio === '31.20' && normFinance.grossMargin === '45.50%';
  console.log(`  - Normalize Finance: ${passFinance ? '✅ PASS' : '❌ FAIL'}`, normFinance);
  console.log('');

  // 5. Test CompanyResolver Async
  console.log('5. Testing CompanyResolver.resolve():');
  try {
    const resolved = await resolve('Sonata');
    const passResolve = resolved.symbol === 'SONATSOFTW.NS' && resolved.registry === false;
    console.log(`  - Resolve "Sonata" -> Symbol: "${resolved.symbol}", Registry: ${resolved.registry} | ${passResolve ? '✅ PASS' : '❌ FAIL'}`);
  } catch (err) {
    console.log(`  - Resolve "Sonata" failed: ${err.message} | ❌ FAIL`);
  }

  console.log('\n=== Verification Run Complete ===');
}

runTests();
