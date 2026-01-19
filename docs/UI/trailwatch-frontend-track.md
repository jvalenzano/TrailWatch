# TrailWatch Frontend Track Definition

## Track Metadata
- **Track ID:** FRONTEND-001
- **Track Name:** Ranger Dashboard (Multi-Mode Agentic UI)
- **Status:** Ready for Implementation
- **Created:** January 2026
- **Dependencies:** Intake Agent Track (Phase 3 complete), Component Architecture Spec
- **Owner:** Jason (Human-in-the-Loop)
- **Executor:** Anti-Gravity (AI Development Assistant)

---

## 1. Track Overview

### 1.1 Objective

Build a React-based ranger dashboard that:
- Consumes Intake Agent extraction API
- Supports three UI modes (Traditional, Moderate, Agentic) from single codebase
- Enables progressive disclosure of AI capabilities via feature flags
- Deploys to GCP Cloud Run alongside Intake Agent

### 1.2 Success Criteria

| Criterion | Measurement |
|-----------|-------------|
| Core triage workflow functional | Ranger can view, filter, and approve reports in all modes |
| Mode switching works | URL parameter changes layout and feature visibility instantly |
| AI transparency visible | Confidence and reasoning display correctly in Moderate/Agentic modes |
| Demo-ready | Can walk stakeholder through all three modes with real data |
| No backend changes required | Frontend consumes existing Intake Agent API without modifications |

### 1.3 Constraints

- **Stack:** React 18+, TypeScript, Tailwind CSS
- **Map:** Google Maps JavaScript API (FedRAMP-compatible)
- **Data Fetching:** React Query or SWR (team preference)
- **No external AI services:** All AI happens in Intake Agent backend
- **Offline:** Out of scope for this track (future track)

### 1.4 Reference Documents

| Document | Location | Purpose |
|----------|----------|---------|
| Component Architecture | `docs/trailwatch-component-architecture.md` | Component structure, interfaces, data flow |
| UI Strategy | `docs/TrailWatch_UI_Strategy.docx` | Strategic rationale for three-mode approach |
| Intake Agent API | `docs/intake-agent-api.md` | Backend contract (extraction response schema) |
| GEMINI.md | `GEMINI.md` | Coding standards, patterns |

---

## 2. Phase Definitions

### Phase 0: Project Scaffolding

**Objective:** Establish project structure, tooling, and configuration. No functional UI yet.

**Scope:**
- Initialize React project (Vite or Create React App)
- Configure TypeScript, ESLint, Prettier
- Set up Tailwind CSS
- Create directory structure per Component Architecture spec
- Implement `ui-modes.ts` configuration
- Implement `useUIMode` hook
- Implement `FeatureGate` component
- Create placeholder components for all items in architecture spec
- Verify build and dev server work

**Deliverables:**
```
src/
├── config/ui-modes.ts           ✓ Implemented with all mode definitions
├── hooks/useUIMode.ts           ✓ Implemented, reads from URL
├── components/common/FeatureGate.tsx  ✓ Implemented
├── components/[all others]      ✓ Placeholder files with TODO comments
├── types/[all]                  ✓ Type definitions from architecture spec
└── pages/Dashboard.tsx          ✓ Placeholder, renders mode name
```

**Checkpoint Criteria:**
- [ ] `npm run dev` starts without errors
- [ ] `npm run build` completes without errors
- [ ] `npm run lint` passes
- [ ] Navigating to `/?mode=traditional`, `/?mode=moderate`, `/?mode=agentic` shows different mode name on screen
- [ ] `FeatureGate` correctly shows/hides children based on mode
- [ ] All type definitions match Intake Agent API contract

**Estimated Duration:** 1-2 days

---

### Phase 1: Core Data Layer

**Objective:** Implement data fetching hooks that connect to Intake Agent API. No UI rendering yet.

**Scope:**
- Implement `useReports` hook (fetch list, filtering, pagination)
- Implement `useExtraction` hook (trigger extraction, standard request/response)
- Implement `useCrews` hook (fetch available crews)
- Create mock data for local development (when backend unavailable)
- Implement basic error handling and loading states

**Deliverables:**
```
src/
├── hooks/
│   ├── useReports.ts            ✓ Fetches from /api/reports
│   ├── useExtraction.ts         ✓ POSTs to /api/extract
│   └── useCrews.ts              ✓ Fetches from /api/crews
├── mocks/
│   ├── reports.json             ✓ 10-20 sample reports with extractions
│   └── crews.json               ✓ 3-5 sample crews
└── utils/
    └── api.ts                   ✓ Base fetch wrapper with error handling
```

