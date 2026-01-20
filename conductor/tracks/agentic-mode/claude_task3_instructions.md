# Task 3: Smart Marker Clustering

**Role:** Frontend Developer
**Objective:** Implement the interactive clustering layer that bridges the Map and the Agentic Insights.

## Context
We have the **Sidebar** (Agentic Insights) and the **Map** (MapLibre).
Now we need the **Smart Clusters** (Wireframe 2) that show on the map and react to user interaction.

## Specifications

### 1. `src/components/map/SmartMarkerCluster.tsx` (Create)
**Purpose:**
Render clustered report markers using MapLibre's built-in clustering capabilities, but with "Smart" hover interactions.

**Data Source:**
-   You will need report data. Create a simple hook `src/hooks/useReports.ts` that fetches from `/api/reports` (mocked in `handlers.ts`).
-   Convert these reports to a GeoJSON FeatureCollection.

**MapLibre Integration:**
-   Access the map instance via `useContext(MapContext)`.
-   Add a GeoJSON source with `cluster: true`.
-   Add layers:
    -   `clusters`: Circle layer (color-coded by severity if possible, or just standard cluster color).
    -   `cluster-count`: Symbol layer text.
    -   `unclustered-point`: Circle layer for single reports.

**"Smart" Interaction (The Wireframe 2 Feature):**
-   **Requirement:** When hovering a cluster for **>2 seconds**, show a "Preview" Insight Card floating near the cluster.
-   **Implementation:**
    -   `map.on('mouseenter', 'clusters', ...)`: Start a 2s timer.
    -   `map.on('mouseleave', 'clusters', ...)`: Clear the timer.
    -   If timer fires: Set state `hoveredClusterId`.
    -   Render a **Popup** (MapLibre Popup or absolute positioned div) containing a *mini version* of the `InsightCard`.
    -   *Simplify:* For the preview, you can just show "Cluster Detected: X Reports" text if full InsightCard is too complex for now, but aim for the InsightCard if possible.

### 2. Update `src/components/MapView.tsx` (Modify)
-   Ensure it exports `MapContext` (it already does).
-   Ensure it renders `children` inside the `MapContext.Provider` (it already does).

## Workflow
1.  **Hook:** Create `src/hooks/useReports.ts` (fetch from `/api/agentic/reports` if available, or `/api/reports`).
2.  **Component:** Create `src/components/map/SmartMarkerCluster.tsx`.
    -   Implement the source/layer logic.
    -   Implement the hover timer logic.
3.  **Integration:** Create a test wrapper or verify by importing it in `MapView` parent (later).
4.  **Test:** Create `src/components/map/SmartMarkerCluster.test.tsx`.

## Deliverables
-   `src/hooks/useReports.ts`
-   `src/components/map/SmartMarkerCluster.tsx`
-   `src/components/map/SmartMarkerCluster.test.tsx`
