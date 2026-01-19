<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# ADR-001: Trail Validation Architecture (Revised)

**Status:** Proposed

**Date:** 2026-01-17

**Decision Makers:** Jason Valenzano (Lead), Strategic Advisor

**Technical Story:** Intake Agent Phase 3 checkpoint, RIDB Integration research

***

## Context

TrailWatch requires GPS validation to ensure citizen-reported trail coordinates fall on actual USFS trails. This validation serves two purposes:[^1]

1. **Data quality**: Reject obviously invalid coordinates (Pacific Ocean, Antarctica, clearly off‑forest).
2. **Confidence scoring**: The `gps_accurate` factor (0.15 weight) in report confidence calculation.[^1]

Research into the Recreation Information Database (RIDB) API revealed it does not contain USFS trail geometry data. RIDB is designed for recreation.gov resources (campgrounds, permits, tours) and lacks trail LineStrings or spatial query capabilities. No real-time USFS trail API exists or is planned; bulk downloads are the standard method used by commercial trail apps (AllTrails, Gaia GPS, CalTopo).[^1]

The correct data source is the **USFS Geodata Clearinghouse**, specifically the National Forest System Trails dataset (≈117MB geodatabase, updated quarterly, 180k+ trails).[^1]

**Key constraint**: The current Intake Agent track (Phase 3) is ready for checkpoint with 28 passing tests, working TRACS classification, and 5/7 confidence factors implemented. Adding PostGIS infrastructure would delay this milestone.[^1]

***

## Decision Drivers

- **Development velocity**: USFS is in crisis mode (22% trail mile reduction). Speed to value matters more than perfect architecture in the short term.[^1]
- **Risk isolation**: PostGIS setup failures or data import issues should not block citizen report ingestion and basic confidence scoring.[^1]
- **Conductor workflow alignment**: Tracks should have cohesive scope and clear “done” definitions; infrastructure work should not blur application milestones.[^1]
- **FOSS architecture**: Modular design aids open-source contribution and independent evolution of services.[^1]
- **Team capacity**: Fazal or an incoming GCP AI Engineer can own infrastructure work in parallel without blocking Intake Agent delivery.[^1]

***

## Considered Options

1. **Separate tracks**: Complete Intake Agent now, create new “Trail Validation Service” track.
2. **Extend current track**: Add Phase 4 (PostGIS + validation) to Intake Agent track.
3. **Skip GPS validation**: Defer indefinitely, rely on other confidence factors only.[^1]

***

## Decision Outcome

**Chosen option:** **Option 1: Separate tracks** with a lightweight boundary validation safeguard added to Phase 3.[^1]

This approach delivers partial value immediately (Intake Agent deployable now) while properly scoping infrastructure work as its own track that can proceed in parallel.[^1]

### Positive Consequences

- Clean milestone: Intake Agent track complete with an auditable checkpoint and clear scope.[^1]
- Modular architecture: Trail validation can be parallelized and iterated independently.
- Risk isolation: PostGIS/data issues do not block Intake Agent progress.
- Git history clarity: Separate track for infrastructure work and validation logic.
- Easier rollback if trail validation has issues or needs to be temporarily disabled.[^1]


### Negative Consequences

- Temporary gap: Confidence scoring less accurate (0.15 `gps_accurate` factor only partially implemented via boundary checks until full validation is live).
- Some integration work required later (~2–3 hours) to wire Intake Agent to Trail Validation Service endpoint.
- Two Cloud Run services to maintain (Intake Agent and Trail Validation Service).[^1]

***

## Service Contract \& Degradation Behavior

To keep the integration point stable and make degradation explicit, the Trail Validation Service will expose a narrow HTTP interface:

**Request (example):**

```json
POST /validate-trail-point
{
  "latitude": 39.0842,
  "longitude": -120.2624,
  "tolerance_meters": 50
}
```

**Response (success):**

```json
{
  "valid": true,
  "distance_meters": 23.4,
  "snapped_point": { "latitude": 39.0845, "longitude": -120.2621 },
  "trail_id": "USFS-CA-2024-001",
  "trail_name": "Tahoe Rim Trail",
  "managing_district": "Lake Tahoe Basin Management Unit",
  "gps_confidence": 0.73,
  "error_mode": null
}
```

**Response (degraded):**

