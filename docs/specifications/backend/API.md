# Backend API Specification

## Purpose

The Backend API acts as the communication layer between the frontend and the AI engine.

---

## Responsibilities

- Validate incoming requests.
- Route requests to appropriate services.
- Invoke ARGUS.
- Return standardized JSON responses.
- Handle errors gracefully.

---

## Endpoints

### POST /api/analyze

Input

```json
{
  "company": "NVIDIA"
}
```

Output

```json
{
  "success": true,
  "report": {}
}
```

---

### POST /api/chat

Follow-up questions using existing report context.

---

### GET /api/health

Returns service health status.

---

## Rules

- JSON only.
- Stateless APIs.
- No frontend API keys.
- Standard error format.