# ARGUS Specification

## Module

Autonomous Research & Guidance Utility System

---

## Purpose

ARGUS is the orchestration engine responsible for coordinating all research and AI reasoning.

---

## Responsibilities

- Validate request.
- Execute research tools.
- Aggregate data.
- Build prompt.
- Invoke Gemini.
- Validate output.
- Calculate confidence.
- Return final report.

---

## Workflow

Request

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

Response

---

## Rules

- Never call APIs directly.
- Never bypass validation.
- Never recommend without evidence.