# TrailWatch: Product & Design Insights

**For:** Design, Product, and Engineering review  
**Context:** Research completed on USFS trail management landscape

---

## PRODUCT POSITIONING

### NOT This
❌ "Like AllTrails but official"  
❌ "Crowdsourced trail database replacement"  
❌ "Hiker social network"  
❌ "Real-time crowdsourced trail condition API"  

### BUT This
✅ **"The operational tool that helps USFS and volunteers close the trail maintenance gap."**

- Target user: **Volunteer coordinators + USFS rangers**, not primarily hikers
- Primary value: **Automated triage of citizen input** → actionable intelligence for staff
- Secondary value: **Real-time hiker alerts** for high-urgency issues (closures, safety)
- Data philosophy: Citizen reports **inform**, not replace official decisions

---

## USER PERSONAS & WORKFLOWS

### Primary User 1: Volunteer Coordinator (e.g., PCTA regional leader)

**Pain Points:**
- "How do I know which section of trail my volunteers should prioritize?"
- "I get random reports from hikers but can't validate them"
- "I have 5 groups adopting different trail miles; unclear where conflicts/duplicates are"
- "After we do maintenance, how do I report that to the Forest Service?"

**How TrailWatch Helps:**
- Dashboard showing real-time citizen reports on "their" adopted trails
- Heatmap of report density = maintenance priority
- "Mark as resolved" when volunteer crew completes work
- Export report summary to ranger for official closure/alert decision

**Key Feature Needs:**
- Trail section filtering (can adopt = can manage reports)
- Report clustering (10 reports of fallen trees → 1 action item)
- Photo upload + comment thread (crew coordination)
- PCTA/volunteer org integration (single sign-on)

---

### Primary User 2: USFS District Ranger / Trail Manager

**Pain Points:**
- "I'm one person managing 400 miles of trail across 3 districts"
- "Ranger stations get random calls/emails about trail problems"
- "I can't distinguish between 'log across trail' and 'major bridge washout'"
- "I need data for my annual budget request but have no system"

**How TrailWatch Helps:**
- Automated intake of citizen reports (no more random emails/calls)
- AI triage assigns severity + TRACS category
- Prioritization by: trail popularity (via Strava), visitor impact, hazard type
- Dashboard: "Top 10 maintenance needs this month"
- Data export for grants/budget justification

**Key Feature Needs:**
- Severity scoring (AI triage output)
- Trend detection ("Bridge X has 4 reports in 2 weeks" → deteriorating)
- Historical closure data (why did this trail close? when will it reopen?)
- Integration with Volunteer.gov and partner orgs (coordinators visible on map)
- Closure notice generation (template: hazard + evidence → official closure order)

---

### Secondary User: Individual Hiker (Web/Mobile App)

**Pain Points:**
- "Is this trail currently passable?"
- "I planned a hike last week but conditions changed"
- "Which trails are closed and why?"
- "I want to report a hazard but don't know who to contact"

**How TrailWatch Helps:**
- Real-time trail status (open/closed/caution)
- Recent condition reports + photos (last 7 days)
- Closure announcements with reasons + estimated reopening
- One-tap reporting with photo (geolocation auto-filled)

**Key Feature Needs:**
- Minimal friction to report (photo + 3-click hazard type)
- Alert notifications (trail you saved is now open/closed)
- Offline map + report capability
- Integration with popular mapping apps (AllTrails, Gaia, Google Maps?)

---

## TECHNICAL REQUIREMENTS

### Data Intake Architecture

**Citizen Report Payload (Minimal)**
```json
{
  "trail_name_or_id": "String or RIDB ID",
  "trail_location": {
    "lat": 37.123,
    "lon": -120.456,
    "accuracy_meters": 50
  },
  "hazard_type": "enum: fallen_tree, drainage_issue, erosion, rockfall, bridge_damage, overgrowth, water_crossing, other",
  "severity": "enum: passable_with_care, impassable, safety_hazard",
  "description": "Free-form user text (parsed by AI)",
  "photos": ["photo_urls[]"],
  "timestamp": "ISO8601",
  "user_id": "optional, links to volunteer/coordinator account",
  "contact_preference": "email | phone | none"
}
```

**AI Triage Output**
```json
{
  "original_report_id": "UUID",
  "mapped_tracs_category": "Drainage, Clearing, Structure, Signing, etc.",
  "confidence_score": 0.87,
  "severity_flag": "closure_recommended | maintenance_needed | info_only | false_positive",
  "estimated_impact": {
    "hikers_affected_annually": 12000,
    "trail_popularity_percentile": 0.78
  },
  "similar_reports": ["UUID1", "UUID2"],
  "weather_context": {
    "recent_weather": "heavy_rain_last_48h",
    "current_fire_activity": false
  },
  "recommended_action": "Schedule drainage repair within 30 days"
}
```

### Integration Points (Priority Order)

