# Implementation Plan: Wireframe Conformance & Feature Completion

**Track:** `wireframe-conformance`  
**Status:** Planned  
**Estimated Duration:** 8 weeks  
**Team Size:** 4-6 engineers

---

## Phase 4.2: Core Feature Implementation (Weeks 1-4)

**Goal:** Implement the three missing major features (WF6, WF9, WF10)

### A.1: Batch Assignment (WF6) — COMPLETE ✅

- [x] **Task: Create BatchAssignmentModal component** (P0, M) — `a5da08d`
    - [x] Create `src/components/assignment/BatchAssignmentModal.tsx`
    - [x] Implement modal structure with header "Assign {N} Reports"
    - [x] Add district selector with suggestion hint
    - [x] Add crew selector (populates based on district)
    - [x] Add report checklist display
    - [x] Add Cancel and Assign buttons
    - [x] Write unit tests (>80% coverage)
    - [x] Verify accessibility (keyboard nav, ARIA labels)

- [x] **Task: Create CrewContextCard component** (P0, M) — `a5da08d`
    - [x] Create `src/components/assignment/CrewContextCard.tsx`
    - [x] Display crew name
    - [x] Display recent performance indicator (excellent/good/fair/poor)
    - [x] Display last assignment date
    - [x] Display capacity percentage with color coding
    - [x] Update when crew selection changes
    - [x] Write unit tests

- [x] **Task: Create RouteSummary component** (P0, M) — `a5da08d`
    - [x] Create `src/components/assignment/RouteSummary.tsx`
    - [x] Display total distance in miles
    - [x] Display estimated travel time in hours
    - [x] Display estimated work time in hours
    - [x] Update when report selection changes
    - [x] Handle loading state
    - [x] Write unit tests

- [x] **Task: Create useBatchAssignment hook** (P0, M) — `120fee1`
    - [x] Create `src/hooks/useBatchAssignment.ts`
    - [x] Manage selected reports state
    - [x] Manage district/crew selection
    - [x] Provide route calculation (mock initially)
    - [x] Handle assignment submission
    - [x] Handle loading and error states
    - [x] Write unit tests (95.83% coverage)

- [x] **Task: Integrate BatchAssignmentModal with report selection** (P0, S) — `2be031e`
    - [x] Add multi-select checkboxes to report list (WF1)
    - [x] Add "Assign Crew" button to report list footer
    - [x] Connect button to open BatchAssignmentModal
    - [x] Pass selected reports to modal
    - [x] Write integration tests

- [x] **Task: Mock route optimization API** (P0, S) — `afffc50`
    - [x] Create mock API endpoint
    - [x] Return sample route data
    - [x] Document API contract for backend team
    - [x] Update when backend API ready

- [x] **Task: Integration testing for Batch Assignment** (P0, M) — `2be031e`
    - [x] E2E test: Select reports, assign to crew
    - [x] Test error handling
    - [x] Test loading states
    - [x] Verify accessibility (jest-axe passes)

- [x] **Task: Conductor - User Manual Verification 'Phase 4.2: Batch Assignment'** (P0, Checkpoint)
    - 573 tests passing, >80% coverage, zero accessibility violations

### A.2: Feature Admin (WF10) — Estimated: 1.5 weeks

- [ ] **Task: Create FeatureAdminPanel component** (P0, M)
    - [ ] Create `src/components/admin/FeatureAdminPanel.tsx`
    - [ ] Add header "Trust Calibration & Feature Management"
    - [ ] Implement grid layout for feature cards
    - [ ] Add responsive design
    - [ ] Add settings icon in header
    - [ ] Write unit tests

- [ ] **Task: Create FeatureCard component** (P0, M)
    - [ ] Create `src/components/admin/FeatureCard.tsx`
    - [ ] Display feature name
    - [ ] Display status badge (Enabled/Beta/Alpha/Disabled)
    - [ ] Display metric (adoption rate, users, etc.)
    - [ ] Display action buttons based on status
    - [ ] Add confirmation dialog for destructive actions
    - [ ] Write unit tests

