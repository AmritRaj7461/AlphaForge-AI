# Confidence Engine Specification

## Purpose

Compute an evidence-based confidence score.

---

## Inputs

- Financial Coverage
- News Coverage
- Risk Coverage
- Data Completeness
- Validation Quality

---

## Output

Integer (0–100)

---

## Rules

- Missing data lowers confidence.
- Validation failures reduce confidence.
- Confidence is deterministic.