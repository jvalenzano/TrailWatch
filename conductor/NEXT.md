# Next Track Mission Brief

> **Last Updated:** 2026-01-19
> 
> This file is the handoff artifact between strategic planning and Conductor execution.
> Keep under 50 lines. Update after each track completes.
>
> 🛑 **STOP & READ:** Before picking up any task, you MUST read the [Agent Protocol](../docs/onboarding/AGENT_PROTOCOL.md).

## Current Status

✅ **Intake Agent** — Complete
- Checkpoint: `3eb7f41`
- API endpoints, database integration, TRACS classification
- 38 tests passing

✅ **Trail Validation Service** — Complete
- Checkpoint: `3cc300b`
- PostGIS GPS snapping, USFS geodata ingestion

✅ **Status Dashboard (Backend)** — Phase 1 Complete
- Checkpoint: `1d1b412`
- Reports and statistics API endpoints implemented

## Active Track

🎯 **Ranger Dashboard (Frontend)** — In Progress
- Track: `frontend_dashboard_20260118`
- Phase 0 complete (scaffolding, UI modes, type definitions)
- Phase 1 complete (Core Data Layer)
- Phase 2 complete (Traditional Mode UI)
- Phase 3 complete (Moderate Mode UI) — Pending Human Sign-Off
- Phase 4 pending (Agentic Mode UI)

**Scope:**
- React 18+ / TypeScript / Vite / Tailwind CSS / TanStack Query
- Three UI modes: Traditional, Moderate, Agentic
- MapLibre GL JS for map visualization
- Consumes backend APIs from Status Dashboard track

## Priority Queue

| # | Track | Status | Notes |
|---|-------|--------|-------|
| 1 | Ranger Dashboard (Frontend) | 🎯 ACTIVE | Phase 3 merged to develop, Phase 4 awaiting approval |
| 2 | Status Dashboard (Backend) | ⏸️ Phase 2+ | Frontend phases pending |
| 3 | Hazard Classifier (Project 3) | ⏸️ Waiting | — |
| 4 | Closure Notice Generator (Project 4) | ⏸️ Waiting | — |

## Future Considerations

**Evaluate at Track 5-7: Antigravity Skills**

When pattern library is established, consider creating workspace skills:
- `trailwatch-standards` — Coding standards enforcement
- `tracs-mapping` — TRACS classification reference + examples
- `tdd-workflow` — Test pattern with pytest runner
