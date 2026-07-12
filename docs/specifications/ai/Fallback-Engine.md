# Fallback Engine Specification

## Purpose

Ensure report generation continues despite failures.

---

## Strategy

Primary Tool

↓

Retry

↓

Fallback Provider

↓

Partial Report

↓

Reduced Confidence

↓

Return Response

---

## Rules

- Never terminate analysis.
- Always return usable output.
- Clearly identify unavailable sections.