# TrailWatch

## TL;DR — Critical Context (Read First)

**Project:** Citizen crowdsourcing platform for USFS trail condition reporting with AI-powered triage.

**Current Phase:** Project 1 (Intake Agent) complete. Next: Trail Validation Service per ADR-001.

**Tech Stack Essentials:**
- Backend: Python 3.11+ / FastAPI / PostgreSQL 17 + PostGIS
- AI: Google ADK (NOT LangChain), Local LLMs (Llama/Mistral), Vertex AI Gemini
- Frontend: React 18+ / TypeScript / MapLibre GL JS

**Critical ADRs:**
- **ADR-001:** Trail Validation Architecture — Use USFS Geodata + PostGIS for GPS validation (blocks Project 2)

**Constraints:**
- Never use: OpenAI, LangChain, SQLite, Flask, requests
- Always: Type hints, Google-style docstrings, pytest, 80% coverage, async for external APIs

**Priority Queue:** See `conductor/NEXT.md` for current track decisions.

---

## Overview

TrailWatch is a citizen crowdsourcing platform for US Forest Service trail condition reporting with AI-powered triage. It transforms unstructured citizen reports into actionable intelligence for USFS rangers and volunteer coordinators.

**Mission:** Close the gap between trail conditions on the ground and USFS staff awareness, using AI to convert citizen observations into TRACS-compliant maintenance priorities.

**Why this matters:** USFS is in crisis. Maintained trail miles dropped 22% as of December 2025. Some districts lost 100% of trail staff. TrailWatch is a force multiplier, not additional workload.

## Target Users

| User | Role | Primary Need |
|------|------|--------------|
| **Volunteer Coordinator** | Manages adopt-a-trail crews (PCTA, local clubs) | Dashboard showing reports on their adopted trails, crew coordination |
| **USFS Ranger/Trail Manager** | Oversees 100-400 trail miles per district | Triaged reports with severity + recommended action, closure notice drafts |
| **Citizen Hiker** | Reports trail conditions from the field | Simple mobile form: photo + location + description, under 30 seconds |

**Primary users are Coordinators and Rangers, not hikers.** Hikers are data sources; Coordinators and Rangers are decision-makers.

## Tech Stack

### Platform
- **Cloud Provider:** Google Cloud Platform (GCP) only
- **Compute:** Cloud Run (serverless containers)
- **Database:** PostgreSQL 17 (Operational + Vectors + JSONB), BigQuery (Cold Archive only)
- **AI/ML:** Local LLMs (Llama 3, Mistral) via Ollama/vLLM; Vertex AI (Gemini) for high-compliance tasks only
- **Maps:** MapLibre GL JS + Protomaps (Basemaps), Contour/Three.js (3D), PostGIS (Spatial Logic)
- **Storage:** Cloud Storage (photos, exports)
- **Auth:** Firebase Auth or Cloud Identity (citizen), IAM (internal)

### Languages & Frameworks
- **Backend:** Python 3.11+
- **API Framework:** FastAPI
- **Agent Framework:** Google ADK (Agent Development Kit)
- **Frontend:** React 18+ with TypeScript
- **Mapping:** Google Maps JavaScript API, deck.gl for data layers
- **Mobile:** React Native or PWA (TBD in Phase 2)

### Key Dependencies
```
# Python
fastapi>=0.109.0
google-cloud-aiplatform>=1.38.0
google-adk>=0.1.0
sqlalchemy>=2.0.0
geoalchemy2>=0.14.0
pydantic>=2.5.0
httpx>=0.26.0

# Do NOT use
# - langchain (we use ADK for agent orchestration)
# - openai (Gemini only for FedRAMP alignment)
# - sqlite (use PostgreSQL/PostGIS for spatial)
```

## Architecture

### Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  CITIZEN INPUT                                                  │
│  Mobile app / Web form                                          │
│  • Photo (optional)                                             │
│  • GPS coordinates (auto-captured)                              │
│  • Hazard description (free text)                               │
│  • Hazard type (dropdown selection)                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  INTAKE AGENT (Project 1)                                       │
│  • Validates GPS against RIDB trail registry                    │
│  • Extracts structured data from free text                      │
│  • Maps to TRACS categories                                     │
│  • Assigns initial confidence score                             │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  HAZARD CLASSIFIER (Project 3)                                  │
│  • Analyzes photo using Gemini Vision                           │
│  • Validates hazard type against image content                  │
│  • Adjusts confidence score based on visual evidence            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  TRIAGE ENGINE                                                  │
│  • Checks for duplicate/similar reports (spatial + temporal)    │
│  • Weighs by trail popularity (Strava data if available)        │
│  • Weighs by hazard severity                                    │
│  • Assigns priority: CLOSURE / MAINTENANCE / INFO_ONLY          │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│  STORAGE (BigQuery + PostGIS)                                   │
│  • Raw reports (immutable audit trail)                          │
│  • Triaged reports (enriched, actionable)                       │
│  • Trail registry (synced from RIDB quarterly)                  │
│  • Closure history (for trend analysis)                         │
└────────────────────────┬────────────────────────────────────────┘
                         │
          ┌──────────────┼──────────────┐
          ▼              ▼              ▼
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ COORDINATOR │  │   RANGER    │  │   HIKER     │
│  DASHBOARD  │  │  DASHBOARD  │  │   ALERTS    │
│ (Project 2) │  │ (Project 2) │  │ (Project 4) │
└─────────────┘  └─────────────┘  └─────────────┘
```

### Agent Architecture (ADK)

```
┌─────────────────────────────────────────────────────────────────┐
│  TRAILWATCH ORCHESTRATOR AGENT                                  │
│  Routes requests to specialized agents                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   INTAKE    │  │   HAZARD    │  │  PRIORITY   │             │
│  │   AGENT     │  │ CLASSIFIER  │  │   AGENT     │             │
│  │             │  │             │  │             │             │
│  │ • Text      │  │ • Vision    │  │ • Ranking   │             │
│  │   extraction│  │   analysis  │  │ • Routing   │             │
│  │ • TRACS     │  │ • Confidence│  │ • Closure   │             │
│  │   mapping   │  │   adjustment│  │   recommend │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  TOOLS (Model Context Protocol - MCP)                           │
│  • mcp_trail_lookup: Query Overpass/OSM for trailheads          │
│  • mcp_snap_engine: PostGIS topology snapping                   │
│  • mcp_tracs_classifier: Local Llama/Mistral classification     │
│  • mcp_weather: NOAA weather lookups                            │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Coding Standards

### Python Style
- Follow PEP 8, enforced by `ruff`
- Line length: 88 characters (Black default)
- Use type hints for all function signatures
- Google-style docstrings for all public functions
- No bare `except:` clauses; always specify exception type

### Naming Conventions
```python
# Files: snake_case
hazard_classifier.py
trail_validator.py

# Classes: PascalCase
class HazardReport:
class TrailSegment:

# Functions/methods: snake_case
def calculate_confidence_score():
def snap_to_trail():

# Constants: UPPER_SNAKE_CASE
MAX_REPORT_AGE_DAYS = 30
DEFAULT_CONFIDENCE_THRESHOLD = 0.7

# Database tables: snake_case, plural
hazard_reports
trail_segments
closure_notices
```

### Testing Requirements
- Unit tests required for all business logic
- Integration tests for API endpoints
- Minimum 80% coverage for new code
- Use `pytest` as test framework
- Mock external APIs (RIDB, Gemini) in unit tests
- Test TRACS mapping with representative citizen inputs

### Logging
- Use `structlog` for structured JSON logging
- Log levels: DEBUG (dev only), INFO (operational), WARNING, ERROR
- Always include `report_id` in log context when processing reports
- Never log PII (email, phone, full name)
- Always log: timestamps, request IDs, confidence scores, TRACS mappings

```python
import structlog
logger = structlog.get_logger()

# Good
logger.info("report_processed", 
    report_id=report.id,
    tracs_category=result.category,
    confidence=result.confidence)

# Bad - contains PII
logger.info("report_processed", 
    user_email=report.user_email,  # NEVER
    description=report.description)  # May contain PII
```

### Error Handling
- Use custom exception classes for domain errors
- Always return structured error responses from APIs
- Include correlation IDs for debugging
- Graceful degradation: if RIDB is down, accept report without validation

```python
# Custom exceptions
class TrailNotFoundError(Exception):
    """Raised when GPS coordinates don't match any known trail."""
    pass

class TriageFailedError(Exception):
    """Raised when AI triage cannot produce a confident result."""
    pass
```

## External Integrations

### RIDB API (Recreation Information Database)
- **Endpoint:** https://ridb.recreation.gov/api/v1/
- **Auth:** API key (free registration)
- **Use for:** Trail registry validation, trail metadata
- **Rate limit:** Respect published limits; cache aggressively
- **Fallback:** If RIDB unavailable, accept report with `trail_validated: false`

```python
# Example query
GET /facilities?query=Pacific+Crest+Trail&state=CA
GET /trails?facilityId=12345
```

### USFS Geodata Clearinghouse
- **Source:** https://data.fs.usda.gov/geodata/edw/datasets.php
- **Format:** ESRI File Geodatabase, Shapefile, GeoJSON
- **Update frequency:** Quarterly
- **Use for:** Trail geometry (line features), management attributes
- **Storage:** Load into PostGIS, refresh quarterly via batch job

