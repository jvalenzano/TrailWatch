# Specification: Agentic UI Foundation

**Primary Source of Truth:** [docs/UI/UI_SPECIFICATION.md](../../src/docs/UI/UI_SPECIFICATION.md)
**Pattern Definitions:** [docs/concepts/agentic_ui_patterns.md](../../src/docs/concepts/agentic_ui_patterns.md)
**Data Source:** [docs/UI/SYNTHETIC_DATA_PLAN.md](../../src/docs/UI/SYNTHETIC_DATA_PLAN.md)

## Core Requirements

### 1. The Layout (The Shell)
- **Three-Panel Grid:** Fixed 20% (Left) / 60% (Center) / 20% (Right) layout.
- **Map-First:** MapLibre GL is the "desktop background." It never unmounts.
- **Theme:** Dark Mode defaults (slate-900/950).

### 2. The "Agentic Brain" (The Mock)
- **Synthetic Data Store:** A strictly typed JSON store containing the 25 "Day in the Life" reports defined in `SYNTHETIC_DATA_PLAN.md`.
- **Simulation Hook:** `useAgenticSimulation()` that replays these reports as if they were streaming in (or loads them all for the demo).

### 3. Key Components
- **Spatial Insights Sidebar (Left):** Renders "Insight Cards" (Cluster, Trend).
- **Reasoning Panel (Right):** Renders the "Glass Box" AI logic (Chain of Thought).
- **Map Layer:** Renders clusters and pulse animations for alerts.

## Constraints
- **Zero Backend Dependency:** This track MUST run 100% client-side using the synthetic artifacts.
- **Strict Typing:** All synthetic data must match the shared `types/report.ts` interfaces.
