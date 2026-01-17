# Strategic Planning Recommendations

**To:** Jason (Project Lead)  
**From:** Anti-Gravity (AI Assistant)  
**Date:** January 16, 2026  

After reviewing the UI Strategy and Project Charter, I recommend three critical "Deep Dives" before we begin coding. Detailed planning here will prevent costly refactors later.

## 1. AI Trust & Evaluation Strategy ("The Brain")
**Why:** The best UI fails if the AI allows garbage data or misses a safety hazard. We need to prove reliability to USFS.
**Key Questions:**
*   How do we *measure* the Intake Agent's accuracy? (We need a quantitative metric, e.g., "92% TRACS match").
*   What is our "Golden Dataset" for testing? (We need 50-100 perfect examples).
*   How do we handle "Hallucinations"? (e.g., Identifying a bear as a fallen tree).
**Recommendation:** Create an **AI Evaluation Framework** doc detailing the testing pipeline.

## 2. Geospatial & Offline Architecture ("The Backbone")
**Why:** "Wow" factor is destroyed if the app crashes when a hiker loses signal. Mobile offline sync is notoriously difficult.
**Key Questions:**
*   **Offline-First:** How does the Citizen App store photos/data without signal? (Sync strategy).
*   **Snap-to-Trail:** How do we validate GPS points? (We need a robust PostGIS strategy).
*   **Visualization:** Do we use 3D Photorealistic Tiles (Google Maps) for the Ranger Dashboard? (Huge "Wow" potential).
**Recommendation:** Create a **Geospatial & Offline Architecture** brief.

## 3. Data Governance & Schema ("The Foundation")
**Why:** AI models need structured data. If our database schema is messy, the AI will struggle.
**Key Questions:**
*   **TRACS Taxonomy:** How exactly do we map vague citizen reports to strict federal codes?
*   **PII & Security:** How do we hash emails/names while keeping the system usable for Coordinators?
*   **BigQuery vs. Cloud SQL:** Efficient separation of "Hot" (Operational) and "Cold" (Analytical) data.
**Recommendation:** Design the **Core Data Schema (ERD)** and **TRACS Mapping Logic**.

---

## Proposed Next Steps
I have scaffolded a `task.md` with these three research areas. I suggest we tackle them one by one, starting with **AI Trust & Evaluation**, as that informs the data we need to collect.
