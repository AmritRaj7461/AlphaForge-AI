/**
 * LoadingScreen Component — Redesigned premium progress screen
 * Displays step-by-step progress tracking for all 9 ARGUS pipeline stages.
 * Fixed scrollbar bleed by wrapping the container in an overflow-hidden card.
 * Uses smooth 800ms paced intervals for a high-end sequential checking flow.
 * Prevent duplicate ticks from parent re-renders by enforcing unique state updates and mounting once.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const STAGES = [
  { 
    id: 'company',    
    label: 'Company Profile',   
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ), 
    description: 'Resolving spelling typos, aliases, and corporate structure.' 
  },
  { 
    id: 'finance',    
    label: 'Financial Statements', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
      </svg>
    ), 
    description: 'Accessing income statements, balance sheets, and key ratios.' 
  },
  { 
    id: 'news',       
    label: 'News Collection',   
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
      </svg>
    ), 
    description: 'Retrieving recent news headlines and performing sentiment analysis.' 
  },
  { 
    id: 'competitor', 
    label: 'Competitor Analysis', 
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ), 
    description: 'Analyzing competitor peers and market multiples.' 
  },
  { 
    id: 'risk',       
    label: 'Risk Analysis',    
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ), 
    description: 'Performing business, operational, and macroeconomic risk audits.' 
  },
  { 
    id: 'argus',      
    label: 'Prompt Construction',       
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2m6-2v2M9 19v-2m6 0v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h1v1H9V9zm5 0h1v1h-1V9z" />
      </svg>
    ), 
    description: 'Compiling tool evidence and formatting arguments for reasoning.' 
  },
  { 
    id: 'gemini',     
    label: 'AI Reasoning',      
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ), 
    description: 'Running LLM router chain to formulate investment thesis.' 
  },
  { 
    id: 'validation', 
    label: 'Validation & Confidence',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ), 
    description: 'Asserting structural schemas and computing coverage indices.' 
  },
  { 
    id: 'dashboard',  
    label: 'Report Generation',    
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" />
      </svg>
    ), 
    description: 'Structuring reports and preparing dashboard metrics.' 
  },
];

const LoadingScreen = ({ company = 'Company', onComplete }) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [completedStages, setCompletedStages] = useState([]);
  const containerRef = React.useRef(null);

  // Auto-scroll unchecked active stage to the top of the frame
  useEffect(() => {
    if (!containerRef.current) return;
    const activeEl = containerRef.current.children[currentStage];
    if (activeEl) {
      containerRef.current.scrollTo({
        top: activeEl.offsetTop - 16,
        behavior: 'smooth'
      });
    }
  }, [currentStage]);

  useEffect(() => {
    // Smooth, premium 800ms paced progression through all 9 stages
    const stageDuration = 800;
    
    const intervals = STAGES.map((_, i) =>
      setTimeout(() => {
        setCompletedStages((prev) => prev.includes(i) ? prev : [...prev, i]);
        setCurrentStage((prev) => Math.min(i + 1, STAGES.length - 1));
        if (i === STAGES.length - 1 && onComplete) {
          onComplete();
        }
      }, stageDuration * (i + 1))
    );

    return () => intervals.forEach(clearTimeout);
  }, []); // Run exactly once on mount to keep timer indexes stable

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ backgroundColor: 'var(--bg-page)' }}>
      
      {/* Premium Background Glow Blurs */}
      <div className="absolute pointer-events-none rounded-full blur-[120px] opacity-10 animate-pulse-slow"
        style={{ top: '10%', left: '20%', width: '30rem', height: '30rem', backgroundColor: '#10b981' }} />
      <div className="absolute pointer-events-none rounded-full blur-[120px] opacity-10 animate-pulse-slow"
        style={{ bottom: '10%', right: '20%', width: '25rem', height: '25rem', backgroundColor: '#06b6d4' }} />

      <div className="w-full max-w-lg relative z-10">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-8"
        >
          <div className="relative mx-auto w-16 h-16 mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', boxShadow: '0 0 30px rgba(16,185,129,0.25)' }}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-2xl border border-emerald-400/20 animate-spin-slow"></div>
          </div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Analyzing <span className="text-gradient-emerald-cyan">{company}</span>
          </h2>
          <p className="text-xs font-mono mt-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            ARGUS reasoning pipeline active
          </p>
        </motion.div>

        {/* Frosted Stages Container with overflow hidden outer card to clip scrollbar */}
        <div className="glass-card mb-6 overflow-hidden" style={{ borderRadius: '16px' }}>
          <div ref={containerRef} className="p-4 space-y-2 max-h-[290px] overflow-y-auto custom-scrollbar">
            {STAGES.map((stage, idx) => {
              const isCompleted = completedStages.includes(idx);
              const isActive = currentStage === idx && !isCompleted;
              const isPending = idx > currentStage;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isPending ? 0.35 : 1, y: 0 }}
                  whileHover={{ scale: isPending ? 1 : 1.01 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="flex items-center gap-3.5 p-3 rounded-xl transition-all duration-300 relative overflow-hidden"
                  style={{
                    backgroundColor: isCompleted ? 'rgba(16,185,129,0.03)' : isActive ? 'rgba(6,182,212,0.08)' : 'transparent',
                    border: isCompleted ? '1px solid rgba(16,185,129,0.15)' : isActive ? '1px solid rgba(6,182,212,0.2)' : '1px solid transparent',
                  }}
                >
                  {/* Active progress glowing bar in the background */}
                  {isActive && (
                    <motion.div 
                      layoutId="loading-active-glow"
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-emerald-500/5 pointer-events-none"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}

                  {/* Stage Indicator Node */}
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 relative z-10"
                    style={{
                      backgroundColor: isCompleted ? '#10b981' : isActive ? 'rgba(6,182,212,0.15)' : 'var(--bg-elevated)',
                      color: isCompleted ? '#fff' : isActive ? '#06b6d4' : 'var(--text-muted)',
                      border: isCompleted ? 'none' : '1px solid var(--border)'
                    }}>
                    {isCompleted ? (
                      <motion.svg 
                        initial={{ scale: 0.5, rotate: -15 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    ) : isActive ? (
                      <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="text-[10px] font-mono">{idx + 1}</span>
                    )}
                  </div>

                  {/* Info Text */}
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-xs font-semibold tracking-wide transition-colors duration-300"
                      style={{ color: isCompleted ? '#10b981' : isActive ? '#06b6d4' : 'var(--text-secondary)' }}>
                      {stage.label}
                    </p>
                    {isActive && (
                      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[10px] mt-0.5 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {stage.description}
                      </motion.p>
                    )}
                  </div>

                  <span className={`text-sm relative z-10 ${isPending ? 'opacity-20' : ''}`} style={{ color: isActive || isCompleted ? '#10b981' : 'var(--text-muted)' }}>
                    {stage.icon}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Global Progress Bar */}
        <div className="glass-card p-4">
          <div className="flex justify-between items-center mb-2 text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>
            <span>PIPELINE STATUS</span>
            <span>{Math.round((completedStages.length / STAGES.length) * 100)}% COMPLETE</span>
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <motion.div 
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #10b981, #06b6d4)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${(completedStages.length / STAGES.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        <p className="text-[10px] text-center mt-6" style={{ color: 'var(--text-muted)' }}>
          ARGUS aggregates multi-source evidence to guarantee explainability. Please hold...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
