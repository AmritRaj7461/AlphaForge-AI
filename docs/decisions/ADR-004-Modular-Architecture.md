# ADR-004

# Title

Adopt a Modular Architecture

---

## Status

Accepted

---

## Context

Investment analysis involves multiple independent domains.

Company Profile

Financial Data

Market News

Risk

Competitors

Combining all logic into one service reduces maintainability.

---

## Decision

Each domain will be implemented as an independent module.

Modules communicate only through ARGUS.

Each module has a single responsibility.

---

## Benefits

Independent Testing

Easy Maintenance

Easy API Replacement

Future AI Agent Migration

Fault Isolation

Scalability

---

## Consequences

Slightly larger codebase

More files

Cleaner architecture

Higher maintainability

---

## Future

Each module can later become an autonomous AI agent without changing the frontend or backend APIs.