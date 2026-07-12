/**
 * NewsCard — Sentiment timeline with stacked sentiment chart and expandable news list.
 * Fully theme-aware with CSS variables.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SENT = {
  positive: { label: 'Positive', color: '#10b981', bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)' },
  negative: { label: 'Negative', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)' },
  neutral:  { label: 'Neutral',  color: '#94a3b8', bg: 'rgba(148,163,184,0.06)', border: 'rgba(148,163,184,0.2)' },
};

function ArticleRow({ article, index }) {
  const s = SENT[article.sentiment] || SENT.neutral;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
      className="flex items-start gap-3.5 py-3 group rounded-lg px-2 transition-all duration-200 hover:bg-[var(--bg-elevated)]"
    >
      {/* Timeline dot */}
      <div
        className="mt-1 w-4 h-4 rounded-full shrink-0 flex items-center justify-center"
        style={{ border: `1.5px solid ${s.color}`, background: 'var(--bg-page)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full block" style={{ background: s.color }} />
      </div>

      <div className="flex-1 min-w-0">
        <a
          href={article.url || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-semibold line-clamp-2 leading-snug transition-colors block"
          style={{ color: 'var(--text-primary)' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--green)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          {article.title}
        </a>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{article.source}</span>
          <span style={{ color: 'var(--border)' }}>·</span>
          <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>{article.publishedAt}</span>
          <span
            className="text-[9px] font-bold font-mono px-1.5 py-0.5 rounded"
            style={{ color: s.color, background: s.bg, border: `1px solid ${s.border}` }}
          >
            {s.label}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function NewsCard({ news }) {
  const [expanded, setExpanded] = useState(false);

  if (!news?.length) return (
    <div className="glass-card p-6">
      <h2 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Sentiment Timeline</h2>
      <p className="text-sm" style={{ color: 'var(--text-muted)' }}>News data unavailable.</p>
    </div>
  );

  const shown = expanded ? news : news.slice(0, 5);
  const remaining = news.length - shown.length;

  const counts = { positive: 0, neutral: 0, negative: 0 };
  news.forEach(n => { if (n.sentiment in counts) counts[n.sentiment]++; });

  const total = counts.positive + counts.neutral + counts.negative || 1;
  const posPct = Math.round((counts.positive / total) * 100);
  const negPct = Math.round((counts.negative / total) * 100);
  const neuPct = 100 - (posPct + negPct);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-card p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5 flex-wrap">
        <h2 className="flex items-center gap-2 text-base font-bold" style={{ color: 'var(--text-primary)' }}>
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--teal)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          Sentiment Timeline
        </h2>
        <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>
          Media Analytics
        </span>
      </div>

      {/* Stacked Sentiment Ratio Bar */}
      <div className="mb-6 p-4 rounded-xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
        <div className="flex justify-between text-[10px] font-mono mb-2" style={{ color: 'var(--text-secondary)' }}>
          <span className="text-emerald-500 font-bold">Positive {posPct}%</span>
          <span className="text-slate-400 font-bold">Neutral {neuPct}%</span>
          <span className="text-red-500 font-bold">Negative {negPct}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden flex bg-slate-200 dark:bg-slate-800">
          <div style={{ width: `${posPct}%`, backgroundColor: '#10b981' }} className="transition-all duration-500" />
          <div style={{ width: `${neuPct}%`, backgroundColor: '#94a3b8' }} className="transition-all duration-500" />
          <div style={{ width: `${negPct}%`, backgroundColor: '#ef4444' }} className="transition-all duration-500" />
        </div>
      </div>

      {/* List */}
      <div className="timeline-track relative pl-1">
        {/* Timeline trace line */}
        <div className="absolute left-3 top-2 bottom-2 w-[1.5px]" style={{ backgroundColor: 'var(--border)' }} />
        
        <AnimatePresence>
          {shown.map((a, i) => <ArticleRow key={a.id || i} article={a} index={i} />)}
        </AnimatePresence>
      </div>

      {/* Expand / collapse */}
      {remaining > 0 ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full mt-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ↓ Show +{remaining} more articles
        </button>
      ) : news.length > 5 && (
        <button
          onClick={() => setExpanded(false)}
          className="w-full mt-4 py-2.5 text-xs font-semibold rounded-lg transition-all duration-200 hover:translate-y-0.5"
          style={{ color: 'var(--text-muted)', background: 'var(--bg-elevated)', border: '1px dashed var(--border-strong)', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          ↑ Collapse timeline
        </button>
      )}
    </motion.div>
  );
}
