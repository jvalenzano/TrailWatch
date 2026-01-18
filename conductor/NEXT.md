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

🎯 **Trail Validation Service**

**Reason:** ADR-001 requires this before Project 2 (Status Dashboard). Provides GPS-to-trail snapping infrastructure.

**Unblocks:** Status Dashboard map rendering, accurate trail matching

**Scope:**
- Load USFS Geodata into PostGIS
- Implement GPS coordinate snapping to trail geometries
- Enhance confidence scoring with `gps_accurate` factor
- Target: GPS within 50m of known trail = validated

**Reference:** [ADR-001](docs/adr/ADR-001-trail-validation-architecture.md)

## Priority Queue

| # | Track | Status | Dependency |
|---|-------|--------|------------|
| 1 | Trail Validation Service | 🎯 NEXT | ADR-001 |
| 2 | Status Dashboard (Project 2) | ⏸️ Blocked | Requires #1 |
| 3 | Hazard Classifier (Project 3) | ⏸️ Waiting | — |

## Future Considerations

**Evaluate at Track 5-7: Antigravity Skills**

When pattern library is established, consider creating workspace skills:
- `trailwatch-standards` — Coding standards enforcement
- `tracs-mapping` — TRACS classification reference + examples
- `tdd-workflow` — Test pattern with pytest runner

Reference: [Getting Started with Skills](https://codelabs.developers.google.com/getting-started-with-antigravity-skills)
