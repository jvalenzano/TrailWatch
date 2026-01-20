# TrailWatch Observability Track Definition

## Track Metadata
- **Track ID:** OBSERVE-001
- **Track Name:** Agent Telemetry & Governance Dashboard
- **Status:** Ready for Implementation
- **Created:** January 2026
- **Dependencies:** Intake Agent Track (Phase 3 complete)
- **Owner:** Jason (Human-in-the-Loop)
- **Executor:** Anti-Gravity (AI Development Assistant)
- **Parallel Track:** Can run concurrently with Frontend Track after Phase 1

---

## 1. Track Overview

### 1.1 Objective

Build a production-grade observability layer for TrailWatch that:
- Instruments all Intake Agent operations with OpenTelemetry traces and spans
- Exports telemetry to Cloud Trace, BigQuery, and GCS for analysis and compliance
- Provides queryable audit trails for every AI decision
- Demonstrates AI governance capabilities to federal stakeholders
- Enables performance debugging and cost analysis

### 1.2 Strategic Rationale

Federal AI procurement requires demonstrable governance. While the Ranger Dashboard shows what the AI does, the Observability layer shows how we know it's working correctly. This addresses:

- **Audit requirements:** Complete decision trails for every extraction
- **Trust building:** Correlation between AI confidence and actual accuracy
- **Operational maturity:** Latency analysis, error tracking, cost attribution
- **Differentiation:** Most AI demos are black boxes; we show the machinery

### 1.3 Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Full trace coverage | Every extraction request generates complete trace with all spans |
| Query latency | BigQuery telemetry queries return in < 5 seconds |
| Retention compliance | Telemetry data retained and queryable for 90+ days |
| Demo impact | Can show live BigQuery queries during stakeholder presentation |
| Override tracking | Ranger overrides correlated with AI confidence in telemetry |
| Cost visibility | Token usage attributable by hazard type, model, time period |

### 1.4 Constraints

- **Stack:** GCP only (Cloud Trace, BigQuery, GCS, Cloud Logging)
- **Instrumentation:** OpenTelemetry (OTEL) standard
- **Privacy:** Default to NO_CONTENT mode (metadata only, no prompt/response text)
- **Retention:** Minimum 90 days for demo; design for 10-year FedRAMP compliance
- **Performance:** Telemetry export must not add > 100ms to extraction latency

### 1.5 Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| GCP Agent Starter Pack | External (googlecloudplatform.github.io) | Telemetry architecture patterns |
| Intake Agent API | `docs/intake-agent-api.md` | Operations to instrument |
| Agentic UI Patterns | `docs/agentic-ui-patterns-reference.md` | Metrics definitions |
| GEMINI.md | `GEMINI.md` | Coding standards |

---

## 2. Phase Definitions

### Phase 0: Telemetry Foundation

**Objective:** Add OpenTelemetry instrumentation to Intake Agent. No export destinations yet, just spans.

**Scope:**
- Add OpenTelemetry SDK to Intake Agent dependencies
- Create telemetry utility module (`app/telemetry.py`)
- Instrument extraction pipeline with spans:
  - `extraction.request` (parent span for full request)
  - `extraction.image_analysis` (Vertex AI Vision call)
  - `extraction.gps_validation` (boundary check)
  - `extraction.hazard_classification` (Gemini call)
  - `extraction.confidence_scoring` (confidence calculation)
  - `extraction.tracs_mapping` (TRACS code assignment)
- Add span attributes: `report_id`, `hazard_type`, `confidence`, `model_name`
- Verify spans visible in local console output

**Deliverables:**
```
app/
├── telemetry.py                 ✓ OTEL setup, span context management
├── routes/extract.py            ✓ Updated with span instrumentation
├── services/
│   ├── image_analyzer.py        ✓ Instrumented with child span
│   ├── gps_validator.py         ✓ Instrumented with child span
│   ├── hazard_classifier.py     ✓ Instrumented with child span
│   └── tracs_mapper.py          ✓ Instrumented with child span
└── requirements.txt             ✓ opentelemetry-* packages added
```