**TIER 1 (MVP): PUBLIC DATA (No Auth Needed)**
- RIDB API: Fetch trail registry for validation/matching
- EDW Clearinghouse: Load trail geometry + metadata quarterly
- USGS/NOAA: Fetch recent weather, fire data (daily)
- Strava API (if accessible): Get visitor density by trail segment

**TIER 2 (Pilot): USFS Read-Only (API Key Auth)**
- FACTS data: Pull trail maintenance activities
- INFRA Trails (if available): Pull current official trail status

**TIER 3 (Future): USFS Write Integration (OAuth + Data Sharing Agreement)**
- Submit triage output to USFS dashboard
- Two-way closure notice sync
- Volunteer activity tracking

---

## DATA QUALITY & VALIDATION FRAMEWORK

### Validation Rules (AI Triage)

| Rule | Purpose | Action |
|------|---------|--------|
| **Trail snapping** | Report location 10km away from actual trail | Flag: "Could not match to known trail" |
| **Temporal clustering** | 20 reports of "muddy" within 2 hours of rain | Cluster + auto-link to weather event |
| **Duplicate detection** | 3 reports same hazard within 100m, 24h | Merge, increase confidence |
| **Outlier detection** | Absurd hazard descriptions | Flag as low confidence |
| **Recency weighting** | Reports >30 days old in volatile season | Reduce confidence |
| **Reporter credibility** | Same user reports 50 things in 1 day | Flag: possible bot/spam |
| **Photo analysis** | CV checks if photo matches hazard type | Confidence adjustment |

### Confidence Scoring Factors

**HIGH CONFIDENCE (>0.8):**
- Photo + specific hazard type + matching weather context
- Multiple corroborating reports from different users
- Volunteer/PCTA reporter (trusted source)
- Matches historical pattern

**MEDIUM CONFIDENCE (0.5–0.8):**
- Text-only report but clear hazard description
- Geolocation accurate but time unclear
- Single report but plausible

**LOW CONFIDENCE (<0.5):**
- Vague description, no photo
- Location far from trail or on private land
- Unknown/new user, first report ever
- Contradicts recent official status

### Human Review Workflow

```
Citizen Report
    ↓
AI Triage: Confidence score + severity flag
    ↓
IF confidence > 0.8:
  → Queue to ranger dashboard (auto-priority)
ELSE IF confidence 0.5–0.8:
  → Queue to volunteer coordinator (manual review)
ELSE:
  → Low-priority queue (maybe ask for clarification)
    ↓
Coordinator/ranger review → action or dismiss
    ↓
Resolution feedback loop (closes report, improves AI)
```

---

## ALERT STRATEGY

### Who Gets Alerts & When

**HIKER ALERTS** (Mobile App Push)
- **Closure notice:** "Trail X closed effective today; reopen estimated [date]"
- **Safety warning:** "Trail Y has recent reports of [rockfall/bridge damage]"
- **Condition update:** "Trail Z now passable; rain has subsided"
- Frequency: Max 2–3 per trail per week

**COORDINATOR ALERTS** (Dashboard + Email)
- **High-priority:** "5 reports in 48h on your adopted trail section"
- **Conflict alert:** "Your section overlaps Coordinator B's section; coordinate?"
- **Opportunity:** "Trail usage is up 20%; recommend extra maintenance visits"

**RANGER ALERTS** (Dashboard)
- **Closure recommendation:** "Trail X, [hazard], affects 15K visitor-days/year"
- **Maintenance task:** "[Hazard type], confidence [score], 3 corroborating reports"
- **Trend:** "Rockfall reports on trail Y up 3x this month"

---

## PRODUCT ROADMAP DRAFT

### V1.0 (MVP): Citizen Input + Volunteer Dashboard
- [ ] Mobile app: photo + report + GPS
- [ ] Web form: trail selection + hazard type + description
- [ ] Basic AI triage (map to TRACS, confidence score)
- [ ] Volunteer dashboard: reports on adopted trails
- [ ] Manual review workflow
- **Target: 2–3 months, 1 forest pilot**

### V2.0: Official Integration + Ranger Dashboard
- [ ] RIDB integration (trail registry, matching)
- [ ] EDW integration (read trail data + closure status)
- [ ] Ranger dashboard with triage output + prioritization
- [ ] Closure notice generator (template system)
- [ ] Hiker alerts (mobile push + web)
- **Target: 3–4 months, 3–5 forests**

### V3.0: Full Ecosystem Integration
- [ ] AllTrails / Gaia GPS partnership (data sharing)
- [ ] Strava integration (visitor density weighting)
- [ ] USGS/NOAA (weather + fire context)
- [ ] NPS app interoperability (closure data sync)
- [ ] Historical analysis + trend detection
- **Target: 4–6 months, 10+ forests**

### V4.0: Automation & Scale
- [ ] INFRA Trails direct integration
- [ ] Volunteer activity tracking (completion reporting)
- [ ] Predictive maintenance (ML: which trails will need work next month?)
- [ ] National dashboard (all USFS forests)
- **Target: 6–12 months, nationwide**