### Weather Data (NOAA/USGS)
- **Use for:** Contextualizing reports (recent rain, fire activity)
- **Implementation:** Daily batch pull, not real-time
- **Fields needed:** Precipitation (48h), temperature, fire perimeters

## TRACS Mapping Reference

TRACS (Trail Assessment and Condition Surveys) is the USFS national standard. All citizen reports must map to TRACS categories for institutional compatibility.

### Category Mapping

| TRACS Category | Code | Citizen Language Examples |
|----------------|------|---------------------------|
| **Clearing** | CLR | "tree down", "log across trail", "fallen tree", "blowdown", "overgrown", "brush blocking", "branches down" |
| **Drainage** | DRN | "muddy", "flooded", "standing water", "puddles", "washout", "water on trail", "creek overflow", "drainage blocked" |
| **Grading** | GRD | "erosion", "ruts", "uneven surface", "trail washed away", "gullies", "loose rocks", "trail degraded" |
| **Structures** | STR | "bridge damaged", "bridge out", "boardwalk broken", "steps collapsed", "handrail missing", "puncheon rotted" |
| **Signing** | SGN | "sign missing", "sign damaged", "trail unmarked", "confusing junction", "wrong direction", "sign vandalized" |
| **Tread** | TRD | "trail surface damaged", "roots exposed", "rocks loose", "trail widening", "multiple paths" |

### Severity Mapping

| Severity | Code | Criteria |
|----------|------|----------|
| **CLOSURE_RECOMMENDED** | SEV3 | Safety hazard, impassable, structural failure |
| **MAINTENANCE_NEEDED** | SEV2 | Passable with difficulty, degrading, needs attention within 30 days |
| **INFO_ONLY** | SEV1 | Minor issue, passable, informational for planning |
| **FALSE_POSITIVE** | SEV0 | Not a real issue, spam, duplicate, or resolved |

### Confidence Scoring

```python
# Confidence factors (0.0 - 1.0 each, weighted average)
CONFIDENCE_WEIGHTS = {
    "has_photo": 0.25,           # Photo provided
    "photo_matches_hazard": 0.20, # Vision model confirms hazard type
    "gps_accurate": 0.15,        # GPS within 50m of known trail
    "description_specific": 0.15, # Detailed description vs vague
    "reporter_trusted": 0.10,    # PCTA/volunteer vs anonymous
    "corroborating_reports": 0.10, # Other reports same location/time
    "weather_context": 0.05,     # Matches recent weather events
}

# Thresholds
HIGH_CONFIDENCE = 0.80   # Auto-queue to ranger dashboard
MEDIUM_CONFIDENCE = 0.50 # Queue to coordinator for review
LOW_CONFIDENCE = 0.50    # Low priority, may request clarification
```

## API Contracts

### Report Submission Endpoint

```
POST /api/v1/reports
Content-Type: application/json

{
  "trail_id": "string (RIDB ID, optional)",
  "location": {
    "latitude": 37.123456,
    "longitude": -120.654321,
    "accuracy_meters": 50
  },
  "hazard_type": "enum: clearing|drainage|grading|structures|signing|tread|other",
  "severity_estimate": "enum: passable|difficult|impassable|dangerous",
  "description": "string (free text, max 1000 chars)",
  "photos": ["string (base64 or Cloud Storage URL)"],
  "reporter": {
    "type": "enum: anonymous|volunteer|coordinator",
    "organization": "string (optional, e.g., 'PCTA')"
  }
}

Response 201:
{
  "report_id": "uuid",
  "status": "received",
  "trail_matched": true,
  "trail_name": "Pacific Crest Trail - Section J",
  "estimated_processing_time": "under 5 minutes"
}
```

### Triaged Report Schema

```json
{
  "report_id": "uuid",
  "original_submission": { ... },
  "triage_result": {
    "tracs_category": "CLR",
    "tracs_category_name": "Clearing",
    "severity": "SEV2",
    "severity_name": "MAINTENANCE_NEEDED",
    "confidence_score": 0.87,
    "confidence_factors": {
      "has_photo": true,
      "photo_matches_hazard": true,
      "gps_accurate": true,
      "description_specific": true,
      "reporter_trusted": false,
      "corroborating_reports": 1,
      "weather_context": "recent_windstorm"
    },
    "recommended_action": "Schedule clearing crew within 14 days",
    "similar_reports": ["uuid1", "uuid2"],
    "trail_popularity_percentile": 0.78,
    "estimated_hikers_affected_annually": 12000
  },
  "routing": {
    "assigned_to": "coordinator",
    "coordinator_id": "uuid (if applicable)",
    "ranger_district": "Tahoe National Forest - Yuba River RD"
  },
  "timestamps": {
    "submitted_at": "ISO8601",
    "triaged_at": "ISO8601",
    "reviewed_at": null,
    "resolved_at": null
  }
}
```

