# ADR-001

# Title

Use a Single AI Orchestrator (ARGUS) in Version 1.0

---

## Status

Accepted

---

## Context

AlphaForge AI aims to become a multi-agent investment intelligence platform.

However, implementing multiple AI agents during Version 1.0 would significantly increase development complexity, testing effort, and project risk.

The internship timeline requires a stable and functional MVP.

---

## Decision

Version 1.0 will implement a single AI orchestrator named ARGUS.

ARGUS will coordinate modular research tools instead of multiple AI agents.

The research tools are deterministic services that collect structured data.

Gemini will only be invoked once after all research data has been aggregated.

---

## Consequences

Advantages

- Simpler implementation
- Lower API cost
- Easier debugging
- Faster execution
- Cleaner architecture

Disadvantages

- Limited specialization
- Single reasoning stage

---

## Future Evolution

In Version 2.0, the research tools can be replaced with specialized AI agents without redesigning the architecture.