# Validation Prompt

## Purpose

Validate Gemini responses before returning them to the frontend.

---

# Validation Checklist

Verify

✓ JSON is valid.

✓ Recommendation exists.

✓ SWOT exists.

✓ Company Summary exists.

✓ Risk Summary exists.

✓ Reasoning exists.

✓ No fabricated values.

✓ No unsupported claims.

✓ Output follows required schema.

---

# Failure Handling

If validation fails

Return

INVALID_RESPONSE

Retry once.

Otherwise invoke fallback.