# Request Flow

```

User

↓

POST /api/analyze

↓

Controller

↓

Analysis Service

↓

ARGUS

↓

Research Tools

↓

Aggregation

↓

Prompt Builder

↓

Gemini

↓

Validator

↓

Confidence Engine

↓

Formatter

↓

Frontend Dashboard

```

---

## Goal

Every request follows exactly one pipeline.

No component bypasses ARGUS.