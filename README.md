# TrailWatch

A citizen crowdsourcing platform for USFS trail maintenance. TrailWatch combines a React/TypeScript frontend with a FastAPI/PostgreSQL backend, featuring AI-powered hazard report classification and trail validation using PostGIS geospatial data.

## Features

- **Hazard Reporting**: Citizens submit trail hazard reports with photos, location, and descriptions
- **AI-Powered Classification**: Automatic extraction of TRACS categories, severity levels, and confidence scores
- **Streaming Extraction**: Real-time SSE-based AI analysis with visible reasoning
- **Interactive Map**: MapLibre GL JS with Protomaps for trail visualization
- **Progressive UI Modes**: Three disclosure levels for AI transparency
  - **Traditional**: Standard list-based triage workflow
  - **Moderate**: AI transparency with confidence indicators and reasoning panels
  - **Agentic**: Map-first layout with spatial insights and batch operations

## Tech Stack

### Frontend
- React 19 + TypeScript + Vite
- MapLibre GL JS + Protomaps
- TanStack Query for data fetching
- Tailwind CSS
- Vitest + React Testing Library

### Backend
- Python 3.11+ / FastAPI
- PostgreSQL 17 + PostGIS
- SQLAlchemy ORM
- Google ADK for AI agents

## Quick Start

### Prerequisites
- Node.js 20+
- Python 3.11+
- PostgreSQL 17 with PostGIS extension

### Frontend

```bash
cd frontend
npm install
npm run dev          # Start dev server at http://localhost:5173
```

### Backend

```bash
# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # or `.venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start server
python -m uvicorn src.trailwatch.main:app --reload
```

## Development

### Running Tests

```bash
# Frontend (from frontend/ directory)
npm test             # Run all tests
npm run test:watch   # Watch mode
npm run coverage     # Coverage report

# Backend (from repo root)
pytest               # Run all tests
pytest --cov=src     # With coverage
```

### Building

```bash
# Frontend production build
cd frontend
npm run build
```

## Project Structure

```
frontend/                    # React frontend
├── src/
│   ├── components/
│   │   ├── common/         # AppShell, Header, Layout, FeatureGate
│   │   └── extraction/     # AI transparency components
│   ├── hooks/              # React hooks (useReports, useUIMode, etc.)
│   ├── config/             # UI mode configuration
│   └── types/              # TypeScript interfaces

src/trailwatch/             # FastAPI backend
├── main.py                 # App entry point
├── api/                    # REST endpoints
├── models.py               # Pydantic models
├── models_sqlalchemy.py    # ORM models
└── validation/             # Trail validation service

docs/                       # Documentation
├── onboarding/             # Getting started guides
├── architecture/           # System design docs
└── adr/                    # Architecture Decision Records
```

## Current Status

**Version**: v0.5.0

- Phase 5: Polish & Demo Prep (complete)
- Phase 6: Streaming Extraction (complete)
  - Backend SSE endpoint for real-time extraction
  - Frontend streaming hook and progress display
  - 109 frontend tests, 4 backend SSE tests

## License

MIT

## Contributing

See [CLAUDE.md](CLAUDE.md) for development guidelines and coding standards.