**Checkpoint Criteria:**
- [ ] `opentelemetry-api`, `opentelemetry-sdk`, `opentelemetry-instrumentation` in requirements
- [ ] Running extraction locally prints span hierarchy to console
- [ ] Each span has correct parent-child relationship
- [ ] Span attributes include `report_id`, `hazard_type`, `confidence`
- [ ] Extraction latency unchanged (< 100ms overhead)
- [ ] No OTEL errors in application logs

**Estimated Duration:** 2-3 days

---

### Phase 1: Cloud Trace Export

**Objective:** Export traces to Cloud Trace for distributed tracing visualization.

**Scope:**
- Configure OTEL exporter for Cloud Trace
- Add environment-based configuration (local vs. deployed)
- Deploy instrumented Intake Agent to Cloud Run (dev environment)
- Verify traces visible in Cloud Trace console
- Add trace ID to extraction API response for correlation

**Deliverables:**
```
app/
├── telemetry.py                 ✓ Updated with Cloud Trace exporter
├── config.py                    ✓ OTEL configuration by environment
deployment/
└── terraform/
    └── service.tf               ✓ OTEL env vars for Cloud Run
```

**Checkpoint Criteria:**
- [ ] Local development: spans print to console (no Cloud Trace export)
- [ ] Deployed (dev): traces visible in Cloud Trace within 30 seconds
- [ ] Trace waterfall shows all child spans with correct timing
- [ ] Can filter traces by `report_id` attribute in Cloud Trace
- [ ] Extraction API response includes `trace_id` field
- [ ] No increase in Cold Start time for Cloud Run

**Estimated Duration:** 2 days

---

### Phase 2: BigQuery Telemetry Tables

**Objective:** Export structured telemetry to BigQuery for analytics and demo queries.

**Scope:**
- Create GCS bucket for telemetry JSONL files
- Implement telemetry upload hook (write JSONL to GCS on each extraction)
- Create BigQuery dataset with external tables reading from GCS
- Create flattened view for easy querying
- Implement token counting for Gemini calls
- Add ranger action logging (approve, override, assign) from Frontend

**Telemetry Schema:**
```json
{
  "timestamp": "2026-01-19T14:30:00Z",
  "trace_id": "abc123...",
  "report_id": "rpt_456",
  "extraction_id": "ext_789",
  "service_version": "v1.2.3",
  
  "hazard_type": "rock_fall",
  "tracs_code": "1120",
  "urgency": "high",
  "confidence": 0.87,
  
  "model_name": "gemini-1.5-flash",
  "input_tokens": 1250,
  "output_tokens": 340,
  
  "latency_ms": {
    "total": 2340,
    "image_analysis": 890,
    "gps_validation": 120,
    "hazard_classification": 1100,
    "confidence_scoring": 80,
    "tracs_mapping": 50
  },
  
  "gps_validation": {
    "within_boundary": true,
    "nearest_trail": "Pacific Crest Trail - Section J",
    "distance_to_trail_meters": 12.5
  },
  
  "ranger_action": null,
  "ranger_override": null,
  "ranger_id": null
}
```

**Deliverables:**
```
app/
├── telemetry.py                 ✓ GCS upload hook added
├── services/
│   └── telemetry_writer.py      ✓ JSONL formatting, async upload
deployment/
└── terraform/
    ├── gcs.tf                   ✓ Telemetry bucket
    ├── bigquery.tf              ✓ Dataset, external tables, views
    └── iam.tf                   ✓ Service account permissions
```

**Checkpoint Criteria:**
- [ ] GCS bucket `{project_id}-trailwatch-telemetry` created
- [ ] JSONL files appear in `gs://{bucket}/extractions/` after each extraction
- [ ] BigQuery external table `trailwatch_telemetry.extractions_raw` reads GCS
- [ ] BigQuery view `trailwatch_telemetry.extractions` has flattened schema
- [ ] Token counts accurate (verified against Vertex AI logs)
- [ ] Query `SELECT * FROM extractions WHERE timestamp > ... LIMIT 10` returns data
- [ ] Latency breakdown sums to approximately total latency

