# TrailWatch: Context Briefing for UI/UX Research

## What We're Building

TrailWatch is a citizen crowdsourcing platform that transforms unstructured trail condition reports into actionable intelligence for US Forest Service (USFS) personnel. Think "311 for trails" but with AI-powered triage that maps citizen observations to official USFS maintenance taxonomies.

The core value proposition: Rangers currently waste hours manually processing citizen emails, phone calls, and social media reports. TrailWatch automates intake, classification, and prioritization so rangers focus on decisions, not data entry.

## The AI Architecture (Backend, Already In Progress)

We're using Google Vertex AI with the Agent Development Kit (ADK) to build an "Intake Agent" that:

1. Accepts unstructured citizen input (text, photos, GPS coordinates)
2. Extracts structured hazard data using Gemini models
3. Maps observations to TRACS codes (the official USFS trail maintenance taxonomy)
4. Validates GPS coordinates against known trail geometries
5. Assigns urgency scores and routes to appropriate personnel

The backend is GCP-only: Cloud Run, Cloud SQL with PostGIS, Vertex AI, BigQuery for analytics. No LangChain, no OpenAI.

## User Personas and Their Contexts

**Citizen Hikers (Report Submitters)**
- Mobile-first, often offline or low-connectivity in the field
- Non-technical, varying levels of trail knowledge
- Motivated by stewardship but won't tolerate friction
- May include photos, voice memos, imprecise descriptions ("the bridge by the big rock")

**Volunteer Coordinators**
- Manage trail sections, dispatch volunteer crews
- Need batch operations (assign 15 reports to Saturday's work party)
- Desktop-primary but may do quick triage on mobile
- Semi-technical, comfortable with dashboards but not GIS experts

**USFS Rangers (Decision Makers)**
- Triage AI-classified hazards, approve official notices
- Accountable for safety decisions (closure notices require human sign-off)
- Time-constrained, often managing multiple forests/districts
- Government employees with varying tech comfort levels
- Need audit trails for compliance

## Technical and Regulatory Constraints

| Constraint | Implication for UI |
|------------|-------------------|
| GCP-only | No third-party UI services that aren't FedRAMP-friendly |
| FedRAMP-aware | Audit logging, data residency, no exotic dependencies |
| Offline/low-connectivity | Mobile app must function without network for field submissions |
| Government users | Must work for non-technical staff; no assumption of AI literacy |
| Safety-critical decisions | Human-in-the-loop required for closures; clear accountability |
| Async team (global) | Documentation-heavy development process |

## What the Frontend Needs to Do

The dashboard serves coordinators and rangers (citizens use a separate mobile submission flow). Core capabilities:

- **Map View**: Visualize reports geospatially, cluster by trail/region, show hazard types
- **Triage Queue**: AI-prioritized list of reports needing human review
- **Batch Operations**: Select multiple reports, assign to crews, update status
- **Report Detail**: View citizen submission, AI extraction, confidence scores, edit/approve
- **Analytics**: Trends, response times, hazard patterns by season/region
- **Audit Trail**: Who approved what, when, with what AI assistance

## Why We're Researching Agentic UI

The original spec was a traditional dashboard (filters, dropdowns, CRUD forms). But this is a flagship demo for federal AI adoption. We want to explore whether agentic UI patterns could:

1. Reduce cognitive load for rangers doing high-volume triage
2. Surface proactive insights ("17 drainage reports this week, possible systemic issue")
3. Make AI assistance visible and trustworthy (not a black box)
4. Handle the natural language nature of citizen input more elegantly
5. Differentiate from legacy government systems

We're NOT trying to replace the dashboard with a chatbot. We're exploring hybrid patterns where conversational AI augments structured interfaces.

## Key Questions We're Trying to Answer

- What does "agentic UX" look like beyond chat interfaces?
- How do you build trust with government users who are skeptical of AI?
- What frontend libraries exist for streaming AI responses, tool visualization, confidence indicators?
- Are there precedents in government/GIS/public safety contexts?
- What anti-patterns should we avoid?

## Glossary

- **TRACS**: Trail Assessment and Condition Survey, the USFS standard for trail inventory and maintenance
- **ADK**: Google's Agent Development Kit for building AI agents on Vertex AI
- **PostGIS**: Geospatial extension for PostgreSQL, used for trail geometry validation
- **FedRAMP**: Federal Risk and Authorization Management Program (security compliance framework)

---

*This document prepared January 2026 for external research handoff.*
