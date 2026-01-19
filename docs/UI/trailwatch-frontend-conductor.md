# TrailWatch Frontend Conductor Workflow

## Workflow Metadata
```yaml
workflow_id: FRONTEND-001
workflow_name: Ranger Dashboard (Multi-Mode Agentic UI)
version: 1.0.0
created: 2026-01-18
owner: Jason
executor: Anti-Gravity
status: ready_for_execution
```

---

## Context Loading

Before executing any phase, Anti-Gravity must load these documents into context:

```yaml
required_context:
  - path: docs/trailwatch-component-architecture.md
    purpose: Component structure, interfaces, data flow
    sections_critical:
      - "Section 2: Directory Structure"
      - "Section 3: Component Specifications"
      - "Section 5: API Contract Reference"
  
  - path: docs/trailwatch-frontend-track.md
    purpose: Phase definitions, checkpoint criteria, timelines
    sections_critical:
      - "Section 2: Phase Definitions"
      - "Section 4: Technical Decisions"
  
  - path: GEMINI.md
    purpose: Coding standards, patterns, conventions
    sections_critical:
      - All (project-wide standards apply)

optional_context:
  - path: docs/intake-agent-api.md
    purpose: Backend API contract (if available)
  
  - path: docs/TrailWatch_UI_Strategy.docx
    purpose: Strategic rationale (reference only)
```

---

## Global Rules

These rules apply to ALL phases:

```yaml
global_rules:
  code_style:
    - Use TypeScript strict mode
    - Use functional components with hooks
    - Use Tailwind CSS for styling (no CSS-in-JS)
    - Follow naming conventions in GEMINI.md
  
  commit_format:
    pattern: "[FRONTEND-001/P{phase}] {description}"
    examples:
      - "[FRONTEND-001/P0] Initialize React project with Vite"
      - "[FRONTEND-001/P2] Implement ReportList with sorting"
  
  validation_required:
    - npm run build must succeed
    - npm run lint must pass
    - TypeScript must compile without errors
  
  escalation_triggers:
    - Deviation from Component Architecture spec
    - New dependencies not in pre-authorized list
    - API contract changes required
    - Scope additions not in phase definition
    - Performance issues affecting architecture
```

---

## Phase Execution Protocol

### How to Execute a Phase

```
1. LOAD context documents
2. READ phase definition from track document
3. CONFIRM understanding of scope and deliverables
4. EXECUTE implementation
5. VALIDATE against checkpoint criteria
6. DOCUMENT results
7. IF human_review_required: WAIT for approval
8. PROCEED to next phase
```

---

## Phase 0: Project Scaffolding

### Entry Criteria
```yaml
entry:
  - Track approved by Jason
  - Context documents available
  - Development environment ready (Node.js 18+)
```

### Execution Instructions