```json
{
  "valid": false,
  "distance_meters": null,
  "snapped_point": null,
  "trail_id": null,
  "trail_name": null,
  "managing_district": null,
  "gps_confidence": 0.0,
  "error_mode": "SERVICE_UNAVAILABLE"
}
```

**Degradation rules (Intake Agent side):**

- If `error_mode` is non‑null (e.g., `SERVICE_UNAVAILABLE`, `NO_DATA`, `TIMEOUT`):
    - Do **not** treat GPS as invalid; treat as **“unvalidated”**.
    - Set `gps_accurate = 0.0` but also set metadata like `gps_validation_source = 'unavailable'` for analytics.
- If `valid = false` and `error_mode` is null:
    - Treat as “validated and off‑trail”; `gps_accurate = 0.0`.
- If `valid = true`:
    - Map `gps_confidence` into the `gps_accurate` factor as per the mapping below.

This ensures Intake Agent can degrade gracefully if the service is down without blocking report ingestion.

***

## GPS Confidence Mapping

The Trail Validation Service returns a numeric `gps_confidence` in $[0, 1]$ for internal use, with a simple distance-based mapping:

- Distance ≤ 20 m → `gps_confidence = 1.0`
- Distance 20–50 m → linear drop from 1.0 to 0.5
- Distance 50–100 m → linear drop from 0.5 to 0.0
- Distance > 100 m or no trail within tolerance → `gps_confidence = 0.0`

Example mapping:

- If `tolerance_meters = 100`:
    - 10 m → 1.0
    - 35 m → ≈0.75
    - 80 m → ≈0.2
    - 150 m → 0.0

The Intake Agent uses this directly as the `gps_accurate` factor (weight 0.15 in overall confidence), while the UI may bucket it into user‑friendly categories (High / Medium / Low / Unknown).

***

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
| :-- | :-- | :-- | :-- |
| Bad GPS data enters system before full validation | High | Medium | Add boundary validation to Phase 3 (rejects coordinates outside US regions); treat `gps_accurate` as low until full validation is live.[^1] |
| PostGIS setup takes longer than expected | Medium | Low | Separate track means Intake Agent isn’t blocked; widen estimate to 2–3 weeks including monitoring/tests. |
| Integration is harder than estimated | Low | Low | Integration point is well-defined (single client wrapper, ~20–30 LOC + wiring in confidence factor).[^1] |
| USFS geodatabase download fails or format changes | Low | Medium | Quarterly refresh automation includes schema/format validation; keep “last known good” snapshot and fall back to it on failure.[^1] |
| Quarterly refresh fails silently | Medium | High | Add data freshness monitoring with alerting; `/health` endpoint exposes `last_import_timestamp` and “fresh/stale” status.[^1] |
| USFS data attributes incomplete | High | Low | Geometry is primary validation target; attributes are nice-to-have. Consider supplementing with OpenStreetMap in future iteration.[^1] |
| Schema drift in USFS datasets | Medium | Medium | Add validation step in import pipeline that checks expected field names/types and fails fast if they change; version schema expectations. |
| Cloud SQL sizing incorrect (performance or cost) | Medium | Medium | Start with a moderate tier (e.g., 2 vCPU / 8GB), log query timings and index usage, and right-size after 1–2 months of real usage. |


***

## Options Analysis

### Option 1: Separate Tracks (Recommended)

**Description:** Complete Intake Agent Phase 3 checkpoint now. Create a new “Trail Validation Service” track for Cloud SQL/PostGIS infrastructure and spatial validation endpoint. Integrate back to Intake Agent via a well-defined service contract.[^1]

**Implementation:**

- Phase 3 addition: Lightweight boundary validation (bounding box check for continental US, Alaska, Hawaii) in Intake Agent.[^1]
- New track phases: Cloud SQL setup, geodatabase import, FastAPI endpoint, quarterly automation, observability, integration.

**Pros:**

- Intake Agent deployable immediately with clear Conductor checkpoint.[^1]
- Infrastructure concerns isolated and parallelizable.
- Service contract allows evolution of validation logic without changing Intake Agent.
- Easier rollback/feature flags for Trail Validation Service independent of Intake Agent.

**Cons:**

- Temporary confidence scoring gap (distance-based gps_accurate not yet contributing).
- Additional track planning and coordination overhead.

**Estimated Effort (Trail Validation Service track):**

- End‑to‑end (Cloud SQL, PostGIS, API, automation, monitoring/tests): **2–3 weeks** of focused work by one engineer.


