# ARGUS Specification

## Module

Autonomous Research & Guidance Utility System (ARGUS)

---

## Purpose

ARGUS is the core orchestration engine responsible for coordinating the research pipeline, triggering parallel queries, synthesizing context, and validating AI reasoning outputs.

---

## Responsibilities

- **Validation**: Ensure input queries are validated and routed through the Company Intelligence Layer.
- **Tool Coordination**: Invoke research tools concurrently via `ToolManager`.
- **Data Aggregation**: Merge outputs from tools into a normalized JSON payload.
- **Context Synthesis**: Compile system instructions and dynamic metrics using `PromptBuilder`.
- **Reasoning Dispatch**: Query Gemini (or trigger OpenAI/Groq failovers).
- **Zod Validation**: Validate Gemini's JSON response against the structural schema.
- **Score Calculation**: Call the Confidence Engine to compute evidence metrics.

---

## Workflow Diagram

```text
Request
  │
  ▼
Company Intelligence Layer (Resolver, Registry, Router)
  │
  ▼
ToolManager
  ├── CompanyTool
  ├── FinanceTool
  ├── NewsTool
  ├── RiskTool
  └── CompetitorTool
  │
  ▼
Data Aggregator
  │
  ▼
PromptBuilder
  │
  ▼
Primary LLM (Gemini 1.5)
  │
  ├── [Success] ──► Zod Schema Validator ──► Confidence Engine ──► ReportBuilder ──► Output
  │
  └── [Error/Fail] ──► FallbackEngine (OpenAI/Groq) ──► Zod Schema Validator ──► Output
```

---

## Rules

- **Deterministic Pipeline**: ARGUS never fetches API data directly; it relies exclusively on research tools.
- **No Hallucination**: AI must build reports based strictly on the aggregated context.
- **Robust Failover**: If Zod validation fails, the orchestrator MUST route the request to fallback models rather than returning server errors.