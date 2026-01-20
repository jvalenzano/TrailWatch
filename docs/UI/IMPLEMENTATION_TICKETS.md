# Implementation Tickets

**Purpose:** Ready-to-create tickets for project management tools (Jira, Linear, GitHub Issues)
**Source:** [WIREFRAME_CONFORMANCE_AUDIT.md](WIREFRAME_CONFORMANCE_AUDIT.md)
**Created:** 2026-01-19

---

## Ticket Format

Each ticket below includes:
- **Title** — Copy-paste ready
- **Type** — Bug, Feature, Enhancement, Task
- **Priority** — P0 (Critical), P1 (High), P2 (Medium), P3 (Low)
- **Estimate** — S (1-2 days), M (3-5 days), L (1-2 weeks), XL (2+ weeks)
- **Labels** — Suggested labels for filtering
- **Acceptance Criteria** — Definition of done

---

## EPIC: Design Blockers

### TICKET-001: Locate Missing Wireframe WF1

**Title:** [BLOCKER] Locate or recreate WF1 Spatial Baseline wireframe

**Type:** Task
**Priority:** P0
**Estimate:** S
**Labels:** `design`, `blocker`, `wireframe`
**Assignee:** Design Team

**Description:**
The wireframe file `wf1_dashboard_baseline_v2.png` is missing from the repository. This blocks engineering from verifying the dashboard baseline layout.

**Acceptance Criteria:**
- [ ] File `docs/UI/wireframes/wf1_dashboard_baseline_v2.png` exists
- [ ] File shows 3-panel layout with insights, map, and reports
- [ ] WIREFRAME_CATALOG.md path is correct

---

### TICKET-002: Locate Missing Wireframe WF2

**Title:** [BLOCKER] Locate or recreate WF2 Cluster Alert wireframe

**Type:** Task
**Priority:** P0
**Estimate:** S
**Labels:** `design`, `blocker`, `wireframe`
**Assignee:** Design Team

**Description:**
The wireframe file `wf2_dashboard_alert_v2.png` is missing from the repository. This blocks engineering from implementing the cluster alert visualization.

**Acceptance Criteria:**
- [ ] File `docs/UI/wireframes/wf2_dashboard_alert_v2.png` exists
- [ ] File shows Pattern A cluster detection with pulsing radius
- [ ] Context-aware assignment panel is visible

---

### TICKET-003: Locate Missing Wireframe WF3

**Title:** [BLOCKER] Locate or recreate WF3 Report Detail wireframe

**Type:** Task
**Priority:** P0
**Estimate:** S
**Labels:** `design`, `blocker`, `wireframe`
**Assignee:** Design Team

**Description:**
The wireframe file `wf3_report_detail_high_conf_v2.png` is missing from the repository. This blocks engineering from verifying the report detail view layout.

**Acceptance Criteria:**
- [ ] File `docs/UI/wireframes/wf3_report_detail_high_conf_v2.png` exists
- [ ] File shows high-confidence report with photo and AI classification
- [ ] Assignment suggestion with reasoning is visible

---

## EPIC: Batch Assignment (WF6)

### TICKET-004: Create BatchAssignmentModal Component

**Title:** [Feature] Implement BatchAssignmentModal component (WF6)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF6`, `assignment`
**Assignee:** TBD
**Blocked By:** None

**Description:**
Create a modal component for batch assigning multiple reports to a crew. This is a key workflow for efficient report management.

**Wireframe Reference:** `docs/UI/wireframes/wf6_batch_assignment.png`

**Acceptance Criteria:**
- [ ] Modal opens with list of selected reports
- [ ] Header shows "Assign {N} Reports" with correct count
- [ ] District dropdown with "Suggested: Most common district" hint
- [ ] Crew dropdown populates based on district
- [ ] Cancel button closes modal
- [ ] Assign button triggers callback
- [ ] Unit tests with >80% coverage
- [ ] Accessible (keyboard nav, ARIA labels)

**Technical Notes:**
- Create in `src/components/assignment/BatchAssignmentModal.tsx`
- Use React Query for crew data fetching
- Integrate with existing report selection state

---

### TICKET-005: Create CrewContextCard Component

**Title:** [Feature] Implement CrewContextCard component (WF6)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF6`, `assignment`
**Assignee:** TBD
**Blocked By:** None

