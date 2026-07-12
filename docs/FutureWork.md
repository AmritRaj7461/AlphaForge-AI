# Future Roadmap

This document outlines the strategic engineering path and future feature additions planned for AlphaForge AI.

---

## 1. Multi-Agent Orchestration
*   **Concept**: Transitioning the single-agent **ARGUS** model into a hierarchical multi-agent framework.
*   **Plan**:
    - **Macro Agent**: Focuses on inflation, interest rates, and sector trends.
    - **Financial Auditor Agent**: Performs deep-dive valuations and balance sheet stress tests.
    - **News & Sentiment Agent**: Monitors live social media feeds (Twitter, Reddit) for market signals.
    - **Orchestrator Agent**: Aggregates sub-agent findings and builds the final consensus report.

---

## 2. Retrieval-Augmented Generation (RAG) over Annual Reports
*   **Concept**: Allowing users to query historical PDF reports (10-K, 10-Q) directly through the Ask ARGUS chat window.
*   **Plan**: Implement a vector database (e.g., Pinecone or Chroma) and chunk local annual filings to extract footnotes and management commentary.

---

## 3. Advanced Features
- **Portfolio Watchlists**: LocalStorage-based watchlists allowing users to monitor multiple tickers simultaneously.
- **Exporting Capabilities**: PDF and CSV download tools for financial pillars and risk metrics.
- **Voice Intelligence**: Speech-to-text querying in the search modal and Ask ARGUS chat window.