**Checkpoint Criteria:**
- [ ] `useReports` returns typed report list (from mock or real API)
- [ ] `useExtraction` triggers extraction and returns typed result
- [ ] `useCrews` returns typed crew list
- [ ] Loading states work (hook returns `isLoading: true` during fetch)
- [ ] Error states work (hook returns `error` object on failure)
- [ ] Console shows no TypeScript errors

**Estimated Duration:** 2-3 days

---

### Phase 2: Traditional Mode UI

**Objective:** Build fully functional dashboard in Traditional mode. This is the baseline.

**Scope:**
- Implement `ListFirstLayout` (list primary, map secondary)
- Implement `ReportList` with sorting and filtering
- Implement `ReportListItem` 
- Implement `ReportDetail` (citizen submission + extraction, NO confidence/reasoning yet)
- Implement `ReportFilters` (hazard type, date range, urgency)
- Implement `ReportActions` (approve, assign, resolve buttons)
- Implement `CrewSelector` dropdown
- Implement basic `MapView` showing report markers
- Implement `ReportMarker`

**UI Behavior (Traditional Mode):**
- List view is 60% width, map is 40%
- Clicking report in list highlights on map
- Clicking marker on map selects report in list
- Detail panel slides up from bottom on selection
- No confidence indicators, no reasoning panel, no AI badges

**Deliverables:**
```
src/
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         ✓ Header + content area
│   │   ├── ListFirstLayout.tsx  ✓ List (60%) + Map (40%)
│   │   └── Header.tsx           ✓ App title, mode indicator
│   ├── reports/
│   │   ├── ReportList.tsx       ✓ Sortable table
│   │   ├── ReportListItem.tsx   ✓ Single row
│   │   ├── ReportDetail.tsx     ✓ Full view (no AI transparency)
│   │   ├── ReportFilters.tsx    ✓ Filter controls
│   │   └── ReportActions.tsx    ✓ Action buttons
│   ├── assignment/
│   │   └── CrewSelector.tsx     ✓ Dropdown
│   └── map/
│       ├── MapView.tsx          ✓ Google Maps wrapper
│       └── ReportMarker.tsx     ✓ Pin component
└── pages/
    └── Dashboard.tsx            ✓ Assembles Traditional mode
```

**Checkpoint Criteria:**
- [ ] Dashboard loads with report list populated
- [ ] Can filter reports by hazard type
- [ ] Can sort reports by date, urgency
- [ ] Clicking report shows detail panel
- [ ] Detail panel shows citizen photo, text, GPS
- [ ] Detail panel shows extraction result (hazard type, TRACS code, urgency)
- [ ] No confidence indicator visible (feature flag off)
- [ ] No reasoning panel visible (feature flag off)
- [ ] Map shows markers for all reports
- [ ] Clicking marker selects report
- [ ] Can assign crew via dropdown
- [ ] Can approve report (calls API, updates list)
- [ ] `?mode=traditional` renders this layout

**Estimated Duration:** 5-7 days

---

### Phase 3: Moderate Mode UI

**Objective:** Add AI transparency layer on top of Traditional mode.

**Scope:**
- Implement `ConfidenceIndicator` (4-level color system)
- Implement `ReasoningPanel` (expandable "Why?" section)
- Implement `AIBadge` ("AI Extracted" label)
- Modify `ReportDetail` to include these components (gated by feature flags)
- Modify `ReportListItem` to show confidence badge inline

**UI Behavior (Moderate Mode):**
- Same layout as Traditional (list primary)
- Confidence indicator appears next to hazard type
- "AI Extracted" badge appears in detail panel
- "Why did AI classify this?" expandable panel appears below extraction

**Deliverables:**
```
src/
├── components/
│   ├── extraction/
│   │   ├── ExtractionDisplay.tsx    ✓ Wrapper for extraction result
│   │   ├── ConfidenceIndicator.tsx  ✓ 4-level badge
│   │   ├── ReasoningPanel.tsx       ✓ Expandable "Why?"
│   │   └── AIBadge.tsx              ✓ Attribution label
│   ├── reports/
│   │   ├── ReportDetail.tsx         ✓ Updated with FeatureGates
│   │   └── ReportListItem.tsx       ✓ Updated with confidence badge
```

**Checkpoint Criteria:**
- [ ] `?mode=moderate` shows confidence indicator in list and detail
- [ ] Confidence colors match spec (Gray/Yellow/Green/Dark Green)
- [ ] Clicking "Why?" expands reasoning panel
- [ ] Reasoning panel shows AI-generated explanation
- [ ] "AI Extracted" badge visible in detail panel
- [ ] `?mode=traditional` still hides all AI transparency
- [ ] Switching modes does not lose selected report