**Description:**
Create a card component showing crew context (performance, capacity, last assignment) for the batch assignment modal.

**Wireframe Reference:** `docs/UI/wireframes/wf6_batch_assignment.png`

**Acceptance Criteria:**
- [ ] Shows crew name
- [ ] Shows recent performance indicator
- [ ] Shows last assignment date
- [ ] Shows capacity percentage
- [ ] Updates when crew selection changes
- [ ] Unit tests

**Technical Notes:**
- Create in `src/components/assignment/CrewContextCard.tsx`
- Performance levels: excellent, good, fair, poor
- Capacity as percentage with color coding

---

### TICKET-006: Create RouteSummary Component

**Title:** [Feature] Implement RouteSummary component (WF6)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF6`, `assignment`
**Assignee:** TBD
**Blocked By:** None

**Description:**
Create a component displaying route optimization metrics (distance, travel time, work time) for batch assignments.

**Wireframe Reference:** `docs/UI/wireframes/wf6_batch_assignment.png`

**Acceptance Criteria:**
- [ ] Shows total distance in miles
- [ ] Shows estimated travel time in hours
- [ ] Shows estimated work time in hours
- [ ] Updates when report selection changes
- [ ] Handles loading state
- [ ] Unit tests

**Technical Notes:**
- Create in `src/components/assignment/RouteSummary.tsx`
- Will need route optimization hook (TICKET-007)

---

### TICKET-007: Create useBatchAssignment Hook

**Title:** [Feature] Implement useBatchAssignment hook (WF6)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF6`, `hook`
**Assignee:** TBD
**Blocked By:** None

**Description:**
Create a custom hook for managing batch assignment state and API interactions.

**Acceptance Criteria:**
- [ ] Manages selected reports state
- [ ] Manages district/crew selection
- [ ] Provides route calculation
- [ ] Handles assignment submission
- [ ] Handles loading and error states
- [ ] Unit tests

**Technical Notes:**
- Create in `src/hooks/useBatchAssignment.ts`
- Use React Query for mutations
- Mock API until backend ready

---

### TICKET-008: Implement Route Optimization API

**Title:** [Backend] Implement route optimization API endpoint

**Type:** Feature
**Priority:** P1
**Estimate:** L
**Labels:** `backend`, `api`, `WF6`
**Assignee:** TBD
**Blocked By:** None

**Description:**
Create API endpoint for calculating optimized routes for batch assignments.

**Acceptance Criteria:**
- [ ] POST `/api/routes/optimize` endpoint
- [ ] Accepts list of report coordinates
- [ ] Returns distance, travel time, work time estimates
- [ ] Uses PostGIS for spatial calculations
- [ ] API tests with >80% coverage

---

## EPIC: Offline Mode (WF9)

### TICKET-009: Create OfflineBanner Component