```markdown
## Task: Initialize TrailWatch Frontend Project

### Step 1: Create Project
- Initialize new React project using Vite with TypeScript template
- Project name: `trailwatch-dashboard`

### Step 2: Install Dependencies
Core dependencies:
- react, react-dom (included with Vite)
- typescript (included with Vite)
- tailwindcss, postcss, autoprefixer
- @tanstack/react-query (confirmed: React Query over SWR)
- @types/google.maps

Dev dependencies:
- eslint, prettier
- vitest, @testing-library/react (confirmed: Vitest over Jest)

### Step 3: Create Directory Structure
Create all directories and placeholder files per Component Architecture Section 2.
Each placeholder file should contain:
```typescript
// TODO: Implement in Phase {N}
// See: docs/trailwatch-component-architecture.md Section 3.{X}
export {};
```

### Step 4: Implement Core Config
Implement these files fully (not placeholders):
- src/config/ui-modes.ts (per Architecture Section 3.1)
- src/hooks/useUIMode.ts (per Architecture Section 3.2)
- src/components/common/FeatureGate.tsx (per Architecture Section 3.3)
- src/types/*.ts (all type definitions from Architecture Section 5)

### Step 5: Create Test Page
Implement src/pages/Dashboard.tsx to display:
- Current mode name from URL parameter
- List of enabled features for current mode
- Verification that mode switching works

### Step 6: Validate
Run all checkpoint criteria. Document results.
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P0-1
    test: "npm run dev starts without errors"
    validation: manual
  
  - id: P0-2
    test: "npm run build completes without errors"
    validation: command
    command: "npm run build"
    expect: exit_code_0
  
  - id: P0-3
    test: "npm run lint passes"
    validation: command
    command: "npm run lint"
    expect: exit_code_0
  
  - id: P0-4
    test: "Mode switching works via URL"
    validation: manual
    steps:
      - Navigate to /?mode=traditional
      - Verify "Traditional" mode displayed
      - Navigate to /?mode=moderate
      - Verify "Moderate" mode displayed
      - Navigate to /?mode=agentic
      - Verify "Agentic" mode displayed
  
  - id: P0-5
    test: "FeatureGate correctly shows/hides content"
    validation: manual
    steps:
      - In traditional mode, verify showConfidence features hidden
      - In moderate mode, verify showConfidence features visible
  
  - id: P0-6
    test: "Type definitions match API contract"
    validation: review
    check: "Types in src/types/ align with Architecture Section 5"
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: async
  review_focus:
    - Directory structure matches spec
    - Types are correct
    - Mode switching works
  deliverable: "Phase 0 completion report with checkpoint results"
```

---

## Phase 1: Core Data Layer

### Entry Criteria
```yaml
entry:
  - Phase 0 complete and approved
  - API contract confirmed (mock or real)
```

### Execution Instructions

```markdown
## Task: Implement Data Fetching Hooks

### Step 1: Create API Utilities
Implement src/utils/api.ts:
- Base fetch wrapper with error handling
- Type-safe request/response handling
- Environment-based URL configuration (local vs deployed)

### Step 2: Create Mock Data
Create src/mocks/reports.json:
- 15-20 sample reports
- Variety of hazard types (rock_fall, erosion, flooding, etc.)
- Range of confidence values (0.4 to 0.95)
- Include reasoning text for each
- GPS coordinates in realistic range

Create src/mocks/crews.json:
- 5 sample crews
- Include skills, location, availability

### Step 3: Implement useReports Hook
File: src/hooks/useReports.ts
- Fetch from /api/reports (or mock)
- Support filtering by hazard type, urgency, date range
- Support sorting by date, urgency
- Return { reports, isLoading, error, refetch }
- Use React Query for caching

### Step 4: Implement useExtraction Hook
File: src/hooks/useExtraction.ts
- POST to /api/extract
- Accept reportId parameter
- Return { extract, isLoading, error }
- Standard request/response (not streaming yet)

### Step 5: Implement useCrews Hook
File: src/hooks/useCrews.ts
- Fetch from /api/crews (or mock)
- Return { crews, isLoading, error }
- Long cache TTL (1 hour)

### Step 6: Validate
Test each hook in isolation. Verify loading/error states.
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P1-1
    test: "useReports returns typed report list"
    validation: manual
    steps:
      - Call useReports in test component
      - Verify reports array is populated
      - Verify TypeScript types are correct
  
  - id: P1-2
    test: "useExtraction triggers extraction"
    validation: manual
    steps:
      - Call extract function with reportId
      - Verify extraction result returned
      - Verify loading state transitions correctly
  
  - id: P1-3
    test: "useCrews returns typed crew list"
    validation: manual
  
  - id: P1-4
    test: "Loading states work"
    validation: manual
    steps:
      - Verify isLoading=true during fetch
      - Verify isLoading=false after completion
  
  - id: P1-5
    test: "Error states work"
    validation: manual
    steps:
      - Simulate API failure
      - Verify error object populated
  
  - id: P1-6
    test: "No TypeScript errors"
    validation: command
    command: "npx tsc --noEmit"
    expect: exit_code_0
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: none
  deliverable: "Phase 1 completion report"
```

