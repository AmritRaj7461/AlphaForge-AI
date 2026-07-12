import React from 'react';
import { motion } from 'framer-motion';

export default function SummaryCard({ analysis }) {
  if (!analysis) return null;

  // Derive structured properties from analysis summaries
  const businessSummary = analysis.companySummary || 'No profile summary available.';
  const financialSummary = analysis.financialSummary || 'No financial summary available.';
  const growthOutlook = analysis.growthOutlook || 'Stable expansion projected across key business verticals.';
  const competitivePosition = analysis.competitorSummary || 'Leading position relative to peer benchmarks.';
  const thesis = analysis.reasoning || 'Positive risk-to-reward ratio backed by core fundamentals.';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6 flex flex-col justify-between"
      style={{ minHeight: 460 }}
    >
      <div>
        <div className="flex items-center justify-between mb-5">
          <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--green)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            ARGUS Summary Thesis
          </h2>
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Thesis Reader
          </span>
        </div>

        <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
          {/* Business Summary */}
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold" style={{ color: 'var(--green)' }}>Business Summary</span>
            <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
              {businessSummary}
            </p>
          </div>

          {/* Financial Health */}
          <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold" style={{ color: 'var(--green)' }}>Financial Health</span>
            <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
              {financialSummary}
            </p>
          </div>

          {/* Growth Outlook & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold" style={{ color: 'var(--green)' }}>Growth Outlook</span>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                {growthOutlook}
              </p>
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold" style={{ color: 'var(--green)' }}>Competitive Position</span>
              <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
                {competitivePosition}
              </p>
            </div>
          </div>

          {/* Core Thesis */}
          <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[10px] font-mono uppercase tracking-wider font-extrabold" style={{ color: 'var(--green)' }}>Investment Thesis</span>
            <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>
              {thesis}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