**Estimated Duration:** 3-4 days

---

### Phase 4: Agentic Mode UI (Map-First)

**Objective:** Implement map-primary layout and spatial insights sidebar.

**Scope:**
- Implement `MapFirstLayout` (map primary, list secondary, sidebar)
- Implement `SpatialInsightsSidebar` (placeholder insights for now)
- Implement `useSpatialInsights` hook (mock data initially)
- Modify `MapView` to support zoom-to-bounds on insight click
- Implement `MarkerCluster` for dense report areas

**UI Behavior (Agentic Mode):**
- Map is 50% width (center), list is 25% (right), sidebar is 25% (left)
- Sidebar shows "3 Insights About Your Data"
- Clicking insight zooms map to relevant area, highlights reports
- All Moderate features still visible

**Deliverables:**
```
src/
├── components/
│   ├── layout/
│   │   └── MapFirstLayout.tsx       ✓ Map-primary arrangement
│   ├── map/
│   │   ├── SpatialInsightsSidebar.tsx  ✓ Insights list
│   │   └── MarkerCluster.tsx        ✓ Clustered markers
├── hooks/
│   └── useSpatialInsights.ts        ✓ Fetches insights (mock for now)
```

**Checkpoint Criteria:**
- [ ] `?mode=agentic` shows map-primary layout
- [ ] Sidebar appears on left with insight cards
- [ ] Clicking insight zooms map to relevant area
- [ ] Highlighted reports are visually distinct on map
- [ ] Marker clustering works for dense areas
- [ ] List is still functional (smaller, but scrollable)
- [ ] All Moderate features (confidence, reasoning) still visible
- [ ] `?mode=moderate` and `?mode=traditional` still work correctly

**Estimated Duration:** 5-7 days

---

### Phase 5: Polish and Demo Prep

**Objective:** Refine UX, add demo tooling, prepare for stakeholder presentation.

**Scope:**
- Implement `ModeSwitcher` component (floating toggle for non-prod)
- Add loading skeletons for better perceived performance
- Add empty states ("No reports match your filters")
- Implement keyboard navigation (arrow keys in list, Escape to close detail)
- Add responsive breakpoints (tablet view)
- Create demo script document with talking points per mode
- Fix any visual bugs found in review

**Deliverables:**
```
src/
├── components/
│   ├── layout/
│   │   └── ModeSwitcher.tsx         ✓ Floating mode toggle
│   ├── common/
│   │   ├── LoadingSkeleton.tsx      ✓ Placeholder loaders
│   │   └── EmptyState.tsx           ✓ No results message
docs/
└── demo-script.md                   ✓ Presentation talking points
```

**Checkpoint Criteria:**
- [ ] ModeSwitcher appears in development, hidden in production
- [ ] No layout jank during loading (skeletons appear)
- [ ] Empty states appear when filters return no results
- [ ] Can navigate list with keyboard
- [ ] Tablet viewport (768px-1024px) is usable
- [ ] Demo script covers all three modes with sample narrative
- [ ] All three modes demo-ready for stakeholder

**Estimated Duration:** 3-4 days

---

### Phase 6: Streaming Extraction (Agentic Enhancement)

**Objective:** Add real-time streaming extraction for Agentic mode.

**Prerequisites:** 
- Intake Agent supports SSE endpoint (`/api/extract/stream`)
- SSE event types documented

**Scope:**
- Implement `useStreamingExtraction` hook (SSE consumer)
- Implement `StreamingExtractionView` component
- Modify `ReportDetail` to use streaming in Agentic mode
- Add visual animation showing "AI thinking"
- Implement graceful fallback if SSE fails

**Deliverables:**
```
src/
├── hooks/
│   └── useStreamingExtraction.ts    ✓ SSE consumer hook
├── components/
│   ├── extraction/
│   │   └── StreamingExtractionView.tsx  ✓ Real-time display
```

**Checkpoint Criteria:**
- [ ] In Agentic mode, new extractions stream in real-time
- [ ] Partial results appear as events arrive (hazard type first, then details)
- [ ] Animation indicates AI is processing
- [ ] On SSE error, falls back to standard extraction display
- [ ] In Traditional/Moderate modes, standard extraction still used
- [ ] Latency from upload to first visible result < 2 seconds

**Estimated Duration:** 4-5 days

