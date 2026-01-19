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

## Phase 1: Core Data Layer

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

## Phase 2: Traditional Mode UI

- [ ] **Task: Implement layout components**
    - [ ] Create `AppShell.tsx`, `Header.tsx`, `ListFirstLayout.tsx`
- [ ] **Task: Implement report list**
    - [ ] Create `ReportList.tsx`, `ReportListItem.tsx`, `ReportFilters.tsx`
- [ ] **Task: Implement report detail**
    - [ ] Create `ReportDetail.tsx`, `ReportActions.tsx`
- [ ] **Task: Implement crew assignment**
    - [ ] Create `CrewSelector.tsx`
- [ ] **Task: Implement map**
    - [ ] Create `MapView.tsx` (MapLibre wrapper)
    - [ ] Create `ReportMarker.tsx`
- [ ] **Task: Assemble Dashboard page**
    - [ ] Wire components together in `Dashboard.tsx`
- [ ] **Task: Conductor - User Manual Verification 'Phase 2: Traditional Mode UI'** (human review required)

## Phase 3: Moderate Mode UI

- [ ] **Task: Implement AI transparency components**
    - [ ] Create `ConfidenceIndicator.tsx` (4-level color system)
    - [ ] Create `ReasoningPanel.tsx` (expandable "Why?")
    - [ ] Create `AIBadge.tsx` ("AI Extracted" label)
    - [ ] Create `ExtractionDisplay.tsx` (wrapper with FeatureGates)
- [ ] **Task: Update ReportDetail for Moderate mode**
    - [ ] Add ExtractionDisplay with FeatureGates
- [ ] **Task: Update ReportListItem for Moderate mode**
    - [ ] Add inline confidence badge
- [ ] **Task: Verify mode switching preserves state**
- [ ] **Task: Conductor - User Manual Verification 'Phase 3: Moderate Mode UI'**

## Phase 4: Agentic Mode UI

- [ ] **Task: Implement map-first layout**
    - [ ] Create `MapFirstLayout.tsx` (25% sidebar, 50% map, 25% list)
- [ ] **Task: Implement spatial insights**
    - [ ] Create `SpatialInsightsSidebar.tsx`
    - [ ] Create `src/hooks/useSpatialInsights.ts` (mock data for now)
    - [ ] Create `src/mocks/insights.json`
- [ ] **Task: Implement marker clustering**
    - [ ] Create `MarkerCluster.tsx`
- [ ] **Task: Implement insight interaction**
    - [ ] Click insight → zoom map → highlight reports
- [ ] **Task: Update Dashboard for Agentic mode**
    - [ ] Render MapFirstLayout when `mode.features.mapPrimary`
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
