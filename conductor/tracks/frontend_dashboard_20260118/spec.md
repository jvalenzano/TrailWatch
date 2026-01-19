# Specification: Ranger Dashboard (Multi-Mode Agentic UI)

## 1. Goal

Build a React-based ranger dashboard that consumes the Intake Agent API and supports three UI modes (Traditional, Moderate, Agentic) for progressive disclosure of AI capabilities.

## 2. Input

- Intake Agent API endpoints (`/api/v1/reports`, `/api/v1/reports/{id}`, `/api/v1/statistics`)
- Mock data for local development when backend unavailable

## 3. Output

- React 18+ TypeScript web application
- Three UI modes accessible via `?mode=` URL parameter
- Map-based visualization using MapLibre GL JS

## 4. Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Core triage workflow | Ranger can view, filter, and approve reports in all modes |
| Mode switching | URL parameter changes layout and feature visibility instantly |
| AI transparency | Confidence and reasoning display correctly in Moderate/Agentic |
| Demo-ready | Can walk stakeholder through all three modes with real data |
| No backend changes | Frontend consumes existing Intake Agent API without modifications |

## 5. Tech Stack

- **Framework:** React 18+ with TypeScript
- **Build:** Vite
- **Styling:** Tailwind CSS
- **Data Fetching:** TanStack Query (React Query v5)
- **Maps:** MapLibre GL JS + Protomaps (per ADR-004)
- **Testing:** Vitest + React Testing Library

## 6. UI Modes

| Mode | Layout | AI Visibility | Features |
|------|--------|---------------|----------|
| Traditional | List primary (60%), Map secondary (40%) | Hidden | Basic triage workflow |
| Moderate | List primary (60%), Map secondary (40%) | Visible (confidence, reasoning, badges) | AI transparency layer |
| Agentic | Map primary (50%), Sidebar (25%), List (25%) | Full | Spatial insights, batch operations |

## 7. Style Guidelines

Reference: `conductor/code_styleguides/ui-skills.md`

Key Constraints:
- **Tailwind Defaults:** Use default configuration unless custom values are explicitly requested.
- **Accessibility:** Use Radix/Base UI/React Aria for accessible interactive primitives.
- **Layout:** Use `h-dvh` instead of `h-screen`.
- **Animations:** No animations unless explicitly requested. If requested, use `motion/react` (compositor props only) or `tw-animate-css`.
- **Performance:** No layout animations.

## 8. Reference Documents

- `docs/UI/TrailWatch_UI_Strategy.md` — Strategic rationale
- `docs/UI/trailwatch-component-architecture.md` — Component structure
- `docs/UI/trailwatch-frontend-track.md` — Phase definitions (detailed)
