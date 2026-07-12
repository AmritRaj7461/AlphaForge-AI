# Services Specification

## Purpose

Services contain the business logic of AlphaForge AI.

Controllers must remain thin and delegate all processing to services.

---

## Services

AnalysisService

Responsibilities

- Coordinate complete analysis workflow.
- Invoke ARGUS.
- Return structured report.

---

CompanyService

Responsibilities

- Validate company.
- Retrieve company information.
- Normalize data.

---

FinanceService

Responsibilities

- Retrieve financial metrics.
- Calculate derived metrics if required.
- Normalize financial data.

---

NewsService

Responsibilities

- Retrieve latest news.
- Remove duplicates.
- Sort by relevance.

---

RiskService

Responsibilities

- Identify business risks.
- Aggregate risk indicators.

---

CompetitorService

Responsibilities

- Identify competitors.
- Compare market position.

---

Rules

Business logic belongs only in services.

Services never communicate directly with the frontend.

Services return standardized JSON.