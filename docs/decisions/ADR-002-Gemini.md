# ADR-002

# Title

Use Gemini as the Primary Large Language Model

---

## Status

Accepted

---

## Context

AlphaForge AI requires an LLM capable of

- Long context windows
- Structured JSON generation
- Strong reasoning
- Cost-effective usage
- Reliable API support

---

## Decision

Google Gemini will be used as the primary reasoning engine.

Gemini is responsible only for analysis and recommendation.

It is not responsible for collecting external data.

---

## Responsibilities

Gemini

✓ Analyze

✓ Compare

✓ Summarize

✓ Recommend

Gemini

✗ Fetch APIs

✗ Validate Companies

✗ Calculate Confidence

---

## Benefits

Large Context Window

Fast Response

Structured Output

Good Cost Efficiency

Future LangChain Compatibility