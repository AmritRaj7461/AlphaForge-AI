# Fallback Prompt

## Purpose

Provide a reduced but reliable response whenever the primary analysis cannot be completed.

---

# Conditions

Fallback activates when

- Gemini timeout
- API unavailable
- Invalid JSON
- Missing mandatory sections
- Tool failure

---

# Instructions

Generate the best possible analysis using available evidence.

Clearly identify missing information.

Reduce confidence accordingly.

Never fabricate missing data.

---

# Output

Company Summary

Available Financials

Available News

Known Risks

Recommendation

Confidence

Missing Sections