# Coding Standards

## General Principles

- Write readable code.
- Prefer clarity over cleverness.
- Keep functions small and focused.
- Follow Single Responsibility Principle.
- Avoid duplicate logic.

---

## Naming

### Variables

camelCase

Example

companyName

currentPrice

confidenceScore

---

### Functions

camelCase

Examples

analyzeCompany()

calculateConfidence()

generatePrompt()

---

### Classes

PascalCase

ARGUS

FinanceTool

NewsService

---

### Constants

UPPER_SNAKE_CASE

MAX_RETRIES

DEFAULT_TIMEOUT

---

## File Naming

PascalCase for React Components

camelCase for utility files

Example

Dashboard.jsx

CompanyCard.jsx

apiClient.js

---

## Comments

Comment WHY

Not WHAT.

---

## Async

Always use async/await.

Avoid Promise chains.

---

## Error Handling

Never ignore exceptions.

Always return structured errors.

---

## Logging

Log every external API request.

Never log secrets.