# Implementation Plan - Phase 4: Agentic Mode UI

## User Review Required
> [!IMPORTANT]
> **Map Clustering Strategy**: Initial implementation uses MapLibre's built-in clustering. We will migrate to `supercluster` if performance degrades with >1000 markers.

## Proposed Changes

### Layout Components
#### [NEW] [src/components/layout/MapFirstLayout.tsx](file:///src/components/layout/MapFirstLayout.tsx)
- 3-column responsive grid (Insights / Map / Report List).
- **Desktop Grid:** 20% (Insights) / 60% (Map) / 20% (Reports).
- **Responsive:** Stack vertically on mobile/tablet.

### Spatial Insights
#### [NEW] [src/components/map/SpatialInsightsSidebar.tsx](file:///src/components/map/SpatialInsightsSidebar.tsx)
- Sidebar to display insight cards.
#### [NEW] [src/components/map/InsightCard.tsx](file:///src/components/map/InsightCard.tsx)
- Base card component with specific variants:
    - `ClusterAlertCard` (Pattern A)
    - `ConsistencyCheckCard` (Pattern B)
    - `DuplicateDetectionCard`
#### [NEW] [src/hooks/useSpatialInsights.ts](file:///src/hooks/useSpatialInsights.ts)
- Hook to load "Golden Dataset" (Synthetic Data) mock.

### Map Enhancements
#### [NEW] [src/components/map/SmartMarkerCluster.tsx](file:///src/components/map/SmartMarkerCluster.tsx)
- Clustering logic for map markers.
- Hover > 2s triggers InsightCard preview.

### Dashboard Integration
#### [MODIFY] [src/pages/Dashboard.tsx](file:///src/pages/Dashboard.tsx)
- Add conditional rendering for `MapFirstLayout` based on agentic mode.

## Verification Plan

### Automated Tests
- [ ] `MapFirstLayout` responsive tests.
- [ ] `SpatialInsightsSidebar` rendering tests.
- [ ] `useSpatialInsights` hook tests.

### Manual Verification
1. Switch to Agentic Mode.
2. Verify 3-column layout.
3. Click an insight -> Verify map zoom and list filter.