- [ ] **Task: Create FeatureStatusBadge component** (P0, S)
    - [ ] Create `src/components/admin/FeatureStatusBadge.tsx`
    - [ ] Green for "Enabled"
    - [ ] Amber for "Beta"
    - [ ] Red for "Alpha"
    - [ ] Gray for "Disabled"
    - [ ] Consistent styling
    - [ ] Write unit tests

- [ ] **Task: Create useFeatureFlags hook** (P0, M)
    - [ ] Create `src/hooks/useFeatureFlags.ts`
    - [ ] Fetch feature flag states
    - [ ] Update feature flag states
    - [ ] Handle optimistic updates
    - [ ] Handle errors
    - [ ] Write unit tests

- [ ] **Task: Add /admin/features route with RBAC** (P1, M)
    - [ ] Add route `/admin/features`
    - [ ] Implement role-based access control (admin only)
    - [ ] Redirect non-admins to dashboard
    - [ ] Add to navigation for admin users
    - [ ] Write integration tests

- [ ] **Task: Mock feature flag API** (P0, S)
    - [ ] Create mock API endpoint
    - [ ] Return sample feature flag data
    - [ ] Document API contract for backend team
    - [ ] Update when backend API ready

- [ ] **Task: Integration testing for Feature Admin** (P0, M)
    - [ ] E2E test: Admin access, feature toggle
    - [ ] Test RBAC (non-admin blocked)
    - [ ] Test confirmation dialogs
    - [ ] Verify accessibility

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.2: Feature Admin'** (P0, Checkpoint)

### A.3: Offline Mode (WF9) — Estimated: 3 weeks

- [ ] **Task: Create OfflineBanner component** (P0, S)
    - [ ] Create `src/components/offline/OfflineBanner.tsx`
    - [ ] Orange banner with satellite icon
    - [ ] Display "OFFLINE MODE" text
    - [ ] Display relative time since last sync
    - [ ] Display pending sync item count
    - [ ] Hidden when online
    - [ ] Smooth show/hide animation
    - [ ] Write unit tests

- [ ] **Task: Create useOfflineStatus hook** (P0, M)
    - [ ] Create `src/hooks/useOfflineStatus.ts`
    - [ ] Detect online/offline status (navigator.onLine)
    - [ ] Track last sync timestamp
    - [ ] Track pending sync queue size
    - [ ] Provide manual sync trigger
    - [ ] Handle reconnection events
    - [ ] Write unit tests

- [ ] **Task: Create CachedBadge component** (P0, S)
    - [ ] Create `src/components/offline/CachedBadge.tsx`
    - [ ] Yellow "[CACHED]" text badge
    - [ ] Accessible (aria-label)
    - [ ] Write unit tests

- [ ] **Task: Create StalenessWarning component** (P0, S)
    - [ ] Create `src/components/offline/StalenessWarning.tsx`
    - [ ] Yellow warning with "[OFFLINE - STALE]" text
    - [ ] Explains data may not be current
    - [ ] Write unit tests

- [ ] **Task: Create SyncQueue component** (P0, M)
    - [ ] Create `src/components/offline/SyncQueue.tsx`
    - [ ] List pending actions with descriptions
    - [ ] Show "Queue for Sync" button
    - [ ] Progress indicator during sync
    - [ ] Handle sync failures gracefully
    - [ ] Write unit tests

- [ ] **Task: Create OfflineMapOverlay component** (P0, S)
    - [ ] Create `src/components/offline/OfflineMapOverlay.tsx`
    - [ ] Display "Live crew locations unavailable offline" message
    - [ ] Tablet-optimized layout
    - [ ] Write unit tests

- [ ] **Task: Implement service worker for offline caching** (P0, L)
    - [ ] Set up Workbox for service worker generation
    - [ ] Cache app shell for offline access
    - [ ] Cache API responses with stale-while-revalidate
    - [ ] Cache map tiles for offline viewing
    - [ ] Implement cache invalidation on version update
    - [ ] Add manual cache clear option
    - [ ] Test service worker registration

