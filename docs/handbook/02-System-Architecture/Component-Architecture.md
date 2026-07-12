# Component Architecture

## Purpose

This document defines every major software component of AlphaForge AI.

Every component has one responsibility.

Every component communicates only through well-defined interfaces.

---

# System Components

```
Frontend

↓

Backend API

↓

ARGUS

↓

Research Layer

↓

AI Layer

↓

Response Layer

↓

Dashboard
```

---

# Frontend

Responsibilities

- User Authentication (Future)
- Company Search
- Dashboard
- Loading Progress
- Charts
- Report Rendering
- Follow-up Chat

Dependencies

- Backend APIs

Never

- Calls Gemini
- Calls external APIs

---

# Backend API

Responsibilities

- Request Validation
- API Routing
- Tool Invocation
- AI Invocation
- Response Formatting

---

# ARGUS

Responsibilities

- Select Tools
- Coordinate Research
- Aggregate Results
- Build Prompt
- Invoke Gemini
- Validate Output
- Calculate Confidence
- Return Report

ARGUS is the ONLY component allowed to communicate with Gemini.

---

# Company Tool

Responsibilities

- Validate Company
- Fetch Overview
- Industry
- Sector
- CEO
- Website
- Headquarters

Output

```json
{
  "company": {},
  "industry": "",
  "sector": "",
  "summary": ""
}
```

---

# Finance Tool

Responsibilities

Collect

Revenue

Net Income

Market Cap

PE Ratio

EPS

ROE

Debt

Cash Flow

Growth

Output

Standard Financial JSON

---

# News Tool

Responsibilities

Latest News

Sentiment

Market Events

Earnings News

Output

List of normalized news articles

---

# Risk Tool

Responsibilities

Business Risk

Financial Risk

Operational Risk

Macroeconomic Risk

Output

Risk Summary

---

# Competitor Tool

Responsibilities

Identify

Top Competitors

Market Position

Competitive Advantage

Output

Competitor Comparison

---

# Data Aggregator

Responsibilities

Merge every tool output

Normalize

Remove duplicates

Prepare prompt input

---

# Prompt Builder

Responsibilities

Construct the final LLM prompt

Never

Call APIs

---

# Gemini

Responsibilities

Reason

Analyze

Recommend

Never

Fetch external data

---

# Response Validator

Responsibilities

Validate JSON

Ensure mandatory fields

Detect hallucinations

Reject malformed output

---

# Confidence Engine

Responsibilities

Generate confidence score

Factors

Financial Coverage

News Coverage

Data Completeness

Validation Quality

Consistency

---

# Dashboard Renderer

Responsibilities

Visualize

Company

Financials

News

Charts

Recommendation

Confidence

Explainability