---

## DESIGN & UX PRINCIPLES

### For Volunteer Coordinators
- **Low friction:** Report intake should not require detailed training
- **Clarity:** Hikers have low expertise; AI triage translates to standard terminology
- **Empowerment:** Volunteers should feel they're being heard & acted upon
- **Community:** Show other volunteers working nearby (collaboration opportunity)

### For Rangers
- **Actionable:** Every report should have a clear "recommended action"
- **Context:** Why is this urgent? (visitor impact, safety hazard, trend?)
- **Integrable:** Dashboard output should feed into existing systems
- **Trust:** Confidence scores help ranger decide what to act on

### For Hikers
- **Simplicity:** Report in 30 seconds (photo + tap buttons)
- **Transparency:** Why is trail closed? When reopens?
- **Reliability:** Alerts are *rare* (high signal-to-noise) and *trustworthy*
- **Accessibility:** Works offline; doesn't require cell service

---

## KEY DESIGN DECISIONS

### 1. Should TrailWatch Recommend Closures or Just Report?

**Option A:** Just flag closure-worthy hazards; ranger makes decision  
→ Safer legally, maintains agency authority, lower organizational risk

**Option B:** Auto-generate draft closure notice; ranger approves/posts  
→ Faster response, reduces ranger workload, higher value-add

**Recommendation:** Start with Option A (V1–V2), graduate to Option B (V3+).

### 2. Should Citizen Data Be Visible to Public or USFS-Only?

**Option A:** Hiker reports visible to all users  
→ Builds community, more engagement, data quality improves

**Option B:** Hiker reports go to USFS/coordinators only; hiker only sees official alerts  
→ Lower liability, USFS controls narrative, less spam

**Recommendation:** Hybrid: Reports visible to **logged-in volunteers + rangers**, not anonymous public.

### 3. How to Handle Contradictory Reports?

**Strategy:**
- AI looks for temporal order (which is more recent?)
- Checks weather context (did conditions change?)
- Favors reports with photos + GPS accuracy
- Flags for manual review if uncertain

---

## PARTNERSHIP STRATEGY

### Tier 1: Essential Partners (Approach First)

**Pacific Crest Trail Association (PCTA)**
- Reason: Established volunteer network, existing trail maintenance model
- Value to PCTA: Better coordination tool for their volunteers
- Ask: Beta test TrailWatch with 3–5 regional groups
- Timeline: Q1 2026

**Sierra Buttes Trail Stewardship (or equivalent regional adopt-a-trail org)**
- Reason: Operates under Volunteer Agreements with USFS; credible, trusted
- Value: Reduces coordinator manual work
- Ask: Pilot with 1 forest district
- Timeline: Q1 2026

### Tier 2: Distribution Partners (Approach After MVP)

**AllTrails**
- Reason: 90M users, USFS already works with
- Value to AllTrails: Official data partner, differentiator
- Ask: Real-time alerts API
- Timeline: Q2–Q3 2026

**American Hiking Society**
- Reason: Advocacy org; credible intermediary
- Value: Promotes responsible recreation
- Ask: Endorsement + volunteer channel
- Timeline: Q2 2026

### Tier 3: Government Relations

**USFS Regional Offices (6 regions)**
- Approach with pilot success data
- Pitch as "innovation pilot"
- Pathway: Pilot → Regional → National

---

## SUCCESS METRICS

### Pilot Phase (1 Forest, 3 Months)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Reports submitted | 50–100 | App/web form analytics |
| Volunteer engagement | 5–10 coordinators | Signup + dashboard logins |
| Data quality | 70%+ actionable | Ranger feedback survey |
| Time-to-action | 50% reduction vs. baseline | Compare old vs. new process |
| Hiker satisfaction | 4.0+/5.0 | App reviews, survey |
| Repeat reporters | 20%+ of users | Analytics |

### Scaling Phase (5–10 Forests, 6 Months)

| Metric | Target |
|--------|--------|
| Active reports/month | 500–1000 |
| Volunteer coordinators | 50–100 |
| USFS rangers using platform | 25–50 |
| Closure notices generated via TrailWatch | 10–20/month |
| Hikers reached (alert notifications) | 50K+ |
| Cost per action item resolved | $50–100 |

---

## CONCLUSION

**TrailWatch is a B2G product** (business-to-government), not B2C.
- Primary users: Volunteer coordinators + USFS rangers
- Secondary users: Hikers (benefit from alerts, contribute reports)
- Business model: Government partnership (grant or SaaS contract)

**Core value proposition:**
"Cut through the noise of citizen input. AI triage turns 100 vague reports into 3 actionable tasks."

**Design principle:** Make it easy for volunteers + rangers, effortless for hikers.

---

**Next Steps:**
1. Validate user personas with interviews (PCTA, USFS, coordinators)
2. Build clickable prototype (volunteer dashboard + mobile report flow)
3. Pitch to 1–2 pilot forests for 3-month test
4. Iterate based on real-world feedback