**Estimated Duration:** 3-4 days

---

### Phase 3: Ranger Action Correlation

**Objective:** Connect ranger decisions from Frontend to telemetry for trust calibration analysis.

**Scope:**
- Add API endpoint for logging ranger actions (`POST /api/telemetry/action`)
- Frontend calls this endpoint on approve, override, assign actions
- Action records link to original extraction via `extraction_id`
- Create BigQuery view joining extractions with ranger actions
- Implement override rate calculation by confidence tier

**Ranger Action Schema:**
```json
{
  "timestamp": "2026-01-19T14:35:00Z",
  "extraction_id": "ext_789",
  "report_id": "rpt_456",
  "ranger_id": "ranger_smith",
  
  "action_type": "override",
  "original_hazard_type": "erosion",
  "corrected_hazard_type": "drainage",
  "original_confidence": 0.72,
  
  "time_to_decision_ms": 8500,
  "reasoning_panel_viewed": true,
  "reasoning_panel_duration_ms": 3200
}
```

**Deliverables:**
```
app/
├── routes/telemetry.py          ✓ POST /api/telemetry/action endpoint
├── services/
│   └── action_logger.py         ✓ Action record formatting, GCS upload
deployment/
└── terraform/
    └── bigquery.tf              ✓ actions table, joined view added

# Frontend additions (coordinate with Frontend Track)
src/
├── hooks/
│   └── useActionTelemetry.ts    ✓ Logs ranger actions to backend
└── components/reports/
    └── ReportActions.tsx        ✓ Calls useActionTelemetry on action
```

**Checkpoint Criteria:**
- [ ] `POST /api/telemetry/action` accepts and stores ranger actions
- [ ] Actions appear in `gs://{bucket}/actions/` as JSONL
- [ ] BigQuery table `trailwatch_telemetry.ranger_actions` queryable
- [ ] View `trailwatch_telemetry.extractions_with_actions` joins correctly
- [ ] Can query override rate by confidence tier (see demo queries below)
- [ ] `reasoning_panel_viewed` and duration tracked accurately

**Estimated Duration:** 3 days

---

### Phase 4: Demo Queries & Governance Views

**Objective:** Create the specific queries and optional lightweight UI for stakeholder demos.

**Scope:**
- Write and test 5 demo queries (see section 2.5)
- Create saved queries in BigQuery for easy demo execution
- (Optional) Build simple "Admin" view in React dashboard showing key metrics
- Document demo narrative with talking points per query
- Performance test queries with 1000+ extraction records

**Demo Queries:**

**Query 1: Trust Calibration (Confidence vs. Override Rate)**
```sql
-- Do rangers trust high-confidence extractions?
SELECT
  CASE 
    WHEN e.confidence >= 0.9 THEN '4-Very High (90-100%)'
    WHEN e.confidence >= 0.75 THEN '3-High (75-89%)'
    WHEN e.confidence >= 0.5 THEN '2-Moderate (50-74%)'
    ELSE '1-Low (0-49%)'
  END as confidence_tier,
  COUNT(DISTINCT e.extraction_id) as total_extractions,
  COUNT(DISTINCT a.extraction_id) as reviewed_extractions,
  COUNTIF(a.action_type = 'override') as overrides,
  ROUND(SAFE_DIVIDE(COUNTIF(a.action_type = 'override'), COUNT(DISTINCT a.extraction_id)) * 100, 1) as override_rate_pct
FROM `trailwatch_telemetry.extractions` e
LEFT JOIN `trailwatch_telemetry.ranger_actions` a 
  ON e.extraction_id = a.extraction_id
WHERE e.timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY confidence_tier
ORDER BY confidence_tier DESC;
```

