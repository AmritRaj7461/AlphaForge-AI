import React from 'react';
import { motion } from 'framer-motion';

export default function FinalDecisionCard({ recommendation, confidence, confidenceLevel }) {
  const rec = recommendation || 'HOLD';
  const score = Math.round(confidence || 75);
  
  // Dynamic metrics based on recommendation
  const expectedReturn = rec === 'BUY' ? '18% – 24%' : rec === 'HOLD' ? '5% – 10%' : 'N/A';
  const horizon = '12 – 18 Months';
  const risk = confidenceLevel || 'Medium';

  const reasons = rec === 'BUY' ? [
    'Sustained industry tailwinds & secular demand growth.',
    'Robust operating margins & high return on equity (ROE).',
    'Positive momentum with supportive news flows.'
  ] : rec === 'PASS' ? [
    'Significant valuation premiums limiting upside potential.',
    'Macroeconomic challenges impacting immediate sector earnings.',
    'Elevated debt levels increasing overall leverage risk.'
  ] : [
    'Fair market valuation balancing growth and margin safety.',
    'Consistent cash flows providing dividend downside protection.',
    'Moderate revenue outlook without clear catalysts.'
  ];

  const risks = rec === 'BUY' ? [
    'Execution risks in scaling international operations.',
    'Regulatory shifts impacting core software services.'
  ] : [
    'Margin pressure from rising input prices & competition.',
    'Potential interest rate hikes impacting valuation multiples.'
  ];

  const suitable = rec === 'BUY' ? 'Growth-focused long term equity portfolios' : 'Income & value investors seeking steady defensive yield';
  const unsuitable = rec === 'BUY' ? 'Short-term risk-averse wealth preservation accounts' : 'Aggressive growth funds aiming for rapid capital appreciation';

  const recColor = rec === 'BUY' ? 'var(--green)' : rec === 'HOLD' ? 'var(--gold)' : 'var(--red)';
  const recBg = rec === 'BUY' ? 'var(--green-dim)' : rec === 'HOLD' ? 'rgba(245,158,11,0.06)' : 'rgba(239,68,68,0.06)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 flex flex-col justify-between"
      style={{ minHeight: 380 }}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: recColor }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Final Investment Decision
          </h2>
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Institutional Verdict
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Circular Visual Verdict Left */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 rounded-xl border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
            <span className="text-[9px] font-mono uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>VERDICT STATUS</span>
            <div className="text-2xl font-black mt-2 uppercase tracking-wide px-4 py-1.5 rounded-full" style={{ color: recColor, backgroundColor: recBg, border: `1px solid ${recColor}20` }}>
              {rec}
            </div>
            
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-[var(--text-primary)]">{score}%</span>
              <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">Confidence</span>
            </div>
            
            <div className="w-full mt-4 h-1 rounded-full overflow-hidden bg-slate-800">
              <div className="h-full rounded-full" style={{ backgroundColor: recColor, width: `${score}%` }} />
            </div>
          </div>

          {/* Structured Verdict Right */}
          <div className="md:col-span-8 space-y-4">
            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3 text-left">
              <div>
                <span className="text-[8px] font-mono uppercase text-[var(--text-muted)]">Horizon</span>
                <span className="text-xs font-bold block mt-0.5" style={{ color: 'var(--text-primary)' }}>{horizon}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-[var(--text-muted)]">Expected Return</span>
                <span className="text-xs font-bold block mt-0.5 text-emerald-400">{expectedReturn}</span>
              </div>
              <div>
                <span className="text-[8px] font-mono uppercase text-[var(--text-muted)]">Expected Risk</span>
                <span className="text-xs font-bold block mt-0.5" style={{ color: 'var(--text-primary)' }}>{risk}</span>
              </div>
            </div>

            {/* Reasons/Risks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left border-t pt-3" style={{ borderColor: 'var(--border)' }}>
              <div>
                <span className="text-[9px] font-mono uppercase font-bold text-emerald-400">Primary Catalysts</span>
                <ul className="text-[11px] leading-relaxed mt-1.5 list-disc list-inside space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  {reasons.slice(0, 2).map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
              <div>
                <span className="text-[9px] font-mono uppercase font-bold text-red-400">Key Risks</span>
                <ul className="text-[11px] leading-relaxed mt-1.5 list-disc list-inside space-y-1" style={{ color: 'var(--text-secondary)' }}>
                  {risks.map((r, idx) => <li key={idx}>{r}</li>)}
                </ul>
              </div>
            </div>

            {/* Suitability */}
            <div className="border-t pt-3 space-y-2 text-left" style={{ borderColor: 'var(--border)' }}>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] font-mono uppercase font-bold text-emerald-400">Target Buyer:</span>
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{suitable}</span>
              </div>
              <div className="flex gap-2 items-center">
                <span className="text-[9px] font-mono uppercase font-bold text-red-400">Avoid Category:</span>
                <span className="text-[11px]" style={{ color: 'var(--text-secondary)' }}>{unsuitable}</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  );
}