---

## Phase 2: Traditional Mode UI

### Entry Criteria
```yaml
entry:
  - Phase 1 complete
  - Google Maps API key available
```

### Execution Instructions

```markdown
## Task: Build Traditional Mode Dashboard

This is the MVP milestone. Focus on functional completeness over polish.

### Step 1: Implement Layout Components
- src/components/layout/AppShell.tsx (header + content area)
- src/components/layout/Header.tsx (app title, mode indicator badge)
- src/components/layout/ListFirstLayout.tsx (60% list, 40% map)

### Step 2: Implement Report List
- src/components/reports/ReportList.tsx (sortable table)
- src/components/reports/ReportListItem.tsx (single row)
- src/components/reports/ReportFilters.tsx (hazard type, date, urgency)

Table columns: Date, Hazard Type, Location, Urgency, Status
Sorting: Click column header to sort
Filtering: Dropdowns above table

### Step 3: Implement Report Detail
- src/components/reports/ReportDetail.tsx
- Shows citizen submission (photo, text, GPS)
- Shows extraction result (hazard type, TRACS code, urgency)
- NO confidence indicator (feature flag off in Traditional)
- NO reasoning panel (feature flag off in Traditional)
- Slides up from bottom on report selection

### Step 4: Implement Report Actions
- src/components/reports/ReportActions.tsx
- Approve button (calls API, updates status)
- Assign button (opens crew selector)
- Resolve button (marks complete)

### Step 5: Implement Crew Assignment
- src/components/assignment/CrewSelector.tsx
- Dropdown populated from useCrews
- Selection triggers API call

### Step 6: Implement Map
- src/components/map/MapView.tsx (Google Maps wrapper)
- src/components/map/ReportMarker.tsx (pin per report)
- Markers colored by hazard type or urgency
- Click marker = select report in list
- Click report in list = highlight marker on map

### Step 7: Assemble Dashboard
- src/pages/Dashboard.tsx
- Use ListFirstLayout
- Wire up all components
- Verify ?mode=traditional renders correctly

### Step 8: Validate
Run through full triage workflow manually.
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P2-1
    test: "Dashboard loads with report list"
    validation: manual
  
  - id: P2-2
    test: "Can filter by hazard type"
    validation: manual
  
  - id: P2-3
    test: "Can sort by date and urgency"
    validation: manual
  
  - id: P2-4
    test: "Clicking report shows detail panel"
    validation: manual
  
  - id: P2-5
    test: "Detail shows citizen photo, text, GPS"
    validation: manual
  
  - id: P2-6
    test: "Detail shows extraction (hazard, TRACS, urgency)"
    validation: manual
  
  - id: P2-7
    test: "No confidence indicator visible"
    validation: manual
    note: "Feature flag off in Traditional mode"
  
  - id: P2-8
    test: "No reasoning panel visible"
    validation: manual
    note: "Feature flag off in Traditional mode"
  
  - id: P2-9
    test: "Map shows markers for all reports"
    validation: manual
  
  - id: P2-10
    test: "Clicking marker selects report"
    validation: manual
  
  - id: P2-11
    test: "Can assign crew via dropdown"
    validation: manual
  
  - id: P2-12
    test: "Can approve report"
    validation: manual
    steps:
      - Click approve
      - Verify API called
      - Verify list updates
  
  - id: P2-13
    test: "?mode=traditional renders this layout"
    validation: manual
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: sync_demo
  review_focus:
    - Workflow feels intuitive
    - Map interaction works smoothly
    - No major UX issues
  milestone: "MVP - Functional triage capability"
  deliverable: "Phase 2 demo + completion report"
```

---

## Phase 3: Moderate Mode UI

### Entry Criteria
```yaml
entry:
  - Phase 2 complete and approved by Jason
```

### Execution Instructions

