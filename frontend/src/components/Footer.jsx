/**
 * Footer Component — theme-aware footer with CSS variables.
 */
import React from 'react';

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', backgroundColor: 'var(--bg-surface)', marginTop: '4rem' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}
            >
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              AlphaForge <span className="text-gradient-emerald-cyan">AI</span>
            </span>
          </div>
          <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
            Powered by ARGUS · AI Research Platform · Not Financial Advice
          </p>
          <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            <span>Version 1.0</span>
            <span>·</span>
            <span>© 2026 AlphaForge AI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
