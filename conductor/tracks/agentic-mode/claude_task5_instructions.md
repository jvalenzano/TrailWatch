# Task 5: Final Dashboard Integration (Phase 4)

**Role:** Frontend Developer
**Objective:** Wire up all Phase 4 components into the main Agentic Dashboard, ensuring the 20/60/20 layout and correct data flow.

## Context
We have implemented:
1. `MapFirstLayout` (20/60/20 responsive grid)
2. `SpatialInsightsSidebar` + `InsightCard`
3. `SmartMarkerCluster` (with 2s hover preview)
4. `ReasoningPanel` (in `ReportDetail`)

Now we need to integrate these into the main application.

## Specifications

### 1. Refactor `src/pages/AgenticDashboard.tsx`
**Purpose:** Switch from the legacy sandbox layout to the production-ready Phase 4 layout.

**Changes:**
-   **Layout Switch:** Replace `AgenticLayout` with `layout/MapFirstLayout.tsx` (the one with `insightPanel`, `mapPanel`, and `reportPanel` props).
-   **Component Mapping:**
    -   `insightPanel`: Render `SpatialInsightsSidebar`.
    -   `mapPanel`: Render `MapView` containing `SmartMarkerCluster`.
    -   `reportPanel`: Render the side-by-side (or vertical) `ReportList` and `ReportDetail`.
-   **Data Sync:**
    -   Ensure `selectedReportId` logic works across the list, map, and detail view.
    -   Ensure `selectedInsightId` from the sidebar highlights markers on the map (via `SmartMarkerCluster` props if added, or a shared hook).
-   **Persistence:** Since `AgenticDashboard` is currently the only user of `AgenticLayout`'s persistence logic, and `MapFirstLayout` is stateless, ensure that switching modes (Traditional <-> Agentic) remains smooth.

### 2. Update `src/components/map/SmartMarkerCluster.tsx` (If needed)
-   Accept `highlightedReportIds` and `selectedReportId` as props to show "Selected" vs "Highlighted" states (e.g., emerald for highlighted, pulsing for selected).
-   Ensure it integrates with the `onReportClick` callback to update the dashboard state.

### 3. Verify `src/pages/Dashboard.tsx`
-   Ensure the entry point correctly renders the refactored `AgenticDashboard`.

## Workflow
1.  **Audit:** Read `AgenticDashboard.tsx` carefully to see how it currently handles state (scenarios, selection).
2.  **Implementation:** Perform the swap.
3.  **Verification:** Run the app (or tests) to ensure:
    -   The grid is exactly 20/60/20 on desktop.
    -   Hovering a cluster for 2s shows the preview.
    -   Selecting an insight in the sidebar zooms the map.
    -   Selecting a report shows the `ReasoningPanel` in the detail view.

## Deliverables
-   Refactored `src/pages/AgenticDashboard.tsx`
-   Any necessary updates to `SmartMarkerCluster.tsx` or `SpatialInsightsSidebar.tsx` for prop wiring.
