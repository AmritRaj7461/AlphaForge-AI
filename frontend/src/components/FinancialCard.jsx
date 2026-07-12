/**
 * FinancialCard — premium metrics board with 3 pillar columns and inline sparklines.
 * Mathematically correct: progress bars are ONLY shown for percentage metrics (margins, returns, growth).
 * Fully theme-aware with CSS variables.
 */
import React from 'react';
import { motion } from 'framer-motion';

const PILLARS = [
  {
    key: 'valuation',
    title: 'Size & Valuation',
    color: '#06b6d4',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    key: 'margins',
    title: 'Margins & Returns',
    color: '#f59e0b',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    key: 'growth',
    title: 'Growth & Solvency',
    color: '#10b981',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
  },
];

function parsePct(str) {
  if (!str) return null;
  const n = parseFloat(str.replace(/[^0-9.-]/g, ''));
  return isNaN(n) ? null : Math.min(Math.max(n, 0), 100);
}

// Sparkline SVGs based on trend type (leaves margin on right/bottom to prevent cut-off look)
const SPARK_UP = (
  <svg className="w-10 h-5 text-emerald-500 overflow-visible" viewBox="0 0 40 20" fill="none">
    <defs>
      <linearGradient id="glow-up" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path d="M2,16 C 12,14 18,8 36,4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2,16 C 12,14 18,8 36,4 L36,18 L2,18 Z" fill="url(#glow-up)" />
  </svg>
);

const SPARK_DOWN = (
  <svg className="w-10 h-5 text-red-500 overflow-visible" viewBox="0 0 40 20" fill="none">
    <defs>
      <linearGradient id="glow-down" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path d="M2,4 C 12,6 18,12 36,16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2,4 C 12,6 18,12 36,16 L36,18 L2,18 Z" fill="url(#glow-down)" />
  </svg>
);

const SPARK_FLAT = (
  <svg className="w-10 h-5 text-slate-400 overflow-visible" viewBox="0 0 40 20" fill="none">
    <defs>
      <linearGradient id="glow-flat" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.15" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.0" />
      </linearGradient>
    </defs>
    <path d="M2,10 L12,8 L22,12 L32,9 L36,10" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2,10 L12,8 L22,12 L32,9 L36,10 L36,18 L2,18 Z" fill="url(#glow-flat)" />
  </svg>
);

function getSparkline(label, value) {
  if (!value || value === 'N/A' || value === 'Data unavailable') return null;

  const valLower = String(value).toLowerCase();
  
  if (label.includes('Growth')) {
    return valLower.startsWith('+') ? SPARK_UP : SPARK_DOWN;
  }
  if (label.includes('Margin') || label.includes('Return')) {
    const num = parseFloat(valLower.replace(/[^0-9.-]/g, ''));
    if (!isNaN(num)) {
      if (num >= 15) return SPARK_UP;
      if (num <= 5) return SPARK_DOWN;
    }
  }
  if (label.includes('P/E')) {
    const num = parseFloat(valLower);
    if (!isNaN(num)) {
      if (num > 40) return SPARK_DOWN;
      if (num < 25) return SPARK_UP;
    }
  }
  if (label.includes('Net Income') || label.includes('Cash Flow')) {
    return valLower.includes('-') ? SPARK_DOWN : SPARK_UP;
  }

  return SPARK_FLAT;
}

function Metric({ label, value, highlight, progress }) {
  const ok = value && value !== 'N/A' && value !== 'Data unavailable';
  const spark = getSparkline(label, value);
  const showProgress = ok && progress !== undefined && progress !== null;

  return (
    <div
      className="p-3 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md relative overflow-hidden flex flex-col justify-between h-[96px]"
      style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Top section: Label + Sparkline with fixed height to absorb label wrapping */}
      <div className="flex justify-between items-start w-full h-[36px] overflow-hidden">
        <p className="metric-header leading-tight pr-1">{label}</p>
        {ok && spark && <div className="opacity-90 shrink-0">{spark}</div>}
      </div>

      {/* Bottom section: Value + optional progress bar */}
      <div className="w-full">
        <p
          className="text-base font-bold font-mono leading-none tracking-tight"
          style={{ color: !ok ? 'var(--text-muted)' : highlight ? 'var(--green)' : 'var(--text-primary)' }}
        >
          {value || 'N/A'}
        </p>

        {showProgress ? (
          <div className="mt-2 h-1 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{ background: highlight ? 'linear-gradient(90deg,var(--green),var(--teal))' : 'var(--text-secondary)' }}
            />
          </div>
        ) : (
          /* Blank spacer to maintain exactly identical alignment when progress bar is absent */
          <div className="h-1 mt-2" />
        )}
      </div>
    </div>
  );
}

function PillarGroup({ pillar, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 pb-2.5 mb-3" style={{ borderBottom: '1px solid var(--border)' }}>
        <span style={{ color: pillar.color }}>{pillar.icon}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--text-muted)' }}>
          {pillar.title}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2.5">{children}</div>
    </div>
  );
}

export default function FinancialCard({ financials }) {
  if (!financials) return null;
  const f = financials;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.05 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--green)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
          </svg>
          Financial Pillars
        </h2>
        <span
          className="text-[10px] font-mono px-2.5 py-1 rounded"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
        >
          Trailing Twelve Months
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <PillarGroup pillar={PILLARS[0]}>
          <Metric label="Market Cap"     value={f.marketCap}  highlight />
          <Metric label="P/E Ratio"      value={f.peRatio} />
          <Metric label="Revenue (TTM)"  value={f.revenue} />
          <Metric label="Net Income"     value={f.netIncome} />
        </PillarGroup>

        <PillarGroup pillar={PILLARS[1]}>
          <Metric label="Gross Margin"   value={f.grossMargin} progress={parsePct(f.grossMargin)} />
          <Metric label="Profit Margin"  value={f.profitMargin} progress={parsePct(f.profitMargin)} />
          <Metric label="Return on Eq."  value={f.roe} progress={parsePct(f.roe)} />
          <Metric label="Return on Ass." value={f.roa} progress={parsePct(f.roa)} />
        </PillarGroup>

        <PillarGroup pillar={PILLARS[2]}>
          <Metric label="Revenue Growth" value={f.revenueGrowth} highlight={f.revenueGrowth?.startsWith('+')} progress={parsePct(f.revenueGrowth)} />
          <Metric label="Cash Flow"      value={f.cashFlow} />
          <Metric label="EPS"            value={f.eps} />
          <Metric label="Long-term Debt" value={f.debt} />
        </PillarGroup>
      </div>
    </motion.div>
  );
}
