# Error Codes

## Standard Error

```json
{
    "success":false,
    "code":"API_TIMEOUT",
    "message":"Primary provider unavailable.",
    "fallback":true
}
```

---

## Error List

INVALID_REQUEST

COMPANY_NOT_FOUND

API_TIMEOUT

INVALID_JSON

RATE_LIMITED

PROVIDER_UNAVAILABLE

GEMINI_ERROR

FALLBACK_TRIGGERED

UNKNOWN_ERROR

---

## Design Principles

Errors must

- be predictable

- be structured

- never expose stack traces

- help frontend display useful messages