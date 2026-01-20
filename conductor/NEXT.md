# Next Track Mission Brief

> **Last Updated:** 2026-01-19
> 
> This file is the handoff artifact between strategic planning and Claude Code execution.
> Keep under 50 lines. Update after each track completes.
>
> 🛑 **STOP & READ:** Before picking up any task, you MUST read:
> - [Agent Protocol](../docs/onboarding/AGENT_PROTOCOL.md)
> - [Workflow Guide](./workflow.md)
> - [Quick Start](./QUICK_START.md) (for new team members)

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
- Track: `frontend-dashboard`
- **Current Branch:** `feature/dashboard-phase-4-agentic`
- Phase 0-3 complete (scaffolding through Moderate Mode)
- Phase 3 merged to develop — Pending Human Sign-Off for main
- Phase 4 branch created — Awaiting human approval to implement

See: `conductor/tracks/agentic-mode/` (Foundation complete - map-first layout, spatial insights, clustering)

**Scope:**
- React 18+ / TypeScript / Vite / Tailwind CSS / TanStack Query
- Three UI modes: Traditional, Moderate, Agentic
- MapLibre GL JS for map visualization
- Consumes backend APIs from Status Dashboard track

## Priority Queue

| # | Track | Status | Notes |
|---|-------|--------|-------|
| 1 | Ranger Dashboard (Frontend) | 🎯 ACTIVE | Phase 3 merged to develop, Phase 4 awaiting approval |
| 2 | Wireframe Conformance | 📋 STRATEGIC PLANNING | 52 gaps identified, strategic plan ready for review |
| 3 | Synthetic Data Quality | ⏸️ Planned | Comprehensive data corpus improvements |
| 4 | Status Dashboard (Backend) | ⏸️ Phase 2+ | Frontend phases pending |
| 5 | Hazard Classifier (Project 3) | ⏸️ Waiting | — |
| 6 | Closure Notice Generator (Project 4) | ⏸️ Waiting | — |

## Strategic Planning

**Wireframe Conformance Track** — Ready for Review
- **Location:** `conductor/tracks/wireframe-conformance/`
- **Status:** Strategic plan complete, awaiting approval
- **Key Document:** `STRATEGIC_PLAN.md` — Complete analysis and recommendations
- **Summary:** 52 gaps identified, 8-week implementation plan, 3 strategic options evaluated
- **Recommendation:** Extend Phase 4 track with 3 new phases (4.2, 4.3, 4.4)

**Next Action:** Review strategic plan and approve track structure before creating detailed implementation plan.

## Future Considerations

**Evaluate at Track 5-7: Antigravity Skills**

When pattern library is established, consider creating workspace skills:
- `trailwatch-standards` — Coding standards enforcement
- `tracs-mapping` — TRACS classification reference + examples
- `tdd-workflow` — Test pattern with pytest runner
