/**
 * Company Registry
 * Central registry mapping aliases to canonical tickers, and storing static profiles
 * and financial metrics for pre-defined curated companies.
 */

const ALIASES = {
  'apple': 'AAPL',
  'aapl': 'AAPL',
  'apple inc': 'AAPL',
  'apple inc.': 'AAPL',
  'microsoft': 'MSFT',
  'msft': 'MSFT',
  'microsoft corporation': 'MSFT',
  'google': 'GOOGL',
  'googl': 'GOOGL',
  'alphabet': 'GOOGL',
  'alphabet inc.': 'GOOGL',
  'nvidia': 'NVDA',
  'nvda': 'NVDA',
  'nvidia corporation': 'NVDA',
  'amazon': 'AMZN',
  'amzn': 'AMZN',
  'amazon.com': 'AMZN',
  'amazon.com, inc.': 'AMZN',
  'tesla': 'TSLA',
  'tsla': 'TSLA',
  'tesla, inc.': 'TSLA',
  'meta': 'META',
  'meta platforms': 'META',
  'meta platforms, inc.': 'META',
  'netflix': 'NFLX',
  'nflx': 'NFLX',
  'netflix, inc.': 'NFLX',
  'samsung': '005930.KS',
  'samsung electronics': '005930.KS',
  'berkshire': 'BRK.B',
  'berkshire hathaway': 'BRK.B',
  'brk.b': 'BRK.B',
  'jpmorgan': 'JPM',
  'jpm': 'JPM',
  'jpmorgan chase': 'JPM',
  'jpmorgan chase & co.': 'JPM',
  'tata consultancy services': 'TCS.BSE',
  'tcs': 'TCS.BSE',
  'tcs.bse': 'TCS.BSE',
  'tcs.nse': 'TCS.BSE',
  'sonata': 'SONATSOFTW.NS',
  'sonata software': 'SONATSOFTW.NS',
  'sonatsoftw.ns': 'SONATSOFTW.NS',
  'paytm': 'PAYTM.BO',
  'paytm.bo': 'PAYTM.BO',
  'paytm.ns': 'PAYTM.BO',
  'reliance': 'RELIANCE.NS',
  'reliance industries': 'RELIANCE.NS',
  'reliance industries limited': 'RELIANCE.NS',
  'relaince': 'RELIANCE.NS',
  'infosys': 'INFY.NS',
  'infy.ns': 'INFY.NS'
};

