# Response Validator Specification

## Purpose

Validate AI output before returning it to the frontend.

---

## Validation

JSON Structure

Mandatory Fields

Recommendation

Confidence

Reasoning

SWOT

Company Summary

---

## Failure

Retry once.

If retry fails

Invoke fallback.

---

## Rules

Reject malformed JSON.

Reject unsupported claims.

Reject missing recommendation.

Reject hallucinated financial values.

---

## Output

Validated JSON

or

Fallback Response