```markdown
## Task: Add AI Transparency Layer

### Step 1: Implement Confidence Indicator
- src/components/extraction/ConfidenceIndicator.tsx
- 4-level color system (per Architecture Section 3.5)
- Props: value (0-1), size, showLabel
- Tooltip shows exact percentage

### Step 2: Implement Reasoning Panel
- src/components/extraction/ReasoningPanel.tsx
- Expandable "Why did AI classify this?"
- Collapsed by default
- Props: reasoning (string), defaultExpanded

### Step 3: Implement AI Badge
- src/components/extraction/AIBadge.tsx
- Simple "AI Extracted" label
- Subtle styling (not distracting)

### Step 4: Implement Extraction Display Wrapper
- src/components/extraction/ExtractionDisplay.tsx
- Composes ConfidenceIndicator, ReasoningPanel, AIBadge
- Uses FeatureGate for conditional rendering

### Step 5: Update ReportDetail
- Add ExtractionDisplay component
- Wrap AI components in FeatureGate
- Verify Traditional mode unchanged

### Step 6: Update ReportListItem
- Add inline confidence badge
- Use FeatureGate so Traditional mode unaffected

### Step 7: Validate Mode Switching
- Verify Traditional hides all AI components
- Verify Moderate shows all AI components
- Verify switching modes preserves selection state
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P3-1
    test: "?mode=moderate shows confidence in list"
    validation: manual
  
  - id: P3-2
    test: "?mode=moderate shows confidence in detail"
    validation: manual
  
  - id: P3-3
    test: "Confidence colors match spec"
    validation: manual
    spec: "Gray <50%, Yellow 50-74%, Green 75-89%, Dark Green 90%+"
  
  - id: P3-4
    test: "Clicking 'Why?' expands reasoning"
    validation: manual
  
  - id: P3-5
    test: "Reasoning shows AI explanation"
    validation: manual
  
  - id: P3-6
    test: "'AI Extracted' badge visible"
    validation: manual
  
  - id: P3-7
    test: "?mode=traditional still hides AI components"
    validation: manual
  
  - id: P3-8
    test: "Mode switching preserves selection"
    validation: manual
    steps:
      - Select report in Traditional
      - Switch to Moderate
      - Verify same report still selected
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: none
  deliverable: "Phase 3 completion report"
```

---

## Phase 4: Agentic Mode UI

### Entry Criteria
```yaml
entry:
  - Phase 3 complete
```

### Execution Instructions

```markdown
## Task: Implement Map-Primary Layout with Spatial Insights

### Step 1: Implement MapFirstLayout
- src/components/layout/MapFirstLayout.tsx
- 25% sidebar (left), 50% map (center), 25% list (right)
- Responsive: collapses gracefully on smaller screens

### Step 2: Implement Spatial Insights Sidebar
- src/components/map/SpatialInsightsSidebar.tsx
- Shows "3 Insights About Your Data"
- Each insight is a clickable card
- Props: insights array, onInsightClick handler

### Step 3: Implement useSpatialInsights Hook
- src/hooks/useSpatialInsights.ts
- For now: return mock insights data
- Mock should include cluster, trend, anomaly types
- Future: will call real backend endpoint

### Step 4: Create Mock Insights Data
- src/mocks/insights.json
- 3-5 sample insights
- Include boundingBox for map zoom
- Include reportIds for highlighting

### Step 5: Implement Insight Interaction
- Click insight → map zooms to boundingBox
- Reports in insight are visually highlighted
- Sidebar shows which insight is active

### Step 6: Implement MarkerCluster
- src/components/map/MarkerCluster.tsx
- Groups dense markers
- Click cluster → zoom in or expand

### Step 7: Update Dashboard for Agentic Mode
- src/pages/Dashboard.tsx
- Check mode.features.mapPrimary
- Render MapFirstLayout if true, ListFirstLayout if false

### Step 8: Validate All Three Modes
- Traditional: list-primary, no AI
- Moderate: list-primary, AI visible
- Agentic: map-primary, AI visible, sidebar visible
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P4-1
    test: "?mode=agentic shows map-primary layout"
    validation: manual
  
  - id: P4-2
    test: "Sidebar appears with insight cards"
    validation: manual
  
  - id: P4-3
    test: "Clicking insight zooms map"
    validation: manual
  
  - id: P4-4
    test: "Highlighted reports visually distinct"
    validation: manual
  
  - id: P4-5
    test: "Marker clustering works"
    validation: manual
  
  - id: P4-6
    test: "List is functional (scrollable, clickable)"
    validation: manual
  
  - id: P4-7
    test: "Moderate features still visible"
    validation: manual
    note: "Confidence, reasoning, AI badge all present"
  
  - id: P4-8
    test: "Traditional and Moderate modes unchanged"
    validation: manual
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: sync_demo
  review_focus:
    - Layout is visually impressive
    - Insight interaction feels intuitive
    - All three modes work correctly
  milestone: "Demo-ready: All modes functional"
  deliverable: "Phase 4 demo + completion report"
```