**Note:** This phase can be deferred. Phases 0-5 deliver a fully functional demo without streaming.

---

## 3. Validation Requirements

### 3.1 Per-Phase Validation

Before marking any phase complete, Anti-Gravity must:

1. **Self-Test:** Run the checkpoint criteria manually, document pass/fail
2. **Build Verification:** `npm run build` succeeds with no errors
3. **Lint Verification:** `npm run lint` passes with no warnings
4. **Type Check:** `npm run typecheck` (if configured) passes
5. **Document Deviations:** If any spec was modified, document why

### 3.2 Human Review Gates

The following phases require Jason's review before proceeding:

| Phase | Review Type | What Jason Checks |
|-------|-------------|-------------------|
| Phase 0 | Async | Directory structure matches spec, types are correct |
| Phase 2 | Sync (demo) | Traditional mode workflow feels right, map works |
| Phase 4 | Sync (demo) | Agentic layout is impressive, insights interaction works |
| Phase 5 | Sync (demo) | Full demo walkthrough with mode switching |

### 3.3 Integration Testing

Before final delivery:
- Test with real Intake Agent API (not just mocks)
- Test with 50+ reports to verify performance
- Test mode switching 10+ times to verify no state leaks
- Test on Chrome, Firefox, Safari (Edge optional)

---

## 4. Technical Decisions (Pre-Authorized)

Anti-Gravity may make the following decisions without escalation:

| Decision Area | Guidance |
|---------------|----------|
| Component library | Prefer headless (Radix, Headless UI) over styled (MUI, Chakra) |
| State management | React Query for server state; useState/useReducer for UI state; no Redux |
| CSS approach | Tailwind utility classes; avoid CSS-in-JS |
| Animation | CSS transitions preferred; Framer Motion acceptable for complex cases |
| Icons | Lucide React or Heroicons |
| Date handling | date-fns (not Moment) |

### 4.1 Escalate to Jason

- Any deviation from Component Architecture spec
- Adding new dependencies not listed above
- Changing API contract (frontend should never require backend changes)
- Scope additions not in phase definition
- Performance issues that might require architecture changes

---

## 5. Communication Protocol

### 5.1 Progress Updates

At end of each phase:
- Summary of what was built
- List of checkpoint criteria with pass/fail status
- Any blockers or questions for Jason
- Estimated timeline for next phase

### 5.2 Blockers

If blocked:
- Document the blocker clearly
- Propose 2-3 potential solutions
- State which solution Anti-Gravity recommends and why
- Wait for Jason's decision before proceeding

### 5.3 Artifacts

All code changes should be committed with:
- Clear commit messages referencing phase number
- Example: `[FRONTEND-001/P2] Implement ReportList with sorting and filtering`

---

## 6. Timeline Summary

| Phase | Duration | Cumulative | Milestone |
|-------|----------|------------|-----------|
| Phase 0: Scaffolding | 1-2 days | 2 days | Project builds, modes switch |
| Phase 1: Data Layer | 2-3 days | 5 days | Hooks fetch data |
| Phase 2: Traditional UI | 5-7 days | 12 days | **MVP: Functional triage** |
| Phase 3: Moderate UI | 3-4 days | 16 days | AI transparency visible |
| Phase 4: Agentic UI | 5-7 days | 23 days | **Demo-ready: All modes** |
| Phase 5: Polish | 3-4 days | 27 days | Stakeholder presentation |
| Phase 6: Streaming | 4-5 days | 32 days | Full agentic experience |

**Critical Path:** Phases 0-4 are sequential. Phase 5 can partially overlap with Phase 4 review. Phase 6 is optional/deferrable.

**MVP Gate:** After Phase 2, system is usable for basic triage.
**Demo Gate:** After Phase 5, system is ready for stakeholder presentation.

---

## 7. Open Items (Require Jason Decision)

1. **React Query vs SWR:** Both work. React Query has more features; SWR is simpler. Recommendation: React Query for caching flexibility. **Decision needed before Phase 1.**

2. **Spatial Insights Backend:** Phase 4 uses mock insights. Real insights require backend endpoint. Is this in Intake Agent scope, or separate service? **Decision needed before Phase 4.**

3. **Deployment Target:** Local development only for this track, or include Cloud Run deployment? **Decision needed before Phase 5.**

4. **Testing Framework:** Jest + React Testing Library, or Vitest? Recommendation: Vitest (faster, native ESM). **Decision needed before Phase 2.**

---

*This track definition is designed for use with Gemini CLI conductor patterns. Each phase should be executed as a discrete work unit with checkpoint validation before proceeding.*
