# TrailWatch Project Charter

**Document Type:** Project Charter  
**Version:** 1.0  
**Date:** January 15, 2026  
**Sponsor:** Shadat Mahmud, Principal Architect and Managing Partner  
**Project Lead:** Jason Valenzano, AI Technical Lead  
**Status:** Draft for Approval

---

## Executive Summary

TrailWatch is a citizen crowdsourcing platform for US Forest Service trail condition reporting with AI-powered triage. It transforms unstructured hiker observations into TRACS-compliant actionable intelligence for USFS rangers and volunteer coordinators.

**Why Now:** The USFS is in crisis. Maintained trail miles dropped 22% as of December 2025, with some districts losing 100% of trail staff. No official citizen reporting system exists, creating both operational pain and first-mover opportunity for TechTrend.

**Core Value:** Cut through the noise of citizen input. AI triage converts 100 vague trail reports into 3 actionable maintenance tasks, giving understaffed rangers leverage to prioritize effectively.

---

## Problem Statement

USFS trail managers face three compounding challenges:

1. **Staffing collapse:** Districts lost trail crews but trail miles remained constant. One ranger may manage 400 miles across multiple districts with no dedicated trail staff.

2. **Information gap:** Rangers receive trail condition reports through fragmented channels (random emails, phone calls, third-party apps) with no validation, prioritization, or standard format.

3. **Volunteer coordination burden:** Adopt-a-Trail programs exist but lack tools. Coordinators manage volunteers manually with spreadsheets and email chains, creating duplicate work and missed opportunities.

The result: trails deteriorate, closures happen reactively instead of proactively, and hikers encounter outdated information about conditions.

---

## Solution Overview

TrailWatch provides:

**For Volunteer Coordinators:** A dashboard showing real-time citizen reports on adopted trail sections, with clustering (10 similar reports become 1 task), photo evidence, and "mark resolved" workflow.

**For USFS Rangers:** AI-triaged reports mapped to TRACS categories with severity scoring, priority ranking by trail popularity and hazard type, and draft closure notice generation for high-severity issues.

**For Citizen Hikers:** A simple mobile interface for reporting (photo + GPS + 3-tap hazard selection in under 30 seconds) and real-time alerts when trails they follow are closed or conditions change.

**Differentiator:** The AI triage layer translates citizen language ("big tree blocking the path") into TRACS-compliant terminology (Category: Clearing, Severity: Maintenance Needed, Confidence: 0.87) and correlates reports with weather events, historical closures, and trail popularity data.

---

## Scope

### In Scope

- Mobile and web interfaces for citizen report submission
- AI-powered intake agent that extracts structured data and maps to TRACS categories
- Coordinator dashboard for managing reports on adopted trail sections
- Ranger dashboard for reviewing triaged reports with priority recommendations
- Closure notice generator (draft for ranger approval, not auto-publish)
- Integration with RIDB API for trail validation and EDW Clearinghouse for trail geometry
- Weather and fire context from USGS/NOAA for report correlation

### Out of Scope (This Phase)

- Direct integration with USFS internal systems (INFRA Trails, FACTS)
- Auto-publishing closures without human approval
- Public-facing API for third-party consumption
- AllTrails or Gaia GPS partnership integration
- Predictive maintenance ML models
- National deployment (pilot is regional)

### Future Scope (Post-Pilot)

- Write integration with USFS systems via data-sharing MOU
- Consumer app partnerships for alert distribution
- Historical trend analysis and predictive prioritization
- Expansion from pilot forest(s) to regional and national coverage

---

## Success Criteria

### Pilot Phase (3 Months, 1 Forest)

| Metric | Target | Rationale |
|--------|--------|-----------|
| Citizen reports processed | 100+ | Validates intake flow and AI triage |
| TRACS mapping accuracy | 80%+ | AI must correctly categorize hazards |
| Volunteer coordinators active | 5-10 | Primary users must adopt the tool |
| Ranger dashboard usage | Weekly | Rangers must find value in triaged output |
| Time-to-action improvement | 50% reduction | Compared to current email/phone process |
| Actionable report rate | 70%+ | Reports should result in tasks, not noise |

### Validation Milestone

Pilot succeeds if a USFS ranger confirms: "TrailWatch saves me time and helps me prioritize my limited maintenance resources."

---

## Team Structure

### Core Team

| Role | Person | Responsibility |
|------|--------|----------------|
| Project Lead | Jason Valenzano | Architecture, AI triage, team coordination |
| Sr. Database Engineer | Vlad Myakota | PostGIS, BigQuery, data pipeline |
| Sr. Software Engineer | Fazal Qureshi | Backend services, API development |
| Sr. Software Engineer (UX/UI) | Dennis Bolanos | Frontend, UX/UI design, integration |
| Junior Developer | Tanim Khan | Testing, documentation, support |
| [Incoming] GCP AI Engineer | TBD | Vertex AI, agent optimization |

### Training Model

