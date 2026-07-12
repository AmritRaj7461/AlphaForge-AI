# Chat API

## Endpoint

POST /api/chat

---

## Purpose

Answer follow-up questions using the existing investment report.

---

## Request

```json
{
    "sessionId":"uuid",
    "question":"Should I hold this stock?"
}
```

---

## Response

```json
{
    "success":true,
    "answer":"...",
    "confidence":87
}
```

---

## Behaviour

Uses previous report context.

Does not restart analysis.

Does not call research tools again unless necessary.

---

## Errors

400

404

500