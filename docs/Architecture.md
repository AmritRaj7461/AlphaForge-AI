# System Architecture

This document details the software architecture of AlphaForge AI.

## Technical Stack Overview

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend UI** | React (Vite) | Client-side reactive terminal and interactive dashboard |
| **Styling** | Vanilla CSS + Tailwind | Premium glassmorphism dark-theme styles with active theme token hooks |
| **API Server** | Node.js + Express | Request routing, caching, and intelligence orchestration |
| **AI Orchestrator** | LangChain / Gemini 2.5 | Multi-tool invocation, thesis building, and risk processing |
| **Validation** | Zod | Verification of structural JSON outputs from LLM calls |

---

## Technical Block Diagram

```text
User Request
     │
     ▼
+──────────────────────────+
|     Company Resolver     |  <-- Spellcheck, fuzzy matching (Fuse.js)
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|     Market Resolver      |  <-- Exchange classification (Domestic vs. Global)
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|     Provider Router      |  <-- Route based on market (NSE, BSE, FMP, AlphaVantage)
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|       Tool Manager       |  <-- Concurrent execution, timeouts, retries
+──────────────────────────+
     │
     ├── CompanyTool       --> Profile, Website, Headquarters
     ├── FinanceTool       --> Financial Statements & Key Margins
     ├── NewsTool          --> Sentiment timeline & RSS fallbacks
     ├── RiskTool          --> Severity & evidence metrics
     └── CompetitorTool    --> Peer group comparisons
     │
     ▼
+──────────────────────────+
|     Data Aggregator      |  <-- Standardize to unified JSON schemas
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|      Prompt Builder      |  <-- Compile prompt template context
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|   ARGUS Orchestrator     |  <-- Dispatch to Gemini (Primary) or Failovers (Groq/OpenAI)
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|    Response Validator    |  <-- Zod parsing schema validations
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|    Confidence Engine     |  <-- Scoring deductions (Capped at 99%)
+──────────────────────────+
     │
     ▼
+──────────────────────────+
|      Report Builder      |  <-- Compile charts and cards for frontend
+──────────────────────────+
     │
     ▼
React Frontend
```

---

## Architecture Boundaries

### 1. Company Intelligence Layer
To satisfy the Single Responsibility Principle, all input parsing, typo correction, and exchange classification is extracted into the `intelligence` folder. Tools accept only a normalized, canonical company object rather than raw user input, preventing code duplication.

### 2. Provider Routing & Normalization
The system is fully decoupled from specific external vendors. The `ProviderRouter` handles domestic/international endpoints based on exchange status, and the `DataNormalizer` standardizes responses into a single schema before serving downstream models.

### 3. ToolManager Concurrency
Instead of raw endpoints calling external APIs, the `ToolManager` coordinates parallel fetches, monitors tool health, manages timeouts (e.g. 5-second locks), and handles service fallbacks to local static registries.

### 4. Asymmetric Dashboard Columns
The dashboard layout splits metrics into two major areas to maintain readability:
- **Left Column (Primary Verdicts)**: Holds core profiles, investment ratings, and the SWOT matrix. It uses a custom `ResizeObserver` listener in React to dynamically compute viewport offsets and stick to the screen bottom.
- **Right Column (Expanded Details)**: Displays financial pillar tables, news sentiment timelines, peer comparisons, and the interactive Ask ARGUS chat window.

### 5. SWOT Height Constrainment
To match the adjacent thesis card baseline, the SWOT Card is constrained to exactly `460px` height. Accordions are removed to present information cleanly, and exactly two points are shown per quadrant to prevent vertical overflows.
