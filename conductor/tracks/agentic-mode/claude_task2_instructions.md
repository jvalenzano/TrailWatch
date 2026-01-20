# Task 2: Spatial Insights & Synthetic Data

**Role:** Frontend Developer
**Objective:** Implement the "Golden Dataset" hook and the Spatial Insights sidebar that consumes it.

## Context
We have the layout (`MapFirstLayout`). Now we need the *data* and *sidebar content* to populate the Left Panel (20%).
Reference: `docs/UI/_!_SYNTHETIC_DATA_PLAN.md` (Golden Dataset) and `docs/UI/WIREFRAME_CATALOG.md` (WF1, WF2).

---

## Part A: Data Layer (The "Golden Dataset")

### 1. `src/types/spatial.ts` (Create/Update)
Define the core interfaces:
```typescript
export interface SpatialInsight {
  id: string;
  type: 'cluster_alert' | 'consistency_check' | 'duplicate_detection';
  title: string;
  summary: string;
  confidence: number;
  /** Relevant entities for this insight */
  entities: {
    reportIds: string[];
    trailId?: string;
  };
  /** Textual reasoning trace */
  reasoning: Array<{
    step: string;
    status: 'success' | 'warning' | 'info';
    detail: string;
  }>;
  /** Suggested actions */
  actions: Array<{
    label: string;
    type: 'primary' | 'secondary';
    actionId: string;
  }>;
}
```

### 2. `src/hooks/useSpatialInsights.ts` (Create)
Implement the hook that expects no arguments and returns the **Golden Dataset**.
**Requirement:** Return **hardcoded mock data** matching "Pattern A" (Cluster) and "Pattern B" (Consistency).

**Mock Data Content (Minimum):**
1.  **Cluster Alert (Pattern A):**
    -   Title: "Hazard Cluster Detected"
    -   Subtitle: "4 obstructions on Wonderland Trail"
    -   Confidence: 0.89
    -   Reasoning: "Spatial proximity (<1mi), similar time window, weather correlation."
2.  **Consistency Check (Pattern B):**
    -   Title: "Assignment Bias Detected"
    -   Subtitle: "District 3 overloaded"
    -   Confidence: 0.75

---

## Part B: UI Components

### 3. `src/components/map/InsightCard.tsx` (Create)
-   **Visuals:** Dark card, subtle border (`border-gray-700`), distinct header.
-   **Props:** `{ insight: SpatialInsight; onAction: (id: string) => void; }`
-   **Behavior:** Render title, summary, mock reasoning steps (collapsed by default?), and action buttons.

### 4. `src/components/map/SpatialInsightsSidebar.tsx` (Create)
-   **Purpose:** The container for the Left Panel.
-   **Logic:**
    -   Call `useSpatialInsights()`.
    -   Map results to `InsightCard` components.
    -   Handle empty states.

---

## Workflow (Steps)

1.  **Types & Hook:** Create `src/types/spatial.ts` and `src/hooks/useSpatialInsights.ts`.
2.  **Test Hook:** Simple test to ensure it returns the mock data.
3.  **Component TDD:** Create `src/components/map/SpatialInsightsSidebar.test.tsx`.
    -   Test that it renders the insights from the hook.
4.  **Implement Components:** Build `InsightCard` and `SpatialInsightsSidebar`.
5.  **Manual Check:** We will verify this renders in the `MapFirstLayout` left panel later.

## Deliverables
- `src/hooks/useSpatialInsights.ts`
- `src/components/map/InsightCard.tsx`
- `src/components/map/SpatialInsightsSidebar.tsx`