### Option 2: Extend Current Track

**Description:** Add “Phase 4: GPS Trail Validation” to current Intake Agent track, implementing PostGIS setup, data import, validation endpoint, and quarterly automation before marking track complete.[^1]

**Pros:**

- All related work stays in one track.
- No later integration work; everything completes before checkpoint.[^1]

**Cons:**

- Scope creep: Track grows from 3 to 4+ phases.
- Delays deployable milestone by 1–2+ weeks.
- Risk coupling: Infrastructure issues block entire track.
- Mixed concerns in one track (application, infrastructure, operations).[^1]

**Estimated Effort:** Similar total to Option 1, but sequential rather than parallel (higher risk to current milestone).

### Option 3: Skip GPS Validation

**Description:** Defer GPS validation indefinitely; `gps_accurate` remains effectively unused. Rely on other confidence factors (photo, description, reporter trust, corroboration).[^1]

**Pros:**

- No additional work.
- Simpler architecture in the short term.[^1]

**Cons:**

- Data quality issues (reports in invalid locations accepted).
- Dashboard map features will show incorrect pins.
- 15% of confidence scoring permanently unavailable; reduces usefulness for triage.[^1]

**Estimated Effort:** None, but long‑term technical debt and reduced observability.

***

## Implementation Notes

### Phase 3 Addition: Boundary Validation

Add simple bounding-box validation to `reports.py` (or equivalent) before checkpoint:

```python
VALID_REGIONS = [
    {"name": "Continental US", "min_lat": 24.5, "max_lat": 49.5, "min_lon": -125.0, "max_lon": -66.5},
    {"name": "Alaska",         "min_lat": 51.0, "max_lat": 71.5, "min_lon": -180.0, "max_lon": -129.0},
    {"name": "Hawaii",         "min_lat": 18.5, "max_lat": 22.5, "min_lon": -161.0, "max_lon": -154.5},
]

def validate_gps_in_usfs_regions(lat: float, lon: float) -> bool:
    """Quick boundary check. Not trail-accurate, but catches garbage data."""
    for region in VALID_REGIONS:
        if (region["min_lat"] <= lat <= region["max_lat"] and
            region["min_lon"] <= lon <= region["max_lon"]):
            return True
    return False
```

Additional implementation detail (recommended):

- Log rejected coordinates with reason (`OUT_OF_BOUNDS`) for early telemetry and tuning of bounding boxes.
- Consider expanding regions slightly to account for GPS noise near borders.


### Trail Validation Service Track

| Phase | Deliverable | Effort | Owner |
| :-- | :-- | :-- | :-- |
| 1 | Cloud SQL + PostGIS setup, spatial schema | 2–3 days | TBD |
| 2 | USFS geodatabase download and import pipeline (with schema validation) | 2–3 days | TBD |
| 3 | `/validate-trail-point` FastAPI endpoint + unit tests | 2–3 days | TBD |
| 4 | Quarterly refresh automation (Cloud Scheduler + validation + alerts) | 2–3 days | TBD |
| 5 | Integration with Intake Agent confidence scoring + feature flag | 0.5–1 day | TBD |

### Architecture

```
Citizen App → Intake Agent (Cloud Run) → [internal HTTP] → Trail Validation Service (Cloud Run)
                    ↓                                          ↓
              PostgreSQL (Reports)                 Cloud SQL + PostGIS (Trails)
```


***

## Technical Constraints

### Cloud SQL Configuration

PostGIS on Cloud SQL requires non‑default configuration for spatial query performance and reliability:[^1]


| Setting | Default | Required | Reason |
| :-- | :-- | :-- | :-- |
| `work_mem` | 4MB | 256MB | Spatial joins and complex geometries need more memory. |
| `statement_timeout` | none | 30s | Prevent runaway queries and limit impact of HA failover. |
| `log_min_duration_statement` | 10s+ | 1s | Visibility into slow spatial queries. |

**Application connection pool configuration (e.g., SQLAlchemy):**

```python
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,      # Required for Cloud SQL HA
    pool_recycle=3600,       # Recycle connections hourly
    connect_args={
        "connect_timeout": 10,
        "application_name": "trailwatch_validation"
    }
)
```


### Required Extensions

At a minimum, the Trail Validation Service database should enable:

