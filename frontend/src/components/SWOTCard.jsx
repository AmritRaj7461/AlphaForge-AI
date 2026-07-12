/**
 * SWOTCard — 2×2 SWOT matrix showing exactly 2 static points per quadrant.
 * Formatted and scaled to fit the 460px height constraint perfectly without overflow.
 */
import React from 'react';
import { motion } from 'framer-motion';

const QUADS = {
  strengths: {
    label: 'Strengths',
    color: '#10b981',
    panelClass: 'swot-strengths-premium',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  weaknesses: {
    label: 'Weaknesses',
    color: '#ef4444',
    panelClass: 'swot-weaknesses-premium',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
      </svg>
    ),
  },
  opportunities: {
    label: 'Opportunities',
    color: '#06b6d4',
    panelClass: 'swot-opportunities-premium',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  threats: {
    label: 'Threats',
    color: '#f59e0b',
    panelClass: 'swot-threats-premium',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

function Quadrant({ type, items, delay }) {
  const q = QUADS[type];
  if (!q) return null;
  
  // Show exactly 2 points per quadrant
  const list = (Array.isArray(items) ? items : []).slice(0, 2);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay }}
      className={`swot-panel ${q.panelClass} transition-all duration-300`}
      style={{ padding: '10px 12px', minHeight: '135px', maxHeight: '145px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <span style={{ color: q.color }}>{q.icon}</span>
        <h3 className="text-[9px] font-bold uppercase tracking-wider text-left font-mono" style={{ color: q.color }}>
          {q.label}
        </h3>
      </div>

      <ul className="space-y-1 text-left flex-1 flex flex-col justify-center overflow-hidden">
        {list.length === 0 && (
          <li className="text-[10px] italic" style={{ color: 'var(--text-muted)' }}>No data available</li>
        )}
        {list.map((item, i) => (
          <li key={i} className="flex items-start gap-1 text-[10px] leading-normal" style={{ color: 'var(--text-secondary)' }}>
            <span className="shrink-0 text-[8px]" style={{ color: q.color }}>▸</span>
            <span className="line-clamp-3">{item}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

export default function SWOTCard({ swot }) {
  if (!swot) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-5 flex flex-col justify-between"
      style={{ minHeight: 460, maxHeight: 460 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--green)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          SWOT Matrix
        </h2>
        <span className="text-[8px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Primary Insights
        </span>
      </div>

      {/* Grid container sized to fit the card exactly without overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 flex-1 items-stretch">
        <Quadrant type="strengths"    items={swot.strengths}    delay={0.05} />
        <Quadrant type="weaknesses"   items={swot.weaknesses}   delay={0.10} />
        <Quadrant type="opportunities" items={swot.opportunities} delay={0.15} />
        <Quadrant type="threats"      items={swot.threats}      delay={0.20} />
      </div>
    </motion.div>
  );
}
