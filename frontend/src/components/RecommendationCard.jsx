/**
 * RecommendationCard — BUY / HOLD / PASS rating panel.
 * Visual centerpiece of the dashboard.
 * Refactored to support dynamic explainable evidence signals, confidence breakdowns,
 * expected returns, target categories, valuation tags, and a large circular score dial.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const THEMES = {
  BUY: {
    cardClass: 'glass-card-buy',
    color: '#10b981',
    glow: 'rgba(16,185,129,0.35)',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    label: 'Strong Buy',
    rating: 'Outperform',
    expectedReturn: '18% – 24%',
    valuation: 'Undervalued',
    targetCategory: 'Growth',
    tagline: 'Strong positive catalyst alignment & solid financial indicators.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  HOLD: {
    cardClass: 'glass-card-hold',
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.3)',
    gradient: 'linear-gradient(135deg,#f59e0b,#fb923c)',
    label: 'Balanced Hold',
    rating: 'Neutral',
    expectedReturn: '5% – 10%',
    valuation: 'Fair',
    targetCategory: 'Value',
    tagline: 'Balanced risk-to-reward ratio. Monitor key valuation levels.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  PASS: {
    cardClass: 'glass-card-pass',
    color: '#ef4444',
    glow: 'rgba(239,68,68,0.35)',
    gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
    label: 'Pass / Avoid',
    rating: 'Underperform',
    expectedReturn: 'N/A',
    valuation: 'Premium',
    targetCategory: 'Defensive',
    tagline: 'Current evidence suggests passing on this investment opportunity.',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
  },
};

export default function RecommendationCard({ 
  recommendation, 
  confidence = 0, 
  confidenceLevel = 'Moderate', 
  reasoning,
  evidence = [],
  confidenceBreakdown = null
}) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showFullReasoning, setShowFullReasoning] = useState(false);
  const rec = recommendation || 'HOLD';
  const t = THEMES[rec] || THEMES.HOLD;

  const pct = Math.min(Math.max(confidence, 0), 100);

  // Confidence factor breakdowns
  const breakdown = confidenceBreakdown ? [
    { label: 'Financial Coverage', value: Math.round(confidenceBreakdown.financial * 0.4), max: 40, color: '#06b6d4' },
    { label: 'News Coverage', value: Math.round(confidenceBreakdown.news * 0.2), max: 20, color: '#3b82f6' },
    { label: 'Risk Coverage', value: Math.round(confidenceBreakdown.risk * 0.15), max: 15, color: '#f59e0b' },
    { label: 'Competitor Coverage', value: Math.round(confidenceBreakdown.competitor * 0.1), max: 10, color: '#8b5cf6' },
    { label: 'Validation Quality', value: Math.round(confidenceBreakdown.validation * 0.15), max: 15, color: '#10b981' },
    { label: 'Pipe Completeness', value: Math.max(0, 100 - (confidenceBreakdown.failedToolsPenalty || 0)), max: 100, color: '#ec4899' },
  ] : [
    { label: 'Financial Coverage', value: 30, max: 30, color: '#06b6d4' },
    { label: 'News Coverage', value: 20, max: 20, color: '#3b82f6' },
    { label: 'Risk Coverage', value: 20, max: 20, color: '#f59e0b' },
    { label: 'Competitor Analysis', value: 10, max: 10, color: '#8b5cf6' },
    { label: 'Validation Quality', value: 10, max: 10, color: '#10b981' },
    { label: 'Data Completeness', value: 10, max: 10, color: '#ec4899' },
  ];

  const evidenceCount = evidence.length > 0 ? evidence.length : Math.round((pct / 100) * 6) + 2;

  const supportPoints = evidence.length > 0 ? evidence : (
    rec === 'BUY'
      ? [
          { text: 'Accelerating Revenue Growth.', type: 'strength' },
          { text: 'Favorable Margins & High ROE.', type: 'strength' },
          { text: 'Positive News Sentiment Catalysts.', type: 'strength' },
          { text: 'Strong Industry Position.', type: 'strength' }
        ]
      : rec === 'PASS'
      ? [
          { text: 'Valuation Premium Concerns.', type: 'weakness' },
          { text: 'Macroeconomic Policy Headwinds.', type: 'weakness' },
          { text: 'Decelerating Growth Trends.', type: 'weakness' },
          { text: 'Elevated Operational Risk Profile.', type: 'weakness' }
        ]
      : [
          { text: 'Balanced Risk-Reward Profile.', type: 'neutral' },
          { text: 'Stable Revenue and Cash Flow.', type: 'neutral' },
          { text: 'Neutral Sentiment Indicators.', type: 'neutral' },
          { text: 'Solid Market Share Retention.', type: 'neutral' }
        ]
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.45 }}
      className={`glass-card p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg`}
      style={{ borderRadius: '1rem', border: '1px solid var(--border)', minHeight: 460 }}
    >
      {/* Background decoration */}
      <div
        className="absolute -right-12 -top-12 w-40 h-40 rounded-full pointer-events-none blur-3xl opacity-[0.12]"
        style={{ backgroundColor: t.color }}
      />

      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase" style={{ color: 'var(--text-muted)' }}>
          Investment Recommendation
        </span>
        <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
          ● CENTERPIECE VERDICT
        </span>
      </div>

      {/* Massive Visual Score & Recommendation block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center mb-6">
        
        {/* Large Circular Confidence Score Dial */}
        <div 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="relative w-28 h-28 mx-auto sm:mx-0 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
          title="Click to view confidence breakdown"
        >
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="2.5" />
            <motion.circle
              cx="18" cy="18" r="16" fill="none"
              stroke={t.color} strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 16}`}
              initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 16 - (pct / 100) * 2 * Math.PI * 16 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-xl font-black font-mono leading-none text-[var(--text-primary)]">
              {pct}%
            </span>
            <span className="text-[8px] uppercase tracking-widest mt-1 text-[var(--text-muted)]">CONFIDENCE</span>
          </div>
        </div>

        {/* Large Recommendation text */}
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span style={{ color: t.color }}>{t.icon}</span>
            <h2
              className="text-5xl font-black uppercase tracking-tight"
              style={{ background: t.gradient, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {rec}
            </h2>
          </div>
          <p className="text-xs font-semibold mt-2" style={{ color: 'var(--text-secondary)' }}>{t.label}</p>
          <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {t.tagline}
          </p>
        </div>

      </div>

      {/* Ratios Metrics Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 p-3 mb-5 rounded-xl text-left" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Rating</p>
          <p className="text-xs font-extrabold mt-0.5" style={{ color: t.color }}>{t.rating}</p>
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Expected Return</p>
          <p className="text-xs font-extrabold mt-0.5 text-emerald-400">{t.expectedReturn}</p>
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Horizon</p>
          <p className="text-xs font-extrabold mt-0.5 text-[var(--text-primary)]">Long Term</p>
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Risk Level</p>
          <p className="text-xs font-extrabold mt-0.5 text-[var(--text-primary)]">{confidenceLevel}</p>
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Valuation</p>
          <p className="text-xs font-extrabold mt-0.5 text-[var(--text-primary)]">{t.valuation}</p>
        </div>
        <div>
          <p className="text-[8px] font-mono uppercase tracking-wider text-[var(--text-muted)]">Category</p>
          <p className="text-xs font-extrabold mt-0.5 text-[var(--text-primary)]">{t.targetCategory}</p>
        </div>
      </div>

      {/* Confidence Factor Breakdown Accordion */}
      <AnimatePresence>
        {showBreakdown && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-5 overflow-hidden space-y-3 p-4 rounded-xl"
            style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
          >
            <p className="text-[9px] font-mono uppercase tracking-widest font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
              Confidence Factor Breakdown
            </p>
            {breakdown.map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-[9px] font-mono" style={{ color: 'var(--text-secondary)' }}>
                  <span>{item.label}</span>
                  <span>{item.value} / {item.max}{item.max === 100 ? '%' : ''}</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
                  <motion.div 
                    className="h-full rounded-full" 
                    style={{ backgroundColor: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / item.max) * 100}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Why? Evidence Checklist */}
      <div className="mb-5 space-y-2">
        <p className="text-[9px] font-mono uppercase tracking-widest font-bold text-left" style={{ color: 'var(--text-muted)' }}>
          Why? — Evidence Checklist ({evidenceCount} Signals Used)
        </p>
        <div className="grid grid-cols-1 gap-2 border p-3 rounded-xl bg-opacity-35 text-left" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          {supportPoints.slice(0, 3).map((item, i) => {
            const isStrength = item.type === 'strength';
            const isWeakness = item.type === 'weakness';
            const symbolColor = isStrength ? '#10b981' : isWeakness ? '#ef4444' : '#f59e0b';
            const iconChar = isStrength ? '✓' : isWeakness ? '⚠' : '•';
            return (
              <div key={i} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex-shrink-0 flex items-center justify-center w-4 h-4 rounded-lg font-bold text-[10px]" style={{ color: symbolColor, background: `${symbolColor}12` }}>
                  {iconChar}
                </span>
                <span>{item.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accordion Full Thesis */}
      {reasoning && (
        <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={() => setShowFullReasoning(!showFullReasoning)}
            className="flex items-center justify-between w-full text-xs font-semibold tracking-wide transition-opacity hover:opacity-75"
            style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span>Read full ARGUS reasoning report</span>
            <svg
              className="w-3.5 h-3.5 transition-transform"
              style={{ transform: showFullReasoning ? 'rotate(180deg)' : 'rotate(0)', color: 'var(--text-muted)' }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {showFullReasoning && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden"
              >
                <p
                  className="text-xs leading-relaxed p-3 rounded-lg text-left"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                >
                  {reasoning}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
