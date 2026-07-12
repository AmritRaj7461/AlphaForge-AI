# Low-Level Architecture

```mermaid
flowchart LR

Request

↓

Validation

↓

ARGUS

↓

Company Tool

↓

Finance Tool

↓

News Tool

↓

Risk Tool

↓

Competitor Tool

↓

Aggregator

↓

Prompt Builder

↓

Gemini

↓

Validator

↓

Confidence Engine

↓

Formatter

↓

JSON Response
```

---

## Execution Flow

### Step 1

Receive request.

---

### Step 2

Validate company.

---

### Step 3

ARGUS selects required tools.

---

### Step 4

Execute tools.

---

### Step 5

Normalize responses.

---

### Step 6

Aggregate data.

---

### Step 7

Construct LLM prompt.

---

### Step 8

Gemini performs reasoning.

---

### Step 9

Validate response.

---

### Step 10

Calculate confidence.

---

### Step 11

Return structured JSON.

---

## Architecture Rules

Only ARGUS invokes Gemini.

Every tool returns JSON.

Frontend never processes business logic.

All failures must pass through the fallback manager.