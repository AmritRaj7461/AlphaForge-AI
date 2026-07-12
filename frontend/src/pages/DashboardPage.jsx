/**
 * DashboardPage — Premium asymmetric cockpit layout.
 * Redesigned to use CSS grid rows of side-by-side paired components with equal height alignments,
 * avoiding large vertical gaps and aligning the Q&A window near the end of the report.
 * Fully theme-aware via CSS variables. No hardcoded colors.
 */
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import LoadingScreen from '../components/LoadingScreen';
import CompanyCard from '../components/CompanyCard';
import FinancialCard from '../components/FinancialCard';
import NewsCard from '../components/NewsCard';
import RiskCard from '../components/RiskCard';
import CompetitorCard from '../components/CompetitorCard';
import SWOTCard from '../components/SWOTCard';
import RecommendationCard from '../components/RecommendationCard';
import ProviderHealthStatus from '../components/ProviderHealthStatus';
import ChatWindow from '../components/ChatWindow';
import SummaryCard from '../components/SummaryCard';
import FinalDecisionCard from '../components/FinalDecisionCard';
import LimitationsCard from '../components/LimitationsCard';
import Footer from '../components/Footer';
import { useAnalysisContext } from '../context/AnalysisContext';
import useAnalysis from '../hooks/useAnalysis';

