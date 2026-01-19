# TrailWatch Frontend Component Architecture

## Document Metadata
- **Version:** 1.0
- **Status:** Draft for Review
- **Last Updated:** January 2026
- **Purpose:** Define component structure for multi-mode agentic UI

---

## 1. Architectural Principles

### 1.1 Core Design Decisions

| Principle | Implementation | Rationale |
|-----------|----------------|-----------|
| Mode-agnostic backend | API returns full extraction payload regardless of UI mode | Prevents backend refactoring when enabling features |
| Feature-flag driven rendering | Components check mode config before rendering | Single codebase serves all UI experiences |
| Composition over configuration | Small, focused components assembled by layouts | Easier testing, clearer responsibilities |
| Data-fetching separation | Custom hooks handle all API communication | Components remain pure renderers |
| Progressive enhancement | Each mode adds to previous, never removes core function | Users always have working triage capability |

### 1.2 UI Mode Hierarchy

```
Traditional (baseline)
    │
    ├── Core triage workflow (list, detail, actions)
    ├── Basic map view (secondary)
    └── Standard request/response data fetching
    
Moderate (extends Traditional)
    │
    ├── Everything in Traditional, plus:
    ├── Confidence indicators visible
    ├── Reasoning panel in detail view
    └── AI attribution badges ("AI Extracted")
    
Agentic (extends Moderate)
    │
    ├── Everything in Moderate, plus:
    ├── Map-primary layout (list becomes secondary)
    ├── Spatial Insights sidebar (proactive AI suggestions)
    ├── Streaming extraction (SSE)
    └── Batch operation suggestions
```

---

## 2. Directory Structure

```
src/
├── config/
│   ├── ui-modes.ts              # Mode definitions and feature flags
│   ├── api.ts                   # API endpoints, base URLs
│   └── constants.ts             # App-wide constants
│
├── types/
│   ├── report.ts                # Report, Extraction, Hazard types
│   ├── crew.ts                  # Crew, Assignment types
│   ├── spatial.ts               # GPS, Boundary, Trail types
│   └── ui.ts                    # UIMode, FeatureFlags types
│
├── hooks/
│   ├── useUIMode.ts             # Read/manage current UI mode
│   ├── useReports.ts            # Fetch, cache, mutate reports
│   ├── useExtraction.ts         # Trigger extraction (standard)
│   ├── useStreamingExtraction.ts # Trigger extraction (SSE)
│   ├── useSpatialInsights.ts    # Fetch AI-generated insights
│   └── useCrews.ts              # Fetch available crews
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx         # Top-level app wrapper
│   │   ├── ListFirstLayout.tsx  # Traditional/Moderate: list primary
│   │   ├── MapFirstLayout.tsx   # Agentic: map primary
│   │   ├── Header.tsx           # App header with mode indicator
│   │   └── ModeSwitcher.tsx     # Dev/demo mode toggle (non-prod)
│   │
│   ├── map/
│   │   ├── MapView.tsx          # Map container (Google Maps wrapper)
│   │   ├── ReportMarker.tsx     # Individual report pin
│   │   ├── MarkerCluster.tsx    # Clustered reports visualization
│   │   └── SpatialInsightsSidebar.tsx  # Agentic: "3 insights" panel
│   │
│   ├── reports/
│   │   ├── ReportList.tsx       # Sortable, filterable report table
│   │   ├── ReportListItem.tsx   # Single row in report list
│   │   ├── ReportDetail.tsx     # Full report view (citizen + AI)
│   │   ├── ReportFilters.tsx    # Filter controls (hazard type, date, etc.)
│   │   └── ReportActions.tsx    # Action buttons (approve, assign, resolve)
│   │
│   ├── extraction/
│   │   ├── ExtractionDisplay.tsx      # Shows AI extraction results
│   │   ├── ConfidenceIndicator.tsx    # 4-level confidence badge
│   │   ├── ReasoningPanel.tsx         # "Why?" expandable explanation
│   │   ├── StreamingExtractionView.tsx # Real-time extraction animation
│   │   └── AIBadge.tsx                # "AI Extracted" attribution label
│   │
│   ├── assignment/
│   │   ├── CrewSelector.tsx     # Dropdown to assign crew
│   │   ├── CrewSuggestion.tsx   # AI-suggested crew with reasoning
│   │   └── BatchAssignment.tsx  # Multi-select + bulk assign (Agentic)
│   │
│   └── common/
│       ├── LoadingSpinner.tsx   # Standard loading state
│       ├── ErrorBoundary.tsx    # Error handling wrapper
│       ├── EmptyState.tsx       # "No reports" placeholder
│       └── FeatureGate.tsx      # Conditional render based on mode
│
├── pages/
│   ├── Dashboard.tsx            # Main triage dashboard
│   ├── ReportPage.tsx           # Single report deep-dive
│   └── AnalyticsPage.tsx        # Trends and statistics (future)
│
└── utils/
    ├── formatters.ts            # Date, hazard type formatting
    ├── gps.ts                   # Coordinate utilities
    └── tracs.ts                 # TRACS code helpers
```

