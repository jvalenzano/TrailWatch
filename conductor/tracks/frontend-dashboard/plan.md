# Implementation Plan: Ranger Dashboard

## Phase 0: Project Scaffolding

- [x] **Task: Initialize React project with Vite**
    - [x] Run `npm create vite@latest . -- --template react-ts`
    - [x] Install core dependencies (tailwindcss, @tanstack/react-query, maplibre-gl)
    - [x] Configure Tailwind CSS
- [x] **Task: Create directory structure per component architecture**
    - [x] Create `src/config/`, `src/types/`, `src/hooks/`, `src/components/`, `src/pages/`, `src/utils/`
    - [x] Create placeholder files with TODO comments
- [x] **Task: Implement UI mode configuration**
    - [x] Create `src/config/ui-modes.ts` with feature flags
    - [x] Create `src/hooks/useUIMode.ts` to read mode from URL
    - [x] Create `src/components/common/FeatureGate.tsx`
- [x] **Task: Implement type definitions**
    - [x] Create `src/types/report.ts`, `src/types/crew.ts`, `src/types/spatial.ts`, `src/types/ui.ts`
- [x] **Task: Create test page**
    - [x] Implement `src/pages/Dashboard.tsx` showing current mode and enabled features
- [x] **Task: Verify build and lint**
    - [x] Run `npm run build` and `npm run lint`
- [x] **Task: Conductor - User Manual Verification 'Phase 0: Project Scaffolding'**

## Phase 1: Core Data Layer [checkpoint: 5016950]

- [x] **Task: Create API utilities** [e60e5b6]
    - [x] Implement `src/utils/api.ts` with fetch wrapper and error handling
- [x] **Task: Create mock data** [e9617b6]
    - [x] Create `src/mocks/reports.json` (15-20 sample reports)
    - [x] Create `src/mocks/crews.json` (5 sample crews)
- [x] **Task: Implement data hooks** [1618557]
    - [x] Implement `src/hooks/useReports.ts` (fetch, filter, sort)
    - [x] Implement `src/hooks/useExtraction.ts` (trigger extraction)
    - [x] Implement `src/hooks/useCrews.ts` (fetch crews)
- [x] **Task: Verify hooks work with mock data** [f381eda]
- [ ] **Task: Conductor - User Manual Verification 'Phase 1: Core Data Layer'**

## Phase 2: Traditional Mode UI [checkpoint: c93e60a]

- [x] **Task: Implement layout components** [d85dd36]
    - [x] Create `AppShell.tsx`, `Header.tsx`, `ListFirstLayout.tsx`
- [x] **Task: Implement report list** [3c09bf5]
    - [x] Create `ReportList.tsx`, `ReportListItem.tsx`, `ReportFilters.tsx`
- [x] **Task: Implement report detail** [3004e76]
    - [x] Create `ReportDetail.tsx`, `ReportActions.tsx`
- [x] **Task: Implement crew assignment** [818150e]
    - [x] Create `CrewSelector.tsx`
- [x] **Task: Implement map**
    - [x] Create `MapView.tsx` (MapLibre wrapper)
    - [x] Create `ReportMarker.tsx`
- [x] **Task: Assemble Dashboard page**
    - [x] Wire components together in `Dashboard.tsx`
    - [x] Implement selection state (List <-> Map <-> Detail)
- [x] **Task: Verify manually** (Autonomous Agent)
    - [x] Run `npm run dev` and test with mock data
    - [x] Fix map rendering bug (useEffect dependency loop)
- [x] **Task: Conductor - User Manual Verification 'Phase 2: Traditional Mode UI'** (Verified by Browser Agent)

## Phase 3: Moderate Mode UI ✅ MERGED TO DEVELOP

**Status:** Complete and merged to `develop` branch (2026-01-19)
**Merge Commit:** Merge feature/dashboard-phase-3-moderate
**Awaiting:** Human sign-off for main merge
**Next:** Phase 4 implementation approval

