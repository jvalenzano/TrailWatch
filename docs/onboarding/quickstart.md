# TrailWatch Quickstart

**Project:** Citizen crowdsourcing platform for USFS trail condition reporting with AI-powered triage.

> **Current Phase:** Project 1 (Intake Agent) complete. Next: Trail Validation Service per ADR-001.

## Tech Stack Essentials
- **Backend:** Python 3.11+ / FastAPI / PostgreSQL 17 + PostGIS
- **AI:** Google ADK (No LangChain), Local LLMs (Llama/Mistral), Vertex AI Gemini
- **Frontend:** React 18+ / TypeScript / MapLibre GL JS

## Critical Constraints
- **Never use:** OpenAI, LangChain, SQLite, Flask, requests
- **Always:** Type hints, Google-style docstrings, pytest, 80% coverage, async for external APIs

## Getting Started

1. **Review Priority Queue:** See `conductor/NEXT.md` for current track decisions.
2. **Deep Dive:** Read [docs/onboarding/deep-dive.md](./deep-dive.md) for full context.
3. **Architecture:** Check [docs/architecture/](./../architecture/) for system design.

## Key Decisions (ADRs)
- **ADR-001:** Trail Validation Architecture — Use USFS Geodata + PostGIS for GPS validation.
- **ADR-004:** Map Library Selection — MapLibre GL JS + Protomaps.

---
*For full project context, see [deep-dive.md](./deep-dive.md).*
