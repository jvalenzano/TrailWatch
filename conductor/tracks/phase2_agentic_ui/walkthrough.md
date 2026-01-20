# Walkthrough: Agentic UI Implementation (Phase 2)

**Status:** Phase 2 Complete
**Branch:** feature/phase2-agentic-ui -> merged to develop
**Focus:** Synthetic Data Foundation, Agentic Shell, Insight Components, Reasoning Visualization

## 1. Overview
We have successfully implemented the "Agentic UI" for TrailWatch. This phase shifts the application from a traditional dashboard to an AI-driven, map-first interface. The implementation is powered by high-fidelity synthetic data, allowing us to demonstrate complex scenarios (clusters, duplicates, high-risk circuit breakers) without backend dependencies.

## 2. Key Components Delivered

### 2.1 The Data Foundation (Phase 2.1)
- **Synthetic Database:** `src/data/synthetic_day_in_life.json` contains 24 rich reports simulating a "Storm Scenario" on North Ridge Trail and "Duplicate Check" on Beaver Pond Loop.
- **Simulation Hook:** `useMockAgent()` acts as a "mock backend," serving data and simulating streaming updates. It supports scenario toggling (`trigger_cluster`, `trigger_bias`).
- **Enhanced Types:** `HazardReport` now includes `PatternDetection` (clusters/duplicates) and `ReasoningChain` (step-by-step logic).

### 2.2 The Agentic Shell (Phase 2.2)
- **Layout:** A 20/60/20 grid structure (`AgenticLayout.tsx`) with a **persistent map layer**. The map does not unmount when switching panels, ensuring smooth performance.
- **Mode Toggle:** Seamless switching between "Traditional Dashboard" (list-first) and "Agentic Mode" (map-first).

### 2.3 Insight Components (Phase 2.3 - Left Panel)
- **Spatial Insights Sidebar:** A specialized sidebar for AI-detected patterns.
- **Visual Cards:**
    - **Cluster Insight:** Shows report count, radius, and time span (e.g., "4 reports in 1 mile").
    - **Duplicate Insight:** Shows similarity score and distance (e.g., "94% match, 15m apart").
    - **Bias Insight:** Visualizes district anomaly detection.

### 2.4 Reasoning Components (Phase 2.4 - Right Panel)
- **Step-by-Step Visualization:** `AgenticReasoningPanel` breaks down AI logic into "Vision Analysis" -> "Spatial Validation" -> "Policy Check".
- **Circuit Breaker:** `HighRiskConfirmation` component adds "friction" to dangerous actions (e.g., "I have verified GPS accuracy") to prevent automation bias.

### 2.5 Integration (Phase 2.5)
- **Map Interaction:** Clicking a sidebar insight automatically **zooms** the map to the relevant reports using `fitBounds`.
- **Pulse Effect:** Selected markers "pulse" with an emerald halo to visually connect the insight to the map location.

## 3. How to Test (Manual UAT)
1. **Launch App:** Run `npm run dev`.
2. **Switch Mode:** Click "Switch to Agentic Mode" in the dashboard header.
3. **Trigger Scenario:** Use the debug tools (if exposed) or default load to see the "North Ridge Storm Cluster".
4. **Interact:**
   - Click the **"Cluster Deteced"** card in the left sidebar.
   - Observe the map **zoom** to the 4 clustered reports.
   - Click a marker to see the **Right Panel** open.
   - Expand the **"AI Reasoning Chain"** to see the 3-step validation logic.

## 4. Next Steps (Phase 3)
Phase 3 "Safety & Governance" will focus on:
- **Feature Gating:** Implementing `FeatureGate` components for progressive disclosure.
- **Audit Logging:** Tracking every AI interaction.
- **Feedback Loops:** Allowing users to correct the AI (RLHF lite).
