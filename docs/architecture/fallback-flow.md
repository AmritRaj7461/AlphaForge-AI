# Fallback Flow

```

Primary Provider

↓

Failure

↓

Retry

↓

Backup Provider

↓

Partial Data

↓

Confidence Reduction

↓

Structured Response

```

---

## Rules

Application must never crash.

Partial information is better than no information.

Missing sections must be clearly indicated.