**Query 2: Latency Breakdown by Processing Step**
```sql
-- Where is time spent in extraction?
SELECT
  'Image Analysis' as step,
  APPROX_QUANTILES(latency_ms.image_analysis, 100)[OFFSET(50)] as p50_ms,
  APPROX_QUANTILES(latency_ms.image_analysis, 100)[OFFSET(95)] as p95_ms
FROM `trailwatch_telemetry.extractions`
WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
UNION ALL
SELECT
  'GPS Validation',
  APPROX_QUANTILES(latency_ms.gps_validation, 100)[OFFSET(50)],
  APPROX_QUANTILES(latency_ms.gps_validation, 100)[OFFSET(95)]
FROM `trailwatch_telemetry.extractions`
WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
UNION ALL
SELECT
  'Hazard Classification',
  APPROX_QUANTILES(latency_ms.hazard_classification, 100)[OFFSET(50)],
  APPROX_QUANTILES(latency_ms.hazard_classification, 100)[OFFSET(95)]
FROM `trailwatch_telemetry.extractions`
WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 7 DAY)
ORDER BY p95_ms DESC;
```

**Query 3: Token Cost by Hazard Type**
```sql
-- Which hazard types cost the most to process?
SELECT
  hazard_type,
  COUNT(*) as extraction_count,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  ROUND(SUM(input_tokens + output_tokens) * 0.000001 * 0.075, 4) as estimated_cost_usd
FROM `trailwatch_telemetry.extractions`
WHERE timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 30 DAY)
GROUP BY hazard_type
ORDER BY total_input_tokens DESC;
```

**Query 4: Daily Extraction Volume & Accuracy Trend**
```sql
-- How is the system performing over time?
SELECT
  DATE(e.timestamp) as date,
  COUNT(DISTINCT e.extraction_id) as extractions,
  ROUND(AVG(e.confidence) * 100, 1) as avg_confidence_pct,
  COUNTIF(a.action_type = 'override') as overrides,
  ROUND(AVG(e.latency_ms.total)) as avg_latency_ms
FROM `trailwatch_telemetry.extractions` e
LEFT JOIN `trailwatch_telemetry.ranger_actions` a 
  ON e.extraction_id = a.extraction_id
WHERE e.timestamp > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 14 DAY)
GROUP BY date
ORDER BY date DESC;
```

**Query 5: Trace Drill-Down for Specific Extraction**
```sql
-- Deep dive into a specific extraction (for debugging demo)
SELECT
  timestamp,
  trace_id,
  report_id,
  hazard_type,
  confidence,
  urgency,
  model_name,
  input_tokens,
  output_tokens,
  latency_ms.total as total_latency_ms,
  latency_ms.image_analysis,
  latency_ms.gps_validation,
  latency_ms.hazard_classification,
  gps_validation.within_boundary,
  gps_validation.nearest_trail,
  gps_validation.distance_to_trail_meters
FROM `trailwatch_telemetry.extractions`
WHERE report_id = @report_id  -- parameterized
ORDER BY timestamp DESC
LIMIT 1;
```

**Deliverables:**
```
deployment/
└── bigquery/
    ├── saved_queries/
    │   ├── trust_calibration.sql        ✓ Query 1
    │   ├── latency_breakdown.sql        ✓ Query 2
    │   ├── token_cost.sql               ✓ Query 3
    │   ├── daily_trend.sql              ✓ Query 4
    │   └── extraction_drilldown.sql     ✓ Query 5
    └── README.md                        ✓ Query descriptions, demo narrative

# Optional: Admin view in Frontend
src/
├── pages/
│   └── AdminPage.tsx                    ○ Optional metrics dashboard
└── components/admin/
    ├── TrustCalibrationChart.tsx        ○ Optional
    ├── LatencyBreakdownChart.tsx        ○ Optional
    └── DailyTrendChart.tsx              ○ Optional
```

**Checkpoint Criteria:**
- [ ] All 5 demo queries execute successfully against real data
- [ ] Query execution time < 5 seconds each with 1000+ records
- [ ] Saved queries accessible in BigQuery console
- [ ] Demo narrative document complete with talking points
- [ ] (Optional) Admin page renders charts from BigQuery data
- [ ] Can demonstrate full trace drill-down from Cloud Trace console

**Estimated Duration:** 3-4 days (add 3 days if building Admin UI)

---

### Phase 5: Production Hardening

**Objective:** Ensure telemetry is reliable, performant, and compliant for production use.

