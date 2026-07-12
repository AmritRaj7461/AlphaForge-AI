/**
 * ChatWindow — Ask ARGUS follow-up Q&A chat panel.
 * Upgraded with: Suggested follow-ups, auto-scroll, typing animations,
 * text streaming simulation, message copy, regeneration, and conversation clearing.
 * Fully theme-aware with CSS variables.
 */
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sendChatMessage } from '../services/apiClient';

const QUICK = [
  'Why BUY?',
  'Why HOLD?',
  'Why PASS?',
  'Compare with competitors',
  'Biggest risks',
  'Future outlook',
  'Valuation concerns',
  'Revenue growth',
  'Cash flow',
  'Competitive advantages',
  'Confidence explanation'
];

function Bubble({ role, content, confidence, onCopy, onRegenerate, isLastAssistant }) {
  const isUser = role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 group/bubble ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-mono font-bold"
        style={
          isUser
            ? { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }
            : { background: 'linear-gradient(135deg,#10b981,#06b6d4)', color: '#fff' }
        }
      >
        {isUser ? 'U' : 'A'}
      </div>

      {/* Bubble Container */}
      <div className="max-w-[80%] flex flex-col">
        <div
          className={`rounded-xl px-4 py-3 relative text-left ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
          style={
            isUser
              ? { background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-primary)' }
              : { background: 'var(--bg-card)',     border: '1px solid var(--border)', color: 'var(--text-primary)' }
          }
        >
          <p className="text-xs leading-relaxed whitespace-pre-wrap select-text">{content}</p>
          {!isUser && confidence !== undefined && (
            <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-dashed" style={{ borderColor: 'var(--border)' }}>
              <span className="text-[8px] font-mono uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                ARGUS CONFIDENCE: {confidence}%
              </span>
            </div>
          )}
        </div>

        {/* Action buttons (Copy/Regenerate) shown on hover */}
        {!isUser && (
          <div className="flex items-center gap-2.5 mt-1.5 px-1 opacity-0 group-hover/bubble:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="text-[9px] font-semibold transition-colors flex items-center gap-1 hover:text-emerald-500"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              <span>{copied ? '✓ Copied' : '⎘ Copy'}</span>
            </button>
            
            {isLastAssistant && onRegenerate && (
              <button
                onClick={onRegenerate}
                className="text-[9px] font-semibold transition-colors flex items-center gap-1 hover:text-cyan-500"
                style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <span>⟳ Regenerate</span>
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function ChatWindow({ sessionId, companyName }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastUserQuery, setLastUserQuery] = useState('');
  const feedRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize welcome message
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        content: `Research Complete.\n\nI analyzed:\n✓ Company Profile\n✓ Financial Statements\n✓ Financial Ratios\n✓ Industry\n✓ Competitors\n✓ Market Sentiment\n✓ Risks\n✓ Confidence\n\nAsk anything about ${companyName || 'this company'}.`,
        confidence: 98
      }
    ]);
  }, [companyName]);

  // Auto-scroll the feed container
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTo({
        top: feedRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, loading]);

  // Simulate text streaming
  const streamText = (fullText, confidenceValue) => {
    let index = 0;
    const words = fullText.split(' ');
    
    setMessages(prev => [...prev, { role: 'assistant', content: '', confidence: confidenceValue }]);

    const interval = setInterval(() => {
      if (index < words.length) {
        setMessages(prev => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === 'assistant') {
            last.content = words.slice(0, index + 1).join(' ');
          }
          return next;
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 45);
  };

  const send = async (customQuery = null) => {
    const q = (customQuery || input).trim();
    if (!q || loading || !sessionId) return;
    
    if (!customQuery) setInput('');
    setLastUserQuery(q);

    setMessages(p => [...p, { role: 'user', content: q }]);
    setLoading(true);

    try {
      const res = await sendChatMessage(sessionId, q);
      setLoading(false);
      streamText(res.answer || 'No response details received.', res.confidence);
    } catch {
      setLoading(false);
      setMessages(p => [...p, { role: 'assistant', content: 'Connection timed out. Please try again.', confidence: 0 }]);
    }
  };

  const regenerate = () => {
    if (!lastUserQuery) return;
    setMessages(p => {
      const next = [...p];
      if (next.length > 0 && next[next.length - 1].role === 'assistant') {
        next.pop();
      }
      return next;
    });
    send(lastUserQuery);
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Conversation cleared. I'm ready for new follow-up questions regarding ${companyName || 'this company'}.`,
        confidence: 100
      }
    ]);
    setLastUserQuery('');
  };

  const canSend = Boolean(input.trim() && !loading && sessionId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="glass-card flex flex-col overflow-hidden"
      style={{ height: 520 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-4 justify-between" style={{ borderBottom: '1px solid var(--border)' }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)' }}>
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="min-w-0 text-left">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Ask ARGUS</p>
            <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>Follow-up Q&A sessions</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3.5">
          {messages.length > 1 && (
            <button
              onClick={clearChat}
              className="text-[10px] font-mono tracking-wider font-bold transition-all duration-200 hover:text-red-500"
              style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              CLEAR SESSION
            </button>
          )}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
            <span className="text-[9px] font-mono font-bold text-emerald-500">READY</span>
          </div>
        </div>
      </div>

      {/* Message Feed */}
      <div 
        ref={feedRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" 
        style={{ background: 'var(--bg-surface)' }}
      >
        {messages.map((m, i) => {
          const isLastAssistant = !loading && m.role === 'assistant' && i === messages.length - 1;
          return (
            <Bubble 
              key={i} 
              {...m} 
              onRegenerate={regenerate}
              isLastAssistant={isLastAssistant}
            />
          );
        })}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-mono font-bold shrink-0" style={{ background: 'linear-gradient(135deg,#10b981,#06b6d4)', color: '#fff' }}>A</div>
            <div className="rounded-xl rounded-tl-sm px-4 py-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1.5 py-1">
                {[0,150,300].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Suggested Follow-up Prompts */}
      <div className="px-4 py-2 flex gap-1.5 overflow-x-auto whitespace-nowrap custom-scrollbar shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
        {QUICK.map(q => (
          <button
            key={q}
            onClick={() => { setInput(q); inputRef.current?.focus(); }}
            className="text-[10px] font-semibold px-2.5 py-1 rounded-full transition-colors cursor-pointer shrink-0"
            style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border)' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--green)'; e.currentTarget.style.borderColor = 'var(--green)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input controls */}
      <div className="p-3 flex gap-2 shrink-0" style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
        <input
          ref={inputRef}
          id="chat-input"
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask a follow-up question…"
          disabled={loading || !sessionId}
          style={{
            flex: 1,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: '0.625rem',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8125rem',
            color: 'var(--text-primary)',
            outline: 'none',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s ease',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--green)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button
          id="chat-send-button"
          onClick={() => send()}
          disabled={!canSend}
          style={{
            padding: '0.5rem 0.875rem',
            borderRadius: '0.625rem',
            border: 'none',
            cursor: canSend ? 'pointer' : 'not-allowed',
            background: canSend ? 'var(--green)' : 'var(--bg-elevated)',
            color: canSend ? '#fff' : 'var(--text-muted)',
            transition: 'background 0.2s ease, color 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {loading ? (
            <span className="spinner" style={{ width: 16, height: 16 }} />
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ transform: 'rotate(90deg)' }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          )}
        </button>
      </div>
    </motion.div>
  );
}
