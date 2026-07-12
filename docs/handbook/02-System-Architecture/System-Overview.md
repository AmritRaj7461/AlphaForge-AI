# System Overview

## Objective

AlphaForge AI transforms fragmented investment information into structured investment intelligence.

Instead of directly querying an LLM, AlphaForge follows a structured pipeline.

```
User
 ↓
Frontend
 ↓
Backend
 ↓
ARGUS
 ↓
Research Tools
 ↓
Data Aggregation
 ↓
Prompt Construction
 ↓
Gemini
 ↓
Validation
 ↓
Confidence Engine
 ↓
Dashboard
```

---

## Core Components

### Frontend

Responsible for

- User Interface
- Company Search
- Dashboard
- Charts
- Follow-up Chat

---

### Backend

Responsible for

- API Layer
- Validation
- Authentication (Future)
- Tool Execution
- AI Orchestration

---

### ARGUS

The central AI orchestrator.

Responsibilities

- Coordinate research
- Select tools
- Aggregate data
- Build prompts
- Validate responses
- Generate recommendations

---

### Research Tools

Company Tool

Finance Tool

News Tool

Risk Tool

Competitor Tool

---

### Gemini

Responsible only for reasoning.

Never fetches data directly.

---

### Confidence Engine

Computes recommendation confidence based on

- Financial Coverage
- News Coverage
- Risk Coverage
- Data Completeness
- Validation

---

### Explainability Layer

Every recommendation must answer

Why?

Evidence?

Confidence?

Limitations?