---

## 3. Component Specifications

### 3.1 Config: UI Modes

**File:** `src/config/ui-modes.ts`

**Purpose:** Single source of truth for feature flags per mode.

**Interface:**
```typescript
interface FeatureFlags {
  // Visibility
  showConfidence: boolean;
  showReasoning: boolean;
  showAIBadges: boolean;
  showSpatialInsights: boolean;
  
  // Behavior
  useStreaming: boolean;
  enableBatchOperations: boolean;
  
  // Layout
  mapPrimary: boolean;
}

interface UIMode {
  id: 'traditional' | 'moderate' | 'agentic';
  name: string;
  description: string;
  features: FeatureFlags;
}
```

**Mode Definitions:**

| Mode | showConfidence | showReasoning | showAIBadges | showSpatialInsights | useStreaming | enableBatchOperations | mapPrimary |
|------|---------------|---------------|--------------|---------------------|--------------|----------------------|------------|
| traditional | false | false | false | false | false | false | false |
| moderate | true | true | true | false | false | false | false |
| agentic | true | true | true | true | true | true | true |

---

### 3.2 Hook: useUIMode

**File:** `src/hooks/useUIMode.ts`

**Purpose:** Read current UI mode from URL parameter, provide mode config to components.

**Behavior:**
- Reads `?mode=` query parameter from URL
- Defaults to `moderate` if not specified or invalid
- Returns full mode configuration including feature flags
- Provides setter function for demo mode switching

**Usage Pattern:**
```typescript
const { mode, features, setMode } = useUIMode();

if (features.showConfidence) {
  // render confidence indicator
}
```

---

### 3.3 Component: FeatureGate

**File:** `src/components/common/FeatureGate.tsx`

**Purpose:** Declarative conditional rendering based on feature flags.

**Props:**
- `feature`: keyof FeatureFlags (e.g., 'showConfidence')
- `children`: ReactNode to render if feature enabled
- `fallback?`: ReactNode to render if feature disabled (optional)

**Usage Pattern:**
```typescript
<FeatureGate feature="showReasoning">
  <ReasoningPanel reasoning={report.extraction.reasoning} />
</FeatureGate>
```

**Rationale:** Cleaner than inline conditionals; makes feature dependencies explicit and searchable.

---

### 3.4 Layout: ListFirstLayout vs MapFirstLayout

**Purpose:** Top-level layout components that arrange the dashboard differently based on mode.

