import React from 'react';
import { motion } from 'framer-motion';

export default function LimitationsCard({ limitations }) {
  const items = limitations?.length > 0 ? limitations : [
    'Model output represents historical financial patterns and does not guarantee future market returns.',
    'Data feeds are subject to regulatory reporting latency of primary exchange disclosures.',
    'Valuation multiples do not account for unannounced corporate restructurings.'
  ];

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
          <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--gold)' }}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Analysis Limitations & Disclaimers
          </h2>
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
            Compliance Disclaimers
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 max-h-[270px] overflow-y-auto pr-1 custom-scrollbar">
          {items.map((lim, idx) => (
            <div 
              key={idx} 
              className="p-3.5 rounded-xl text-xs leading-relaxed transition-all duration-150 border"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-[10px] font-mono font-bold uppercase" style={{ color: 'var(--gold)' }}>Compliance Warning #{idx + 1}</span>
              </div>
              <span style={{ color: 'var(--text-secondary)' }}>{lim}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