- `postgis`
- `postgis_topology` (optional but future‑proof)
- `pg_trgm` (if fuzzy matching of trail names is ever needed)
- `pgrouting` (future routing/snap‑to‑network enhancements)


### Data Quality Limitations

USFS Geodata completeness varies by attribute (as of January 2026):[^1]


| Attribute | Completeness | Impact |
| :-- | :-- | :-- |
| Trail geometry | ~95% | Core requirement met. |
| Trail length | ~85% | Minor impact on length-based analytics. |
| Difficulty rating | ~60% | Cannot rely solely on this for triage. |
| Maintenance status | ~30% | Supplement with citizen reports and field data. |

**Implication:** Confidence scoring should treat geometry validation as the primary GPS signal and consider attribute enrichment as optional/secondary (possibly from USFS + OSM in later tracks).[^1]

### Data Format Requirements

**Critical:** Download geodatabase format only. USFS is deprecating shapefiles; they have data-loss and field-length issues compared to geodatabase/GeoPackage formats.[^1]

***

## Future Considerations

### Offline Mobile Validation

USER_JOURNEYS.md indicates citizens need offline capability (e.g., Sarah reporting with limited cell service). Server-side PostGIS does not address this.[^1]

Recommended approach for a future **Mobile Offline Validation** track:

- Pre-generate a SpatiaLite SQLite database (~100–120MB for all US trails).
- Ship in app bundle or as region-based downloads (10–20MB per state/region).
- Use on-device spatial queries for validation (<30 ms per query on modern phones).
- Use degrees‑to‑meters conversion or SpatiaLite’s geography‑like logic.

This ADR explicitly defers offline mobile validation to a later track while ensuring the server schema and IDs are compatible with a mirrored mobile dataset.

### Multi-Agency Trail Coverage

Current scope is USFS trails only (≈180k+ trails). Future expansion options:[^1]


| Agency | Source | Coverage | Format |
| :-- | :-- | :-- | :-- |
| BLM | BLM geospatial hub | 50k+ trails | Geodatabase/feature services |
| NPS | NPS GIS portals | 5k+ park trails | Park-specific datasets |
| State Forests | State GIS portals | State-dependent | Mixed |

Schema considerations (future‑proofing):

- Add `data_source` (e.g., `USFS`, `BLM`, `NPS`, `STATE_CA`) to trail table.
- Optionally add `agency_id` and `access_class` (e.g., `MOTORIZED`, `NON_MOTORIZED`, `CLOSED_SEASONAL`).

PostGIS architecture already supports multi‑agency integration; only import pipelines and schema enrichment would need extension.[^1]

***

## Related Decisions

- Intake Agent track plan: `conductor/tracks/intake_agent_20260116/plan.md`.[^1]
- RIDB research findings: `docs/RIDB_INTEGRATION/summary.txt`.[^1]
- PostGIS implementation guide: `docs/RIDB_INTEGRATION/trailwatch_integration_guide.md`.[^1]
- Production gotchas: `docs/RIDB_INTEGRATION/trailwatch_gotchas_solutions.md`.[^1]


### Supersedes / Depends On

- **Depends on:** RIDB research decision (RIDB not suitable for trail geometry; USFS Geodata is source of truth).[^1]
- **Will be referenced by:** Future ADRs for:
    - Trail Validation Service detailed design (API spec, error codes).
    - Offline Mobile Validation architecture.
    - Multi‑agency trails integration.

***

## References

- USFS Geodata Clearinghouse: https://data.fs.usda.gov/geodata/.[^1]
- National Forest System Trails dataset (≈117MB, updated quarterly).[^1]
- PostGIS documentation: https://postgis.net/.[^1]
- Cloud SQL for PostgreSQL with PostGIS: https://cloud.google.com/sql/docs/postgres/.[^1]
- SpatiaLite: https://www.gaia-gis.it/fossil/libspatialite/.[^1]

***

## Changelog

| Date | Author | Change |
| :-- | :-- | :-- |
| 2026-01-17 | Jason Valenzano | Initial draft based on expert consultation.[^1] |
| 2026-01-17 | Jason Valenzano | Added Technical Constraints, Future Considerations, updated risks based on expert research.[^1] |
| 2026-01-17 | TrailWatch team | Revised ADR for clearer service contract, confidence mapping, and risk expansion (this version). [^1] |

<div align="center">⁂</div>

[^1]: ADR-001-trail-validation-architecture.md