**ListFirstLayout (Traditional/Moderate):**
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────────────────────────────────────────┤
│  Filters                                    │
├────────────────────────┬────────────────────┤
│                        │                    │
│  Report List           │  Map View          │
│  (60% width)           │  (40% width)       │
│                        │                    │
│                        │                    │
├────────────────────────┴────────────────────┤
│  Report Detail (slides up on selection)     │
└─────────────────────────────────────────────┘
```

**MapFirstLayout (Agentic):**
```
┌─────────────────────────────────────────────┐
│  Header                                     │
├─────────┬───────────────────────┬───────────┤
│         │                       │           │
│ Spatial │  Map View             │  Report   │
│ Insights│  (primary, 50%)       │  List     │
│ Sidebar │                       │  (25%)    │
│ (25%)   │                       │           │
│         │                       │           │
├─────────┴───────────────────────┴───────────┤
│  Report Detail (slides up on selection)     │
└─────────────────────────────────────────────┘
```

---

### 3.5 Component: ConfidenceIndicator

**File:** `src/components/extraction/ConfidenceIndicator.tsx`

**Purpose:** Visual representation of AI extraction confidence.

**Props:**
- `value`: number (0.0 to 1.0)
- `size?`: 'sm' | 'md' | 'lg'
- `showLabel?`: boolean

**Visual Design (4-level system from research):**

| Range | Color | Label |
|-------|-------|-------|
| 0.0 - 0.49 | Gray | Low |
| 0.50 - 0.74 | Yellow | Moderate |
| 0.75 - 0.89 | Green | High |
| 0.90 - 1.0 | Dark Green | Very High |

**Behavior:**
- Renders only if mode has `showConfidence: true`
- Hoverable tooltip shows exact percentage
- Accessible: uses aria-label for screen readers

---

### 3.6 Component: ReasoningPanel

**File:** `src/components/extraction/ReasoningPanel.tsx`

**Purpose:** Expandable panel showing AI reasoning for extraction.

**Props:**
- `reasoning`: string (AI-generated explanation)
- `defaultExpanded?`: boolean

**Behavior:**
- Renders only if mode has `showReasoning: true`
- Collapsed by default; click to expand
- Header shows "Why did AI classify this?" 
- Body shows reasoning text with nice formatting

**Content Structure (what backend provides):**
```
"Large boulder (approx 1.5m diameter) visible in photo center. 
GPS coordinates place report within 15m of Bear Valley Loop trail. 
Recent weather data shows freeze-thaw cycles consistent with 
rock fall events. Similar reports in this area: 3 in past 30 days."
```

---

### 3.7 Component: SpatialInsightsSidebar

**File:** `src/components/map/SpatialInsightsSidebar.tsx`

**Purpose:** Proactive AI-generated spatial insights (Agentic mode only).

**Props:**
- `insights`: SpatialInsight[] (from useSpatialInsights hook)
- `onInsightClick`: (insight: SpatialInsight) => void

**Insight Interface:**
```typescript
interface SpatialInsight {
  id: string;
  type: 'cluster' | 'trend' | 'anomaly';
  title: string;           // "Drainage cluster in Bear Valley"
  description: string;     // "17 reports, 40% of weekly volume"
  reportIds: string[];     // Reports included in this insight
  boundingBox: BoundingBox; // For map zoom
  confidence: number;
  generatedAt: string;     // ISO timestamp
}
```

**Behavior:**
- Renders only if mode has `showSpatialInsights: true`
- Shows top 3 insights by default (configurable)
- Click insight: map zooms to bounding box, highlights relevant reports
- Dismissible (per-session, not persisted)
- Refreshes on new report submission or manual trigger

---

### 3.8 Component: StreamingExtractionView

**File:** `src/components/extraction/StreamingExtractionView.tsx`

**Purpose:** Real-time visualization of extraction as it streams from backend.

**Props:**
- `reportId`: string
- `onComplete`: (extraction: Extraction) => void
- `onError`: (error: Error) => void

**Behavior:**
- Used only if mode has `useStreaming: true`
- Connects to SSE endpoint for extraction events
- Renders partial results as they arrive (hazard type first, then details)
- Shows subtle animation indicating "AI thinking"
- Falls back to standard extraction display on completion

**Event Types Expected (from Intake Agent):**
```typescript
type ExtractionEvent = 
  | { type: 'START'; reportId: string }
  | { type: 'HAZARD_TYPE'; value: string; confidence: number }
  | { type: 'TRACS_CODE'; value: string }
  | { type: 'URGENCY'; value: string }
  | { type: 'REASONING'; value: string }
  | { type: 'GPS_VALIDATION'; value: GPSValidation }
  | { type: 'COMPLETE'; extraction: Extraction }
  | { type: 'ERROR'; message: string };
