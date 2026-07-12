# Third-Party Data Providers & API Requirements

AlphaForge AI aggregates financial ratios, news sentiment, and company details from multiple providers to maintain high uptime.

---

## 1. Provider Reference Sheet

| Provider | Endpoint | Scope | Free Tier Constraints |
| :--- | :--- | :--- | :--- |
| **Google AI Studio** | `https://generativelanguage.googleapis.com` | Gemini 2.5 LLM reasoning | 15 RPM (Requests Per Minute) |
| **Alpha Vantage** | `https://www.alphavantage.co` | Financial statements & ratios | 25 requests/day |
| **NewsAPI.org** | `https://newsapi.org` | Sentiment timelines & headlines | 100 requests/day (no history > 30 days) |
| **Financial Modeling Prep** | `https://financialmodelingprep.com` | Domestic profiles & peer listings | 250 requests/day |

---

## 2. API Failover Strategy

To bypass free-tier rate limits, the backend implements a secondary LLM provider routing sequence:

```text
[Gemini Request] 
      │
      ├── (Succeeds) ──> Return payload
      │
      └── (Fails/Rate Limit) ──> [OpenAI gpt-4o-mini]
                                        │
                                        ├── (Succeeds) ──> Return payload
                                        │
                                        └── (Fails) ──> [Groq Llama-3.3]
```
This failover sequence prevents service disruptions due to single-point rate limits.