**Scope:**
- Implement async telemetry upload (non-blocking)
- Add retry logic for GCS upload failures
- Configure Cloud Logging bucket with extended retention
- Add alerting for telemetry pipeline failures
- Document data retention and privacy policies
- Load test with 100 concurrent extractions

**Deliverables:**
```
app/
├── services/
│   └── telemetry_writer.py      ✓ Async upload, retry logic, error handling
deployment/
└── terraform/
    ├── logging.tf               ✓ Cloud Logging bucket, 10-year retention
    ├── monitoring.tf            ✓ Alerting policies for telemetry failures
    └── vars/
        └── prod.tfvars          ✓ Production-specific retention settings
docs/
├── telemetry-data-retention.md  ✓ Retention policy documentation
└── telemetry-privacy.md         ✓ Privacy policy (NO_CONTENT mode explained)
```

**Checkpoint Criteria:**
- [ ] Telemetry upload is async (does not block extraction response)
- [ ] Failed GCS uploads retry 3x with exponential backoff
- [ ] Cloud Logging bucket configured with 10-year retention
- [ ] Alert fires if telemetry write success rate < 99% over 1 hour
- [ ] Load test: 100 concurrent extractions complete without telemetry errors
- [ ] Documentation reviewed and approved by Jason

**Estimated Duration:** 3-4 days

---

## 3. Validation Requirements

### 3.1 Per-Phase Validation

Before marking any phase complete, Anti-Gravity must:

1. **Self-Test:** Run checkpoint criteria, document pass/fail
2. **Query Verification:** All demo queries return expected results
3. **Latency Check:** Confirm telemetry adds < 100ms to extraction
4. **Build Verification:** `terraform plan` shows no errors
5. **Document Deviations:** If any spec was modified, document why

### 3.2 Human Review Gates

| Phase | Review Type | What Jason Checks |
|-------|-------------|-------------------|
| Phase 1 | Async | Traces visible in Cloud Trace console |
| Phase 2 | Async | BigQuery tables populated, schema correct |
| Phase 4 | Sync (demo) | Run through all 5 demo queries with talking points |
| Phase 5 | Async | Retention policies, alerting configuration |

### 3.3 Integration Testing

Before final delivery:
- Generate 100+ test extractions with varied hazard types and confidence levels
- Simulate ranger actions (approve, override) for 50+ extractions
- Verify all queries return accurate aggregations
- Test Cloud Trace filtering by report_id and trace_id
- Confirm GCS files are valid JSONL (parseable)

---

## 4. Technical Decisions (Pre-Authorized)

Anti-Gravity may make the following decisions without escalation:

| Decision Area | Guidance |
|---------------|----------|
| OTEL packages | Use official `opentelemetry-*` packages from PyPI |
| GCS path structure | `gs://{bucket}/{table_name}/year={Y}/month={M}/day={D}/` |
| JSONL formatting | One record per line, UTF-8 encoded |
| BigQuery partitioning | Partition by `DATE(timestamp)` for all tables |
| Async library | `asyncio` for non-blocking uploads; no Celery |
| Retry logic | Exponential backoff: 1s, 2s, 4s, then fail |

### 4.1 Escalate to Jason

- Any change to telemetry schema after Phase 2 completion
- Adding PII to telemetry (prompt/response content)
- Changing retention periods
- Adding external dependencies for visualization (Looker, Grafana)
- Performance issues requiring architecture changes

---

## 5. Communication Protocol

### 5.1 Progress Updates

At end of each phase:
- Summary of what was built
- Sample query output showing telemetry data
- Any blockers or questions for Jason
- Estimated timeline for next phase

### 5.2 Blockers

If blocked:
- Document the blocker clearly
- Propose 2-3 potential solutions
- State which solution Anti-Gravity recommends and why
- Wait for Jason's decision before proceeding

### 5.3 Artifacts

All code changes should be committed with:
- Clear commit messages referencing phase number
- Example: `[OBSERVE-001/P2] Add BigQuery external tables for telemetry`

---

## 6. Timeline Summary