```

---

## 4. Data Flow

### 4.1 Report Lifecycle

```
┌─────────────────┐
│ Citizen submits │
│ report (mobile) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Intake Agent    │
│ extracts data   │──────────────────────────────┐
└────────┬────────┘                              │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│ Report stored   │                    │ SSE events      │
│ in database     │                    │ (if streaming)  │
└────────┬────────┘                    └────────┬────────┘
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────────────┐
│                    Frontend Dashboard                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │
│  │ useReports  │  │ useExtrac.  │  │ useSpatialIns.  │  │
│  │ (list/poll) │  │ (on-demand) │  │ (periodic)      │  │
│  └──────┬──────┘  └──────┬──────┘  └────────┬────────┘  │
│         │                │                   │          │
│         ▼                ▼                   ▼          │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Component Tree                      │   │
│  │  (renders based on UIMode feature flags)        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 4.2 Hook Responsibilities

| Hook | Data Source | Caching | Mutation |
|------|-------------|---------|----------|
| useReports | GET /api/reports | SWR/React Query | approve, assign, resolve |
| useExtraction | POST /api/extract | None (on-demand) | None |
| useStreamingExtraction | SSE /api/extract/stream | Partial state | None |
| useSpatialInsights | GET /api/insights | Short TTL (5 min) | dismiss |
| useCrews | GET /api/crews | Long TTL (1 hour) | None |

---

## 5. API Contract Reference

### 5.1 Extraction Response (from Intake Agent)

This is the full payload the backend returns. UI modes control what gets displayed.

```typescript
interface ExtractionResponse {
  // Always populated (Traditional mode sees these)
  id: string;
  reportId: string;
  hazardType: string;
  tracsCode: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  extractedAt: string;
  
  // Always populated, displayed in Moderate+ modes
  confidence: number;
  reasoning: string;
  
  // Always populated, displayed in Moderate+ modes
  gpsValidation: {
    withinBoundary: boolean;
    nearestTrail: string | null;
    distanceToTrailMeters: number | null;
    validationMethod: 'boundary' | 'geometry' | 'none';
  };
  
  // Populated when available, displayed in Agentic mode
  suggestedCrew: {
    crewId: string;
    crewName: string;
    reasoning: string;
  } | null;
  
  suggestedPriorityRank: number | null;
}
```

### 5.2 Spatial Insights Response

```typescript
interface SpatialInsightsResponse {
  insights: SpatialInsight[];
  generatedAt: string;
  reportCountAnalyzed: number;
  timeWindowDays: number;
}
```

---

## 6. Testing Strategy

### 6.1 Component Testing (per mode)

Each component that respects feature flags needs test coverage for:
- Renders correctly when feature enabled
- Does not render (or renders fallback) when feature disabled
- Handles loading/error states appropriately

### 6.2 Integration Testing (per mode)

Test the full dashboard in each mode:
- Traditional: Can complete triage workflow without any AI visibility
- Moderate: AI indicators appear in correct locations
- Agentic: Map is primary, sidebar appears, streaming works

### 6.3 Mode Switching

Test that switching modes mid-session:
- Does not lose report selection state
- Does not trigger unnecessary re-fetches
- Updates layout correctly

---

## 7. Open Questions for Review

1. **Map Library Decision:** This spec assumes Google Maps. Confirm before implementation.

2. **Streaming Fallback:** If SSE connection fails in Agentic mode, should we fall back to standard request/response, or show an error?

3. **Spatial Insights Backend:** The insights endpoint is referenced but not defined in Intake Agent. Is this a separate service, or an extension of Intake Agent?

4. **Offline Behavior:** How should each mode degrade when offline? Traditional might work with cached data; Agentic's streaming won't work at all.

5. **Mode Persistence:** Should user's mode preference persist across sessions (localStorage), or always default to moderate?

---

*This specification is intended for use with Anti-Gravity conductor workflows. Implementation tracks should reference specific sections when defining phase scope.*
