# Confidence Engine Specification

## Purpose

Compute an evidence-based confidence score to evaluate the reliability and completeness of the research inputs.

---

## Inputs

- **Financial Coverage**: Availability of core statements (Balance Sheet, Income Statement).
- **News Sentiment Density**: Volume and freshness of articles retrieved.
- **Risk Assessment**: Level of detailed factors (Business, Financial, Macro).
- **Competitor Benchmark**: Data availability for industry peer groups.
- **Provider Status**: Use of fallback or static registry nodes.

---

## Scoring Rules & Cap

- **Uncertainty Capping**: The maximum confidence score is capped at **99%**. No investment recommendation is 100% certain.
- **Deduction Criteria**:
  - **Missing Financial Statements**: Deduct **10%** from the baseline score.
  - **Use of Fallback Providers**: Deduct **5%** per tool fallback.
  - **Insufficient News Sentiment**: Deduct **5%** if news density is low.
  - **Missing Peer Group Benchmarks**: Deduct **5%** if competitor comparison is empty.
  - **Incomplete Financial Ratios**: Deduct **5%** for missing multiples.

---

## Output

- **Value**: Integer representing the confidence score percentage (0–99).
- **Breakdown**: Individual score indicators for Financials, Sentiment, Risks, and Competitors, rendered dynamically as UI progress indicators.