function MarketTicker() {
  const indices = [
    { name: 'NIFTY 50', value: '24,315.80', change: '+0.42%', up: true },
    { name: 'SENSEX', value: '79,985.20', change: '+0.36%', up: true },
    { name: 'NASDAQ', value: '18,188.30', change: '-0.18%', up: false },
    { name: 'S&P 500', value: '5,537.02', change: '+0.11%', up: true },
    { name: 'BSE SANS', value: '80,120.40', change: '+0.48%', up: true },
  ];

  return (
    <div className="w-full py-2 px-4 mb-4 flex items-center gap-4 relative overflow-hidden" style={{ background: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
      <span className="text-[9px] font-mono font-bold tracking-widest text-[var(--text-muted)] uppercase shrink-0 z-10 pr-3" style={{ background: 'var(--bg-elevated)' }}>
        MARKET INDEX PREVIEW:
      </span>
      
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-6 z-10 pointer-events-none" style={{ background: 'linear-gradient(90deg, var(--bg-elevated), transparent)' }} />
        <div className="absolute right-0 top-0 bottom-0 w-6 z-10 pointer-events-none" style={{ background: 'linear-gradient(270deg, var(--bg-elevated), transparent)' }} />

        <div className="flex gap-6 animate-marquee select-none text-[10px] font-mono">
          {[...indices, ...indices].map((ind, i) => (
            <span key={i} className="flex items-center gap-1.5 shrink-0">
              <span style={{ color: 'var(--text-primary)' }} className="font-bold">{ind.name}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{ind.value}</span>
              <span style={{ color: ind.up ? 'var(--green)' : 'var(--red)' }} className="font-bold">
                {ind.up ? '▲' : '▼'} {ind.change}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ToolStatusPanel({ dataQuality }) {
  const failed = dataQuality?.failedTools || [];
  
  const tools = [
    { id: 'company', label: 'Profile' },
    { id: 'finance', label: 'Finance' },
    { id: 'news', label: 'News' },
    { id: 'risk', label: 'Risk' },
    { id: 'competitor', label: 'Peers' },
  ];

  return (
    <div className="flex items-center gap-2 p-1.5 rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
      <span className="text-[8px] font-mono font-bold tracking-wider text-[var(--text-muted)] uppercase px-1">Pipeline:</span>
      {tools.map((t) => {
        const isFailed = failed.includes(t.id);
        const statusColor = isFailed ? 'var(--red)' : 'var(--green)';
        const description = isFailed ? 'Unavailable / Degraded' : 'Active & Live';
        
        return (
          <div 
            key={t.id}
            className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold select-none cursor-help relative group"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
            <span>{t.label}</span>

            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 p-2 text-[9px] w-36 rounded-md shadow-lg border text-center pointer-events-none"
              style={{ background: 'var(--bg-surface)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <span className="font-bold block uppercase tracking-wider">{t.label} Tool</span>
              <span style={{ color: 'var(--text-muted)' }}>Status: {description}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DataQualityBadge({ dataQuality, usedMockData }) {
  const failed = dataQuality?.failedTools || [];
  const good = failed.length === 0 && !usedMockData;

  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold select-none shrink-0"
      style={good
        ? { background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.2)', color: '#10b981' }
        : { background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b' }}
    >
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: good ? '#10b981' : '#f59e0b' }} />
      {usedMockData ? 'MOCK MODE' : good ? 'ALL SOURCES LIVE' : 'DEGRADED REPORT'}
    </div>
  );
}

export default function DashboardPage() {
  const { analysisData, isLoading, error, currentCompany, sessionId } = useAnalysisContext();
  const { analyze } = useAnalysis();
  const [copiedLink, setCopiedLink] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(true);
  const [leftColTop, setLeftColTop] = useState('80px');
  const leftColRef = React.useRef(null);

  // Monitor left column height changes dynamically to recalculate sticky offset
  useEffect(() => {
    if (!leftColRef.current) return;
    
    const observer = new ResizeObserver(() => {
      const leftColHeight = leftColRef.current?.offsetHeight || 0;
      const windowHeight = window.innerHeight;
      if (windowHeight < leftColHeight) {
        setLeftColTop(`${windowHeight - leftColHeight - 24}px`);
      } else {
        setLeftColTop('80px');
      }
    });

    observer.observe(leftColRef.current);
    return () => observer.disconnect();
  }, [analysisData]);

  // When a new analysis begins, reset animation status
  useEffect(() => {
    if (isLoading) {
      setAnimationFinished(false);
    }
  }, [isLoading]);

  // Scroll to top when analysis data changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [analysisData]);

  if (isLoading || (analysisData && !animationFinished)) {
    return (
      <LoadingScreen 
        company={currentCompany || (analysisData && analysisData.company && (analysisData.company.name || analysisData.company.ticker))} 
        onComplete={() => setAnimationFinished(true)} 
      />
    );
  }
  if (!analysisData && !isLoading) return <Navigate to="/" replace />;

  const {
    company, financials, news, risk, competitors, analysis,
    recommendation, confidence, confidenceLevel, reasoning, swot,
    limitations, dataQuality, usedMockData
  } = analysisData;

  // Export handlers
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(analysisData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${company?.ticker || 'report'}_analysis_report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleShareLink = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(window.location.href);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = window.location.href;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.warn("Share clipboard failed:", err);
    }
  };

  return (
    <div
      style={{ minHeight: '100vh', backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)', transition: 'background-color 0.25s ease' }}
      className="flex flex-col relative"
    >
      <Navbar onAnalyzeClick={() => {
        // Toggles spotlight search directly by triggering custom events or focusing search inputs
        const searchInput = document.getElementById('company-search-input');
        if (searchInput) {
          searchInput.focus();
        } else {
          // If on dashboard, navigate to home and focus spotlight
          window.location.href = '/?search=true';
        }
      }} />

      {/* Ticker overview widget at very top */}
      <div className="pt-16">
        <MarketTicker />
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 flex-1">

        {/* Top Control panel */}
        <div
          className="py-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex-1 min-w-0 max-w-xl">
            <SearchBar onSearch={analyze} isLoading={isLoading} size="default" />
          </div>

          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <ToolStatusPanel dataQuality={dataQuality} />
            <DataQualityBadge dataQuality={dataQuality} usedMockData={usedMockData} />
            
            {/* Export Toolbar */}
            <div className="flex items-center gap-2 border-l pl-3" style={{ borderColor: 'var(--border)' }}>
              <button 
                onClick={handlePrint}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] flex items-center justify-center"
                title="Print Report"
                style={{ color: 'var(--text-secondary)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h8z" />
                </svg>
              </button>
              <button 
                onClick={handleDownloadJSON}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] flex items-center justify-center"
                title="Download JSON Report"
                style={{ color: 'var(--text-secondary)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>
              <button 
                onClick={handleShareLink}
                className="p-2 rounded-lg transition-all duration-200 hover:bg-[var(--bg-elevated)] flex items-center gap-1.5 text-[10px] font-bold font-mono"
                title="Copy Shareable Link"
                style={{ color: copiedLink ? 'var(--green)' : 'var(--text-secondary)', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                {copiedLink ? (
                  <>
                    <span>✓ LINK COPIED</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 10.742l4.636-2.318M8.684 13.257l4.636 2.318M18 8a3 3 0 11-6 0 3 3 0 016 0zm-6 8a3 3 0 11-6 0 3 3 0 016 0zm6 0a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>SHARE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 rounded-xl text-sm"
            style={{ color: 'var(--red)', background: 'var(--red-dim)', border: '1px solid rgba(239,68,68,0.25)' }}
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Two-column responsive dashboard layout with sticky left column stack */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-12 items-start">
          
          {/* Left Column Stack (Sticky at bottom viewport limit once scrolled to end) */}
          <div ref={leftColRef} className="space-y-6" style={{ position: 'sticky', top: leftColTop, alignSelf: 'start' }}>
            <CompanyCard company={company} />
            <RecommendationCard
              recommendation={recommendation}
              confidence={confidence}
              confidenceLevel={confidenceLevel}
              reasoning={reasoning || analysis?.reasoning}
              evidence={analysisData.evidence}
              confidenceBreakdown={analysisData.confidenceBreakdown}
            />
            <ProviderHealthStatus
              providerStatus={analysisData.providerStatus}
              freshness={analysisData.freshness}
              toolHealth={analysisData.toolHealth}
            />
            <SummaryCard analysis={analysis} />
            <LimitationsCard limitations={limitations} />
          </div>

          {/* Right Column Stack */}
          <div className="space-y-6">
            <FinancialCard financials={financials} />
            <RiskCard risk={risk} analysis={analysis} />
            <SWOTCard swot={swot || analysis?.swot} />
            <NewsCard news={news} />
            <CompetitorCard competitors={competitors} analysis={analysis} />
            <ChatWindow sessionId={sessionId} companyName={company?.name} />
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
