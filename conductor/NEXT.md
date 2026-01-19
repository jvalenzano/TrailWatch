# Next Track Mission Brief

> **Last Updated:** 2026-01-17
> 
> This file is the handoff artifact between strategic planning and Conductor execution.
> Keep under 50 lines. Update after each track completes.

## Current Status

✅ **Intake Agent** — Phases 1-3 complete
- Checkpoint: `3eb7f41`
- API endpoints, database integration, TRACS classification
- 38 tests passing

## Next Track

✅ **Trail Validation Service** — Project 2 complete
- Checkpoint: `3cc300b`
- PostGIS GPS snapping, USFS geodata ingestion
- Verified spatial accuracy (PostGIS 3.6 + Postgres 17)

## Next Track

🎯 **Status Dashboard (Project 2)**

**Reason:** Core backend infrastructure (Intake + Validation) is stable. The coordinator needs to visualize this data on a map.

**Unblocks:** Visual triage, spatial report clustering, ranger district dashboard

**Scope:**
- Implement MapLibre GL JS frontend
- Create API endpoints for fetching triaged reports with trail metadata
- Implement trail status overlay (PostGIS-backed)
- Cluster reports by severity and ranger district

**Reference:** [Project 2 Specification](conductor/archive/trail_validation_service_20260117/spec.md) (Context)

## Priority Queue

| # | Track | Status | Dependency |
|---|-------|--------|------------|
| 1 | Status Dashboard (Project 2) | 🎯 NEXT | Validation Service |
| 2 | Hazard Classifier (Project 3) | ⏸️ Waiting | — |
| 3 | Closure Notice Generator (Project 4)| ⏸️ Waiting | — |

## Future Considerations

**Evaluate at Track 5-7: Antigravity Skills**

When pattern library is established, consider creating workspace skills:
- `trailwatch-standards` — Coding standards enforcement
- `tracs-mapping` — TRACS classification reference + examples
- `tdd-workflow` — Test pattern with pytest runner

Reference: [Getting Started with Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
