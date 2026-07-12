/**
 * SearchBar — fully theme-aware search input with quick suggestions.
 */
import React, { useState } from 'react';

const SUGGESTIONS = ['Apple', 'Microsoft', 'NVIDIA', 'Tesla', 'Amazon', 'Google', 'Meta', 'Netflix'];

export default function SearchBar({ onSearch, isLoading, size = 'default' }) {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const large = size === 'large';

  const submit = (e) => { e.preventDefault(); if (query.trim() && !isLoading) onSearch(query.trim()); };

  const wrapStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.625rem',
    borderRadius: '0.875rem',
    padding: large ? '0.5rem 0.5rem 0.5rem 1.25rem' : '0.375rem 0.375rem 0.375rem 1rem',
    backgroundColor: 'var(--bg-input)',
    border: `1px solid ${focused ? 'var(--green)' : 'var(--border-strong)'}`,
    boxShadow: focused ? '0 0 0 3px var(--green-dim)' : 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
  };

  const btnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    padding: large ? '0.6rem 1.25rem' : '0.45rem 0.875rem',
    borderRadius: '0.625rem',
    fontSize: large ? '0.875rem' : '0.75rem',
    fontWeight: 600,
    border: 'none',
    cursor: query.trim() && !isLoading ? 'pointer' : 'not-allowed',
    backgroundColor: query.trim() && !isLoading ? 'var(--green)' : 'var(--bg-elevated)',
    color: query.trim() && !isLoading ? 'var(--text-inverse)' : 'var(--text-muted)',
    boxShadow: query.trim() && !isLoading ? 'var(--shadow-glow-g)' : 'none',
    transition: 'background-color 0.2s ease, box-shadow 0.2s ease, color 0.2s ease',
    flexShrink: 0,
    whiteSpace: 'nowrap',
  };

  return (
    <div className="w-full">
      <form onSubmit={submit}>
        <div style={wrapStyle}>
          <svg
            style={{ color: focused ? 'var(--green)' : 'var(--text-muted)', flexShrink: 0, width: large ? 18 : 16, height: large ? 18 : 16 }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>

          <input
            id="company-search-input"
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search Company... (e.g. Apple, Google, Tesla)"
            disabled={isLoading}
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontSize: large ? '1rem' : '0.875rem',
              fontFamily: 'inherit',
              minWidth: 0,
            }}
          />

          {query && !isLoading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem', color: 'var(--text-muted)', flexShrink: 0 }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          <button type="submit" disabled={!query.trim() || isLoading} style={btnStyle}>
            {isLoading ? (
              <>
                <span className="spinner" />
                <span>Analyzing…</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      {!isLoading && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 500 }}>Try:</span>
          {SUGGESTIONS.map(s => (
            <button
              key={s}
              onClick={() => onSearch(s)}
              style={{
                fontSize: '0.7rem',
                fontFamily: 'monospace',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: '999px',
                padding: '0.2rem 0.6rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease, color 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--green)'; e.currentTarget.style.color = 'var(--green)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
