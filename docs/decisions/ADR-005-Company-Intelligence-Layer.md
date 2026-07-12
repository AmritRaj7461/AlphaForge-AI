# ADR-005

# Title

Introduce a Centralized Company Intelligence Layer in Version 1.1

---

## Status

Accepted

---

## Context

Initially, company lookup, symbol mapping, typo correction, and exchange classification logic were duplicated across individual research tools (e.g. `FinanceTool`, `NewsTool`, `RiskTool`). 

This violated the Single Responsibility Principle, created synchronization overhead, and made it difficult to scale support to new markets (like Indian NSE/BSE exchanges) or adjust provider mappings dynamically.

---

## Decision

We will extract all search normalization and provider mapping logic into a centralized Company Intelligence Layer under `backend/src/intelligence/`. 

This layer consists of:
- **CompanyResolver**: Corrects typos and normalizes inputs to canonical names (using Fuse.js).
- **MarketResolver**: Classifies domestic vs. international exchanges.
- **ProviderRouter**: Determines the optimal endpoint execution path (NSE/BSE endpoints for India, FMP/AlphaVantage for US).
- **DataNormalizer**: Transforms raw provider JSON outputs into unified schemas before downstream model consumption.

Research tools will now accept only the normalized, canonical company objects rather than raw user strings.

---

## Consequences

### Advantages
- **Single Source of Truth**: Typo corrections and exchange registries are maintained in one centralized registry.
- **Improved Maintainability**: Adding a new market or provider requires modifying only the router/registry configuration, without changing research tool code.
- **Zero Hallucination Safety**: Decoupling prevents tools from guessing parameters or using incorrect ticker syntaxes.

### Disadvantages
- **Upfront Overhead**: Requires refactoring existing tools to strip their internal mappings.

---

## Future Evolution

This layer provides clear extension hooks to integrate third-party database mapping APIs or dynamic DNS registries when transitioning to production scales.