---

## Phase 5: Polish and Demo Prep

### Entry Criteria
```yaml
entry:
  - Phase 4 complete and approved by Jason
```

### Execution Instructions

```markdown
## Task: Refine UX and Prepare for Stakeholder Demo

### Step 1: Implement ModeSwitcher
- src/components/layout/ModeSwitcher.tsx
- Floating panel (bottom-right corner)
- Dropdown to select mode
- Only visible in development (check NODE_ENV)

### Step 2: Add Loading Skeletons
- src/components/common/LoadingSkeleton.tsx
- Skeleton variants for: list item, detail panel, map
- Use in place of spinners for better perceived performance

### Step 3: Add Empty States
- src/components/common/EmptyState.tsx
- "No reports match your filters"
- "No insights available"
- Friendly messaging with suggested actions

### Step 4: Implement Keyboard Navigation
- Arrow keys navigate report list
- Enter selects highlighted report
- Escape closes detail panel
- Document shortcuts in UI (tooltip or help panel)

### Step 5: Responsive Breakpoints
- Test at 1024px, 768px widths
- Ensure layouts degrade gracefully
- Mobile: single column, detail as modal

### Step 6: Visual Bug Fixes
- Review all three modes
- Fix alignment issues, color inconsistencies
- Ensure consistent spacing

### Step 7: Create Demo Script
- docs/demo-script.md
- Talking points for each mode
- Suggested flow: Traditional → Moderate → Agentic
- Key messages to emphasize
- Anticipated questions and answers

### Step 8: Final Validation
- Full walkthrough in each mode
- Test mode switching repeatedly
- Verify no console errors
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P5-1
    test: "ModeSwitcher appears in dev only"
    validation: manual
  
  - id: P5-2
    test: "No layout jank during loading"
    validation: manual
  
  - id: P5-3
    test: "Empty states appear when appropriate"
    validation: manual
  
  - id: P5-4
    test: "Keyboard navigation works"
    validation: manual
  
  - id: P5-5
    test: "Tablet viewport usable"
    validation: manual
    viewport: "768px - 1024px"
  
  - id: P5-6
    test: "Demo script complete"
    validation: review
  
  - id: P5-7
    test: "All three modes demo-ready"
    validation: manual
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: sync_demo
  review_focus:
    - Full demo walkthrough
    - Mode switching narrative
    - Ready for stakeholder presentation
  milestone: "Stakeholder presentation ready"
  deliverable: "Phase 5 demo + demo script + completion report"
```

---

## Phase 6: Streaming Extraction (Optional)

### Entry Criteria
```yaml
entry:
  - Phase 5 complete
  - Intake Agent SSE endpoint available
  - SSE event types documented
```

### Execution Instructions

