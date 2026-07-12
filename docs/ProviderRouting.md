# Dynamic Provider Routing & Market Support

This document details how AlphaForge AI resolves tickers, classifies exchanges, and routes queries to support both Indian domestic and global equities.

---

## 1. Company Intelligence Layer

Equities are resolved through a two-step mapping process:

1.  **Registry Resolving**: The query is normalized by stripping punctuation and suffix terms (like "Ltd", "Inc", "Corp").
2.  **Exchange Appending**: Tickers are mapped to their primary exchanges (e.g., Apple $\rightarrow$ `AAPL` on NASDAQ, Tata Consultancy Services $\rightarrow$ `TCS` on NSE).

---

## 2. Market Classification Routing

Once resolved, the ticker is classified by the `MarketResolver`:

```text
               Ticker Input
                    |
          Does it end with .NS? (NSE)
             /             \
          (Yes)            (No)
           /                 \
  Query Indian Feed     Query Global Feed
  (FMP / Live Feeds)    (Yahoo Finance / Alpha Vantage)
```

---

## 3. Indian Domestic Market Coverage

AlphaForge supports prominent Indian symbols across NSE and BSE, including:
- **TCS** (`TCS.NS`)
- **Paytm** (`PAYTM.NS`)
- **Sonata Software** (`SONATACO.NS`)
- **Infosys** (`INFY.NS`)
- **Reliance Industries** (`RELIANCE.NS`)

The pipeline handles local currency symbols (₹ / INR), adjusts market capitalization limits for mid/large-cap definitions, and maps regional news sentiment to the timeline.
