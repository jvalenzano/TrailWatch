# Agentic UI Engineering Guide

**For:** New engineering team members
**Last Updated:** 2026-01-19
**Current Branch:** `feature/dashboard-phase-4-agentic`

---

## Quick Start

```bash
# Clone and setup
git clone <repo-url>
cd frontend
npm install
npm run dev

# Run tests
npm test

# Build
npm run build
```

---

## Project Context

TrailWatch is a citizen crowdsourcing platform for USFS trail maintenance. The **Agentic UI** is the most advanced of three UI modes:

| Mode | Description | Map Position |
|------|-------------|--------------|
| Traditional | List-based, minimal AI | Secondary |
| Moderate | AI transparency features | Secondary |
| **Agentic** | Map-first, spatial insights, AI patterns | **Primary** |

The Agentic Mode implements several "agentic patterns" where AI assists with decision-making while keeping humans in control.

---

## Key Documents to Read First

1. **[WIREFRAME_CONFORMANCE_AUDIT.md](WIREFRAME_CONFORMANCE_AUDIT.md)** — Gap analysis and implementation roadmap
2. **[WIREFRAME_CATALOG.md](WIREFRAME_CATALOG.md)** — Index of all 10 wireframes
3. **[MISSING_WIREFRAMES_ISSUE.md](MISSING_WIREFRAMES_ISSUE.md)** — Blocker for Phase 1 work
4. **[UI_SPECIFICATION.md](UI_SPECIFICATION.md)** — Detailed UI specification
5. **[../../CLAUDE.md](../../CLAUDE.md)** — Main project conventions

---

## Architecture Overview

### Directory Structure

```
frontend/src/
├── components/
│   ├── agentic/          # Agentic mode components
│   │   ├── ReasoningPanel.tsx
│   │   └── ConfidenceBadge.tsx
│   ├── assignment/       # [TO CREATE] Batch assignment
│   ├── admin/            # [TO CREATE] Feature admin
│   ├── charts/           # [TO CREATE] Data visualizations
│   ├── common/           # Shared components
│   │   ├── AppShell.tsx
│   │   ├── FeatureGate.tsx
│   │   └── MapFirstLayout.tsx
│   ├── extraction/       # Streaming extraction
│   ├── insights/         # Spatial insight cards
│   │   ├── InsightCard.tsx
│   │   ├── ClusterInsight.tsx
│   │   ├── DuplicateInsight.tsx
│   │   ├── BiasInsight.tsx
│   │   └── GenericInsight.tsx
│   ├── map/              # Map components
│   │   ├── SmartMarkerCluster.tsx
│   │   └── SpatialInsightsSidebar.tsx
│   ├── offline/          # [TO CREATE] Offline mode
│   └── reasoning/        # AI reasoning display
│       ├── HighRiskConfirmation.tsx
│       └── ReasoningStepItem.tsx
├── hooks/
│   ├── useUIMode.ts      # UI mode switching
│   ├── useSpatialInsights.ts
│   ├── useReports.ts
│   └── useStreamingExtraction.ts
├── pages/
│   ├── Dashboard.tsx     # Main entry point
│   └── AgenticDashboard.tsx
├── types/
│   ├── report.ts
│   └── spatial.ts
└── data/
    └── synthetic_day_in_life.json  # Demo data
```

### Data Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Dashboard.tsx │────▶│  useUIMode.ts   │────▶│   ModeConfig    │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │
         ▼ mode === 'agentic'
┌─────────────────────────────────────────────────────────────────┐
│                    AgenticDashboard.tsx                         │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐       │
│  │SpatialInsights│  │    MapView    │  │  ReportList   │       │
│  │   Sidebar     │  │  + Clusters   │  │  + Detail     │       │
│  └───────────────┘  └───────────────┘  └───────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

---

## The Three Agentic Patterns

Understanding these patterns is essential for implementing the wireframes correctly.

### Pattern A: Cluster Detection (WF2)

**What it does:** Identifies multiple reports in geographic/temporal proximity that likely share a root cause (e.g., storm damage).

**UI Components:**
- `ClusterInsight.tsx` — Card in sidebar
- `SmartMarkerCluster.tsx` — Grouped markers on map
- [NEEDED] Pulsing radius animation
- [NEEDED] Context-aware assignment panel

**Data Structure:**
```typescript
interface ClusterMetadata {
  report_count: number;
  radius_miles: number;
  time_span_hours: number;
  weather_correlation?: string;
}
```

### Pattern B: Consistency Check / Bias Detection (WF8)

**What it does:** Flags anomalies in assignment distribution (e.g., all reports going to one district) without accusation.

