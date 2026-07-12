# System Architecture

This document details the software architecture of AlphaForge AI.

## Technical Stack Overview

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend UI** | React (Vite) | Client-side reactive terminal and interactive dashboard |
| **Styling** | Vanilla CSS + Tailwind | Premium glassmorphism dark-mode styles with active theme token hooks |
| **API Server** | Node.js + Express | Request routing, caching, and intelligence orchestration |
| **AI Orchestrator** | LangChain / Gemini 2.5 | Multi-tool invocation, thesis building, and risk processing |
| **Validation** | Zod | Verification of structural JSON outputs from LLM calls |

---

## Technical Block Diagram

```text
+-----------------------+     REST API     +-----------------------+
|    React Frontend     | <==============> |    Express Backend    |
|  (Interactive UI)     |                  |   (Routes & Server)   |
+-----------------------+                  +-----------------------+
            ^                                          |
            | (State Mount)                            | (Trigger Orchestrator)
            v                                          v
+-----------------------+                  +-----------------------+
|  Dashboard Workspace  |                  | ARGUS AI Orchestrator |
|  - Financial Pillars  |                  | - Prompt Builder      |
|  - SWOT (460px Const) |                  | - Model Failover      |
|  - Q&A Chat Window    |                  +-----------------------+
+-----------------------+                              |
                                                       | (Parallel Query)
                                                       v
                                           +-----------------------+
                                           |  Live Research Tools  |
                                           |  - Finance, News,     |
                                           |    Risks, Competitors |
                                           +-----------------------+
```

---

## Architecture Boundaries

### 1. Asymmetric Dashboard Columns
The dashboard layout splits metrics into two major areas to maintain readability:
- **Left Column (Primary Verdicts)**: Holds core profiles, investment ratings, and the SWOT matrix. It uses a custom `ResizeObserver` listener in React to dynamically compute viewport offsets and stick to the screen bottom.
- **Right Column (Expanded Details)**: Displays financial pillar tables, news sentiment timelines, peer comparisons, and the interactive Ask ARGUS chat window.

### 2. SWOT Height Constrainment
To match the adjacent thesis card baseline, the SWOT Card is constrained to exactly `460px` height. Accordions are removed to present information cleanly, and exactly two points are shown per quadrant to prevent vertical overflows.
