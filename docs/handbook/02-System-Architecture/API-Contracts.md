# API Contracts

---

# POST /api/analyze

Purpose

Analyze a company.

Request

```json
{
    "company":"NVIDIA"
}
```

Response

```json
{
    "success":true,

    "company":{},    

    "financials":{},

    "news":[],

    "risk":{},

    "competitors":[],

    "recommendation":"BUY",

    "confidence":91,

    "reasoning":"...",

    "generatedAt":"..."
}
```

---

Status Codes

200

Success

400

Invalid Request

404

Company Not Found

429

Rate Limited

500

Internal Error

503

Provider Unavailable

---

# POST /api/chat

Purpose

Follow-up Questions

Request

```json
{
 "sessionId":"...",
 "question":"Should I hold this stock?"
}
```

Response

```json
{
 "answer":"...",
 "confidence":89
}
```

---

# GET /api/health

Purpose

Health Check

Response

```json
{
 "status":"healthy"
}
```

---

# Error Format

```json
{
 "success":false,

 "code":"API_TIMEOUT",

 "message":"Primary provider unavailable.",

 "fallback":true
}
```

---

# API Rules

Only Backend exposes APIs.

Frontend never communicates with external providers.

Responses must always follow standardized JSON.