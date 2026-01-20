# Wireframe Conformance Audit

**Audit Date:** January 19, 2026
**Auditor:** Claude (AI-assisted code review)
**Branch:** `feature/dashboard-phase-4-agentic`
**Reference:** [WIREFRAME_CATALOG.md](WIREFRAME_CATALOG.md)

---

## Executive Summary

A comprehensive audit of the TrailWatch Agentic UI implementation against the 10 approved wireframes reveals **significant gaps** between the design specifications and current implementation.

| Metric | Value |
|--------|-------|
| **Overall Conformance** | ~35% |
| **Wireframes Fully Implemented** | 0 of 10 |
| **Wireframes Partially Implemented** | 7 of 10 |
| **Wireframes Not Implemented** | 3 of 10 |

### Key Findings

1. **Core structural components exist** (3-panel layout, insight cards, reasoning panels)
2. **Three major features have no implementation** (Batch Assignment WF6, Offline Mode WF9, Feature Admin WF10)
3. **Interactive details and data visualizations are largely missing** across all implemented components
4. **Map-based visualizations need work** (pulsing radius, hazard overlays, cluster animations)

---

## Table of Contents

1. [Conformance Assessment by Wireframe](#1-conformance-assessment-by-wireframe)
2. [Gap Inventory](#2-gap-inventory)
3. [Prioritized Implementation Roadmap](#3-prioritized-implementation-roadmap)
4. [Component Specifications](#4-component-specifications)
5. [Appendix: File Mapping](#appendix-file-mapping)

---

## 1. Conformance Assessment by Wireframe

### WF1: Spatial Baseline — 55% Conformance

**Wireframe Location:** `wireframes/wf1_dashboard_baseline.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| 3-panel layout | LEFT SIDEBAR (20%), CENTER MAP (60%), RIGHT REPORTS PANEL (20%) | `MapFirstLayout.tsx` with flex layout | **OK** |
| Left sidebar title | "SPATIAL INSIGHTS" header | Present in `SpatialInsightsSidebar.tsx` | **OK** |
| Insight cards | TREND/PATTERN cards with severity indicator | `InsightCard.tsx` with variants | **PARTIAL** |
| Trend indicators | "TREND (Low)", "PATTERN (High)" labels with icons | Insight type shown but trend levels missing | **PARTIAL** |
| Center map | Dark topographic style with trails | MapLibre GL with dark style | **OK** |
| Colored markers | Red (high), Yellow (medium), Green (low) severity | `SmartMarkerCluster.tsx` with color coding | **OK** |
| Right panel title | "REPORTS (15)" with count | Report list exists but dynamic count unclear | **PARTIAL** |
| Report list items | Checkbox, title, location, date, status, description | Basic report cards implemented | **PARTIAL** |
| Status badges | "New" (blue), "In Progress" (orange), "Resolved" (green) | Status display exists | **PARTIAL** |
| Bottom action buttons | "Assign Crew" and "Extract Info" buttons | Action buttons not visible in current implementation | **MISSING** |
| Report checkboxes | Multi-select capability for reports | Not implemented | **MISSING** |

#### Current Implementation

**Files:**
- `frontend/src/components/common/MapFirstLayout.tsx` — 3-panel layout
- `frontend/src/components/map/SpatialInsightsSidebar.tsx` — Left panel
- `frontend/src/components/map/SmartMarkerCluster.tsx` — Map markers
- `frontend/src/components/insights/InsightCard.tsx` — Insight cards

#### Required Changes

1. Add report count to right panel header ("REPORTS (N)")
2. Add checkboxes to report list items for multi-select
3. Add "Assign Crew" and "Extract Info" action buttons to right panel footer
4. Add trend level indicators (Low/Medium/High) to insight cards
5. Verify status badge colors match wireframe spec

---

### WF2: Cluster Alert (Pattern A) — 40% Conformance

**Wireframe Location:** `wireframes/wf2_dashboard_alert.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| Critical alert card | Red border, "CRITICAL SPATIAL ALERT" header | `ClusterInsight.tsx` exists but different styling | **PARTIAL** |
| Alert content | "Unusual cluster: 4 downed trees in 1 mile" | Shows cluster data but different format | **PARTIAL** |
| Weather context | "Weather: Heavy wind gusts" with distinct styling | Weather data exists in mock but not prominently shown | **PARTIAL** |
| AI Reasoning link | "Show AI Reasoning" expandable link | Not implemented on cluster card | **MISSING** |
| Spatial insights menu | Heatmap Analysis, Route Traffic, Incident Trends, Resource Allocation | Not implemented | **MISSING** |
| Pulsing radius | Red animated circle with "1 MILE RADIUS" label | Not implemented | **MISSING** |
| Warning markers | Red markers with warning triangle icons inside radius | Basic markers exist, no warning icons | **PARTIAL** |
| Header navigation | DASHBOARD, ALERTS, REPORTS, SETTINGS tabs | AppShell header exists but limited navigation | **PARTIAL** |
| Right panel filter | "CLUSTER REPORTS (4)" - filtered to cluster only | No cluster filtering in report list | **MISSING** |
| Assign Cluster button | Primary action button at bottom | Not implemented | **MISSING** |
| Notification bell | Top-right notification icon | Not implemented | **MISSING** |

#### Current Implementation

**File:** `frontend/src/components/insights/ClusterInsight.tsx`

The component shows cluster metadata but lacks:
- Red alert border styling
- Pulsing map radius animation
- "Assign Cluster" action button
- Filtered report list view
- Weather context prominence

#### Required Changes

1. Create `ClusterAlertCard.tsx` with red border styling and "CRITICAL SPATIAL ALERT" header
2. Add "Show AI Reasoning" expandable section
3. Create `PulsingRadius.tsx` MapLibre layer with animation
4. Add "1 MILE RADIUS" label to map
5. Create cluster-filtered report list mode
6. Add "Assign Cluster" button
7. Implement Spatial Insights menu items (Heatmap, Route Traffic, etc.)
8. Add warning triangle icons to cluster markers

---

### WF3: Report Detail (High Confidence) — 50% Conformance

**Wireframe Location:** `wireframes/wf3_report_detail_high_conf.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| 3-panel detail layout | Left nav, Center map, Right detail panel | Exists but different proportions | **PARTIAL** |
| Left navigation | Recent Reports, Heatmaps, Historical Data, Asset Layers, Boundaries | Not implemented - sidebar shows insights only | **MISSING** |
| Map focus | Blue radius highlighting selected location with trail overlay | Basic location shown, no radius highlight | **PARTIAL** |
| Report header | "REPORT #1234" with "Report Detail" subtitle | Report ID shown | **OK** |
| Section 1: Photo | "1. PHOTO SECTION" header with large photo and timestamp | Photo display exists but no section numbering | **PARTIAL** |
| Section 2: AI Classification | "2. AI CLASSIFICATION" with TRACS code and confidence badge | `ConfidenceBadge.tsx` exists, TRACS display partial | **PARTIAL** |
| Confidence badge | "Confidence: 0.89 High" styled badge | Badge shows percentage | **OK** |
| Show AI Reasoning link | Expandable "Show AI Reasoning" link | `ReasoningPanel.tsx` exists | **OK** |
| Section 3: Assignment | "3. ASSIGNMENT" with District/Crew and reasoning | Assignment display partial | **PARTIAL** |
| Assignment reasoning | "Based on 4 similar reports in District 7" | Not shown | **MISSING** |
| Section 4: Actions | "4. ACTIONS" with "Approve & Route" and "Edit" buttons | Action buttons exist but different labels | **PARTIAL** |
| Section numbering | Numbered sections 1-4 | Not implemented | **MISSING** |
| Classification timestamp | "Classified: 8:16 AM" | Not shown | **MISSING** |

#### Current Implementation

**Files:**
- `frontend/src/components/agentic/ReasoningPanel.tsx` — AI reasoning display
- `frontend/src/components/agentic/ConfidenceBadge.tsx` — Confidence indicator

#### Required Changes

1. Add numbered section headers (1. PHOTO, 2. AI CLASSIFICATION, etc.)
2. Add "Show AI Reasoning" expandable link to classification section
3. Add classification timestamp
4. Add assignment reasoning text ("Based on N similar reports...")
5. Rename action buttons to "Approve & Route" and "Edit"
6. Create left navigation menu for detail view
7. Create `LocationHighlight.tsx` map component with blue radius
8. Add trail overlay on detail map

---

### WF4: AI Reasoning — 60% Conformance

**Wireframe Location:** `wireframes/wf4_report_detail_reasoning.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| Layout | 2-column (Report Overview + AI Reasoning) | Single panel | **MISSING** |
| Step numbering | Steps 1-4 with numbers | Unnumbered list | **MISSING** |
| Step 1: Photo Analysis | "Gemini Vision identified: Tree trunk (92%), Obstruction. Tool: vision-api-gemini-2.0" | Generic step with status icon | **PARTIAL** |
| Step 2: GPS Validation | "Validated against River Valley Trail geometry. Offset 0.3 miles. Tool: postgis-spatial-query" | Generic step | **PARTIAL** |
| Step 3: Size Estimation | "Estimated clear time: 2-3 hours. Crew size: 2-3 people. Equipment: Chainsaw." | Not shown | **MISSING** |
| Step 4: Classification | "Primary: TRACS 245 (89%). Alternative: TRACS 242 (8%)." | Single classification | **PARTIAL** |
| Confidence display | "Confidence: 0.89 (High)" with warning icon | Percentage badge | **PARTIAL** |
| Audit log link | "View Full Audit Log" link | Not present | **MISSING** |
| Map thumbnail | Small map in Report Overview | Not in reasoning panel | **MISSING** |

#### Current Implementation

**File:** `frontend/src/components/agentic/ReasoningPanel.tsx`

```typescript
// Current step structure (lines 6-13)
export interface ReasoningStep {
    step: string;      // e.g., "Visual Analysis"
    status: 'success' | 'warning' | 'info';
    detail: string;    // e.g., "Identified fallen tree > 12in diameter"
}
```

#### Required Changes

1. Add step numbering to UI
2. Add `toolName` field to `ReasoningStep` interface
3. Add alternative classifications with confidence percentages
4. Add "View Full Audit Log" link with `onViewAuditLog` callback
5. Create 2-column layout wrapper for Report Detail view

---

### WF5: Duplicate Detection — 35% Conformance

**Wireframe Location:** `wireframes/wf5_duplicate_detection.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| Alert styling | Yellow "POSSIBLE DUPLICATE" header with warning icon | Muted card styling | **MISSING** |
| Similarity headline | "94% similar to Report #1180" | Inline text only | **PARTIAL** |
| Side-by-side comparison | Two photo placeholders with labels | No photo comparison | **MISSING** |
| GPS coordinates | Shows both GPS values | Not displayed | **MISSING** |
| Description preview | Shows both descriptions | Not displayed | **MISSING** |
| Status badges | "NEW" (blue), "ASSIGNED" (orange) | Not displayed | **MISSING** |
| Distance visualization | "Distance: 15 meters" with arrow diagram | Text only | **PARTIAL** |
| Map visualization | Two markers connected by dashed line | Not implemented | **MISSING** |
| Action: Mark as Duplicate | Primary button | Not implemented | **MISSING** |
| Action: Keep Separate | Secondary button | Not implemented | **MISSING** |
| Action: View Both on Map | Secondary button | Not implemented | **MISSING** |

#### Current Implementation

**File:** `frontend/src/components/insights/DuplicateInsight.tsx`

The current implementation only shows metadata (similarity score, distance, shared features) but lacks:
- Visual comparison UI
- Action buttons
- Map integration

#### Required Changes

1. Create `DuplicateComparisonCard.tsx` — Full side-by-side comparison component
2. Add photo thumbnails with lazy loading
3. Add GPS coordinate display
4. Add action buttons with callbacks (`onMarkDuplicate`, `onKeepSeparate`, `onViewOnMap`)
5. Create map layer for duplicate visualization (connected markers)

---

### WF6: Batch Assignment — 0% Conformance (NOT IMPLEMENTED)

**Wireframe Location:** `wireframes/wf6_batch_assignment.png`

#### Wireframe Requirements (Full Specification)

| Component | Specification |
|-----------|---------------|
| **Modal container** | Overlay on dashboard, dark semi-transparent backdrop |
| **Header** | "Assign {N} Reports" with report count |
| **District selector** | Dropdown with "Suggested: Most common district" hint |
| **Crew selector** | Dropdown for crew selection |
| **Context card** | Shows selected crew's recent performance, last assignment date, current capacity percentage |
| **Route summary** | Total Distance (miles), Estimated Travel (hours), Work Time (hours) |
| **Report checklist** | List of selected reports with trail names and checkboxes |
| **Cancel button** | Secondary action, closes modal |
| **Assign button** | Primary action, submits assignment |

#### Current Implementation

**No implementation exists.** Search results:
```
$ find . -name "*BatchAssignment*" -o -name "*batch*assignment*"
(no results)
```

#### Required Implementation

1. Create `BatchAssignmentModal.tsx` — Main modal component
2. Create `CrewContextCard.tsx` — Crew performance/capacity display
3. Create `RouteSummary.tsx` — Distance/time calculations
4. Create `useBatchAssignment.ts` hook — State management
5. Create `useRouteOptimization.ts` hook — Route calculation logic
6. Add modal trigger to report selection UI
7. Integrate with crew API endpoints

---

### WF7: High-Risk Decision (Circuit Breaker) — 65% Conformance

**Wireframe Location:** `wireframes/wf7_high_risk_decision.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| Header | "HIGH-RISK DECISION" in red | "High-Risk Action Required" | **OK** |
| Subtitle | "Requires explicit review." | "This report requires human verification" | **OK** |
| Checkbox 1 | "Reviewed photo" | "I have reviewed all attached photos" | **OK** |
| Checkbox 2 | "GPS validated" | "I have verified the GPS location is accurate" | **OK** |
| Checkbox 3 | "Severity appropriate" | Not present | **MISSING** |
| Checkbox 4 | "Closure justified" | "I understand this action may close the trail" | **PARTIAL** |
| Justification field | "Enter mandatory justification (min 50 chars)" textarea | Not implemented | **MISSING** |
| Button state | Disabled until checklist + justification complete | Disabled until checklist only | **PARTIAL** |
| Map visualization | Pulsing red hazard radius with bridge icon | Not implemented | **MISSING** |

#### Current Implementation

**File:** `frontend/src/components/reasoning/HighRiskConfirmation.tsx`

The component has good structure but is missing:
- 4th checklist item ("Severity appropriate")
- Mandatory justification text field with character count
- Map integration with hazard radius visualization

#### Required Changes

1. Add "Severity appropriate" checkbox item
2. Add `justification` state with textarea input
3. Add character counter (min 50 chars validation)
4. Update button disabled logic to require justification
5. Create `HazardRadiusOverlay.tsx` map component
6. Add bridge/hazard icon to map marker

---

### WF8: Consistency Check (Bias Detection) — 40% Conformance

**Wireframe Location:** `wireframes/wf8_consistency_check.png`

#### Wireframe Requirements vs Implementation

| Requirement | Wireframe Spec | Implementation | Gap |
|-------------|----------------|----------------|-----|
| Alert styling | Yellow "CONSISTENCY CHECK" card with warning icon | Muted card in sidebar | **PARTIAL** |
| Statistics | "In last 60 days, 18 assignments to District 3, 0 to District 4." | Deviation percentage only | **PARTIAL** |
| Bar chart | Horizontal bar chart showing distribution | Not implemented | **MISSING** |
| Explanations | Bulleted list of possible causes (Terrain difference? Reporting bias? Assignment bias?) | Not implemented | **MISSING** |
| View Coverage Map | Button to show district coverage | Not implemented | **MISSING** |
| Acknowledge button | Primary action | Not implemented | **MISSING** |
| Dismiss button | Secondary action | Not implemented | **MISSING** |
| Map visualization | Two district boundaries (blue/orange) with markers | Not implemented | **MISSING** |

#### Current Implementation

**File:** `frontend/src/components/insights/BiasInsight.tsx`

Shows basic metadata but lacks:
- Visual bar chart
- Explanatory questions
- Action buttons
- Map integration

#### Required Changes

1. Create `DistributionBarChart.tsx` — Horizontal bar visualization
2. Add explanations array to `ConsistencyCheckMetadata` type
3. Add action buttons (`onAcknowledge`, `onDismiss`, `onViewCoverageMap`)
4. Create `DistrictBoundaryLayer.tsx` map component
5. Style as prominent yellow alert card

---

### WF9: Offline Mode — 0% Conformance (NOT IMPLEMENTED)

**Wireframe Location:** `wireframes/wf9_offline_mode.png`

#### Wireframe Requirements (Full Specification)

| Component | Specification |
|-----------|---------------|
| **Banner** | Orange "OFFLINE MODE" banner at top with satellite icon |
| **Sync timestamp** | "Last sync: 2 hours ago. Data may be stale." |
| **Cached badges** | Yellow "[CACHED]" badge on reports |
| **Stale warnings** | Yellow "[OFFLINE - STALE]" warning on AI suggestions |
| **Queue for Sync** | Orange button to queue actions for later sync |
| **Map overlay** | "Live crew locations unavailable offline" message |
| **Form factor** | Tablet-optimized layout |

#### Current Implementation

**No implementation exists.** Search results:
```
$ find . -name "*Offline*" -o -name "*offline*"
(no results)
```

#### Required Implementation

1. Create `OfflineBanner.tsx` — Top banner with sync status
2. Create `useOfflineStatus.ts` hook — Network detection, sync queue
3. Create `CachedBadge.tsx` — Visual indicator for cached data
4. Create `StalenessWarning.tsx` — Warning for outdated AI data
5. Create `SyncQueue.tsx` — Pending actions queue UI
6. Create `OfflineMapOverlay.tsx` — Map unavailable features message
7. Implement service worker for offline data caching
8. Add IndexedDB persistence layer

---

### WF10: Feature Admin (Governance) — 0% Conformance (NOT IMPLEMENTED)

**Wireframe Location:** `wireframes/wf10_feature_flag_admin.png`

#### Wireframe Requirements (Full Specification)

| Component | Specification |
|-----------|---------------|
| **Header** | "Trust Calibration & Feature Management" |
| **Feature cards** | 3 cards in horizontal layout |
| **Card 1** | "Structured AI Reasoning" — Enabled (green), 87% Adoption Rate, "Disable Globally" button |
| **Card 2** | "Spatial Cluster Alerts" — Beta (amber), 68% Acceptance Rate, "Enable for All" / "Disable" buttons |
| **Card 3** | "Assignment Consistency" — Alpha (red), 5 User Pilot, "Promote to Beta" button |
| **Status badges** | Green "Enabled", Amber "Beta", Red "Alpha" |
| **Metrics** | Adoption Rate, Acceptance Rate, Active Pilot Users |

#### Current Implementation

**No implementation exists.** Search results:
```
$ find . -name "*FeatureAdmin*" -o -name "*feature*flag*"
(no results)
```

#### Required Implementation

1. Create `FeatureAdminPanel.tsx` — Main admin panel
2. Create `FeatureCard.tsx` — Individual feature card component
3. Create `FeatureStatusBadge.tsx` — Status indicator (Enabled/Beta/Alpha)
4. Create `useFeatureFlags.ts` hook — Feature flag management
5. Create `FeatureMetrics.tsx` — Adoption/acceptance display
6. Add admin route `/admin/features`
7. Implement feature flag API endpoints (backend)
8. Add role-based access control for admin panel

---

## 2. Gap Inventory

### Summary by Category

| Category | Gaps | Priority |
|----------|------|----------|
| Unimplemented Features | 3 | HIGH |
| Missing UI Components | 15 | HIGH |
| Missing Visualizations | 8 | MEDIUM |
| Missing Action Buttons | 11 | MEDIUM |
| Data/API Gaps | 4 | MEDIUM |
| Styling Gaps | 6 | LOW |

### Complete Gap List

#### HIGH: Unimplemented Features
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-001 | Batch Assignment Modal | WF6 | Large |
| GAP-002 | Offline Mode System | WF9 | X-Large |
| GAP-003 | Feature Admin Panel | WF10 | Large |

#### HIGH: Missing UI Components
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-004 | Report multi-select checkboxes | WF1 | Small |
| GAP-005 | "Assign Crew" button in report list | WF1 | Small |
| GAP-006 | "Extract Info" button in report list | WF1 | Small |
| GAP-007 | Critical alert card with red border | WF2 | Medium |
| GAP-008 | Cluster-filtered report list | WF2 | Medium |
| GAP-009 | "Assign Cluster" button | WF2 | Small |
| GAP-010 | Detail view left navigation menu | WF3 | Medium |
| GAP-011 | Numbered section headers in report detail | WF3 | Small |
| GAP-012 | Side-by-side duplicate comparison | WF5 | Medium |
| GAP-013 | Mandatory justification field | WF7 | Small |
| GAP-014 | Distribution bar chart | WF8 | Medium |
| GAP-015 | Crew context card | WF6 | Medium |
| GAP-016 | Route summary component | WF6 | Medium |
| GAP-017 | Cached data badge | WF9 | Small |
| GAP-018 | Staleness warning | WF9 | Small |
| GAP-019 | Sync queue UI | WF9 | Medium |
| GAP-020 | Feature card component | WF10 | Medium |
| GAP-021 | Feature status badge | WF10 | Small |
| GAP-022 | Offline banner | WF9 | Small |

#### MEDIUM: Missing Visualizations
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-023 | Pulsing cluster radius with label | WF2 | Medium |
| GAP-024 | Warning triangle icons in markers | WF2 | Small |
| GAP-025 | Blue location highlight radius | WF3 | Medium |
| GAP-026 | Trail overlay on detail map | WF3 | Medium |
| GAP-027 | Pulsing hazard radius on map | WF7 | Medium |
| GAP-028 | District boundary overlay | WF8 | Medium |
| GAP-029 | Duplicate markers with connection line | WF5 | Medium |
| GAP-030 | Hazard icon markers (bridge, etc.) | WF7 | Small |
| GAP-031 | Offline map overlay message | WF9 | Small |

#### MEDIUM: Missing Action Buttons
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-032 | "Approve & Route" button (rename) | WF3 | Small |
| GAP-033 | "Mark as Duplicate" button | WF5 | Small |
| GAP-034 | "Keep Separate" button | WF5 | Small |
| GAP-035 | "View Both on Map" button | WF5 | Small |
| GAP-036 | "View Coverage Map" button | WF8 | Small |
| GAP-037 | "Acknowledge" button | WF8 | Small |
| GAP-038 | "Dismiss" button | WF8 | Small |
| GAP-039 | "Queue for Sync" button | WF9 | Small |
| GAP-040 | "View Full Audit Log" link | WF4 | Small |
| GAP-041 | Spatial insights menu items | WF2 | Medium |
| GAP-042 | Header navigation tabs | WF2 | Medium |

#### MEDIUM: Data/API Gaps
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-043 | Route optimization API | WF6 | Large |
| GAP-044 | Crew performance API | WF6 | Medium |
| GAP-045 | Feature flag API | WF10 | Medium |
| GAP-046 | Offline sync queue API | WF9 | Large |

#### LOW: Styling Gaps
| ID | Gap | Wireframe | Effort |
|----|-----|-----------|--------|
| GAP-047 | Trend level indicators (Low/Medium/High) | WF1 | Small |
| GAP-048 | Yellow alert card styling | WF5, WF8 | Small |
| GAP-049 | Step numbering in reasoning | WF4 | Small |
| GAP-050 | Tool name display in steps | WF4 | Small |
| GAP-051 | 2-column report detail layout | WF4 | Medium |
| GAP-052 | Orange offline theme colors | WF9 | Small |

---

## 3. Prioritized Implementation Roadmap

### Phase A: Core Feature Implementation (Weeks 1-4)
**Goal:** Implement the three missing major features.

#### A.1: Batch Assignment (WF6) — Estimated: 2 weeks
| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| A.1.1 Create BatchAssignmentModal.tsx | P0 | M | — |
| A.1.2 Create CrewContextCard.tsx | P0 | M | — |
| A.1.3 Create RouteSummary.tsx | P0 | M | — |
| A.1.4 Create useBatchAssignment.ts | P0 | M | — |
| A.1.5 Implement route optimization API | P1 | L | Backend |
| A.1.6 Implement crew performance API | P1 | M | Backend |
| A.1.7 Integration tests | P0 | M | A.1.1-A.1.4 |

#### A.2: Feature Admin (WF10) — Estimated: 1.5 weeks
| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| A.2.1 Create FeatureAdminPanel.tsx | P0 | M | — |
| A.2.2 Create FeatureCard.tsx | P0 | M | — |
| A.2.3 Create FeatureStatusBadge.tsx | P0 | S | — |
| A.2.4 Create useFeatureFlags.ts | P0 | M | — |
| A.2.5 Implement feature flag API | P1 | M | Backend |
| A.2.6 Add /admin/features route | P0 | S | A.2.1 |
| A.2.7 Add RBAC for admin access | P1 | M | Backend |

#### A.3: Offline Mode (WF9) — Estimated: 3 weeks
| Task | Priority | Effort | Dependencies |
|------|----------|--------|--------------|
| A.3.1 Create OfflineBanner.tsx | P0 | S | — |
| A.3.2 Create useOfflineStatus.ts | P0 | M | — |
| A.3.3 Create CachedBadge.tsx | P0 | S | — |
| A.3.4 Create StalenessWarning.tsx | P0 | S | — |
| A.3.5 Create SyncQueue.tsx | P0 | M | — |
| A.3.6 Create OfflineMapOverlay.tsx | P0 | S | — |
| A.3.7 Implement service worker | P0 | L | — |
| A.3.8 Implement IndexedDB layer | P0 | L | — |
| A.3.9 Implement sync queue API | P1 | L | Backend |
| A.3.10 E2E offline testing | P0 | L | A.3.1-A.3.8 |

### Phase B: Component Enhancements (Weeks 5-7)
**Goal:** Bring existing components to full wireframe conformance.

#### B.1: Dashboard Enhancements (WF1, WF2, WF3)
| Task | Priority | Effort |
|------|----------|--------|
| B.1.1 Add report multi-select checkboxes | P0 | S |
| B.1.2 Add "Assign Crew"/"Extract Info" buttons | P0 | S |
| B.1.3 Add trend level indicators to insight cards | P0 | S |
| B.1.4 Create ClusterAlertCard with red border | P0 | M |
| B.1.5 Create PulsingRadius map layer | P0 | M |
| B.1.6 Add cluster-filtered report list view | P0 | M |
| B.1.7 Add numbered section headers to report detail | P0 | S |
| B.1.8 Create LocationHighlight map component | P1 | M |

#### B.2: Duplicate Detection Enhancement (WF5)
| Task | Priority | Effort |
|------|----------|--------|
| B.2.1 Create DuplicateComparisonCard.tsx | P0 | M |
| B.2.2 Add photo thumbnails | P0 | S |
| B.2.3 Add GPS coordinate display | P0 | S |
| B.2.4 Add action buttons | P0 | S |
| B.2.5 Create duplicate markers map layer | P1 | M |

#### B.3: Consistency Check Enhancement (WF8)
| Task | Priority | Effort |
|------|----------|--------|
| B.3.1 Create DistributionBarChart.tsx | P0 | M |
| B.3.2 Add explanations list | P0 | S |
| B.3.3 Add action buttons | P0 | S |
| B.3.4 Create DistrictBoundaryLayer.tsx | P1 | M |
| B.3.5 Update card styling to yellow alert | P0 | S |

#### B.4: High-Risk Enhancement (WF7)
| Task | Priority | Effort |
|------|----------|--------|
| B.4.1 Add 4th checklist item | P0 | S |
| B.4.2 Add justification textarea | P0 | S |
| B.4.3 Add character counter | P0 | S |
| B.4.4 Create HazardRadiusOverlay.tsx | P1 | M |
| B.4.5 Add hazard icon markers | P1 | S |

#### B.5: AI Reasoning Enhancement (WF4)
| Task | Priority | Effort |
|------|----------|--------|
| B.5.1 Add step numbering | P0 | S |
| B.5.2 Add tool name to steps | P0 | S |
| B.5.3 Add alternative classifications | P1 | S |
| B.5.4 Add "View Audit Log" link | P1 | S |
| B.5.5 Create 2-column report layout | P2 | M |

### Phase C: Polish & Integration (Week 8)
**Goal:** Final integration, testing, and documentation.

| Task | Priority | Effort |
|------|----------|--------|
| C.1 Visual QA against all wireframes | P0 | M |
| C.2 Accessibility audit (WCAG 2.1 AA) | P0 | M |
| C.3 Responsive testing (mobile/tablet) | P0 | M |
| C.4 Performance profiling | P1 | S |
| C.5 Update component documentation | P1 | M |
| C.6 Update WIREFRAME_CATALOG.md with implementation status | P0 | S |

---

## 4. Component Specifications

### 4.1 BatchAssignmentModal (WF6)

```typescript
// Proposed interface
interface BatchAssignmentModalProps {
  /** Reports to be assigned */
  reports: HazardReport[];
  /** Available crews for assignment */
  crews: Crew[];
  /** Available districts */
  districts: District[];
  /** Called when assignment is confirmed */
  onAssign: (assignment: BatchAssignment) => void;
  /** Called when modal is cancelled */
  onCancel: () => void;
  /** Loading state during assignment */
  isLoading?: boolean;
}

interface BatchAssignment {
  reportIds: string[];
  districtId: string;
  crewId: string;
}

interface RouteSummary {
  totalDistanceMiles: number;
  estimatedTravelHours: number;
  estimatedWorkHours: number;
}

interface CrewContext {
  lastAssignmentDate: string;
  capacityPercent: number;
  recentPerformance: 'excellent' | 'good' | 'fair' | 'poor';
}
```

**Acceptance Criteria:**
- [ ] Modal opens with list of selected reports
- [ ] District dropdown shows suggestion based on most common district
- [ ] Crew dropdown populates based on selected district
- [ ] Route summary updates when crew is selected
- [ ] Crew context card shows performance metrics
- [ ] Assign button disabled until district and crew selected
- [ ] Cancel button closes modal without changes
- [ ] Loading state shown during API call

---

### 4.2 DuplicateComparisonCard (WF5)

```typescript
interface DuplicateComparisonCardProps {
  /** The current report being viewed */
  currentReport: HazardReport;
  /** The potential duplicate report */
  duplicateReport: HazardReport;
  /** Similarity analysis metadata */
  similarity: DuplicateSimilarity;
  /** Called when user marks as duplicate */
  onMarkDuplicate: () => void;
  /** Called when user keeps reports separate */
  onKeepSeparate: () => void;
  /** Called when user wants to view both on map */
  onViewOnMap: () => void;
}

interface DuplicateSimilarity {
  score: number; // 0.0 - 1.0
  distanceMeters: number;
  sharedFeatures: ('photo' | 'hazard_type' | 'description' | 'location')[];
}
```

**Acceptance Criteria:**
- [ ] Yellow alert card with "POSSIBLE DUPLICATE" header
- [ ] Shows similarity percentage prominently
- [ ] Side-by-side photo thumbnails (or placeholders if no photo)
- [ ] GPS coordinates shown for both reports
- [ ] Description preview (truncated) for both reports
- [ ] Status badges (NEW, ASSIGNED, etc.)
- [ ] Distance shown between reports
- [ ] Three action buttons functional
- [ ] Accessible (keyboard navigation, screen reader labels)

---

### 4.3 OfflineBanner (WF9)

```typescript
interface OfflineBannerProps {
  /** Whether the app is currently offline */
  isOffline: boolean;
  /** Timestamp of last successful sync */
  lastSyncAt: Date | null;
  /** Number of pending sync items */
  pendingSyncCount: number;
  /** Called when user requests manual sync */
  onRequestSync?: () => void;
}
```

**Acceptance Criteria:**
- [ ] Orange banner visible when offline
- [ ] Shows satellite/offline icon
- [ ] Displays relative time since last sync
- [ ] Shows count of pending sync items
- [ ] "Sync Now" button (disabled when offline)
- [ ] Banner hidden when online
- [ ] Smooth animation on show/hide

---

### 4.4 FeatureCard (WF10)

```typescript
interface FeatureCardProps {
  /** Feature name */
  name: string;
  /** Current status */
  status: 'enabled' | 'beta' | 'alpha' | 'disabled';
  /** Usage metric */
  metric: {
    label: string; // e.g., "Adoption Rate", "Acceptance Rate"
    value: string; // e.g., "87%", "5 User Pilot"
  };
  /** Available actions for this feature */
  actions: FeatureAction[];
  /** Called when an action is triggered */
  onAction: (action: FeatureAction) => void;
}

type FeatureAction =
  | { type: 'enable'; label: 'Enable for All' }
  | { type: 'disable'; label: 'Disable' | 'Disable Globally' }
  | { type: 'promote'; label: 'Promote to Beta' };
```

**Acceptance Criteria:**
- [ ] Card displays feature name
- [ ] Status badge with appropriate color (green/amber/red/gray)
- [ ] Metric displayed with label
- [ ] Action buttons rendered based on available actions
- [ ] Confirmation dialog for destructive actions
- [ ] Loading state during API calls

---

## Appendix: File Mapping

### Existing Components

| Component | File Path | Wireframe |
|-----------|-----------|-----------|
| MapFirstLayout | `src/components/layout/MapFirstLayout.tsx` | WF1 |
| SpatialInsightsSidebar | `src/components/map/SpatialInsightsSidebar.tsx` | WF1 |
| SmartMarkerCluster | `src/components/map/SmartMarkerCluster.tsx` | WF1, WF2 |
| InsightCard | `src/components/insights/InsightCard.tsx` | WF1 |
| ClusterInsight | `src/components/insights/ClusterInsight.tsx` | WF2 |
| ReasoningPanel | `src/components/agentic/ReasoningPanel.tsx` | WF4 |
| DuplicateInsight | `src/components/insights/DuplicateInsight.tsx` | WF5 |
| HighRiskConfirmation | `src/components/reasoning/HighRiskConfirmation.tsx` | WF7 |
| BiasInsight | `src/components/insights/BiasInsight.tsx` | WF8 |

### Components to Create

| Component | Proposed Path | Wireframe |
|-----------|---------------|-----------|
| BatchAssignmentModal | `src/components/assignment/BatchAssignmentModal.tsx` | WF6 |
| CrewContextCard | `src/components/assignment/CrewContextCard.tsx` | WF6 |
| RouteSummary | `src/components/assignment/RouteSummary.tsx` | WF6 |
| DuplicateComparisonCard | `src/components/insights/DuplicateComparisonCard.tsx` | WF5 |
| DistributionBarChart | `src/components/charts/DistributionBarChart.tsx` | WF8 |
| DistrictBoundaryLayer | `src/components/map/DistrictBoundaryLayer.tsx` | WF8 |
| HazardRadiusOverlay | `src/components/map/HazardRadiusOverlay.tsx` | WF7 |
| OfflineBanner | `src/components/offline/OfflineBanner.tsx` | WF9 |
| CachedBadge | `src/components/offline/CachedBadge.tsx` | WF9 |
| StalenessWarning | `src/components/offline/StalenessWarning.tsx` | WF9 |
| SyncQueue | `src/components/offline/SyncQueue.tsx` | WF9 |
| OfflineMapOverlay | `src/components/offline/OfflineMapOverlay.tsx` | WF9 |
| FeatureAdminPanel | `src/components/admin/FeatureAdminPanel.tsx` | WF10 |
| FeatureCard | `src/components/admin/FeatureCard.tsx` | WF10 |
| FeatureStatusBadge | `src/components/admin/FeatureStatusBadge.tsx` | WF10 |

### Hooks to Create

| Hook | Proposed Path | Purpose |
|------|---------------|---------|
| useBatchAssignment | `src/hooks/useBatchAssignment.ts` | Batch assignment state |
| useRouteOptimization | `src/hooks/useRouteOptimization.ts` | Route calculation |
| useOfflineStatus | `src/hooks/useOfflineStatus.ts` | Network/sync state |
| useFeatureFlags | `src/hooks/useFeatureFlags.ts` | Feature flag management |
| useSyncQueue | `src/hooks/useSyncQueue.ts` | Offline action queue |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-01-19 | Claude | Initial audit |
| 1.1 | 2026-01-19 | Claude | Added WF1-3 conformance assessments (files located), updated gap inventory (52 gaps), removed design blockers |

---

**Next Steps:**
1. Engineering lead to review and refine effort estimates
2. PM to create tickets from Gap Inventory (52 gaps identified)
3. Team to begin Phase A (Core Feature Implementation) for WF6, WF9, WF10
4. Assign engineers to Phase B work tracks based on specialization