const REGISTRY = {
  AAPL: {
    profile: {
      name: 'Apple Inc.',
      ticker: 'AAPL',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      headquarters: 'Cupertino, California, USA',
      website: 'https://www.apple.com',
      description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories. Products include iPhone, Mac, iPad, Apple Watch, Apple TV, and services including the App Store, Apple Music, iCloud, and Apple Pay.'
    },
    financials: {
      revenue: '$383.3B',
      netIncome: '$97.0B',
      eps: '$6.13',
      peRatio: '31.2',
      roe: '171.9%',
      roa: '28.3%',
      marketCap: '$3.01T',
      debt: '$108.0B',
      cashFlow: '$113.5B',
      revenueGrowth: '+2.0%',
      grossMargin: '45.5%',
      profitMargin: '25.3%',
      dividendYield: '0.53%',
      beta: '1.24'
    }
  },
  MSFT: {
    profile: {
      name: 'Microsoft Corporation',
      ticker: 'MSFT',
      sector: 'Technology',
      industry: 'Software—Infrastructure',
      headquarters: 'Redmond, Washington, USA',
      website: 'https://www.microsoft.com',
      description: 'Microsoft Corporation develops, licenses, and supports software, services, devices, and solutions worldwide including Windows, Microsoft 365, Azure cloud platform, LinkedIn, and Xbox gaming.'
    },
    financials: {
      revenue: '$245.1B',
      netIncome: '$88.1B',
      eps: '$11.80',
      peRatio: '36.8',
      roe: '39.2%',
      roa: '19.7%',
      marketCap: '$3.30T',
      debt: '$49.6B',
      cashFlow: '$89.0B',
      revenueGrowth: '+16.0%',
      grossMargin: '69.8%',
      profitMargin: '35.9%',
      dividendYield: '0.72%',
      beta: '0.90'
    }
  },
  GOOGL: {
    profile: {
      name: 'Alphabet Inc.',
      ticker: 'GOOGL',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      headquarters: 'Mountain View, California, USA',
      website: 'https://www.alphabet.com',
      description: 'Alphabet Inc. provides online advertising services through Google Search, YouTube, and the Google Network. Also operates Google Cloud, Waymo autonomous vehicles, and DeepMind AI research.'
    },
    financials: {
      revenue: '$339.0B',
      netIncome: '$100.1B',
      eps: '$8.04',
      peRatio: '22.8',
      roe: '32.1%',
      roa: '19.4%',
      marketCap: '$2.30T',
      debt: '$29.6B',
      cashFlow: '$94.7B',
      revenueGrowth: '+14.0%',
      grossMargin: '57.0%',
      profitMargin: '29.5%',
      dividendYield: '0.50%',
      beta: '1.03'
    }
  },
  NVDA: {
    profile: {
      name: 'NVIDIA Corporation',
      ticker: 'NVDA',
      sector: 'Technology',
      industry: 'Semiconductors',
      headquarters: 'Santa Clara, California, USA',
      website: 'https://www.nvidia.com',
      description: 'NVIDIA Corporation provides graphics processing units (GPUs) for gaming, professional visualization, data centers, and automotive markets. A global leader in AI computing hardware and the CUDA software platform.'
    },
    financials: {
      revenue: '$130.5B',
      netIncome: '$72.9B',
      eps: '$29.76',
      peRatio: '52.4',
      roe: '123.8%',
      roa: '55.6%',
      marketCap: '$3.25T',
      debt: '$8.7B',
      cashFlow: '$60.8B',
      revenueGrowth: '+122.4%',
      grossMargin: '75.0%',
      profitMargin: '55.9%',
      dividendYield: '0.03%',
      beta: '1.67'
    }
  },
  AMZN: {
    profile: {
      name: 'Amazon.com, Inc.',
      ticker: 'AMZN',
      sector: 'Consumer Cyclical',
      industry: 'Internet Retail',
      headquarters: 'Seattle, Washington, USA',
      website: 'https://www.amazon.com',
      description: 'Amazon.com operates as an e-commerce, cloud computing (AWS), digital streaming, and AI company with segments including North America retail, International retail, and Amazon Web Services.'
    },
    financials: {
      revenue: '$590.7B',
      netIncome: '$59.2B',
      eps: '$5.53',
      peRatio: '43.1',
      roe: '22.0%',
      roa: '7.8%',
      marketCap: '$2.02T',
      debt: '$143.7B',
      cashFlow: '$84.9B',
      revenueGrowth: '+11.0%',
      grossMargin: '47.6%',
      profitMargin: '9.3%',
      dividendYield: 'N/A',
      beta: '1.16'
    }
  },
  TSLA: {
    profile: {
      name: 'Tesla, Inc.',
      ticker: 'TSLA',
      sector: 'Consumer Cyclical',
      industry: 'Auto Manufacturers',
      headquarters: 'Austin, Texas, USA',
      website: 'https://www.tesla.com',
      description: 'Tesla, Inc. designs, develops, manufactures, leases, and sells electric vehicles, energy generation and storage systems. Products include Model S, 3, X, Y, Cybertruck, and energy storage solutions.'
    },
    financials: {
      revenue: '$97.7B',
      netIncome: '$7.9B',
      eps: '$2.29',
      peRatio: '78.5',
      roe: '10.5%',
      roa: '5.4%',
      marketCap: '$1.13T',
      debt: '$8.6B',
      cashFlow: '$14.9B',
      revenueGrowth: '-1.1%',
      grossMargin: '18.2%',
      profitMargin: '7.3%',
      dividendYield: 'N/A',
      beta: '2.05'
    }
  },
  META: {
    profile: {
      name: 'Meta Platforms, Inc.',
      ticker: 'META',
      sector: 'Communication Services',
      industry: 'Internet Content & Information',
      headquarters: 'Menlo Park, California, USA',
      website: 'https://www.meta.com',
      description: 'Meta Platforms develops products enabling people to connect through mobile devices, PCs, and VR headsets. Products include Facebook, Instagram, WhatsApp, Messenger, and Reality Labs.'
    },
    financials: {
      revenue: '$156.2B',
      netIncome: '$59.6B',
      eps: '$23.86',
      peRatio: '29.1',
      roe: '36.7%',
      roa: '22.5%',
      marketCap: '$1.54T',
      debt: '$28.8B',
      cashFlow: '$71.1B',
      revenueGrowth: '+22.0%',
      grossMargin: '81.5%',
      profitMargin: '38.3%',
      dividendYield: '0.33%',
      beta: '1.22'
    }
  },
  NFLX: {
    profile: {
      name: 'Netflix, Inc.',
      ticker: 'NFLX',
      sector: 'Communication Services',
      industry: 'Entertainment',
      headquarters: 'Los Gatos, California, USA',
      website: 'https://www.netflix.com',
      description: 'Netflix, Inc. provides subscription streaming entertainment with TV series, documentaries, feature films, and games in multiple languages across 190+ countries.'
    },
    financials: {
      revenue: '$39.0B',
      netIncome: '$7.0B',
      eps: '$16.59',
      peRatio: '51.2',
      roe: '36.3%',
      roa: '11.6%',
      marketCap: '$395B',
      debt: '$14.5B',
      cashFlow: '$6.9B',
      revenueGrowth: '+15.0%',
      grossMargin: '46.2%',
      profitMargin: '17.0%',
      dividendYield: 'N/A',
      beta: '1.26'
    }
  },
  'TCS.BSE': {
    profile: {
      name: 'Tata Consultancy Services Limited',
      ticker: 'TCS.BSE',
      sector: 'Technology',
      industry: 'Information Technology Services',
      headquarters: 'Mumbai, Maharashtra, India',
      website: 'https://www.tcs.com',
      description: 'Tata Consultancy Services Limited (TCS) is an Indian multinational information technology services and consulting company headquartered in Mumbai. It is a part of the Tata Group and operates in 150 locations across 46 countries.'
    },
    financials: {
      revenue: '₹2.41T',
      netIncome: '₹460.9B',
      eps: '₹125.80',
      peRatio: '28.5',
      roe: '51.4%',
      roa: '28.1%',
      marketCap: '₹14.8T',
      debt: '₹80.5B',
      cashFlow: '₹420.5B',
      revenueGrowth: '+7.2%',
      grossMargin: '40.2%',
      profitMargin: '19.1%',
      dividendYield: '3.10%',
      beta: '0.65'
    }
  },
  '005930.KS': {
    profile: {
      name: 'Samsung Electronics Co., Ltd.',
      ticker: '005930.KS',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      headquarters: 'Suwon-si, Gyeonggi-do, South Korea',
      website: 'https://www.samsung.com',
      description: 'Samsung Electronics Co., Ltd. manufactures and sells consumer electronics, information technology, mobile communications, and device solutions worldwide.'
    },
    financials: {
      revenue: '₩258.9T',
      netIncome: '₩15.4T',
      eps: '₩2131.00',
      peRatio: '32.4',
      roe: '5.4%',
      roa: '4.1%',
      marketCap: '₩385.2T',
      debt: '₩18.4T',
      cashFlow: '₩42.5T',
      revenueGrowth: '+6.5%',
      grossMargin: '34.2%',
      profitMargin: '5.9%',
      dividendYield: '2.15%',
      beta: '1.10'
    }
  },
  'BRK.B': {
    profile: {
      name: 'Berkshire Hathaway Inc.',
      ticker: 'BRK.B',
      sector: 'Financial Services',
      industry: 'Insurance—Diversified',
      headquarters: 'Omaha, Nebraska, USA',
      website: 'https://www.berkshirehathaway.com',
      description: 'Berkshire Hathaway is a conglomerate holding company with subsidiaries in insurance, utilities, energy, transportation, manufacturing, and retail.'
    },
    financials: {
      revenue: '$364.5B',
      netIncome: '$96.2B',
      eps: '$15.82',
      peRatio: '18.5',
      roe: '18.1%',
      roa: '9.4%',
      marketCap: '$880B',
      debt: '$120B',
      cashFlow: '$49.2B',
      revenueGrowth: '+20.5%',
      grossMargin: '18.9%',
      profitMargin: '26.4%',
      dividendYield: 'N/A',
      beta: '0.85'
    }
  },
  'JPM': {
    profile: {
      name: 'JPMorgan Chase & Co.',
      ticker: 'JPM',
      sector: 'Financial Services',
      industry: 'Banks—Diversified',
      headquarters: 'New York, New York, USA',
      website: 'https://www.jpmorganchase.com',
      description: 'JPMorgan Chase is a global financial services firm offering investment banking, commercial banking, financial transaction processing, and consumer banking.'
    },
    financials: {
      revenue: '$158.1B',
      netIncome: '$49.6B',
      eps: '$16.20',
      peRatio: '11.8',
      roe: '17.2%',
      roa: '1.2%',
      marketCap: '$580B',
      debt: '$320B',
      cashFlow: '$38.2B',
      revenueGrowth: '+7.4%',
      grossMargin: '100%',
      profitMargin: '31.3%',
      dividendYield: '2.50%',
      beta: '1.11'
    }
  }
};

/**
 * Returns canonical ticker from alias
 * @param {string} alias - Company name/alias
 * @returns {string|null} Canonical ticker
 */
const getTickerFromAlias = (alias) => {
  if (!alias) return null;
  return ALIASES[alias.trim().toLowerCase()] || null;
};

/**
 * Returns registry entry for canonical ticker
 * @param {string} ticker - Canonical ticker
 * @returns {object|null} Registry entry
 */
const getRegistryEntry = (ticker) => {
  if (!ticker) return null;
  return REGISTRY[ticker.toUpperCase()] || null;
};

module.exports = {
  ALIASES,
  REGISTRY,
  getTickerFromAlias,
  getRegistryEntry
};