- [ ] **Task: Implement IndexedDB persistence layer** (P0, L)
    - [ ] Set up Dexie.js (or native IndexedDB)
    - [ ] Store reports locally
    - [ ] Store spatial insights locally
    - [ ] Store pending actions (sync queue)
    - [ ] Handle storage quota limits
    - [ ] Implement migration strategy for schema changes
    - [ ] Integrate with React Query persistence
    - [ ] Write unit tests

- [ ] **Task: Mock offline sync queue API** (P0, S)
    - [ ] Create mock API endpoint
    - [ ] Return sample sync queue data
    - [ ] Document API contract for backend team
    - [ ] Update when backend API ready

- [ ] **Task: E2E offline testing** (P0, L)
    - [ ] Test offline banner display
    - [ ] Test cached data display
    - [ ] Test staleness warnings
    - [ ] Test sync queue functionality
    - [ ] Test service worker caching
    - [ ] Test IndexedDB persistence
    - [ ] Test reconnection and sync

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.2: Offline Mode'** (P0, Checkpoint)

---

## Phase 4.3: Component Enhancements (Weeks 5-7)

**Goal:** Bring existing components to full wireframe conformance

### B.1: Dashboard Enhancements (WF1, WF2, WF3)

- [ ] **Task: Add report multi-select checkboxes (WF1)** (P0, S)
    - [ ] Add checkboxes to report list items
    - [ ] Implement multi-select state management
    - [ ] Update report list component
    - [ ] Write unit tests

- [ ] **Task: Add action buttons to report list (WF1)** (P0, S)
    - [ ] Add "Assign Crew" button to report list footer
    - [ ] Add "Extract Info" button to report list footer
    - [ ] Connect buttons to appropriate actions
    - [ ] Write unit tests

- [ ] **Task: Add trend level indicators to insight cards (WF1)** (P0, S)
    - [ ] Add "TREND (Low)", "PATTERN (High)" labels
    - [ ] Add icons for trend levels
    - [ ] Update InsightCard component
    - [ ] Write unit tests

- [ ] **Task: Add report count to right panel header (WF1)** (P0, S)
    - [ ] Update header to show "REPORTS (N)" with dynamic count
    - [ ] Write unit tests

- [ ] **Task: Create ClusterAlertCard with red border (WF2)** (P0, M)
    - [ ] Create `src/components/insights/ClusterAlertCard.tsx`
    - [ ] Red border styling
    - [ ] "CRITICAL SPATIAL ALERT" header
    - [ ] Weather context prominence
    - [ ] Write unit tests

- [ ] **Task: Add "Show AI Reasoning" expandable link (WF2)** (P0, S)
    - [ ] Add expandable section to ClusterAlertCard
    - [ ] Connect to ReasoningPanel
    - [ ] Write unit tests

- [ ] **Task: Create PulsingRadius map layer (WF2)** (P0, M)
    - [ ] Create `src/components/map/PulsingRadius.tsx`
    - [ ] Red animated circle with pulsing animation
    - [ ] "1 MILE RADIUS" label
    - [ ] MapLibre GL JS integration
    - [ ] Performance optimized
    - [ ] Write unit tests

- [ ] **Task: Add cluster-filtered report list view (WF2)** (P0, M)
    - [ ] Create filtered view mode
    - [ ] Update report list to show "CLUSTER REPORTS (N)"
    - [ ] Filter reports by cluster ID
    - [ ] Write unit tests

- [ ] **Task: Add "Assign Cluster" button (WF2)** (P0, S)
    - [ ] Add button to cluster alert card
    - [ ] Connect to batch assignment workflow
    - [ ] Write unit tests

- [ ] **Task: Implement spatial insights menu items (WF2)** (P0, M)
    - [ ] Add Heatmap Analysis option
    - [ ] Add Route Traffic option
    - [ ] Add Incident Trends option
    - [ ] Add Resource Allocation option
    - [ ] Write unit tests

- [ ] **Task: Add warning triangle icons to cluster markers (WF2)** (P0, S)
    - [ ] Update marker icons
    - [ ] Add warning triangle overlay
    - [ ] Write unit tests

