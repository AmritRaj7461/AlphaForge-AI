/**
 * LandingPage — Nebula Console / AlphaForge AI V3.0
 * 100% visual match of the provided reference mockup.
 * Configured with active CSS variables for light and dark theme support.
 * Refined subtext scales, dynamic navbar callbacks, and cleaner search modal tips.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Cpu, TrendingUp, Play, ArrowRight, ShieldCheck, Activity,
  FileText, Settings, Home, Users, MessageSquare, LineChart, PlayCircle, X, Maximize
} from 'lucide-react';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import useAnalysis from '../hooks/useAnalysis';

const MOCK_COMPANIES = [
  {
    name: 'Apple Inc.',
    ticker: 'AAPL',
    exchange: 'NASDAQ',
    sector: 'Technology',
    recommendation: 'BUY',
    confidence: '97%',
    dashoffset: '4.1',
    metrics: [
      { label: 'Market Cap', val: '$2.85T', pct: '+1.32%', path: 'M0,15 C10,12 20,8 30,10 C40,12 50,6 60,4', id: 'mc-a' },
      { label: 'P/E Ratio', val: '28.32', pct: '+5.11%', path: 'M0,15 C10,14 20,10 30,8 C40,4 50,2 60,0', id: 'pe-a' },
      { label: 'Revenue Growth', val: '12.61%', pct: '+2.45%', path: 'M0,15 C10,13 20,12 30,8 C40,9 50,4 60,2', id: 'rg-a' },
      { label: 'ROE', val: '28.47%', pct: '+3.21%', path: 'M0,15 C10,14 20,9 30,7 C40,6 50,4 60,1', id: 'roe-a' },
      { label: 'Net Margin', val: '25.16%', pct: '+2.02%', path: 'M0,15 C10,13 20,11 30,10 C40,8 50,6 60,3', id: 'nm-a' }
    ],
    chartPath: 'M0,50 C30,52 45,35 70,36 C95,38 110,12 135,16 C160,20 170,5 190,7',
    chartFill: 'M0,50 C30,52 45,35 70,36 C95,38 110,12 135,16 C160,20 170,5 190,7 L190,60 L0,60 Z',
    strength: 'Strong profitability, robust cash flow and consistent revenue growth.',
    logo: (
      <svg className="w-4 h-4" style={{ fill: 'var(--text-primary)' }} viewBox="0 0 24 24">
        <path d="M15.22 12.9c-.02-2.93 2.38-4.48 2.49-4.55-1.37-2.01-3.5-2.32-4.26-2.38-1.79-.18-3.56 1.06-4.47 1.06-.92 0-2.35-1.04-3.83-1.01-1.94.03-3.73 1.13-4.73 2.86C-1.61 12.38.12 17.58 2.08 20.4c.96 1.38 2.04 2.9 3.53 2.84 1.44-.06 1.98-.93 3.72-.93 1.73 0 2.23.93 3.72.87 1.51-.06 2.46-1.4 3.42-2.78 1.1-1.62 1.56-3.18 1.59-3.26-.07-.03-2.8-1.07-2.84-4.24M12.8 4c.8-1 1.3-2.3 1.1-3.6-1.1.1-2.5.8-3.3 1.8-.7.8-1.3 2.1-1 3.4 1.2.1 2.4-.6 3.2-1.6z" />
      </svg>
    )
  },
  {
    name: 'Microsoft Corp.',
    ticker: 'MSFT',
    exchange: 'NASDAQ',
    sector: 'Technology',
    recommendation: 'BUY',
    confidence: '95%',
    dashoffset: '6.9',
    metrics: [
      { label: 'Market Cap', val: '$3.12T', pct: '+2.15%', path: 'M0,15 C10,14 20,12 30,9 C40,8 50,5 60,3', id: 'mc-m' },
      { label: 'P/E Ratio', val: '34.18', pct: '+4.20%', path: 'M0,15 C10,13 20,11 30,10 C40,7 50,4 60,2', id: 'pe-m' },
      { label: 'Revenue Growth', val: '17.84%', pct: '+3.12%', path: 'M0,15 C10,12 20,14 30,9 C40,7 50,5 60,1', id: 'rg-m' },
      { label: 'ROE', val: '38.56%', pct: '+4.01%', path: 'M0,15 C10,13 20,10 30,8 C40,6 50,4 60,1', id: 'roe-m' },
      { label: 'Net Margin', val: '35.42%', pct: '+2.85%', path: 'M0,15 C10,12 20,11 30,9 C40,6 50,3 60,1', id: 'nm-m' }
    ],
    chartPath: 'M0,45 C30,42 45,30 70,28 C95,26 110,14 135,10 C160,6 170,8 190,2',
    chartFill: 'M0,45 C30,42 45,30 70,28 C95,26 110,14 135,10 C160,6 170,8 190,2 L190,60 L0,60 Z',
    strength: 'Cloud leadership with Azure and strong enterprise AI monetization.',
    logo: (
      <svg className="w-4 h-4" style={{ fill: 'var(--text-primary)' }} viewBox="0 0 24 24">
        <path d="M0 0h11.5v11.5H0zM12.5 0H24v11.5H12.5zM0 12.5h11.5V24H0zM12.5 12.5H24V24H12.5z" />
      </svg>
    )
  },
  {
    name: 'NVIDIA Corp.',
    ticker: 'NVDA',
    exchange: 'NASDAQ',
    sector: 'Semiconductors',
    recommendation: 'S. BUY',
    confidence: '98%',
    dashoffset: '2.8',
    metrics: [
      { label: 'Market Cap', val: '$3.01T', pct: '+4.80%', path: 'M0,15 C10,13 20,9 30,6 C40,4 50,2 60,0', id: 'mc-n' },
      { label: 'P/E Ratio', val: '68.42', pct: '+8.50%', path: 'M0,15 C10,12 20,10 30,7 C40,5 50,3 60,0', id: 'pe-n' },
      { label: 'Revenue Growth', val: '265.1%', pct: '+15.2%', path: 'M0,15 C10,10 20,8 30,4 C40,2 50,1 60,0', id: 'rg-n' },
      { label: 'ROE', val: '114.3%', pct: '+12.3%', path: 'M0,15 C10,11 20,7 30,5 C40,3 50,1 60,0', id: 'roe-n' },
      { label: 'Net Margin', val: '57.2%', pct: '+9.80%', path: 'M0,15 C10,12 20,9 30,6 C40,4 50,2 60,0', id: 'nm-n' }
    ],
    chartPath: 'M0,55 C30,48 45,32 70,22 C95,12 110,6 135,2 C160,0 170,0 190,0',
    chartFill: 'M0,55 C30,48 45,32 70,22 C95,12 110,6 135,2 C160,0 170,0 190,0 L190,60 L0,60 Z',
    strength: 'Exponential data center growth and virtual monopoly in AI hardware.',
    logo: (
      <svg className="w-4 h-4" style={{ fill: 'none', stroke: 'var(--text-primary)' }} viewBox="0 0 24 24" strokeWidth="2.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 5h10a2 2 0 012 2v10a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2z" />
      </svg>
    )
  },
  {
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    exchange: 'NASDAQ',
    sector: 'Automotive',
    recommendation: 'HOLD',
    confidence: '88%',
    dashoffset: '16.6',
    metrics: [
      { label: 'Market Cap', val: '$612B', pct: '-1.80%', path: 'M0,12 C10,14 20,13 30,15 C40,17 50,19 60,20', id: 'mc-t' },
      { label: 'P/E Ratio', val: '51.20', pct: '-2.10%', path: 'M0,13 C10,14 20,13 30,16 C40,18 50,20 60,21', id: 'pe-t' },
      { label: 'Revenue Growth', val: '9.40%', pct: '-1.10%', path: 'M0,14 C10,15 20,14 30,17 C40,19 50,21 60,22', id: 'rg-t' },
      { label: 'ROE', val: '18.20%', pct: '-1.50%', path: 'M0,15 C10,16 20,15 30,18 C40,20 50,22 60,23', id: 'roe-t' },
      { label: 'Net Margin', val: '12.80%', pct: '-0.80%', path: 'M0,16 C10,17 20,16 30,19 C40,21 50,23 60,24', id: 'nm-t' }
    ],
    chartPath: 'M0,25 C30,27 45,23 70,30 C95,38 110,35 135,42 C160,48 170,45 190,52',
    chartFill: 'M0,25 C30,27 45,23 70,30 C95,38 110,35 135,42 C160,48 170,45 190,52 L190,60 L0,60 Z',
    strength: 'Pioneering EV market share, but facing near-term margin pressure.',
    logo: (
      <svg className="w-4 h-4" style={{ fill: 'var(--text-primary)' }} viewBox="0 0 24 24">
        <path d="M12 2.25 C12 2.25 15.6 6.3 19.35 10.35 C15.45 10.8 12 11.25 12 11.25 L4.65 10.35 C8.4 6.3 12 2.25 12 2.25 Z M12 13.5 C12 13.5 15.3 15.75 18.6 18 L12 20.25 L5.4 18 L12 13.5 Z" />
      </svg>
    )
  }
];

export default function LandingPage() {
  const { analyze, isLoading, error } = useAnalysis();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeCompanyIdx, setActiveCompanyIdx] = useState(0);

  // Auto-rotate the mock company preview card every 6.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveCompanyIdx((prev) => (prev + 1) % MOCK_COMPANIES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  // Close modals on Esc key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const comp = MOCK_COMPANIES[activeCompanyIdx];
  const recColor = comp.recommendation === 'HOLD' ? '#f59e0b' : '#10b981';
  const isLoss = comp.ticker === 'TSLA';
  const sparkColor = isLoss ? '#f59e0b' : '#10b981';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', transition: 'background-color 0.25s ease, color 0.25s ease' }} className="relative text-left overflow-hidden">
      <Navbar onAnalyzeClick={() => setIsSearchOpen(true)} />

      {/* ─── Base Background Mesh Grid ─── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
        <div
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }}
        />

        {/* Soft Ambient Radial Glows */}
        <div className="absolute top-[15%] right-[-10%] w-[55rem] h-[55rem] rounded-full blur-[130px] opacity-[0.2]"
          style={{ background: 'radial-gradient(circle, #00C6A8 0%, transparent 70%)' }} />
        <div className="absolute top-[30%] right-[-10%] w-[45rem] h-[45rem] rounded-full blur-[130px] opacity-[0.16]"
          style={{ background: 'radial-gradient(circle, #00A3FF 0%, transparent 70%)' }} />
      </div>

      {/* ─── Hero Section ─── */}
      <section className="relative pt-36 pb-12 px-6 max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

          {/* Left Side Copy */}
          <div className="lg:col-span-6 space-y-7">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border"
              style={{
                borderColor: 'var(--border-strong)',
                background: 'var(--bg-elevated)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold tracking-wider uppercase font-mono" style={{ color: 'var(--text-secondary)' }}>
                AI-Powered Investment Research
              </span>
            </motion.div>

            {/* Title / Slogan */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
              className="text-[44px] sm:text-5xl font-extrabold tracking-tight leading-[1.08] font-sans"
              style={{ color: 'var(--text-primary)' }}
            >
              Smarter Research. <br />
              <span className="text-gradient-emerald-cyan font-extrabold">Stronger Decisions.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
              className="text-base leading-relaxed max-w-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              AlphaForge AI analyzes financials, news, and market trends to deliver clear, explainable investment insights.
            </motion.p>

            {/* Call to Actions */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.24 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => setIsSearchOpen(true)}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-white transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: 'linear-gradient(90deg, #00C6A8 0%, #00A3FF 50%, #7B2CBF 100%)',
                  boxShadow: '0 4px 20px rgba(0, 198, 168, 0.3)'
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
                </svg>
                Analyze a Company
              </button>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-walkthrough-video'))}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border transition-colors hover:bg-white/5"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--text-primary)' }}
              >
                <PlayCircle size={16} /> See How It Works
              </button>
            </motion.div>
          </div>

          {/* Right Side Column */}
          <div className="lg:col-span-6 relative flex items-center justify-center min-h-[500px]">

            {/* ─── Glowing Neon Ribbon design perfectly anchored directly behind the card container ─── */}
            <div className="absolute inset-0 pointer-events-none overflow-visible z-0 select-none flex items-center justify-center">
              <svg className="w-[155%] h-[155%] opacity-90 overflow-visible" viewBox="0 0 1000 800" fill="none">
                {/* Thick outer glowing light beam trail (cyan/blue/purple) */}
                <path d="M120,680 C320,620 380,310 580,360 C780,410 830,120 1080,180" stroke="url(#neonWavyGrad1)" strokeWidth="22" strokeLinecap="round" filter="url(#mockupNebulaGlow)" />
                <path d="M150,700 C340,640 400,330 600,380 C800,430 850,140 1100,200" stroke="url(#neonWavyGrad2)" strokeWidth="12" strokeLinecap="round" filter="url(#mockupNebulaGlow)" />
                <path d="M90,660 C290,600 360,290 560,340 C760,390 810,100 1060,160" stroke="url(#neonWavyGrad3)" strokeWidth="6" strokeLinecap="round" filter="url(#mockupNebulaGlow)" />

                <defs>
                  <linearGradient id="neonWavyGrad1" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C6A8" stopOpacity="0.9" />
                    <stop offset="35%" stopColor="#00A3FF" stopOpacity="0.95" />
                    <stop offset="70%" stopColor="#7B2CBF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="neonWavyGrad2" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.95" />
                    <stop offset="65%" stopColor="#7B2CBF" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#ec4899" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="neonWavyGrad3" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C6A8" stopOpacity="0.8" />
                    <stop offset="50%" stopColor="#00A3FF" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#7B2CBF" stopOpacity="0.3" />
                  </linearGradient>
                  <filter id="mockupNebulaGlow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="28" result="blur1" />
                    <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur2" />
                    <feMerge>
                      <feMergeNode in="blur1" />
                      <feMergeNode in="blur2" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            </div>

            {/* Dashboard Card Preview Container (Adapts fully via CSS variables for premium look) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.32, duration: 0.7 }}
              className="w-full max-w-xl rounded-2xl border shadow-2xl relative select-none flex overflow-hidden z-10 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border)',
                color: 'var(--text-primary)',
                backdropFilter: 'blur(16px)'
              }}
            >
              {/* Left Sidebar inside preview */}
              <div className="w-12 border-r flex flex-col items-center py-5 gap-6 shrink-0" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
                {/* Stylized Chevron A Logo top */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M12 3L2 21h5l5-10 5 10h5L12 3z" fill="url(#sidebarLogoGrad)" />
                  <defs>
                    <linearGradient id="sidebarLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#00C6A8" />
                      <stop offset="100%" stopColor="#00A3FF" />
                    </linearGradient>
                  </defs>
                </svg>
                {/* Icons */}
                <Home size={14} className="text-emerald-400" />
                <LineChart size={14} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-primary)] cursor-pointer" />
                <ShieldCheck size={14} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-primary)] cursor-pointer" />
                <Users size={14} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-primary)] cursor-pointer" />
                <MessageSquare size={14} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-primary)] cursor-pointer" />
                <Settings size={14} style={{ color: 'var(--text-muted)' }} className="hover:text-[var(--text-primary)] cursor-pointer mt-auto" />
              </div>

              {/* Main Content Area inside preview */}
              <div className="flex-1 p-5 space-y-4">
                {/* Mockup Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {/* SVG Company Logo */}
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                      {comp.logo}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold" style={{ fontFamily: "'Manrope', sans-serif" }}>{comp.name}</h3>
                      <div className="flex gap-1.5 mt-1">
                        <span className="text-[9px] font-mono px-1.5 py-0.25 rounded" style={{ backgroundColor: `${recColor}15`, color: recColor, border: `1px solid ${recColor}30` }}>{comp.ticker}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.25 rounded border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{comp.exchange}</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.25 rounded border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)', color: 'var(--text-muted)' }}>{comp.sector}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[8px] font-mono uppercase block" style={{ color: 'var(--text-muted)' }}>ARGUS RECOMMENDATION</span>
                      <span className="inline-flex items-center gap-1.5 text-lg font-black" style={{ fontFamily: "'Manrope', sans-serif", color: recColor }}>
                        {comp.recommendation}
                        <svg className="w-4 h-4" style={{ color: recColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          {comp.recommendation === 'HOLD' ? (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                          )}
                        </svg>
                      </span>
                    </div>
                    {/* Confidence circle */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
                        <circle cx="28" cy="28" r="22" fill="none" stroke="var(--border)" strokeWidth="3" />
                        <circle cx="28" cy="28" r="22" fill="none" stroke={recColor} strokeWidth="3" strokeDasharray="138" strokeDashoffset={comp.dashoffset} strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
                        <span className="text-[11px] font-black font-mono" style={{ color: 'var(--text-primary)' }}>{comp.confidence}</span>
                        <span className="text-[5px] uppercase tracking-normal mt-0.5" style={{ color: 'var(--text-muted)' }}>CONFIDENCE</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segment Selector Tabs to allow manual toggle */}
                <div className="flex justify-between items-center text-[8px] font-mono border-b pb-1.5" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
                  <div className="flex gap-1">
                    {MOCK_COMPANIES.map((c, i) => (
                      <button
                        key={c.ticker}
                        onClick={() => setActiveCompanyIdx(i)}
                        className={`px-2 py-0.5 rounded border transition-all duration-200 font-bold uppercase ${
                          activeCompanyIdx === i
                            ? 'text-white border-slate-600'
                            : 'text-slate-500 border-transparent hover:text-slate-300'
                        }`}
                        style={{
                          backgroundColor: activeCompanyIdx === i ? 'var(--bg-elevated)' : 'transparent',
                        }}
                      >
                        {c.ticker}
                      </button>
                    ))}
                  </div>
                  <span className="flex items-center gap-1">📅 Trailing 12 Months</span>
                </div>

                {/* 5 Ratios/Metrics Grid */}
                <div className="grid grid-cols-5 gap-2">
                  {comp.metrics.map(m => {
                    const isStatLoss = m.pct.startsWith('-');
                    const metricColor = isStatLoss ? 'text-amber-500' : 'text-emerald-400';
                    const sparkStroke = isStatLoss ? '#f59e0b' : '#10b981';
                    return (
                      <div key={m.label} className="p-2.5 rounded-xl border text-left transition-all duration-300 hover:border-emerald-500/30"
                        style={{
                          backgroundColor: 'var(--bg-elevated)',
                          borderColor: 'var(--border)',
                          boxShadow: 'inset 0 1px 1px var(--border)'
                        }}>
                        <span className="text-[8px] font-medium block truncate" style={{ color: 'var(--text-muted)' }}>{m.label}</span>
                        <span className="text-[13px] font-bold block mt-1" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-primary)' }}>{m.val}</span>
                        <span className={`text-[9px] font-semibold block mt-0.5 ${metricColor}`}>{m.pct}</span>
                        {/* sparkline with gradient fill */}
                        <svg viewBox="0 0 60 20" className="w-full h-5 mt-2 overflow-visible">
                          <defs>
                            <linearGradient id={`sparkGrad-${m.id}`} x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor={sparkStroke} stopOpacity="0.25" />
                              <stop offset="100%" stopColor={sparkStroke} stopOpacity="0" />
                            </linearGradient>
                          </defs>
                          <path d={`${m.path} L60,20 L0,20 Z`} fill={`url(#sparkGrad-${m.id})`} />
                          <path d={m.path} fill="none" stroke={sparkStroke} strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    );
                  })}
                </div>

                {/* Filters Row & Wavy Chart */}
                <div className="rounded-xl p-3 border" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex gap-1.5 text-[8px] font-mono font-bold">
                      {['1M', '3M', '6M', 'YTD', '1Y', '5Y', 'Max'].map((f, i) => {
                        const is1Y = f === '1Y';
                        return (
                          <span
                            key={i}
                            className={`px-1.5 py-0.5 rounded cursor-pointer ${is1Y ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : ''}`}
                            style={is1Y ? {} : { color: 'var(--text-muted)' }}
                          >
                            {f}
                          </span>
                        );
                      })}
                    </div>
                    {/* Key Strength Card inside */}
                    <div className="flex items-center gap-1.5 text-[8px] font-mono" style={{ color: recColor }}>
                      <span>Key Strength</span>
                      <ShieldCheck size={10} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* The main chart path */}
                    <div className="md:col-span-8">
                      <svg viewBox="0 0 200 60" className="w-full h-20 overflow-visible">
                        <defs>
                          <linearGradient id={`glowArea-${comp.ticker}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={recColor} stopOpacity="0.25" />
                            <stop offset="100%" stopColor={recColor} stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        <path d={comp.chartFill} fill={`url(#glowArea-${comp.ticker})`} />
                        <path d={comp.chartPath} fill="none" stroke={recColor} strokeWidth="1.8" strokeLinecap="round" />
                        <circle cx="190" cy={isLoss ? 52 : comp.ticker === 'MSFT' ? 2 : comp.ticker === 'NVDA' ? 0 : 7} r="3.5" fill={recColor} className="animate-pulse" />
                      </svg>
                    </div>

                    {/* Key strength commentary */}
                    <div className="md:col-span-4 p-2.5 rounded border text-left h-full flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                      <p className="text-[9px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        {comp.strength}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ─── Technology Stack Section (Bridge) ─── */}
      <section id="tech-stack" className="relative py-16 px-6 max-w-7xl mx-auto z-10" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="space-y-3 mb-10 text-center md:text-left">
          <span className="text-[12px] font-mono font-extrabold tracking-widest uppercase" style={{ color: 'var(--green)' }}>
            ● AI & DATA INTEGRATIONS
          </span>
          <h2 className="text-3xl font-extrabold" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-primary)' }}>
            Powered by Modern AI Infrastructure
          </h2>
          <p className="text-base max-w-2xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            AlphaForge combines modern AI frameworks with trusted financial data providers to deliver explainable investment research.
          </p>
        </div>

        {/* Technology Stack Grid - 2 rows x 3 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Gemini AI',
              desc: 'AI Reasoning Engine',
              category: 'AI',
              color: 'var(--green)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" style={{ color: 'var(--green)' }}>
                  <path d="M12 2c.4 0 .7.3.7.7l.9 5.3c.1.7.6 1.2 1.3 1.3l5.3.9c.4 0 .7.3.7.7s-.3.7-.7.7l-5.3.9c-.7.1-1.2.6-1.3 1.3l-.9 5.3c0 .4-.3.7-.7.7s-.7-.3-.7-.7l-.9-5.3c-.1-.7-.6-1.2-1.3-1.3l-5.3-.9c-.4 0-.7-.3-.7-.7s.3-.7.7-.7l5.3-.9c.7-.1 1.2-.6 1.3-1.3l.9-5.3c0-.4.3-.7.7-.7z" />
                </svg>
              )
            },
            {
              name: 'Financial Modeling Prep',
              desc: 'Financial Statements',
              category: 'Financial Data',
              color: 'var(--teal)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" style={{ color: 'var(--teal)' }} strokeWidth="2">
                  <path d="M12 2C6.5 2 2 4.2 2 7v10c0 2.8 4.5 5 10 5s10-2.2 10-5V7c0-2.8-4.5-5-10-5z" />
                  <path d="M2 12c0 2.8 4.5 5 10 5s10-2.2 10-5" />
                  <path d="M2 7c0 2.8 4.5 5 10 5s10-2.2 10-5" />
                  <path d="M7 14v4M12 15v3M17 13v5" />
                </svg>
              )
            },
            {
              name: 'Yahoo Finance',
              desc: 'Market Data',
              category: 'Financial Data',
              color: 'var(--teal)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" style={{ color: 'var(--teal)' }}>
                  <path d="M3.7 3h3.6l3.8 6.4L14.9 3h3.5L13 10.3v6.7h-3.1v-6.7L3.7 3z" />
                  <circle cx="20.3" cy="17.2" r="1.8" />
                </svg>
              )
            },
            {
              name: 'Alpha Vantage',
              desc: 'Financial Ratios',
              category: 'Financial Data',
              color: 'var(--teal)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" style={{ color: 'var(--teal)' }} strokeWidth="2">
                  <path d="M6 22L12 3l6 19M9 13h6M13 14l3 8M11 14l-3 8" />
                </svg>
              )
            },
            {
              name: 'NewsAPI',
              desc: 'Real-time News',
              category: 'Financial Data',
              color: 'var(--teal)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-none stroke-current" style={{ color: 'var(--teal)' }} strokeWidth="2">
                  <rect x="3" y="4" width="18" height="16" rx="2" />
                  <path d="M7 8h10M7 12h10M7 16h6" />
                </svg>
              )
            },
            {
              name: 'Internal ARGUS Engine',
              desc: 'Explainable AI',
              category: 'AI',
              color: 'var(--green)',
              renderIcon: () => (
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" style={{ color: 'var(--green)' }}>
                  <path d="M12 3L2 21h5l5-10 5 10h5L12 3z" />
                </svg>
              )
            }
          ].map((tech, idx) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between text-left group hover:-translate-y-1 hover:border-emerald-500/30 shadow-md"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)'
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono font-extrabold tracking-wider uppercase" style={{ color: tech.color }}>
                  {tech.category}
                </span>
                <div className="group-hover:rotate-6 transition-transform duration-300">
                  {tech.renderIcon()}
                </div>
              </div>
              <div>
                <h4 className="text-base font-black tracking-tight" style={{ color: 'var(--text-primary)', fontFamily: "'Manrope', sans-serif" }}>
                  {tech.name}
                </h4>
                <p className="text-[13px] font-medium mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {tech.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 4-Pill Lower Feature Tape ─── */}
      <section id="features" className="px-6 pb-20 max-w-7xl mx-auto z-10 relative">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x border p-5 rounded-2xl shadow-xl backdrop-blur-xl"
          style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
        >
          {[
            { icon: Activity, title: 'Real-time Data', desc: 'Live market & financial feeds', color: '#06b6d4' },
            { icon: Cpu, title: 'Explainable AI', desc: 'Every insight backed by evidence', color: '#10b981' },
            { icon: FileText, title: 'Comprehensive Analysis', desc: 'Financials, News, Peers & Risks', color: '#6366f1' },
            { icon: TrendingUp, title: 'Actionable Insights', desc: 'Clear recommendations you can trust', color: '#ec4899' }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-4 px-4 py-2 sm:py-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderColor: 'var(--border)', color: item.color }}
              >
                <item.icon size={18} />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h4>
                <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── How It Works Section ─── */}
      <section id="how-it-works" className="py-24 px-6 relative z-10" style={{ borderTop: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto text-center">
          <div className="space-y-2 mb-16">
            <span className="text-[9px] font-mono font-bold tracking-widest text-emerald-400 uppercase">
              ● HOW IT WORKS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-primary)' }}>
              From Data to Decision in 3 Simple Steps
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
            {/* Dotted connector lines on desktop */}
            <div className="hidden sm:block absolute top-[2.2rem] left-[18%] right-[18%] border-t border-dashed" style={{ borderColor: 'var(--border-strong)' }} />

            {[
              { num: '1', icon: Search, title: 'Search Company', desc: 'Enter any company name or ticker you want to analyze.' },
              { num: '2', icon: Cpu, title: 'ARGUS Analyzes', desc: 'Our AI analyzes financials, news, industry trends, and risks.' },
              { num: '3', icon: LineChart, title: 'Get Investment Insight', desc: 'Receive clear recommendation with confidence and evidence.' }
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.1 }}
                className="relative flex flex-col items-center text-center space-y-4"
              >
                {/* Number Circle */}
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs shadow-lg border"
                  style={{
                    backgroundColor: 'var(--bg-page)',
                    borderColor: 'rgba(16,185,129,0.3)',
                    color: '#10b981',
                    boxShadow: '0 0 10px rgba(16,185,129,0.2)'
                  }}
                >
                  {step.num}
                </div>

                {/* Card */}
                <div
                  className="w-full p-6 rounded-2xl border text-center transition-all duration-200 hover:border-slate-700/60"
                  style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                    <step.icon size={18} />
                  </div>
                  <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{step.title}</h4>
                  <p className="text-[13px] leading-relaxed max-w-[210px] mx-auto" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── About Us Section ─── */}
      <section id="about-us" className="py-28 px-6 relative z-10 border-t" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <span className="text-[13px] font-mono font-bold tracking-[0.2em] text-indigo-400 uppercase block">
              ● ABOUT US
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-primary)', lineHeight: '1.15' }}>
              Autonomous Quantitative Intelligence
            </h2>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              AlphaForge AI is an Explainable AI Investment Research Platform built for modern analysts, asset managers, and retail investors. We believe financial research should not rely on black-box predictions. Every recommendation generated by our AI Research Orchestrator, ARGUS, is backed by auditable data and checked against rigid schemas to guarantee institutional-grade credibility.
            </p>
          </div>

          {/* Grid of Core Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl border text-left space-y-4" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold font-mono text-sm">01</div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Explainable AI (XAI)</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                No opaque assumptions. Every rating, buy/sell decision, and SWOT assessment maps directly to verified primary disclosures, news articles, and SEC files.
              </p>
            </div>

            <div className="p-6 rounded-2xl border text-left space-y-4" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold font-mono text-sm">02</div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Engineered Orchestration</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                ARGUS runs dedicated sub-agents that gather news, evaluate balance sheets, audit competitor dynamics, and execute quantitative modeling concurrently.
              </p>
            </div>

            <div className="p-6 rounded-2xl border text-left space-y-4" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold font-mono text-sm">03</div>
              <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>Zero-Hallucination Guard</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Data validation schemas verify mathematical computations and data integrity at each stage of the analysis pipeline before presenting findings to users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Spotlight Search Modal ─── */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/75 backdrop-blur-sm"
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.95, y: -10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: -10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-xl rounded-2xl border p-5 shadow-2xl space-y-4"
              style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-strong)' }}
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-2 border-b" style={{ borderColor: 'var(--border)' }}>
                <span className="text-[11px] font-mono uppercase tracking-widest font-extrabold" style={{ color: 'var(--text-primary)' }}>Search Workspace</span>
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-1 rounded bg-white/5 border border-white/5 hover:bg-white/10 text-slate-400 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>

              {/* SearchBar wrapper */}
              <div className="relative">
                <SearchBar
                  onSearch={(q) => {
                    analyze(q);
                    setIsSearchOpen(false);
                  }}
                  isLoading={isLoading}
                  size="large"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}