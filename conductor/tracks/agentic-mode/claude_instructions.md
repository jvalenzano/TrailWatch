# Session Kickoff: Phase 4 Agentic UI

**Role & Context**
You are the **Lead Frontend Engineer** for TrailWatch.
We are beginning **Phase 4: Agentic Mode UI**.
- **Current Branch:** `feature/dashboard-phase-4-agentic`
- **Goal:** Implement the "Map-First" power-user interface.
- **Reference:** `docs/UI/WIREFRAME_CATALOG.md`

## 1. Wireframe to Implementation Mapping

| Wireframe | Task / Component | Description |
|-----------|------------------|-------------|
| **[WF1] Spatial Baseline** | **Task 1: `MapFirstLayout`** | The structural shell. Strict 20/60/20 grid. Dark mode. |
| **[WF2] Cluster Alert** | Task 2: `ClusterAlertCard`<br>Task 3: `SmartMarkerCluster` | "Pattern A". Red pulsing map cluster + sidebar card. |
| **[WF3] Report Detail** | Task 4: `ReportDetail` | High-confidence report view enhancement. |
| **[WF4] Reasoning** | Task 4: `ReasoningPanel` | Transparent 4-step logic chain display. |
| **[WF5] Duplicates** | Task 2: `DuplicateDetectionCard` | Side-by-side photo comparison (Similarity > 90%). |
| **[WF8] Consistency** | Task 2: `ConsistencyCheckCard` | "Pattern B" bias detection graphic. |

---

## TASK 1: Implement `MapFirstLayout` ([WF1])

**Objective:**
Build the responsive grid shell that precisely matches the visual intent of **Wireframe 1 (WF1)**.

### Visual Specification (from WF1)
1.  **Layout Geometry (20/60/20):**
    - The interface is split into three distinct vertical zones.
    - **Left Sidebar (20%):** "Spatial Insights" - Dark gray background, distinct vertical separation.
    - **Center Map (60%):** The primary focus. Occupies the majority of the screen.
    - **Right Sidebar (20%):** "Reports & Actions" - Mirroring the left sidebar width.
2.  **Theme:**
    - **Dark Mode Only:** Ensure backgrounds are deep grays (e.g., `bg-gray-900`) to match the "Command Center" aesthetic shown in the wireframe.
    - **Borders:** Subtle separation (e.g., `border-gray-800`).

### Technical Specifications
1.  **File:** `src/components/layout/MapFirstLayout.tsx`
2.  **Responsive Behavior:**
    - **Desktop (`lg`+):** Strict 20% / 60% / 20% horizontal grid.
    - **Mobile/Tablet:** Stack vertically (Map Top -> Insights -> Reports).
3.  **Interface Props:**
    ```typescript
    interface MapFirstLayoutProps {
      insightPanel: React.ReactNode;
      mapPanel: React.ReactNode;
      reportPanel: React.ReactNode;
    }
    ```

### Workflow (TDD)
1.  **Test First:** Create `src/components/layout/MapFirstLayout.test.tsx`.
    - Verify the presence of all 3 slots.
    - **Crucially:** Verify the 20% / 60% / 20% width matching on desktop breakpoints.
2.  **Implement:** Create the component in `src/components/layout/MapFirstLayout.tsx`.
3.  **Validate:** Run `npm test src/components/layout/MapFirstLayout.test.tsx`.

---

**Execution:**
Please acknowledge this context and proceed immediately with Step 1 (Creating the test).