- [ ] **Task: Add numbered section headers to report detail (WF3)** (P0, S)
    - [ ] Add "1. PHOTO SECTION" header
    - [ ] Add "2. AI CLASSIFICATION" header
    - [ ] Add "3. ASSIGNMENT" header
    - [ ] Add "4. ACTIONS" header
    - [ ] Update ReportDetail component
    - [ ] Write unit tests

- [ ] **Task: Add classification timestamp (WF3)** (P0, S)
    - [ ] Display "Classified: 8:16 AM" format
    - [ ] Update ReportDetail component
    - [ ] Write unit tests

- [ ] **Task: Add assignment reasoning text (WF3)** (P0, S)
    - [ ] Display "Based on N similar reports in District X"
    - [ ] Update ReportDetail component
    - [ ] Write unit tests

- [ ] **Task: Create left navigation menu for detail view (WF3)** (P0, M)
    - [ ] Create navigation sidebar
    - [ ] Add "Recent Reports" link
    - [ ] Add "Heatmaps" link
    - [ ] Add "Historical Data" link
    - [ ] Add "Asset Layers" link
    - [ ] Add "Boundaries" link
    - [ ] Write unit tests

- [ ] **Task: Create LocationHighlight map component (WF3)** (P1, M)
    - [ ] Create `src/components/map/LocationHighlight.tsx`
    - [ ] Blue radius highlighting selected location
    - [ ] Trail overlay on detail map
    - [ ] MapLibre GL JS integration
    - [ ] Write unit tests

- [ ] **Task: Rename action buttons to "Approve & Route" and "Edit" (WF3)** (P0, S)
    - [ ] Update button labels
    - [ ] Write unit tests

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.3: Dashboard Enhancements'** (P0, Checkpoint)

### B.2: Duplicate Detection Enhancement (WF5)

- [ ] **Task: Create DuplicateComparisonCard component** (P0, M)
    - [ ] Create `src/components/insights/DuplicateComparisonCard.tsx`
    - [ ] Yellow "POSSIBLE DUPLICATE" header with warning icon
    - [ ] Side-by-side layout
    - [ ] Similarity percentage prominently displayed
    - [ ] Write unit tests

- [ ] **Task: Add photo thumbnails to duplicate comparison** (P0, S)
    - [ ] Add photo thumbnails (or placeholders)
    - [ ] Lazy loading for images
    - [ ] Write unit tests

- [ ] **Task: Add GPS coordinates display** (P0, S)
    - [ ] Display GPS for both reports
    - [ ] Format coordinates clearly
    - [ ] Write unit tests

- [ ] **Task: Add description preview** (P0, S)
    - [ ] Display truncated descriptions for both reports
    - [ ] Write unit tests

- [ ] **Task: Add status badges** (P0, S)
    - [ ] Display "NEW" (blue), "ASSIGNED" (orange) badges
    - [ ] Write unit tests

- [ ] **Task: Add distance visualization** (P0, S)
    - [ ] Display "Distance: 15 meters" with arrow diagram
    - [ ] Write unit tests

- [ ] **Task: Add action buttons** (P0, S)
    - [ ] "Mark as Duplicate" button
    - [ ] "Keep Separate" button
    - [ ] "View Both on Map" button
    - [ ] Connect to callbacks
    - [ ] Write unit tests

- [ ] **Task: Create duplicate markers map layer** (P1, M)
    - [ ] Create map layer showing both markers
    - [ ] Dashed line connecting markers
    - [ ] MapLibre GL JS integration
    - [ ] Write unit tests

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.3: Duplicate Detection'** (P0, Checkpoint)

### B.3: Consistency Check Enhancement (WF8)

- [ ] **Task: Create DistributionBarChart component** (P0, M)
    - [ ] Create `src/components/charts/DistributionBarChart.tsx`
    - [ ] Horizontal bar chart
    - [ ] Shows expected vs actual distribution
    - [ ] Color-coded bars
    - [ ] Axis labels
    - [ ] Responsive sizing
    - [ ] Write unit tests