**UI Components:**
- `BiasInsight.tsx` — Card in sidebar
- [NEEDED] Distribution bar chart
- [NEEDED] District boundary map overlay

**Data Structure:**
```typescript
interface ConsistencyCheckMetadata {
  check_type: 'district_bias' | 'temporal_anomaly' | 'geographic_gap';
  affected_districts?: string[];
  deviation_percentage?: number;
  expected_distribution?: Record<string, number>;
  actual_distribution?: Record<string, number>;
}
```

### Pattern C: Circuit Breaker / High-Risk (WF7)

**What it does:** Requires explicit human verification for high-stakes decisions (trail closures, emergency responses).

**UI Components:**
- `HighRiskConfirmation.tsx` — Modal with checklist
- [NEEDED] Mandatory justification field
- [NEEDED] Hazard radius map overlay

**Trigger Conditions:**
- `safety_alert: true` in report data
- Severity = `SEV3` (CLOSURE_RECOMMENDED)
- Hazard type = `structures` with `dangerous` severity

---

## UI Mode System

The `FeatureGate` component controls feature visibility by mode:

```tsx
import { FeatureGate } from '../components/common/FeatureGate';

// Only show in moderate and agentic modes
<FeatureGate modes={['moderate', 'agentic']}>
  <ConfidenceIndicator level={report.confidenceLevel} />
</FeatureGate>

// Only show in agentic mode
<FeatureGate modes={['agentic']}>
  <SpatialInsightsSidebar />
</FeatureGate>
```

---

## Synthetic Demo Data

The demo uses `synthetic_day_in_life.json` with 24 reports designed to showcase all agentic patterns:

| Scenario | Reports | Pattern |
|----------|---------|---------|
| Storm damage cluster | NR-001, NR-002, NR-003, NR-004 | Cluster Detection |
| Duplicate reports | BP-003, BP-004 | Duplicate Detection |
| Bridge collapse | RV-007 | Circuit Breaker |
| District imbalance | All D03 assignments | Consistency Check |

**Photo Assets:** Located in `public/assets/photos/`

---

## Testing Conventions

### Unit Tests
- Use Vitest + React Testing Library
- Co-locate tests: `Component.test.tsx` next to `Component.tsx`
- Use `data-testid` attributes for test selectors

### E2E Tests
- Use Playwright (not Cypress)
- Tests in `frontend/tests/`
- Run with `npm test`

### Accessibility
- Use jest-axe for automated a11y testing
- Target WCAG 2.1 AA compliance
- All interactive elements need keyboard support

---

## Common Tasks

### Adding a New Insight Card Type

1. Create component in `src/components/insights/`
2. Add metadata type to `src/types/spatial.ts`
3. Register in `InsightCard.tsx` switch statement
4. Add test file
5. Update mock data if needed

### Adding a Map Layer

1. Create component in `src/components/map/`
2. Use MapLibre GL JS APIs
3. Add as child of `<MapView>`
4. Handle cleanup in useEffect return

### Creating a Modal

1. Use `role="dialog"` or `role="alertdialog"`
2. Trap focus within modal
3. Close on Escape key
4. Prevent body scroll when open
5. Use backdrop for click-outside-to-close

---

## Work Assignment

See [WIREFRAME_CONFORMANCE_AUDIT.md](WIREFRAME_CONFORMANCE_AUDIT.md) for:
- Complete gap inventory (41 items)
- Prioritized roadmap (4 phases)
- Component specifications
- Effort estimates

### Recommended Team Split

| Track | Wireframes | Suggested Team Size |
|-------|------------|---------------------|
| **Batch Assignment** | WF6 | 2 engineers |
| **Offline Mode** | WF9 | 2-3 engineers |
| **Feature Admin** | WF10 | 1-2 engineers |
| **Enhancements** | WF4, WF5, WF7, WF8 | 2 engineers |

---

## Getting Help

- **Codebase questions:** Check `CLAUDE.md` first
- **Design questions:** Refer to wireframes in `docs/UI/wireframes/`
- **API questions:** Backend code in `src/trailwatch/`
- **Architecture questions:** Check `docs/adr/` for decision records

---

## Checklist for New Engineers

- [ ] Read WIREFRAME_CONFORMANCE_AUDIT.md
- [ ] Review all wireframes in `docs/UI/wireframes/`
- [ ] Run `npm run dev` and explore the three UI modes
- [ ] Run `npm test` to verify test setup
- [ ] Review synthetic demo data scenarios
- [ ] Understand the three agentic patterns
- [ ] Identify your assigned track from the roadmap
