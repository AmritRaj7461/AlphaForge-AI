# Contributing to AlphaForge AI

Thank you for your interest in contributing to AlphaForge AI! As an Explainable AI investment research platform, we welcome contributions that refine our data pipelines, improve visualization, and expand coverage.

## Code of Conduct

Please maintain a professional, respectful, and cooperative tone during code reviews and discussions.

## How to Contribute

### 1. Reporting Bugs
- Open an issue detailing the steps to reproduce the error.
- Include local browser versions, server logs, or schema validation failures.

### 2. Submitting Pull Requests
- Fork the repository and create your branch from `main`.
- Install dependencies using clean `npm install` runs in both `frontend/` and `backend/` directories.
- Run linting checks using `npm run lint`.
- Submit clean commits with brief, descriptive messages.

## Project Structure & Guidelines
- **Frontend Code**: Resides in `frontend/src/`. Keep styles clean, modern, and bound to CSS variables.
- **Backend Code**: Resides in `backend/src/`. Ensure that any new intelligence controller routes include structural Zod schema validation checks to prevent hallucinations.
- **Environment variables**: Never commit active API keys. Ensure that any new properties are appended to `.env.example`.
