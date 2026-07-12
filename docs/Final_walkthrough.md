# AlphaForge AI - Final Walkthrough & Technical Specifications

This walkthrough covers the entire system architecture, core engineering decisions, market support engines, and assignment mapping specs for AlphaForge AI.

---

## 1. Overview
AlphaForge AI is an institutional-grade investment research platform. It leverages an orchestrator engine called **ARGUS** to pull financial records, compute valuations, analyze risks, track sentiment, and present type-safe explanations to retail and professional investors.

---

## 2. Technology Stack

| Layer | Technologies Used | Key Purpose |
| :--- | :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Lucide icons | Renders glassmorphic terminals and interactive pages |
| **Backend** | Node.js, Express, Zod | Handles REST APIs, rate-limiting, and schema checks |
| **AI Layer** | Google Gemini (Primary), OpenAI & Groq (Failovers) | Reason-based synthesis and report compilation |
| **Caching** | Session and local storage caching | Accelerates response times for repeated tickers |

---

## 3. Architecture Summary

```text
React Client (Dashboard UI)
       │
       ▼ (REST API Calls)
Express Server (API Controller)
       │
       ▼ (Executes Orchestrator)
ARGUS AI Orchestrator
       ├── Parallel Research tools (Finance, News, Risks, Peers)
       ├── Prompt Builder & LLM Chain (Gemini / OpenAI / Groq)
       └── Zod Schema Verification & Text Cleaners
```

---

## 4. Detailed Engineering Decisions

### A. Dynamic Provider Routing
The backend automatically resolves exchange codes and queries suitable API hosts. Global tickers (e.g., AAPL) query NASDAQ/NYSE datasets, while Indian tickers (e.g., TCS, Paytm) query NSE/BSE configurations.

### B. Company Intelligence Layer
Normalizes arbitrary search inputs by stripping punctuation and corporate suffixes (e.g., "Ltd", "Inc") and mapping fuzzy titles to valid registry tickers.

### C. Explainability Engine
Exposes all primary references. When users ask questions in the Ask ARGUS panel, the LLM includes inline bracket citations mapping back to financial statements or news items.

### D. Confidence Engine
A custom mathematical formula compiles numerical metrics (value growth, margins, P/E boundaries, news sentiment values) to output a unified confidence percentage score.

### E. Hallucination Prevention
Uses strict Zod validations. Output schemas dictate exact limits (e.g., exactly 2 points per SWOT quadrant). If validation fails, standard cleanup regex processes correct bracket issues automatically.

### F. Caching & Parallel Execution
- Uses parallel `Promise.all` triggers to execute analysis tools concurrently.
- Implements memory caching to store parsed corporate JSON datasets, avoiding redundant external API calls.

---

## 5. Assignment Mapping & Specifications
- **Overview & Trade-offs**: Fully covered in `docs/Tradeoffs.md`.
- **Engineering Decisions**: Described in `docs/EngineeringDecisions.md`.
- **Example Runs**: Generated reports for Apple, Microsoft, NVIDIA, TCS, Paytm, and Sonata Software under `docs/example-runs/`.
