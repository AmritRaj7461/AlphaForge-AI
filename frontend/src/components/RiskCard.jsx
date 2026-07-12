/**
 * RiskCard — multi-factor risk analysis panel with visual severity meters.
 * Fully theme-aware with CSS variables.
 */
import React from 'react';
import { motion } from 'framer-motion';

const LEVEL_STYLE = {
  Low:      { color: 'var(--green)', bg: 'var(--green-dim)', meter: '■■□□□' },
  Moderate: { color: 'var(--gold)',  bg: 'var(--gold-dim)',  meter: '■■■□□' },
  Elevated: { color: '#fb923c',      bg: 'rgba(251,146,60,0.1)', meter: '■■■■□' },
  High:     { color: 'var(--red)',   bg: 'var(--red-dim)',   meter: '■■■■■' },
};

function getSeverity(label, value) {
  if (!value) return LEVEL_STYLE.Moderate;
  const valLower = String(value).toLowerCase();
  if (valLower.includes('high') || valLower.includes('severe') || valLower.includes('critical')) {
    return LEVEL_STYLE.High;
  }
  if (valLower.includes('elevated') || valLower.includes('warning') || valLower.includes('substantial')) {
    return LEVEL_STYLE.Elevated;
  }
  if (valLower.includes('low') || valLower.includes('stable') || valLower.includes('healthy') || valLower.includes('minimal')) {
    return LEVEL_STYLE.Low;
  }
  return LEVEL_STYLE.Moderate;
}

function RiskRow({ label, value, index, isOverall }) {
  if (isOverall) {
    const s = LEVEL_STYLE[value] || LEVEL_STYLE.Moderate;
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.05 }}
        className="flex items-center justify-between pt-4 mt-4"
        style={{ borderTop: '1px solid var(--border)' }}
      >
        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono opacity-85" style={{ color: s.color }}>{s.meter}</span>
          <span
            className="text-[10px] font-bold font-mono px-2.5 py-1 rounded-full"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.color}40` }}
          >
            {value}
          </span>
        </div>
      </motion.div>
    );
  }

  const sev = getSeverity(label, value);

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="py-3 transition-all duration-200"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full shrink-0 animate-pulse-slow" style={{ background: sev.color }} />
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>
            {label}
          </span>
        </div>
        <span className="text-xs font-mono tracking-wider font-semibold" style={{ color: sev.color }}>
          {sev.meter}
        </span>
      </div>
      <p className="text-xs leading-relaxed pl-3.5" style={{ color: 'var(--text-secondary)' }}>
        {value}
      </p>
    </motion.div>
  );
}

export default function RiskCard({ risk, analysis }) {
  if (!risk) return (
    <div className="glass-card p-6">
      <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Risk Analysis</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Risk data unavailable.</p>
    </div>
  );

  const rows = [
    { label: 'Business Risk',      value: risk.businessRisk },
    { label: 'Financial Risk',     value: risk.financialRisk },
    { label: 'Operational Risk',   value: risk.operationalRisk },
    { label: 'Macroeconomic Risk', value: risk.macroRisk },
    { label: 'Overall Risk Level', value: risk.overallRisk, isOverall: true },
  ].filter(r => r.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--gold)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Risk Analysis
        </h2>
        <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Multi-Factor Audit
        </span>
      </div>

      <div className="divide-y divide-transparent">
        {rows.map((row, i) => (
          <RiskRow key={row.label} {...row} index={i} />
        ))}
      </div>

      {analysis?.riskSummary && (
        <div
          className="mt-5 p-3 rounded-lg text-xs leading-relaxed"
          style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
        >
          <p className="text-[9px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
            ARGUS Summary
          </p>
          {analysis.riskSummary}
        </div>
      )}
    </motion.div>
  );
}