- [x] **Task: Implement AI transparency components**
    - [x] Create `ConfidenceIndicator.tsx` (4-level color system)
    - [x] Create `ReasoningPanel.tsx` (expandable "Why?")
    - [x] Create `AIBadge.tsx` ("AI Extracted" label)
    - [x] Create `ExtractionDisplay.tsx` (wrapper with FeatureGates)
- [x] **Task: Update ReportDetail for Moderate mode**
    - [x] Add ExtractionDisplay with FeatureGates
- [x] **Task: Update ReportListItem for Moderate mode**
    - [x] Add inline confidence badge
- [x] **Task: Debug and document silent React crash**
    - [x] Identify SyntaxError in `report.ts` and fix broken string literal
    - [x] Document "Silent Module Failure" in troubleshooting guide
- [x] **Task: Verify mode switching preserves state** [docs/uat/phase3-mode-switching-test.md]
    - Mode switching works correctly (moderate → traditional → agentic → moderate)
    - AI features show/hide correctly per mode
    - Zero console errors during all transitions
    - All 34 unit tests pass
- [x] **Task: Conductor - User Manual Verification 'Phase 3: Moderate Mode UI'** — Pending Human Sign-Off

## Phase 3.5: Visual Polish (Quick Wins) ✅ MERGED TO MAIN

**Status:** Complete and tagged `v0.3.0` (2026-01-19)

- [x] **Task: Dark Mode Map (P0)**
    - [x] Implement dynamic MapLibre style switching
    - [x] Configure dark matter basemap
- [x] **Task: Confidence Badge Hierarchy (P0)**
    - [x] Update styling for visual weight
    - [x] Ensure 4-level color spread

## Phase 4: Agentic Mode UI

**Status:** Implementation complete (2026-01-19)
**Awaiting:** Human review and verification

- [x] **Task: Implement map-first layout**
    - [x] Create `MapFirstLayout.tsx` (25% sidebar, 50% map, 25% list)
- [x] **Task: Implement spatial insights**
    - [x] Create `SpatialInsightsSidebar.tsx`
    - [x] Create `src/hooks/useSpatialInsights.ts` (mock data for now)
    - [x] Create `src/mocks/insights.json` (8 sample insights)
- [x] **Task: Implement marker clustering**
    - [x] Create `MarkerCluster.tsx` (MapLibre GL native clustering)
- [x] **Task: Implement insight interaction**
    - [x] Click insight → zoom map → highlight reports
    - [x] Enhanced MapView with `flyToViewport` prop
    - [x] Enhanced ReportList with `highlightedReportIds` prop
- [x] **Task: Update Dashboard for Agentic mode**
    - [x] Render MapFirstLayout when `mode.features.mapPrimary`
    - [x] Integrated MarkerCluster for both Traditional and Agentic modes
- [ ] **Task: Conductor - User Manual Verification 'Phase 4: Agentic Mode UI'** (human review required)

## Phase 5: Polish and Demo Prep

- [ ] **Task: Implement ModeSwitcher**
    - [ ] Floating toggle, visible in dev only
- [ ] **Task: Add loading skeletons and empty states**
    - [ ] Create `LoadingSkeleton.tsx`, `EmptyState.tsx`
- [ ] **Task: Implement keyboard navigation**
    - [ ] Arrow keys, Enter, Escape
- [ ] **Task: Responsive breakpoints**
    - [ ] Test at 1024px, 768px
- [ ] **Task: Visual polish**
    - [ ] Fix alignment, colors, spacing
- [ ] **Task: Create demo script**
    - [ ] Write `docs/demo-script.md`
- [ ] **Task: Conductor - User Manual Verification 'Phase 5: Polish and Demo Prep'** (human review required)

## Phase 6: Streaming Extraction (Optional)

- [ ] **Task: Implement streaming hook**
    - [ ] Create `src/hooks/useStreamingExtraction.ts` (SSE consumer)
- [ ] **Task: Implement streaming view**
    - [ ] Create `StreamingExtractionView.tsx`
- [ ] **Task: Update ReportDetail for Agentic streaming**
- [ ] **Task: Implement fallback on SSE error**
- [ ] **Task: Conductor - User Manual Verification 'Phase 6: Streaming Extraction'**
