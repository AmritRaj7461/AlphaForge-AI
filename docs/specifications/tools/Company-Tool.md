# Company Tool Specification

## Purpose

Retrieve and validate company profile information.

---

## Input

- Company Name
- Stock Symbol

---

## Output

```json
{
  "name": "",
  "ticker": "",
  "sector": "",
  "industry": "",
  "headquarters": "",
  "website": "",
  "description": ""
}
```

---

## Responsibilities

- Validate company.
- Fetch profile.
- Normalize response.
- Return structured JSON.

---

## Failure Handling

Retry

↓

Fallback Provider

↓

Partial Response

↓

Continue