The team will build Project 1 (Intake Agent) together in a 5-day training sprint using a "best of three" pattern: each engineer implements their own version, the team compares approaches, then converges on a canonical implementation. This establishes shared patterns for Projects 2-5.

### Stakeholders

| Role | Person | Interest |
|------|--------|----------|
| Executive Sponsor | Shadat Mahmud | AI practice growth, Google partnership |
| Sales Partner | Sharif Ahmed | AI Factory revenue, customer pipeline |
| Pilot Partner | TBD (PCTA or regional coordinator) | Volunteer workflow improvement |
| USFS Contact | TBD (target district ranger) | Operational tool validation |

---

## Technical Approach

### Platform

Google Cloud Platform exclusively, aligning with TechTrend's Google Cloud Partnership strategy. Core services: Vertex AI (model serving), Cloud Run (compute), BigQuery (analytics), Cloud SQL with PostGIS (operational data), Google Maps Platform (visualization).

### Framework

Google ADK (Agent Development Kit) for agentic workflow orchestration. This is a strategic decision: GCP-native framework enables FedRAMP path if needed, integrates cleanly with Vertex AI, and positions TechTrend as a GCP AI delivery partner.

### Methodology

Spec-driven development with DOE context engineering. Each project phase starts with a detailed specification that includes input/output schemas, test cases, and success criteria. Engineers implement against the spec; AI-assisted tools (Claude Code, Gemini CLI) accelerate development.

### Architecture

Five sequential projects building toward full capability:

1. **Intake Agent:** Citizen report → structured TRACS data with confidence scoring
2. **Status Dashboard:** Map visualization with report clustering and trail status
3. **Hazard Classifier:** Photo analysis to validate and enhance classification
4. **Closure Notice Generator:** High-severity hazard → draft public notice
5. **Prioritization Agent:** Multi-criteria ranking across all open reports

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| USFS staff too busy to engage | Medium-High | High | Position as low-friction (API pull, not data entry); find champion ranger |
| Citizen data quality too low | Medium | Medium | AI triage filters noise; trusted reporter network (PCTA) provides quality baseline |
| RIDB API limitations | Low | Medium | RIDB is stable and public; fallback to manual trail entry if needed |
| AllTrails or similar competitor | Low | Low | Different positioning (B2G vs B2C); TrailWatch is operational tool, not consumer app |
| Pilot forest partnership delays | Medium | High | Pursue multiple targets; PCTA can provide initial user base independent of USFS |
| Team bandwidth constraints | Medium | Medium | Prioritize ruthlessly; defer nice-to-haves to post-pilot |

---

## Budget and Resources

### Team Time (Estimated)

| Phase | Duration | Team Allocation |
|-------|----------|-----------------|
| Training Sprint | 1 week | Full team (5 days intensive) |
| Project 1 (Intake Agent) | 2 weeks | Full team |
| Project 2 (Dashboard) | 2 weeks | Full team |
| Pilot Integration | 2 weeks | 2-3 engineers |
| Pilot Operation | 6-8 weeks | 1-2 engineers (support mode) |

### Infrastructure (GCP)

Estimated monthly GCP spend during pilot: $500-1,500 (Cloud Run, BigQuery, Vertex AI inference). Production scaling would require separate cost analysis.

### External Dependencies

- RIDB API access (free, public)
- EDW Clearinghouse data (free, quarterly download)
- Pilot partner organization (PCTA or equivalent)
- USFS district contact (target: Tahoe NF or similar)

---

## Timeline

### Phase 0: Foundation (Current)
- [x] Research complete
- [x] Technical architecture defined (GEMINI.md)
- [ ] Project Charter approved
- [ ] PRD finalized
- [ ] Project 1 Spec complete

### Phase 1: Training and Build (Weeks 1-5)
- Week 1: Team training sprint (build Project 1 together)
- Weeks 2-3: Project 1 production hardening + Project 2 start
- Weeks 4-5: Project 2 completion + pilot partner onboarding

### Phase 2: Pilot (Weeks 6-14)
- Deploy with 1 forest district + 1 volunteer organization
- Collect 100+ citizen reports
- Iterate based on ranger and coordinator feedback
- Measure success metrics

### Phase 3: Validation (Weeks 15-18)
- Compile pilot results
- Document lessons learned
- Prepare expansion proposal (3-5 forests)
- Formalize partnership agreements

---

## Approval

By approving this charter, stakeholders authorize the TrailWatch project to proceed through Phase 1 (Training and Build) with the defined team, scope, and approach.

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Executive Sponsor | Shadat Mahmud | __________ | __________ |
| Project Lead | Jason Valenzano | __________ | __________ |

---

## References

- Research Findings: `/Research/Research-Findings.md`
- Executive Summary: `/Research/Executive-Summary.md`
- Product Insights: `/Research/Product-Insights.md`
- Technical Specification: `/GEMINI.md`
- Sources Matrix: `/Research/Sources-Matrix.md`

---

*Document maintained by AI Factory Team*
