# AI Development Summary

This document chronicles the AI-assisted engineering and iteration process used to design, build, and refine AlphaForge AI.

---

## 1. Project Planning & Architecture Evolution

The project started with a basic concept: creating a dashboard that displays investment recommendations. 

- **V1.0 Initial Concept**: A simple, single-agent system that queried Yahoo Finance and ran a basic GPT-3.5 prompt to output Markdown text.
- **V2.0 Core Agent Expansion**: Introduced the **ARGUS Orchestrator** to coordinate parallel tool workflows (financial queries, competitor ratios, and news sentiment timelines). Zod schema validations were introduced to prevent raw JSON parsing failures.
- **V3.0 Production Refactoring**: Redesigned the frontend into a responsive, high-end SaaS layout. Applied dynamic bottom-sticky columns to prevent row imbalances, aligned the SWOT card heights to the main thesis layout, and built the multi-company carousel preview on the landing page.

---

## 2. Prompt Engineering Iterations

The prompt templates underwent significant refinements to produce consistent, structured outputs:

### Step 1: Raw Output Attempt (V1.0)
Initially, the prompt asked for "a detailed analysis with strengths, weaknesses, and SWOT". The model output unstructured markdown text containing varying headings, making it impossible to render consistent UI cards.

### Step 2: Strict JSON Injection (V2.0)
We constrained the model by adding JSON instructions: *"You must respond ONLY with valid JSON matching this schema..."*. While this improved consistency, the LLM still occasionally output conversational text prefixes (e.g., "Here is your JSON:") or truncated the payload under token limits.

### Step 3: Schema Validation & Defensive Fallbacks (V3.0)
We integrated direct Zod parsing (`analysisSchema.js`) on the backend server. The prompt was reinforced with explicit guardrails:
- SWOT quadrants must contain exactly 2 bullet points.
- Missing values must be output as `null` rather than omitted.
- Expected returns must be formatted as numeric percentages.

If Zod throws validation errors, a secondary fallback engine parses the text and builds a valid schema structure, preventing app crashes.

---

## 3. Dashboard Design Iterations

- **Initial State**: A grid of vertical cards of varying heights. When the News Sentiment card returned 10 items and the SWOT card had 4 items, the layout looked unbalanced.
- **Refinement**:
    - **SWOT Aligned**: Fixed the SWOT card height to `460px` to match the adjacent Thesis card.
    - **Dynamic Bottom-Sticky Lock**: Programmed a `ResizeObserver` listener to stick the Left Column to the viewport bottom. This keeps the primary rating and profile cards pinned in view while scrolling through the longer data cards on the right.
