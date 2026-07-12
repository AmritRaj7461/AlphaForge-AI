/**
 * CompanyCard — Company overview with theme-aware styling.
 */
import React from 'react';
import { motion } from 'framer-motion';

export default function CompanyCard({ company }) {
  if (!company) return null;

  const letter = (company.name || company.ticker || '?')[0].toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-xl font-bold"
            style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', color: '#fff' }}
          >
            {letter}
          </div>
          <div>
            <h1 className="text-xl font-bold leading-tight" style={{ color: 'var(--text-primary)' }}>
              {company.name || 'Unknown Company'}
            </h1>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              {company.ticker && (
                <span
                  className="font-mono text-xs font-bold px-2 py-0.5 rounded"
                  style={{ color: 'var(--green)', background: 'var(--green-dim)', border: '1px solid rgba(16,185,129,0.25)' }}
                >
                  {company.ticker}
                </span>
              )}
              {company.exchange && (
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{company.exchange}</span>
              )}
              {company.sector && (
                <span
                  className="text-xs px-2 py-0.5 rounded"
                  style={{ color: 'var(--text-secondary)', background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
                >
                  {company.sector}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap text-xs" style={{ color: 'var(--text-muted)' }}>
          {company.headquarters && (
            <div className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {company.headquarters}
            </div>
          )}
          {company.website && (
            <a
              href={company.website} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 transition-opacity hover:opacity-70"
              style={{ color: 'var(--teal)' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Website
            </a>
          )}
        </div>
      </div>

      {company.description && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-sm leading-relaxed line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
            {company.description}
          </p>
        </div>
      )}

      {company.industry && company.industry !== company.sector && (
        <div className="mt-3 text-xs" style={{ color: 'var(--text-muted)' }}>
          Industry:&nbsp;
          <span style={{ color: 'var(--text-secondary)' }}>{company.industry}</span>
        </div>
      )}
    </motion.div>
  );
}