```markdown
## Task: Add Real-Time Streaming Extraction

### Step 1: Implement useStreamingExtraction Hook
- src/hooks/useStreamingExtraction.ts
- Connect to SSE endpoint /api/extract/stream
- Parse event types (START, HAZARD_TYPE, TRACS_CODE, etc.)
- Accumulate partial state
- Handle errors and reconnection

### Step 2: Implement StreamingExtractionView
- src/components/extraction/StreamingExtractionView.tsx
- Show partial results as they arrive
- Animate "AI thinking" state
- Transition to final display on COMPLETE event

### Step 3: Update ReportDetail for Agentic
- Check mode.features.useStreaming
- If true and extraction in progress: show StreamingExtractionView
- If false or extraction complete: show standard ExtractionDisplay

### Step 4: Implement Fallback
- If SSE connection fails, fall back to standard request/response
- Show subtle error indicator
- Log for debugging

### Step 5: Validate
- Test with real SSE endpoint
- Verify partial results appear progressively
- Verify fallback works on connection failure
```

### Checkpoint Criteria
```yaml
checkpoints:
  - id: P6-1
    test: "Agentic mode streams extraction"
    validation: manual
  
  - id: P6-2
    test: "Partial results appear progressively"
    validation: manual
    sequence: "Hazard type → TRACS → Urgency → Reasoning"
  
  - id: P6-3
    test: "Animation indicates processing"
    validation: manual
  
  - id: P6-4
    test: "Fallback works on SSE error"
    validation: manual
  
  - id: P6-5
    test: "Traditional/Moderate use standard extraction"
    validation: manual
  
  - id: P6-6
    test: "Latency < 2 seconds to first result"
    validation: manual
```

### Exit Criteria
```yaml
exit:
  all_checkpoints_pass: true
  human_review: sync_demo
  milestone: "Full agentic experience complete"
  deliverable: "Phase 6 demo + completion report"
```

---

## Completion Report Template

After each phase, Anti-Gravity produces this report:

```markdown
# Phase {N} Completion Report

## Summary
- Phase: {name}
- Duration: {actual days}
- Status: {complete|blocked|partial}

## Checkpoint Results

| ID | Test | Result | Notes |
|----|------|--------|-------|
| P{N}-1 | {description} | ✅ Pass / ❌ Fail | {notes} |
| ... | ... | ... | ... |

## Deviations from Spec
- {any changes made and why}

## Blockers Encountered
- {any issues and how resolved}

## Questions for Jason
- {any decisions needed}

## Next Phase Readiness
- [ ] All checkpoints pass
- [ ] Human review complete (if required)
- [ ] Ready to proceed to Phase {N+1}
```

---

## Appendix: Pre-Authorized Dependencies

```yaml
dependencies:
  core:
    - react: "^18.0.0"
    - react-dom: "^18.0.0"
    - typescript: "^5.0.0"
  
  styling:
    - tailwindcss: "^3.0.0"
    - postcss: "*"
    - autoprefixer: "*"
  
  data_fetching:
    - "@tanstack/react-query": "^5.0.0"
  
  maps:
    - "@types/google.maps": "*"
  
  utilities:
    - date-fns: "^3.0.0"
    - clsx: "*"
  
  icons:
    - lucide-react: "*"
    # OR
    - "@heroicons/react": "*"
  
  testing:
    - vitest: "*"
    - "@testing-library/react": "*"
    - "@testing-library/jest-dom": "*"
  
  dev:
    - eslint: "*"
    - prettier: "*"
    - "@typescript-eslint/eslint-plugin": "*"
    - "@typescript-eslint/parser": "*"

not_authorized:
  - Redux, MobX, Zustand (use React Query + useState)
  - styled-components, emotion (use Tailwind)
  - Moment.js (use date-fns)
  - Mapbox GL JS (use Google Maps for FedRAMP)
  - Any component library (MUI, Chakra, Ant) without approval
```

---

*This conductor workflow is designed for Gemini CLI execution with human-in-the-loop validation gates.*
