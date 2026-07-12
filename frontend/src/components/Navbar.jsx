/**
 * Navbar — fixed top bar with logo, nav links, theme toggle, ARGUS status.
 * Dynamically replaces "Features" with "Dashboard" on `/dashboard`.
 * Houses the E2E Walkthrough Video Modal so it works on both pages.
 */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

let _theme = 'dark';
try { _theme = localStorage.getItem('alphaforge-theme') || 'dark'; } catch {}

export default function Navbar({ onAnalyzeClick }) {
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(
    () => {
      try { return localStorage.getItem('alphaforge-theme') || 'dark'; } catch { return 'dark'; }
    }
  );
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    _theme = theme;
    document.documentElement.classList.toggle('light', theme === 'light');
    try { localStorage.setItem('alphaforge-theme', theme); } catch {}
  }, [theme]);

  // Listen for global open walkthrough video requests (e.g. from Hero section buttons)
  useEffect(() => {
    const handleOpenVideo = () => setIsVideoOpen(true);
    window.addEventListener('open-walkthrough-video', handleOpenVideo);
    return () => window.removeEventListener('open-walkthrough-video', handleOpenVideo);
  }, []);

  const isDashboard = pathname === '/dashboard';

  return (
    <>
      <nav
        className="fixed inset-x-0 top-0 z-50 backdrop-blur-md"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderBottom: 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <path d="M12 3L2 21h5l5-10 5 10h5L12 3z" fill="url(#navLogoGrad)" />
              <defs>
                <linearGradient id="navLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00C6A8" />
                  <stop offset="100%" stopColor="#00A3FF" />
                </linearGradient>
              </defs>
            </svg>
            <span className="text-sm font-extrabold tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: "'Manrope', sans-serif" }}>
              AlphaForge <span className="text-emerald-400">AI</span>
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-7 text-sm font-medium">
            {isDashboard ? (
              <Link to="/dashboard" style={{ color: 'var(--green)' }} className="font-semibold tracking-wide transition-colors">
                Dashboard
              </Link>
            ) : (
              <a href="#features" style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--green)] transition-colors">
                Features
              </a>
            )}

            <button
              onClick={() => setIsVideoOpen(true)}
              style={{ color: 'var(--text-muted)', border: 'none', background: 'none', cursor: 'pointer' }}
              className="hover:text-[var(--green)] transition-colors font-medium text-sm p-0"
            >
              How it Works
            </button>

            {isDashboard ? (
              <Link to="/#about-us" style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--green)] transition-colors">
                About Us
              </Link>
            ) : (
              <a href="#about-us" style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--green)] transition-colors">
                About Us
              </a>
            )}

            <a
              href="https://github.com/AmritRaj7461"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'var(--text-muted)' }}
              className="flex items-center gap-1.5 hover:text-[var(--green)] transition-colors"
            >
              GitHub
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
              style={{ border: '1px solid var(--border)', backgroundColor: 'var(--bg-elevated)', color: 'var(--text-secondary)' }}
            >
              {theme === 'light' ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              )}
            </button>

            {/* Analyze Company CTA */}
            <button
              onClick={onAnalyzeClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200"
              style={{
                borderColor: '#10b981',
                color: 'var(--text-primary)',
                background: 'rgba(16,185,129,0.05)',
                boxShadow: '0 0 12px rgba(16,185,129,0.1)'
              }}
            >
              Analyze Company <span className="text-emerald-400">→</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Real Application Walkthrough Video Modal ─── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
          >
            {/* Player Container */}
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="w-full max-w-4xl rounded-2xl border shadow-2xl overflow-hidden relative"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}
            >
              {/* Top Title Bar */}
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-800" style={{ backgroundColor: 'rgba(7, 10, 18, 0.9)' }}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300">ARGUS: E2E ANALYSIS DEMONSTRATION</span>
                </div>
                <button 
                  onClick={() => setIsVideoOpen(false)}
                  className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* The interactive video player container */}
              <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                <video 
                  src="/AlphaForge.mp4" 
                  autoPlay 
                  loop 
                  muted 
                  controls 
                  playsInline 
                  className="w-full h-full object-cover" 
                />
              </div>

              {/* Media controls simulator at the bottom */}
              <div className="px-5 py-3 flex items-center justify-between border-t border-slate-800" style={{ backgroundColor: 'rgba(7, 10, 18, 0.9)' }}>
                <div className="flex items-center gap-4 text-slate-400">
                  <span className="text-[10px] font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded">DEMO RECORDING</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">Walkthrough MP4 Playback · Controls Enabled</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
