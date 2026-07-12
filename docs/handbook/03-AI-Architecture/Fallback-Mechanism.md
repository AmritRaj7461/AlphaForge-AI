# Fallback Mechanism

## Goal

Never fail the entire analysis.

---

# Strategy

Primary Provider

↓

Retry

↓

Backup Provider

↓

Partial Result

↓

Reduce Confidence

↓

Continue

---

# Rules

Failures are isolated.

Other tools continue.

User receives report.

Missing sections are clearly identified.

---

# Never

Crash

Throw raw exceptions

Return empty dashboard