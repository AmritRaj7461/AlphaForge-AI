# System Trade-offs & Limitations

This document lists the architectural compromises, limitations, and intentional exclusions made in the current release of AlphaForge AI.

---

## 1. Intentional Exclusions

| Excluded Feature | Engineering Rationale | Alternative Provided |
| :--- | :--- | :--- |
| **Authentication & User Profiles** | Adding user accounts shifts the scope to database administration, security auditing, and token storage. | Session caching and direct search querying to focus on analysis performance. |
| **Real-time Portfolio Tracking** | Transaction histories and stock balances require brokerage connections and complex ledger updates. | Centerpiece recommendations and peer analysis to support research-level research. |
| **Historical Report PDF Exports** | Server-side PDF generation tools (like Puppeteer) introduce package weight and memory overhead. | Persistent interactive screen layouts and printable browser stylesheets. |

---

## 2. Technical Limitations

### API Quota Controls
- **NewsAPI Free Tier**: Does not allow querying historical articles beyond 30 days. Timeline feeds display current stories.
- **Alpha Vantage Limits**: The free tier is restricted to 25 requests per day, necessitating FMP fallbacks and aggressive internal memory caching.
