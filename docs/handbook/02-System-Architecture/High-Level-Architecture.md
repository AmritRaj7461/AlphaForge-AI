# High-Level Architecture

```mermaid
flowchart TD

User((User))

Frontend["React Frontend"]

Backend["Express Backend"]

ARGUS["ARGUS AI Orchestrator"]

Company["Company Tool"]

Finance["Finance Tool"]

News["News Tool"]

Risk["Risk Tool"]

Competitor["Competitor Tool"]

Aggregator["Data Aggregator"]

Prompt["Prompt Builder"]

Gemini["Gemini LLM"]

Validator["Response Validator"]

Confidence["Confidence Engine"]

Dashboard["Dashboard"]

User --> Frontend

Frontend --> Backend

Backend --> ARGUS

ARGUS --> Company

ARGUS --> Finance

ARGUS --> News

ARGUS --> Risk

ARGUS --> Competitor

Company --> Aggregator

Finance --> Aggregator

News --> Aggregator

Risk --> Aggregator

Competitor --> Aggregator

Aggregator --> Prompt

Prompt --> Gemini

Gemini --> Validator

Validator --> Confidence

Confidence --> Dashboard

Dashboard --> User
```

---

## Design Principles

- Frontend never communicates with Gemini.

- Backend is the only AI gateway.

- Every external request flows through ARGUS.

- Tools never communicate with one another.

- Gemini is invoked exactly once per analysis.