- [ ] **Task: Add explanations list to BiasInsight** (P0, S)
    - [ ] Add explanations array to ConsistencyCheckMetadata type
    - [ ] Display bulleted list of possible causes
    - [ ] Update BiasInsight component
    - [ ] Write unit tests

- [ ] **Task: Add action buttons to BiasInsight** (P0, S)
    - [ ] "View Coverage Map" button
    - [ ] "Acknowledge" button
    - [ ] "Dismiss" button
    - [ ] Connect to callbacks
    - [ ] Write unit tests

- [ ] **Task: Create DistrictBoundaryLayer map component** (P1, M)
    - [ ] Create `src/components/map/DistrictBoundaryLayer.tsx`
    - [ ] GeoJSON polygon rendering
    - [ ] Blue outline for active districts
    - [ ] Orange outline for inactive districts
    - [ ] Labels for district names
    - [ ] Toggle visibility
    - [ ] MapLibre GL JS integration
    - [ ] Write unit tests

- [ ] **Task: Update BiasInsight styling to yellow alert card** (P0, S)
    - [ ] Update card styling to match wireframe
    - [ ] Yellow border and background
    - [ ] Warning icon
    - [ ] Write unit tests

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.3: Consistency Check'** (P0, Checkpoint)

### B.4: High-Risk Enhancement (WF7)

- [ ] **Task: Add 4th checklist item to HighRiskConfirmation** (P0, S)
    - [ ] Add "Severity appropriate" checkbox
    - [ ] Update HighRiskConfirmation component
    - [ ] Write unit tests

- [ ] **Task: Add justification textarea to HighRiskConfirmation** (P0, S)
    - [ ] Add textarea with "Enter mandatory justification" placeholder
    - [ ] Minimum 50 character validation
    - [ ] Character counter display
    - [ ] Update component state
    - [ ] Write unit tests

- [ ] **Task: Update button disabled logic** (P0, S)
    - [ ] Require all 4 checkboxes checked
    - [ ] Require justification >= 50 characters
    - [ ] Update button state
    - [ ] Write unit tests

- [ ] **Task: Create HazardRadiusOverlay map component** (P1, M)
    - [ ] Create `src/components/map/HazardRadiusOverlay.tsx`
    - [ ] Red semi-transparent circle
    - [ ] Pulsing animation (CSS or JS)
    - [ ] Configurable radius
    - [ ] Center on hazard coordinates
    - [ ] Performance optimized
    - [ ] MapLibre GL JS integration
    - [ ] Write unit tests

- [ ] **Task: Add hazard icon markers** (P1, S)
    - [ ] Add bridge icon for bridge hazards
    - [ ] Add other hazard-specific icons
    - [ ] Update marker rendering
    - [ ] Write unit tests

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.3: High-Risk'** (P0, Checkpoint)

### B.5: AI Reasoning Enhancement (WF4)

- [ ] **Task: Add step numbering to ReasoningPanel** (P0, S)
    - [ ] Display "Step 1:", "Step 2:", etc.
    - [ ] Style step numbers prominently
    - [ ] Maintain current status indicator
    - [ ] Update ReasoningPanel component
    - [ ] Write unit tests

- [ ] **Task: Add tool name to ReasoningStep interface** (P0, S)
    - [ ] Add `toolName` field to ReasoningStep type
    - [ ] Update ReasoningPanel to display tool name
    - [ ] Update mock data
    - [ ] Write unit tests

- [ ] **Task: Add alternative classifications display** (P1, S)
    - [ ] Display "Primary: TRACS 245 (89%)"
    - [ ] Display "Alternative: TRACS 242 (8%)"
    - [ ] Update ReasoningPanel component
    - [ ] Write unit tests

- [ ] **Task: Add "View Full Audit Log" link** (P1, S)
    - [ ] Add link to ReasoningPanel
    - [ ] Connect to audit log view
    - [ ] Write unit tests

- [ ] **Task: Create 2-column report detail layout (Optional, P2)** (P2, M)
    - [ ] Create 2-column layout wrapper
    - [ ] Report Overview in left column
    - [ ] AI Reasoning in right column
    - [ ] Responsive (stacks on mobile)
    - [ ] Write unit tests

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.3: AI Reasoning'** (P0, Checkpoint)

