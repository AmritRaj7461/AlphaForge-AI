# Implementation Contracts

## Purpose

This document defines mandatory implementation requirements.

These requirements must be followed by every developer and AI coding assistant.

---

# Contract 1

Frontend never communicates with Gemini.

Only Backend communicates with LLM.

---

# Contract 2

Every request must pass through ARGUS.

No component may bypass ARGUS.

---

# Contract 3

Research Tools never communicate with Gemini.

Tools only collect structured information.

---

# Contract 4

Every Tool returns standardized JSON.

---

# Contract 5

Fallback Manager handles all provider failures.

Individual tools never terminate execution.

---

# Contract 6

Every recommendation contains

Recommendation

Confidence

Evidence

Limitations

---

# Contract 7

Every API returns

Success

or

Structured Error JSON.

---

# Contract 8

Version 1.0 implements

✓ Single ARGUS

✓ Modular Tools

✓ Explainable Reports

✓ Confidence Engine

✓ Fallback Engine

---

# Contract 9

Version 2.0 replaces modular tools with specialized AI Agents.

No redesign should be necessary.

---

# Contract 10

Future components must preserve backward compatibility.

Never redesign existing interfaces without updating the Blueprint.

---

# Acceptance Criteria

Version 1.0 is considered complete when:

✓ User can search any supported company.

✓ ARGUS completes research.

✓ Report is generated.

✓ Confidence score is displayed.

✓ Explainability is available.

✓ Fallback mechanism functions correctly.

✓ Deployment succeeds.