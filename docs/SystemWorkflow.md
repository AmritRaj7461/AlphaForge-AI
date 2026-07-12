# System Workflow

This document traces the end-to-end execution of a research request in AlphaForge AI, showing how user inputs map to backend processes and dashboard components.

---

## 1. Request Lifecycle Diagram

```text
User Search ──> [Company Resolver] ──> [Market Resolver] ──> [Provider Router]
                                                                  |
[Prompt Builder] <── [Parallel Tools (Finance/News/Risk/Peers)] <─+
       │
       v
  [Gemini API] ──> [Zod Schema Validator] ──> [Confidence Engine] ──> Dashboard Mount
```

---

## 2. Step-by-Step Processing Stages

### Stage 1: Ticker Resolving
When a search query is submitted (e.g., "Apple" or "TCS"), the system routes the query through the **Company Intelligence Layer** (`CompanyResolver.js`). This layer checks local registry profiles and maps the string to a valid ticker exchange code.

### Stage 2: Market Classification
The query then passes to the `MarketResolver.js` to determine the exchange (e.g., NASDAQ vs. NSE/BSE). This classification decides which third-party data providers can supply the records.

### Stage 3: Dynamic Provider Routing
The `ProviderRouter.js` checks credential health and selects the optimal endpoint. For Indian companies, it queries NSE/BSE feeds (or FMP fallback); for global tech companies, it queries Yahoo Finance or Alpha Vantage.

### Stage 4: Parallel Tool Execution
The **ARGUS Orchestrator** invokes parallel workers (`ToolManager.js`) to fetch:
- **Finance Tool**: Ratios and metrics.
- **News Tool**: Sentiment timelines.
- **Risk Tool**: SEC risk reports.
- **Competitor Tool**: Peer tickers.

### Stage 5: Response Validation & Guardrails
Raw results are structured into a prompt template, sent to the LLM (Gemini 2.5 with OpenAI/Groq failover), and parsed. The response is validated against Zod schemas. If validation fails, fallback parsing mechanisms clean up formatting to prevent application crashes.

### Stage 6: Dashboard Mounting
The validated JSON payload is returned to the React frontend, caching the output in session state, and rendering the dynamic dashboard.