---

## Phase 4.4: Polish & Integration (Week 8)

**Goal:** Final integration, testing, and documentation

- [ ] **Task: Visual QA against all wireframes** (P0, M)
    - [ ] Compare WF1 implementation to wireframe
    - [ ] Compare WF2 implementation to wireframe
    - [ ] Compare WF3 implementation to wireframe
    - [ ] Compare WF4 implementation to wireframe
    - [ ] Compare WF5 implementation to wireframe
    - [ ] Compare WF6 implementation to wireframe
    - [ ] Compare WF7 implementation to wireframe
    - [ ] Compare WF8 implementation to wireframe
    - [ ] Compare WF9 implementation to wireframe
    - [ ] Compare WF10 implementation to wireframe
    - [ ] Document any deviations with rationale
    - [ ] Capture screenshots for documentation

- [ ] **Task: Accessibility audit (WCAG 2.1 AA)** (P0, M)
    - [ ] Run jest-axe tests (zero violations)
    - [ ] Manual keyboard navigation testing
    - [ ] Screen reader testing (VoiceOver, NVDA)
    - [ ] Verify focus indicators visible
    - [ ] Document and fix any violations

- [ ] **Task: Responsive testing (mobile/tablet)** (P0, M)
    - [ ] Test on iPhone (Safari)
    - [ ] Test on iPad (Safari)
    - [ ] Test on Android (Chrome)
    - [ ] Verify touch targets adequate (44x44px)
    - [ ] Verify text readable without zooming
    - [ ] Document any issues

- [ ] **Task: Performance profiling** (P1, S)
    - [ ] Run Lighthouse audit
    - [ ] Profile initial load time
    - [ ] Profile interaction response times
    - [ ] Profile map rendering performance
    - [ ] Document results and optimizations

- [ ] **Task: Update component documentation** (P1, M)
    - [ ] Update JSDoc comments for all new components
    - [ ] Update Storybook stories (if applicable)
    - [ ] Update AGENTIC_UI_ENGINEERING_GUIDE.md
    - [ ] Document API integrations

- [ ] **Task: Update WIREFRAME_CATALOG.md with implementation status** (P0, S)
    - [ ] Mark all wireframes as "Implemented"
    - [ ] Add implementation notes
    - [ ] Link to component documentation

- [ ] **Task: Final integration testing** (P0, M)
    - [ ] End-to-end test: Full user workflow
    - [ ] Test all three UI modes (Traditional, Moderate, Agentic)
    - [ ] Test offline mode workflow
    - [ ] Test batch assignment workflow
    - [ ] Test feature admin workflow
    - [ ] Verify no regressions

- [ ] **Task: Conductor - User Manual Verification 'Phase 4.4: Polish & Integration'** (P0, Checkpoint)

---

## Summary

**Total Tasks:** ~80 tasks across 3 phases  
**Estimated Duration:** 8 weeks  
**Team Size:** 4-6 engineers  
**Checkpoints:** 8 phase completion checkpoints

**Phase Breakdown:**
- Phase 4.2: ~25 tasks (4 weeks)
- Phase 4.3: ~45 tasks (3 weeks)
- Phase 4.4: ~8 tasks (1 week)

**Success Criteria:**
- 100% wireframe conformance
- Zero accessibility violations
- Performance targets met
- >80% test coverage
- Production ready

---

**Plan Version:** 1.0  
**Last Updated:** 2026-01-20  
**Author:** Strategic Planning (Claude Code)

---

## Track Sequencing

**UI Consolidation Migration:** This track (wireframe conformance) should be completed **BEFORE** the UI consolidation migration track. 

**Rationale:**
- Wireframe conformance implements features (WF6, WF9, WF10) that work in both current and consolidated architectures
- Refactoring 25+ files is easier once all features are implemented and tested
- Avoids rework and provides stable foundation for consolidation
- See `conductor/tracks.yaml` for full track dependencies
