# Phase 4: Agentic Mode UI - Technical Specification

**Objective:** Implement the Agentic Mode UI with map-first layout and spatial insights.

---

## 1. Overview
Agentic Mode features a map-first layout designed for power users. It leverages AI-generated spatial insights to guide efficient trail maintenance triage.

### Key Differentiators
| Feature | Moderate | Agentic |
|---------|----------|---------|
| Layout | List-first (sidebar + map) | Map-first (25% / 50% / 25%) |
| Spatial Insights | Hidden | Visible sidebar (Left) |
| Marker Clustering | Individual markers | Clustered with counts |

---

## 2. Component Architecture

### Layout Hierarchy
```
Dashboard.tsx
├── AppShell
│   └── MapFirstLayout (NEW - when mode.features.mapPrimary === true)
│       ├── SpatialInsightsSidebar (NEW - 25% width, left)
│       │   ├── InsightCard (repeating)
│       │   └── EmptyInsightsState
│       ├── MapView (existing - 50% width, center)
│       │   └── MarkerCluster (NEW)
│       └── ReportList (existing - 25% width, right)
│           └── ReportCard
└── ReportDetail (slides up from bottom, existing)
```

### New Components

#### MapFirstLayout
*   **File:** `src/components/layout/MapFirstLayout.tsx`
*   **Purpose:** Three-column responsive layout.
*   **Grid:** 25% (Insights) / 50% (Map) / 25% (Reports) on Desktop.

#### SpatialInsightsSidebar
*   **File:** `src/components/map/SpatialInsightsSidebar.tsx`
*   **Purpose:** Display AI-generated insights.
*   **Interaction:** Clicking an insight zooms the map and filters the report list.

#### InsightCard
*   **File:** `src/components/map/InsightCard.tsx`
*   **Purpose:** Individual insight display.
*   **Content:** Icon, Title, Summary, Report Count, Confidence Score.

#### MarkerCluster
*   **File:** `src/components/map/MarkerCluster.tsx`
*   **Purpose:** Cluster nearby markers using MapLibre/Supercluster.

---

## 3. Data Flow

```
[Dashboard]
   │
   ├── [useSpatialInsights] -> Fetch Mock Data
   │
   ├── [MapFirstLayout]
   │      ├── [SpatialInsightsSidebar] (Left)
   │      │      └── onInsightClick -> setZoomTarget(bbox) & setFilter(ids)
   │      │
   │      ├── [MapView] (Center)
   │      │      └── onClusterClick -> Zoom In
   │      │
   │      └── [ReportList] (Right)
   │             └── filtered by selected insight
```

---

## 4. API & Data

### SpatialInsight Interface
(Already defined in `src/types/spatial.ts`)
```typescript
interface SpatialInsight {
  id: string;
  type: 'cluster' | 'pattern' | 'anomaly';
  title: string;
  summary: string;
  confidence: number;
  boundingBox: BoundingBox;
  reportIds: string[];
}
```

### Mock Data
Use `src/mocks/insights.json` for Phase 4. Backend integration is Phase 6.
