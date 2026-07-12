# Tool Orchestration

## Objective

Collect all research before invoking Gemini.

---

# Execution Order

Company Tool

↓

Finance Tool

↓

News Tool

↓

Risk Tool

↓

Competitor Tool

↓

Aggregation

↓

Prompt Construction

↓

Gemini

---

# Rules

Every tool returns JSON.

Tools never communicate with Gemini.

Tools execute independently.

Failures trigger fallback.

Partial data is acceptable.

---

# Aggregation

Normalize

Merge

Validate

Deduplicate

Prepare Prompt