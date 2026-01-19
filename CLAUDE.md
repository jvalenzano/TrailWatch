# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> 🛑 **CRITICAL:** Before executing any work, you MUST read the [Agent Protocol](docs/onboarding/AGENT_PROTOCOL.md).

## Project Overview

TrailWatch is a citizen crowdsourcing platform for USFS trail maintenance. It combines a React/TypeScript frontend with a FastAPI/PostgreSQL backend, featuring AI-powered trail validation using PostGIS geospatial data.

**Current Status:** Phase 3 (Moderate Mode UI) complete on branch `feature/dashboard-phase-3-moderate`. The frontend has three progressive UI modes: Traditional (list-based), Moderate (AI transparency), and Agentic (map-first with spatial insights).

## Build & Development Commands

### Frontend (from `frontend/` directory)
```bash
npm run dev          # Start Vite dev server with hot reload
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm test             # Run Vitest (single run)
npm run test:watch   # Vitest in watch mode
npm run coverage     # Coverage report
```

### Backend (from repo root)
```bash
python -m uvicorn src.trailwatch.main:app --reload   # Start FastAPI dev server
pytest                    # Run all tests
pytest --cov=src          # With coverage
pytest tests/test_api.py  # Single test file
CI=true pytest            # Non-interactive mode (required for automation)
```

## Architecture

```
frontend/                    # React 18 + TypeScript + Vite
├── src/
│   ├── components/
│   │   ├── common/         # AppShell, Header, Layout, FeatureGate
│   │   └── extraction/     # AI transparency: ConfidenceIndicator, ReasoningPanel, AIBadge
│   ├── pages/              # Dashboard page
│   ├── hooks/              # useReports, useExtraction, useCrews, useUIMode
│   ├── config/             # UI mode configuration (modeConfig.ts)
│   ├── types/              # TypeScript interfaces
│   └── mocks/              # MSW mock handlers and data

src/trailwatch/              # Python FastAPI backend
├── main.py                  # FastAPI app entry point
├── api/
│   ├── reports.py           # Report CRUD endpoints
│   └── dashboard.py         # Dashboard statistics endpoints
├── models.py                # Pydantic data models
├── models_sqlalchemy.py     # SQLAlchemy ORM models
├── database.py              # PostgreSQL connection
├── confidence_scoring.py    # AI confidence algorithms
└── validation/              # Trail validation service (PostGIS + USFS geodata)

conductor/                   # Gemini Conductor workflow management
├── index.md                 # Project context hub
├── workflow.md              # TDD workflow, phase checkpointing
└── tracks/                  # Active development tracks with plan.md files
```

## Tech Stack Constraints

**Required:**
- Python 3.11+ / FastAPI / PostgreSQL 17 + PostGIS
- Google ADK for agents (NOT LangChain)
- React 18+ / TypeScript / MapLibre GL JS
- httpx for HTTP requests (not requests library)
- Pytest with 80%+ coverage target
- TDD: Red → Green → Refactor

**Forbidden:**
- OpenAI, LangChain, SQLite, Flask, `requests` library
- `var` in JavaScript (use const/let)
- Default exports (use named exports)
- `any` type in TypeScript
- Bare `except:` clauses in Python

## Key Conventions

### Code Style
- **Python:** Google style guide, 4-space indent, type hints, Google-style docstrings
- **TypeScript:** Google style guide, named exports only, no `const enum`
- Line length: 88 characters (Python), ESLint defaults (TypeScript)

### Testing
- Frontend: Vitest + React Testing Library + jest-axe (accessibility) + MSW (mocking)
- Backend: pytest-asyncio with `asyncio_mode="auto"`
- Always run tests non-interactively: `CI=true pytest` or `npm test`

### Workflow
- The plan.md in each conductor track is the source of truth
- Mark tasks: `[ ]` pending, `[~]` in-progress, `[x]` complete with commit SHA
- Phase completion requires: all tests passing, coverage met, git checkpoint with notes

## Key ADRs

- **ADR-001:** Trail validation uses PostGIS + USFS Geodata (not external APIs)
- **ADR-002:** Conductor workflow pattern with plan.md tracking
- **ADR-004:** MapLibre GL JS + Protomaps for maps (not Google Maps, not Mapbox)

## UI Mode System

The frontend supports three modes controlled by `useUIMode` hook:
- **Traditional:** Standard list-based views
- **Moderate:** Adds AI transparency (confidence indicators, reasoning panels)
- **Agentic:** Map-first layout with spatial insights

Use `FeatureGate` component for conditional rendering based on UI mode:
```tsx
<FeatureGate modes={['moderate', 'agentic']}>
  <ConfidenceIndicator level={report.confidenceLevel} />
</FeatureGate>
```

## Related Documentation

- `GEMINI.md` - Global AI instructions and project overview
- `conductor/workflow.md` - Detailed development workflow
- `docs/adr/` - Architecture Decision Records
- `docs/UI/` - Frontend design strategy and component architecture
