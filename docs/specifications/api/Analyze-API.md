# Analyze API

## Endpoint

POST /api/analyze

---

## Purpose

Generate a complete investment research report for a company.

---

## Request

Content-Type

application/json

```json
{
  "company": "NVIDIA"
}
```

---

## Success Response

```json
{
  "success": true,
  "report": {
    "company": {},
    "financials": {},
    "news": [],
    "risk": {},
    "competitors": [],
    "recommendation": "BUY",
    "confidence": 91,
    "reasoning": "...",
    "limitations": []
  }
}
```

---

## Status Codes

200 Success

400 Invalid Request

404 Company Not Found

429 Too Many Requests

500 Internal Server Error

503 Provider Unavailable

---

## Notes

- Executes complete ARGUS pipeline.
- Returns structured JSON.
- Supports fallback mode.