| Phase | Duration | Cumulative | Milestone |
|-------|----------|------------|-----------|
| Phase 0: Telemetry Foundation | 2-3 days | 3 days | Spans visible locally |
| Phase 1: Cloud Trace Export | 2 days | 5 days | Traces in Cloud Trace |
| Phase 2: BigQuery Tables | 3-4 days | 9 days | **Queryable telemetry** |
| Phase 3: Ranger Action Correlation | 3 days | 12 days | Override tracking |
| Phase 4: Demo Queries | 3-4 days | 16 days | **Demo-ready governance** |
| Phase 5: Production Hardening | 3-4 days | 20 days | Production-grade |

**Critical Path:** Phases 0-2 are sequential. Phases 3-4 can partially overlap. Phase 5 can run parallel to Frontend Track Phase 5.

**Demo Gate:** After Phase 4, observability is ready for stakeholder demonstration.

**Parallelization with Frontend Track:**
- OBSERVE Phase 0-2 can run while FRONTEND Phase 0-2 runs
- OBSERVE Phase 3 requires FRONTEND Phase 2 (ReportActions component)
- OBSERVE Phase 4 demo queries require OBSERVE Phase 3 data

---

## 7. Open Items (Require Jason Decision)

1. **Admin UI Priority:** Should Phase 4 include building React charts, or is BigQuery console sufficient for demo? Recommendation: Skip React charts initially; BigQuery console is more impressive (shows real queries). **Decision needed before Phase 4.**

2. **Telemetry Granularity:** Should we log every Gemini API call individually, or just the aggregate per extraction? Recommendation: Aggregate per extraction (simpler, lower volume). **Decision needed before Phase 2.**

3. **Ranger ID Source:** How do we identify rangers? Session-based ID, SSO integration, or manual selection? This affects the `ranger_id` field in action logging. **Decision needed before Phase 3.**

4. **Retention Tiers:** Should dev/staging have shorter retention (30 days) vs. prod (10 years)? Recommendation: Yes, to reduce storage costs. **Decision needed before Phase 5.**

5. **Prompt Content Logging:** Should we ever enable full prompt/response logging for debugging? If yes, what approval process? Recommendation: Only in dev environment, requires explicit env var, documented in privacy policy. **Decision needed before Phase 5.**

---

## 8. Demo Narrative

The following narrative accompanies the demo queries for stakeholder presentations:

### Opening (Before Queries)

"Before I show you the ranger dashboard, I want to show you something most AI demos never show: the complete audit trail. Every decision our AI makes is traced, logged, and queryable. This is how you govern AI in production."

### Query 1: Trust Calibration

"This query answers a critical question: should rangers trust our AI? We're comparing confidence levels to override rates. See how high-confidence extractions (90%+) have a 3% override rate, while moderate confidence (50-74%) has 18%? That tells us the AI knows when it's uncertain, and rangers are appropriately skeptical. This correlation is how we measure trust calibration."

### Query 2: Latency Breakdown

"When an extraction takes longer than expected, we can see exactly why. Here's the p95 latency by processing step. Image analysis is our bottleneck at 1.2 seconds. That tells our engineering team exactly where to optimize."

### Query 3: Token Cost

"AI isn't free. This shows token usage by hazard type. Rock falls use more tokens because the photo analysis is more complex. This helps us forecast costs and optimize prompts for expensive categories."

### Query 4: Daily Trend

"Here's the operational view: extraction volume, average confidence, and override rate over the past two weeks. You can see Tuesday's spike (storm reports) and how confidence stayed stable despite the volume increase."

### Query 5: Trace Drill-Down

"Let's pick a specific report and see everything that happened. Here's the trace ID, every processing step with timing, the GPS validation result, confidence breakdown. If a ranger questions any extraction, we can show them exactly how the AI reached its conclusion."

### Closing

"This isn't a black box. It's a governed, auditable AI system. The dashboard you'll see next is built on this foundation."

---

*This track definition is designed for use with Anti-Gravity conductor patterns. Each phase should be executed as a discrete work unit with checkpoint validation before proceeding.*
