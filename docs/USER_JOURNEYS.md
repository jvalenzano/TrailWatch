# TrailWatch User Journeys & Stories

**Purpose:** Living document to capture user personas, journeys, and stories. Use this for UI design, usability testing, and matching frontend functionality to backend capabilities.

---

## Personas

### 1. Citizen Hiker (Sarah)
- **Role:** Weekend hiker, occasional backpacker
- **Tech comfort:** Mobile-first, expects app to "just work"
- **Primary need:** Quick, low-friction way to report trail hazards
- **Constraints:** Often has limited cell service; wants offline capability

### 2. Volunteer Coordinator (Mike)
- **Role:** Manages adopt-a-trail crews for PCTA
- **Tech comfort:** Comfortable with web dashboards
- **Primary need:** See all reports on "his" trail sections, dispatch crews efficiently
- **Constraints:** Needs batch actions (mark 10 reports as "resolved"), wants Excel exports for crew planning

### 3. USFS Ranger (Elena)
- **Role:** District ranger overseeing 300+ trail miles
- **Tech comfort:** Uses multiple USFS systems (INFRA, FACTS, TRACS)
- **Primary need:** Prioritized list of hazards requiring official action (closures, maintenance)
- **Constraints:** Limited time, needs AI to filter noise, wants TRACS-compliant data for official records

---

## User Journeys

### Journey 1: Citizen Reports a Fallen Tree
**Persona:** Sarah (Citizen Hiker)

**Scenario:** Sarah is 5 miles into a day hike on the Pacific Crest Trail when she encounters a large tree blocking the trail.

**Steps:**
1. Sarah opens the TrailWatch mobile app
2. Taps "Report Hazard"
3. App auto-captures her GPS location (37.123456, -120.654321)
4. She selects hazard type: "Clearing" (from simple icon-based menu)
5. Adds a photo of the tree
6. Types brief description: "Big tree down, can't get around it"
7. Taps "Submit"
8. App shows: "Report received! ID: abc-123. Rangers will be notified."

**Backend touchpoint:** `POST /api/v1/reports` (Phase 1 - COMPLETE)

**UI Requirements:**
- One-tap GPS capture
- Visual hazard type picker (icons, not text)
- Camera integration
- Works offline (queues report for later sync)

---

### Journey 2: Coordinator Reviews Reports on Adopted Trail
**Persona:** Mike (Volunteer Coordinator)

**Scenario:** Mike manages a 20-mile section of the John Muir Trail. Monday morning, he checks for new reports.

**Steps:**
1. Mike logs into TrailWatch web dashboard
2. Sees map of "his" 20-mile section
3. Map shows 3 new report pins (color-coded by severity)
4. Clicks pin → sees report details (photo, description, TRACS category)
5. Marks 2 reports as "Assigned to crew - July 15 work party"
6. Flags 1 report as "Needs ranger review" (potential closure)
7. Downloads Excel export of all reports for monthly email to volunteers

**Backend touchpoint:** Dashboard API (Phase 2 - IN PROGRESS)

**UI Requirements:**
- Map-centric interface
- Filter by trail section, date range, status
- Batch actions (select multiple, bulk assign)
- Export to Excel/CSV

---

### Journey 3: Ranger Reviews AI-Triaged Closure Recommendation
**Persona:** Elena (USFS Ranger)

**Scenario:** Elena receives an email alert: "High-priority hazard detected on Yosemite Falls Trail."

**Steps:**
1. Elena clicks link → opens TrailWatch in browser
2. Sees report: "Bridge washed out at Mile 3.2"
3. AI triage shows:
   - TRACS category: STR (Structures)
   - Severity: SEV3 (Closure Recommended)
   - Confidence: 0.91
   - Reasoning: "Photo shows complete structural failure; 3 corroborating reports in 24 hours"
4. Reviews auto-generated closure notice draft
5. Edits notice (adds alternate route info)
6. Clicks "Approve & Publish" → closure posted to Recreation.gov and social media

**Backend touchpoint:**
- Hazard Classifier (Phase 3 - FUTURE)
- Closure Notice Generator (Phase 4 - FUTURE)

**UI Requirements:**
- Dashboard filtered to "SEV3 only"
- Inline editing of draft notices
- One-click publish workflow
- Audit trail (who approved, when)

---

## User Stories (For Sprint Planning)

### Citizen Hiker Stories
- ✅ **As Sarah, I want to submit a hazard report with a photo and GPS location, so rangers know exactly where the problem is.** (Phase 1 - DONE)
- [ ] **As Sarah, I want to report hazards even when I have no cell service, so my data isn't lost.** (Phase 2 - Offline Sync)
- [ ] **As Sarah, I want to see if someone else already reported this hazard, so I don't duplicate reports.** (Phase 2 - Duplicate Detection)

### Volunteer Coordinator Stories
- [ ] **As Mike, I want to see all reports on my adopted trail section on a map, so I can plan work parties efficiently.** (Phase 2 - Dashboard)
- [ ] **As Mike, I want to mark reports as "assigned to crew," so I don't waste time on already-handled issues.** (Phase 2 - Status Updates)
- [ ] **As Mike, I want to export reports to Excel, so I can share them with my volunteer email list.** (Phase 2 - Export)

### USFS Ranger Stories
- [ ] **As Elena, I want to see only high-severity reports (SEV3), so I focus on closure-level hazards.** (Phase 3 - Triage)
- [ ] **As Elena, I want AI to draft closure notices for me, so I save 30 minutes per closure.** (Phase 4 - Notice Generator)
- [ ] **As Elena, I want reports mapped to TRACS categories, so I can import them into official USFS systems.** (Phase 1 - DONE, Phase 3 - Enhanced)

---

## Test Cases (For Future QA)

### Functional Test Cases
1. **Happy Path:** Submit report with all fields populated → Verify 201 response with `report_id`
2. **Offline Mode:** Submit report with no network → Verify queued for sync → Verify sync on reconnect
3. **Duplicate Detection:** Submit same GPS + hazard type within 24 hours → Verify "Similar report exists" warning
4. **Photo Upload:** Submit report with 10MB photo → Verify accepted; 11MB photo → Verify rejected with clear error

### Edge Cases
1. **GPS Out of Bounds:** Submit report with GPS in Antarctica → Verify graceful error ("Location outside supported regions")
2. **Missing Required Fields:** Submit report without hazard type → Verify 400 Bad Request with specific field error
3. **Malformed JSON:** Send corrupted payload → Verify 422 Unprocessable Entity

### Performance Test Cases
1. **Load Test:** 100 concurrent report submissions → Verify all succeed within 5 seconds
2. **Database Stress:** 10,000 existing reports → Query dashboard → Verify sub-2-second load time

---

**Last Updated:** January 17, 2026  
**Maintainer:** Jason Valenzano (add new journeys/stories as features develop)
