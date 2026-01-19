# Implementation Plan: Agentic UI Foundation

**Objective:** Build the functional "Agentic Mode" shell driven by high-fidelity synthetic data.

## Phase 2.1: The Data Foundation (Crucial First Step)
- [x] **Implement Synthetic Types:** Update `src/types/` to support "Clusters", "Insights", and "Reasoning Chains" as defined in `SYNTHETIC_DATA_PLAN.md`.
- [x] **Build the Mock Database:** Create `src/data/synthetic_day_in_life.json` with the full 25-report dataset (Pattern A, B, C scenarios included).
- [x] **Create Simulation Hook:** Build `useMockAgent()` that serves this data to the UI, allowing us to toggle "scenarios" (e.g., "Trigger Cluster Event").

## Phase 2.2: The Agentic Shell (Layout)
- [ ] **Create `AgenticLayout.tsx`:** Implement the 20/60/20 CSS grid.
- [ ] **Integrate MapLibre:** Ensure the map renders correctly in the center distinct from the standard dashboard.
- [ ] **Implement Mode Toggle:** effectively switch between `Traditional` (existing) and `Agentic` (new) layouts without full page reloads.

## Phase 2.3: The "Insight" Components (Left Panel)
- [ ] **Build `InsightCard`:** The generic container for sidebar alerts.
- [ ] **Implement Pattern A (Cluster):** A specific card for "Spatial Cluster Detected" (linking to the mock data).
- [ ] **Implement Pattern D (Duplicate):** A specific card for "Duplicate Suspected".

## Phase 2.4: The "Reasoning" Components (Right Panel)
- [ ] **Enhanced `ReasoningPanel`:** Upgrade the existing component to support "Step-by-Step" visualization (Vision -> Spatial -> Policy).
- [ ] **Circuit Breaker UI:** Implement the "High Risk" confirmation modal with checkbox friction.

## Phase 2.5: Integration & Wiring
- [ ] **Wire Map Interactions:** Clicking a Sidebar Insight -> Zooms Map to Bounding Box.
- [ ] **Wire Pulse Effects:** Selecting an Insight -> Pulses the related map markers.

## Completion Criteria
- [ ] User can switch to "Agentic Mode".
- [ ] User sees populated "Cluster Alerts" from the synthetic data.
- [ ] User can click an alert and see the map zoom + specific reasoning.
- [ ] No real backend is required to demonstrate the full flow.