**Title:** [Feature] Implement OfflineBanner component (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF9`, `offline`
**Assignee:** TBD

**Description:**
Create a banner component that displays offline status, last sync time, and pending sync count.

**Wireframe Reference:** `docs/UI/wireframes/wf9_offline_mode.png`

**Acceptance Criteria:**
- [ ] Orange banner with satellite icon
- [ ] Shows "OFFLINE MODE" text
- [ ] Shows relative time since last sync
- [ ] Shows pending sync item count
- [ ] Hidden when online
- [ ] Smooth show/hide animation
- [ ] Unit tests

**Technical Notes:**
- Create in `src/components/offline/OfflineBanner.tsx`
- Use CSS transitions for animation

---

### TICKET-010: Create useOfflineStatus Hook

**Title:** [Feature] Implement useOfflineStatus hook (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF9`, `hook`
**Assignee:** TBD

**Description:**
Create a hook for detecting network status and managing offline/online transitions.

**Acceptance Criteria:**
- [ ] Detects online/offline status
- [ ] Tracks last sync timestamp
- [ ] Tracks pending sync queue size
- [ ] Provides manual sync trigger
- [ ] Handles reconnection events
- [ ] Unit tests

**Technical Notes:**
- Create in `src/hooks/useOfflineStatus.ts`
- Use navigator.onLine and online/offline events

---

### TICKET-011: Create CachedBadge Component

**Title:** [Feature] Implement CachedBadge component (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF9`, `offline`
**Assignee:** TBD

**Description:**
Create a badge component indicating data is from local cache.

**Wireframe Reference:** `docs/UI/wireframes/wf9_offline_mode.png`

**Acceptance Criteria:**
- [ ] Yellow "[CACHED]" text badge
- [ ] Accessible (aria-label)
- [ ] Unit tests

---

### TICKET-012: Create StalenessWarning Component

**Title:** [Feature] Implement StalenessWarning component (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF9`, `offline`
**Assignee:** TBD

**Description:**
Create a warning component for AI suggestions that may be stale due to offline status.

**Wireframe Reference:** `docs/UI/wireframes/wf9_offline_mode.png`

**Acceptance Criteria:**
- [ ] Yellow warning with "[OFFLINE - STALE]" text
- [ ] Explains data may not be current
- [ ] Unit tests

---

### TICKET-013: Create SyncQueue Component

**Title:** [Feature] Implement SyncQueue component (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF9`, `offline`
**Assignee:** TBD

**Description:**
Create a UI for viewing and managing pending sync actions.

**Acceptance Criteria:**
- [ ] Lists pending actions with descriptions
- [ ] Shows "Queue for Sync" button
- [ ] Progress indicator during sync
- [ ] Handles sync failures gracefully
- [ ] Unit tests

---

### TICKET-014: Implement Service Worker for Offline Caching

**Title:** [Feature] Implement service worker for offline data caching (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** L
**Labels:** `frontend`, `agentic`, `WF9`, `infrastructure`
**Assignee:** TBD

**Description:**
Implement a service worker to cache app shell and API data for offline use.

**Acceptance Criteria:**
- [ ] App shell cached for offline access
- [ ] API responses cached with stale-while-revalidate
- [ ] Map tiles cached for offline viewing
- [ ] Cache invalidation on version update
- [ ] Manual cache clear option

**Technical Notes:**
- Use Workbox for service worker generation
- Consider cache size limits for mobile

---

### TICKET-015: Implement IndexedDB Persistence Layer

**Title:** [Feature] Implement IndexedDB for offline data persistence (WF9)

**Type:** Feature
**Priority:** P0
**Estimate:** L
**Labels:** `frontend`, `agentic`, `WF9`, `infrastructure`
**Assignee:** TBD

**Description:**
Implement IndexedDB storage for reports, insights, and user actions.

**Acceptance Criteria:**
- [ ] Store reports locally
- [ ] Store spatial insights locally
- [ ] Store pending actions (sync queue)
- [ ] Handle storage quota limits
- [ ] Migration strategy for schema changes

**Technical Notes:**
- Consider using Dexie.js for easier IndexedDB API
- Integrate with React Query persistence

---

## EPIC: Feature Admin (WF10)

### TICKET-016: Create FeatureAdminPanel Component

**Title:** [Feature] Implement FeatureAdminPanel component (WF10)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `admin`, `WF10`
**Assignee:** TBD

**Description:**
Create the main admin panel for trust calibration and feature management.

**Wireframe Reference:** `docs/UI/wireframes/wf10_feature_flag_admin.png`

**Acceptance Criteria:**
- [ ] Header "Trust Calibration & Feature Management"
- [ ] Grid layout for feature cards
- [ ] Responsive design
- [ ] Settings icon in header
- [ ] Unit tests

---

### TICKET-017: Create FeatureCard Component

**Title:** [Feature] Implement FeatureCard component (WF10)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `admin`, `WF10`
**Assignee:** TBD

**Description:**
Create a card component for individual feature flag management.

**Wireframe Reference:** `docs/UI/wireframes/wf10_feature_flag_admin.png`

**Acceptance Criteria:**
- [ ] Shows feature name
- [ ] Shows status badge (Enabled/Beta/Alpha)
- [ ] Shows metric (adoption rate, users, etc.)
- [ ] Shows action buttons appropriate to status
- [ ] Confirmation dialog for destructive actions
- [ ] Unit tests

---

### TICKET-018: Create FeatureStatusBadge Component

**Title:** [Feature] Implement FeatureStatusBadge component (WF10)

**Type:** Feature
**Priority:** P0
**Estimate:** S
**Labels:** `frontend`, `admin`, `WF10`
**Assignee:** TBD

**Description:**
Create a badge component for feature status display.

**Acceptance Criteria:**
- [ ] Green for "Enabled"
- [ ] Amber for "Beta"
- [ ] Red for "Alpha"
- [ ] Gray for "Disabled"
- [ ] Consistent styling
- [ ] Unit tests

---

### TICKET-019: Create useFeatureFlags Hook

**Title:** [Feature] Implement useFeatureFlags hook (WF10)

**Type:** Feature
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `admin`, `WF10`, `hook`
**Assignee:** TBD

**Description:**
Create a hook for reading and managing feature flags.

**Acceptance Criteria:**
- [ ] Fetch feature flag states
- [ ] Update feature flag states
- [ ] Handle optimistic updates
- [ ] Handle errors
- [ ] Unit tests

---

### TICKET-020: Add Admin Route and RBAC

**Title:** [Feature] Add /admin/features route with access control

**Type:** Feature
**Priority:** P1
**Estimate:** M
**Labels:** `frontend`, `admin`, `WF10`, `auth`
**Assignee:** TBD

**Description:**
Add routing for the feature admin panel with role-based access control.

**Acceptance Criteria:**
- [ ] Route /admin/features exists
- [ ] Only accessible to admin users
- [ ] Redirect non-admins to dashboard
- [ ] Add to navigation for admin users

---

## EPIC: Component Enhancements

### TICKET-021: Enhance DuplicateInsight with Side-by-Side Comparison

**Title:** [Enhancement] Add side-by-side comparison to duplicate detection (WF5)

**Type:** Enhancement
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF5`, `insights`
**Assignee:** TBD

**Description:**
Enhance the duplicate detection UI with a full side-by-side comparison card.

**Wireframe Reference:** `docs/UI/wireframes/wf5_duplicate_detection.png`

**Acceptance Criteria:**
- [ ] Yellow "POSSIBLE DUPLICATE" header
- [ ] Side-by-side photo thumbnails
- [ ] GPS coordinates for both reports
- [ ] Description preview for both
- [ ] Status badges (NEW, ASSIGNED)
- [ ] Distance between reports
- [ ] "Mark as Duplicate" button
- [ ] "Keep Separate" button
- [ ] "View Both on Map" button
- [ ] Unit tests

---

### TICKET-022: Enhance BiasInsight with Bar Chart

**Title:** [Enhancement] Add distribution bar chart to consistency check (WF8)

**Type:** Enhancement
**Priority:** P0
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF8`, `insights`, `chart`
**Assignee:** TBD

**Description:**
Add a horizontal bar chart visualization to the consistency check insight.

**Wireframe Reference:** `docs/UI/wireframes/wf8_consistency_check.png`

**Acceptance Criteria:**
- [ ] Horizontal bar chart component
- [ ] Shows expected vs actual distribution
- [ ] Color-coded bars
- [ ] Axis labels
- [ ] Responsive sizing
- [ ] Unit tests

---

### TICKET-023: Add Justification Field to HighRiskConfirmation

**Title:** [Enhancement] Add mandatory justification field to circuit breaker (WF7)

**Type:** Enhancement
**Priority:** P0
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF7`, `reasoning`
**Assignee:** TBD

**Description:**
Add a required text field for justification when approving high-risk decisions.

**Wireframe Reference:** `docs/UI/wireframes/wf7_high_risk_decision.png`

**Acceptance Criteria:**
- [ ] Textarea with "Enter mandatory justification" placeholder
- [ ] Minimum 50 character validation
- [ ] Character counter display
- [ ] Button disabled until justification meets minimum
- [ ] Justification included in confirm callback
- [ ] Unit tests

---

### TICKET-024: Add Step Numbering to ReasoningPanel

**Title:** [Enhancement] Add numbered steps to AI reasoning panel (WF4)

**Type:** Enhancement
**Priority:** P1
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF4`, `reasoning`
**Assignee:** TBD

**Description:**
Update the reasoning panel to show numbered steps matching the wireframe.

**Wireframe Reference:** `docs/UI/wireframes/wf4_report_detail_reasoning.png`

**Acceptance Criteria:**
- [ ] Steps show "Step 1:", "Step 2:", etc.
- [ ] Step number styled prominently
- [ ] Maintains current status indicator
- [ ] Unit tests updated

---

### TICKET-025: Add Tool Names to ReasoningPanel Steps

**Title:** [Enhancement] Show tool names in AI reasoning steps (WF4)

**Type:** Enhancement
**Priority:** P1
**Estimate:** S
**Labels:** `frontend`, `agentic`, `WF4`, `reasoning`
**Assignee:** TBD

**Description:**
Add tool name display (e.g., "Tool: vision-api-gemini-2.0") to reasoning steps.

**Wireframe Reference:** `docs/UI/wireframes/wf4_report_detail_reasoning.png`

**Acceptance Criteria:**
- [ ] Add `toolName` field to ReasoningStep interface
- [ ] Display tool name below step detail
- [ ] Styled as secondary text
- [ ] Unit tests updated

---

### TICKET-026: Create District Boundary Map Layer

**Title:** [Feature] Implement district boundary overlay for map (WF8)

**Type:** Feature
**Priority:** P1
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF8`, `map`
**Assignee:** TBD

**Description:**
Create a map layer showing district boundaries with different colors for active/inactive districts.

**Wireframe Reference:** `docs/UI/wireframes/wf8_consistency_check.png`

**Acceptance Criteria:**
- [ ] GeoJSON polygon rendering
- [ ] Blue outline for active districts
- [ ] Orange outline for inactive districts
- [ ] Labels for district names
- [ ] Toggle visibility
- [ ] Unit tests

**Technical Notes:**
- Create in `src/components/map/DistrictBoundaryLayer.tsx`
- Use MapLibre fill and line layers

---

### TICKET-027: Create Hazard Radius Map Overlay

**Title:** [Feature] Implement pulsing hazard radius on map (WF7)

**Type:** Feature
**Priority:** P1
**Estimate:** M
**Labels:** `frontend`, `agentic`, `WF7`, `map`
**Assignee:** TBD

**Description:**
Create a pulsing red circle overlay for high-risk hazard locations.

**Wireframe Reference:** `docs/UI/wireframes/wf7_high_risk_decision.png`

**Acceptance Criteria:**
- [ ] Red semi-transparent circle
- [ ] Pulsing animation (CSS or JS)
- [ ] Configurable radius
- [ ] Center on hazard coordinates
- [ ] Performance optimized
- [ ] Unit tests

**Technical Notes:**
- Create in `src/components/map/HazardRadiusOverlay.tsx`
- Consider using MapLibre circle layer with animation

---

## Summary

| Epic | Tickets | Total Estimate |
|------|---------|----------------|
| Design Blockers | 3 | 3 days |
| Batch Assignment | 5 | ~2 weeks |
| Offline Mode | 7 | ~3 weeks |
| Feature Admin | 5 | ~1.5 weeks |
| Component Enhancements | 7 | ~1.5 weeks |
| **TOTAL** | **27** | **~8-9 weeks** |

---

**Note:** Estimates assume parallel work streams with 2-3 engineers per epic.
