# ADR-005: Report Ingestion Strategy — Crowdsourcing from Public Sources

**Status:** Accepted  
**Date:** 2026-01-18  
**Decision Makers:** Jason, Anti-Gravity  
**Context:** Clarifying how TrailWatch acquires citizen trail condition reports

---

## Context

During Phase 1 frontend development, documentation referenced a "TrailWatch mobile app" as the source of citizen reports. This contradicts the core project vision of being a **force multiplier** for USFS—leveraging existing trail community data rather than building and maintaining consumer-facing applications.

Building a native mobile app would require:
- iOS and Android development (out of scope)
- App store maintenance and updates
- Competing with established apps (AllTrails, Gaia GPS, FarOut)
- Convincing hikers to download yet another trail app

This is neither practical nor aligned with the project mission.

---

## Decision

**TrailWatch will NOT build a native mobile app.**

Report ingestion will use three tiers of data sources:

### Tier 1: Automated Ingestion from Public Sources

| Source | Data Type | Integration Method |
|--------|-----------|-------------------|
| AllTrails | Reviews mentioning hazards | Web scraping + NLP |
| Reddit | r/PacificCrestTrail, r/AppalachianTrail, r/CDT | Reddit API + text extraction |
| Strava Metro | Activity drop-off patterns suggesting closures | Strava Metro API (aggregate data) |
| FarOut / Guthook | Thru-hiker condition comments | API or scraping (TBD) |

### Tier 2: Partner API Integrations

| Partner | Submission Method |
|---------|-------------------|
| PCTA (Pacific Crest Trail Association) | Direct API (they maintain condition database) |
| ATC (Appalachian Trail Conservancy) | Direct API |
| CDTC (Continental Divide Trail Coalition) | Direct API |
| Regional trail orgs (WTA, GMC, etc.) | Bulk upload or API |

### Tier 3: Direct Submission (No App Required)

| Channel | Description |
|---------|-------------|
| PWA (Progressive Web App) | Browser-based form, works on any device, no install |
| Email intake | Forward reports to intake@trailwatch.org |
| SMS gateway | Text reports to dedicated phone number |

---

## Architecture Implications

```
┌─────────────────────────────────────────────────────────────┐
│                    INGESTION LAYER                          │
├─────────────────┬─────────────────┬─────────────────────────┤
│  Public Source  │  Partner API    │  Direct Submission      │
│  Crawlers       │  Integrations   │  (PWA/Email/SMS)        │
│                 │                 │                         │
│  - AllTrails    │  - PCTA API     │  - Web form (PWA)       │
│  - Reddit API   │  - ATC API      │  - Email parser         │
│  - Strava Metro │  - CDTC API     │  - Twilio SMS gateway   │
└────────┬────────┴────────┬────────┴────────┬────────────────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           ▼
                 ┌─────────────────────┐
                 │    INTAKE AGENT     │
                 │  (Already built)    │
                 │                     │
                 │  - Text extraction  │
                 │  - TRACS mapping    │
                 │  - Confidence score │
                 └──────────┬──────────┘
                            ▼
                 ┌─────────────────────┐
                 │  RANGER DASHBOARD   │
                 │  (Building now)     │
                 └─────────────────────┘
```

---

## Consequences

### Positive
- No mobile app development or maintenance burden
- Leverages existing hiker behavior (they already post on AllTrails, Reddit)
- Scales automatically as community activity grows
- Partner orgs get value without changing their workflows

### Negative
- Depends on third-party platform stability (API changes, rate limits)
- Requires NLP for unstructured text extraction (Intake Agent handles this)
- Legal review needed for web scraping (terms of service compliance)
- Partner negotiations required for API access

### Risks
- AllTrails may block scraping; need partnership or alternative source
- Reddit API pricing changes (post-2023 API controversy)
- Data quality varies by source (anonymous Reddit vs. PCTA volunteer)

---

## Implementation Roadmap

| Track | Scope | Dependency |
|-------|-------|------------|
| **Ingestion Service** | Crawlers, API integrations, message queue | After Dashboard MVP |
| **PWA Submission Form** | Simple web form for direct reports | After Dashboard MVP |
| **Email/SMS Gateway** | Twilio integration, email parser | After PWA |

---

## Documentation Updates Required

- [x] Remove "Mobile: React Native or PWA" from GEMINI.md tech stack
- [x] Update GEMINI.md data flow diagram
- [x] Update conductor/product.md (tech stack, data flow, user description)
- [x] Update conductor/tech-stack.md
- [x] Update docs/USER_JOURNEYS.md (persona, journey)

---

## References

- Project Charter: "Close the gap between trail conditions on the ground and USFS staff awareness"
- GEMINI.md: Intake Agent designed for "unstructured citizen reports"
- **Prior Research:** `docs/pre-flight-context/archive/legacy_research/Sources-Matrix.md` (comprehensive source analysis, Jan 2026)
- AllTrails API documentation: (partnership required; see Sources-Matrix §4.1–4.3)
- Reddit API documentation: https://www.reddit.com/dev/api/
