# Key Engineering Decisions

This document highlights the core engineering decisions made during the development of AlphaForge AI and explains why specific architectural paths were chosen.

---

## 1. Zod Schema Validation
*   **Decision**: Enforcing strict Zod validation on all structured LLM payloads.
*   **Why**: AI models are prone to hallucinating metrics, mismatching SWOT counts, or altering keys. Enforcing Zod ensures that the dashboard components receive reliable, type-safe data structures.

---

## 2. Parallel Tool Execution
*   **Decision**: Using concurrent `Promise.all` workers to fetch financials, news, risks, and competitor data.
*   **Why**: Sequential API requests would lead to unacceptable latencies (over 10-15 seconds). Parallel execution reduces overall database ingestion time to under 3 seconds.

---

## 3. Google Gemini as Primary, with OpenAI/Groq Failover
*   **Decision**: Standardizing on Gemini 2.5 Flash as the primary reasoning engine, with secondary routing to OpenAI (gpt-4o-mini) and Groq (Llama-3.3).
*   **Why**: Gemini offers fast response times, structured outputs, and a free tier. The fallback engine ensures that API rate limits on any single provider do not cause system failures.

---

## 4. BUY / HOLD / PASS Rating System
*   **Decision**: Replaced the traditional *BUY / SELL* indicators with a *BUY / HOLD / PASS* rating scale.
*   **Why**: 
    - The platform is designed for research discovery and screening, rather than trade execution.
    - **PASS** represents companies with insufficient data quality, excessive volatility, or elevated risk profile where taking a position is discouraged.
    - **HOLD** indicates companies with strong fundamentals that face near-term macro headwinds (e.g., Tesla).
