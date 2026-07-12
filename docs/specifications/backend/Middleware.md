# Middleware Specification

## Purpose

Middleware performs request preprocessing and postprocessing.

---

## Middleware Stack

Logger

Helmet

CORS

Rate Limiter

Request Validator

Error Handler

---

## Responsibilities

Logger

Log every request.

---

Helmet

Apply security headers.

---

CORS

Allow approved frontend origins.

---

Rate Limiter

Prevent abuse.

---

Validator

Validate request body.

---

Error Handler

Return standardized error JSON.

Never expose stack traces.

---

Rules

Middleware must remain stateless.

No business logic inside middleware.