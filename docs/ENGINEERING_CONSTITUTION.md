# AlphaForge AI Engineering Constitution

Version: 1.0

Status: Active

---

# Purpose

This document defines the immutable engineering principles of AlphaForge AI.

Every developer, contributor, AI coding assistant, or automation tool working on this repository must follow this Constitution.

These rules are non-negotiable.

If any implementation conflicts with this Constitution, the Constitution always takes precedence.

---

# Article 1 — Product Vision

AlphaForge AI is an Explainable Investment Intelligence Platform.

It is NOT:

- A chatbot
- A stock prediction engine
- A trading bot
- A financial advisor

Its purpose is to collect structured investment research, analyze evidence using AI, and generate transparent, explainable investment reports.

---

# Article 2 — Architecture First

Every implementation must follow the documented architecture.

Developers must never redesign the architecture without updating the official documentation.

The documented architecture is the single source of truth.

---

# Article 3 — Version Discipline

Only implement features belonging to the current version.

Version 1.0 includes:

- Company Analysis
- ARGUS
- Dashboard
- Explainable Reports
- Confidence Engine
- Fallback Mechanism

Future features such as authentication, portfolio management, notifications, and multi-agent systems must not be implemented in Version 1.

---

# Article 4 — Single Responsibility

Every module must have exactly one responsibility.

Examples:

- Company Tool retrieves company information.
- Finance Tool retrieves financial data.
- News Tool retrieves news.
- Risk Tool evaluates risks.
- ARGUS orchestrates the entire workflow.

No module should perform another module's responsibility.

---

# Article 5 — ARGUS is the Brain

Every analysis request must pass through ARGUS.

No service, controller, or tool may bypass ARGUS.

ARGUS is responsible for:

- Orchestration
- Prompt Construction
- AI Invocation
- Validation
- Confidence Calculation
- Final Response

---

# Article 6 — AI Principles

AI must always be:

- Explainable
- Transparent
- Evidence-Based
- Deterministic where possible

AI must never:

- Invent financial data
- Guess missing information
- Hide uncertainty
- Produce unsupported recommendations

Every recommendation must explain WHY.

---

# Article 7 — Research Before Reasoning

Reasoning always happens after research.

Pipeline

Research

↓

Aggregation

↓

Prompt Construction

↓

Gemini

↓

Validation

↓

Confidence

↓

Response

Gemini never performs research.

Research Tools never perform reasoning.

---

# Article 8 — Modular Architecture

The application must remain modular.

Each layer must be replaceable independently.

Frontend

↓

Backend

↓

ARGUS

↓

Research Tools

↓

LLM

↓

Response

Future versions should be able to replace any module without redesigning the system.

---

# Article 9 — Clean Code

Code must be:

Readable

Modular

Maintainable

Reusable

Testable

Avoid:

Duplicate code

Large functions

Deep nesting

Hardcoded values

---

# Article 10 — API Design

All APIs must:

Accept JSON

Return JSON

Use consistent response formats

Handle errors gracefully

Never expose internal implementation details

---

# Article 11 — Error Handling

Application failures must never terminate analysis unnecessarily.

If a provider fails:

Retry

↓

Fallback

↓

Partial Report

↓

Reduced Confidence

↓

Return Response

Partial information is always better than complete failure.

---

# Article 12 — Confidence

Confidence is calculated internally.

Gemini never generates confidence scores.

Confidence depends on:

- Financial Coverage
- News Coverage
- Risk Coverage
- Validation Quality
- Data Completeness

---

# Article 13 — Security

Never commit:

- API Keys
- Secrets
- Passwords
- .env files

Always use environment variables.

Validate every request.

Sanitize every input.

---

# Article 14 — Documentation Driven Development

Documentation is the source of truth.

Implementation follows documentation.

Never implement undocumented features.

If documentation changes, implementation must be updated accordingly.

---

# Article 15 — UI Principles

The interface must be:

Professional

Minimal

Responsive

Accessible

Data-focused

Explainable

Avoid unnecessary visual clutter.

---

# Article 16 — Future Compatibility

Version 1.0 must be designed so that future versions can introduce:

- Multi-Agent AI
- Portfolio Management
- Authentication
- Notifications
- Databases
- Mobile Applications

without requiring architectural redesign.

---

# Article 17 — Engineering Workflow

Before implementing any feature:

1. Read the Blueprint.
2. Read the relevant Handbook section.
3. Read the Specification.
4. Review UML diagrams.
5. Review Wireframes.

Only then begin implementation.

---

# Article 18 — Decision Hierarchy

When conflicts occur, follow this order:

1. Engineering Constitution
2. AlphaForge Blueprint
3. Handbook
4. Specifications
5. API Documentation
6. UML
7. Wireframes
8. ADRs

Lower-priority documents must never override higher-priority documents.

---

# Article 19 — Definition of Done

A feature is complete only when:

✓ Architecture is respected.

✓ Specifications are implemented.

✓ Errors are handled.

✓ Documentation matches implementation.

✓ Code is modular.

✓ No known regressions exist.

---

# Article 20 — Final Principle

AlphaForge AI should always prioritize:

Truth over speculation.

Evidence over opinion.

Architecture over shortcuts.

Quality over speed.

Long-term maintainability over temporary convenience.

This Constitution governs every engineering decision within AlphaForge AI.