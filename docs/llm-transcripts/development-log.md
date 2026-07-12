# AI-Assisted Engineering Development Log

This document compiles the chronological engineering log, iteration cycles, and system design decisions made during the AI-assisted development of AlphaForge AI.

> [!NOTE]
> The associated conversation logs and prompt records represent consolidated summaries of the original engineering sessions. Different LLMs were utilized for specialized tasks throughout development:
> - **ChatGPT** was leveraged for Architectural and System Design Conversations.
> - **Google Gemini** was used for financial API Integration and backend ARGUS orchestrator logic.
> - **Claude** was utilized for UI/UX layouts, Tailwind/CSS styling, and React visual components.

---

## 1. Project Objective
The primary engineering objective of AlphaForge AI was to build a fully explainable, high-fidelity quantitative analysis platform that resolves black-box limitations of standard generative AI advisors. The goal was to trace every investment recommendation back to primary financial feeds and SEC text filings while keeping data schemas type-safe and hallucination-free.

---

## 2. Architecture & Prompt Engineering Evolution

### Phase 1: Raw Output & Parsing Vulnerabilities (V1.0)
Initially, the pipeline sent raw statement text directly to the Gemini model and requested structured metrics. 
- *Problem*: Small alterations in syntax, markdown headers, or JSON wrapping caused runtime parsing errors on the backend server.
- *Solution*: Developed a structured LangChain query system backed by strict Zod schema checking rules.

### Phase 2: Schema Enforcement & Fallback Strategy (V2.0)
Introduced the `analysisSchema.js` layer. If a model output failed schema validation (e.g. key mismatches or formatting issues), the backend routed the query to secondary failover nodes (OpenAI `gpt-4o-mini` and Groq `Llama-3.3-70b-versatile`).

### Phase 3: Cockpit Layout Refactoring & Dynamic Offsets (V3.0)
- **Dashboard Grid System**: Resized cards and paired them in a side-by-side layout to eliminate vertical gaps.
- **Asymmetric Sticky Columns**: Designed a `ResizeObserver` listener in React to dynamically compute Left Column dimensions, pinning the centerpiece verdict at the bottom of the viewport while allowing the right column to scroll freely.
- **Mockup Preview Carousel**: Integrated an auto-rotating preview dashboard on the landing page that dynamically shifts CSS theme colors (green vs. amber) based on stock ratings.

---

## 3. Core Functional Engine Iterations

### A. Company Resolver & Exchange Classification
Implemented the `CompanyResolver` to normalize punctuation and corporate suffixes (e.g. "Ltd", "Inc"). Tickers are matched against the local registry, and mapped to NSE/BSE or NYSE/NASDAQ exchanges.

### B. SWOT Matrix Alignment
- *Problem*: Large descriptions inside quadrants caused the card to expand unpredictably, breaking layout baselines.
- *Solution*: Aligned the SWOT Matrix height to `460px` to match the adjacent Thesis card, removed accordion expansions, and limited all outputs to exactly two concise bullet points per quadrant.

### C. Confidence Engine
Formula computes metrics (e.g., P/E multiples, profit margins, debt ratios) alongside sentiment timeline values to output a unified evidence confidence percentage.

### D. News Sentiment & Competitor Tables
The sentiment timelines utilize actual NewsAPI payloads, mapping article counts to positive/neutral segments. The peer table correlates competitor ratios dynamically.

---

## 4. Lessons Learned & Future Improvements
- **Schema Validation is Essential**: LLM output formats must be treated as untrusted user inputs. Strict schemas like Zod prevent runtime crashes.
- **Modular Failovers**: Multi-API key rotation sequences prevent system downtime when facing free-tier limits.
- **Asymmetric UI Locks**: Tracking DOM layout dimensions with React observers resolves visual layout clipping issues.