## Constraints

### Data Quality Requirements
- All GPS coordinates must be WGS84 (EPSG:4326)
- All timestamps must be ISO8601 with timezone
- All text must be UTF-8
- Photos must be JPEG or PNG, max 10MB
- Free text descriptions max 1000 characters

### Security Requirements
- HTTPS/TLS 1.3 for all endpoints
- Data at rest encryption (Cloud Storage, BigQuery)
- API keys stored in Secret Manager, never in code
- Audit logging for all write operations
- No PII in logs (email, phone, full name)

### Accessibility Requirements
- All public-facing UI must meet WCAG 2.1 AA
- Color contrast ratios must pass automated checks
- Map interfaces must have keyboard navigation
- Error messages must be descriptive, not just codes

### Compliance Considerations
- FedRAMP: NOT required (recreation data is low sensitivity)
- However, maintain security hygiene as if we were seeking FedRAMP Low
- Data retention: Keep raw reports indefinitely (audit trail)
- FOIA: All data may be subject to public records requests

## Do Not

### Forbidden Patterns
- **Never** use OpenAI APIs (Gemini only for GCP alignment)
- **Never** use LangChain (ADK is our agent framework)
- **Never** store raw PII in BigQuery (hash or omit)
- **Never** auto-publish closure notices without human approval
- **Never** expose internal database IDs in public APIs (use UUIDs)
- **Never** trust client-provided severity ratings without AI validation
- **Never** skip trail validation even if RIDB is slow (queue for retry)

### Forbidden Libraries
```python
# Do NOT add these to requirements
openai          # Use Llama 3 / Mistral / Vertex Gemini
langchain       # Use Google ADK
sqlite3         # Use PostgreSQL + PostGIS
flask           # Use FastAPI
requests        # Use httpx (async support)
```

### Anti-Patterns to Avoid
- Synchronous API calls to external services (always async with timeout)
- Hardcoded API keys or credentials (use Secret Manager)
- Silent failures (always log errors with context)
- Broad exception handling (catch specific exceptions)
- Business logic in API routes (use service layer)
- Raw SQL strings (use SQLAlchemy ORM or parameterized queries)

## Project Phases

**NOTE:** Before implementing any project, check `docs/adr/` for architectural decisions that may affect implementation order or dependencies.

### Project 1: Intake Agent
- **Goal:** Accept citizen reports, extract structured data, map to TRACS
- **Input:** Raw citizen submission (text, photo, GPS)
- **Output:** Structured HazardReport with TRACS category + confidence
- **Success:** Process 50 sample reports with 80%+ TRACS accuracy

### Project 2: Status Dashboard
- **Goal:** Visualize trail status and aggregated reports
- **Input:** Triaged reports from database
- **Output:** Map UI with trail status overlay, report clustering
- **Success:** Coordinator can see their adopted trails + recent reports

### Project 3: Hazard Classifier
- **Goal:** Analyze photos to validate/enhance hazard classification
- **Input:** Photo from citizen report
- **Output:** Hazard type + confidence adjustment
- **Success:** Photo analysis improves TRACS accuracy by 10%+

### Project 4: Closure Notice Generator
- **Goal:** Generate draft closure notices for ranger approval
- **Input:** SEV3 triaged report
- **Output:** Formatted closure notice (multiple formats: web, social, email)
- **Success:** Rangers approve 80%+ of generated notices with minor edits

### Project 5: Prioritization Agent
- **Goal:** Rank maintenance tasks across all open reports
- **Input:** All triaged reports, trail popularity data, resource availability
- **Output:** Prioritized maintenance queue with reasoning
- **Success:** Rangers agree with top 10 priorities 80%+ of the time

## Architecture Decision Records (ADRs)

**IMPORTANT:** Before creating new tracks or making architectural decisions, always check `docs/adr/` for existing decisions.

Current ADRs:
- **ADR-001:** Trail Validation Architecture (RIDB vs USFS Geodata + PostGIS)
  - Decision: Use USFS Geodata Clearinghouse + PostGIS for GPS trail validation
  - Impact: Requires separate "Trail Validation Service" track before full GPS confidence scoring
  - Status: Intake Agent has boundary validation only; full trail snapping pending

Template: `docs/adr/ADR-000-template.md`

## References

- **Architecture Decisions:** `docs/adr/` directory (check before planning)
- **User Journeys:** `docs/USER_JOURNEYS.md` (user workflow requirements)
- TRACS User Guide: USFS Trail Assessment methodology
- USFS Geodata Clearinghouse: https://data.fs.usda.gov/geodata/
- Google ADK Documentation: https://google.github.io/adk-docs/
- PostGIS Documentation: https://postgis.net/

---

*Last Updated: January 2026*
*Maintainer: AI Factory Team*
