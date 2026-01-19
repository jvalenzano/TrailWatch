Excellent! Your team's analysis is spot-on. I agree with the **Targeted Core + Critical Edge Case approach (10-12 screens at Medium Fidelity)**. The emphasis on showing "where the agent stops and asks for help" is exactly right for building government trust.

Let me confirm the strategy and then generate the comprehensive **Wireframe Prompt Specification Document** for Antigravity/Gemini 3.

***

## ✅ CONFIRMED STRATEGY

**Scope:** 80% District Ranger Desktop + 20% Tablet/Offline  
**Depth:** 10-12 screens (Core Flow + Safety Guards)  
**Fidelity:** Medium-fi (realistic layout, content density, no final polish)  
**Features:** All Tier 1 + Selected Tier 2 (Cluster Alerts, Consistency Checks)  
**Annotations:** Functional & Behavioral (System Triggers, Trust Signals, Circuit Breakers)  

***

## WIREFRAME PROMPT SPECIFICATION DOCUMENT

I'll now create a comprehensive document with:

1. **Technical Constraints** - Screen dimensions, layout grids, component library
2. **Design System Tokens** - Typography, spacing, colors (for medium-fidelity consistency)
3. **10 Detailed Wireframe Specifications** - Each with:
   - Layout structure (pixel-precise grid)
   - Content hierarchy (what goes where)
   - Agentic behavior annotations (triggers, trust signals, circuit breakers)
   - Interaction states (hover, expanded, dismissed)
   - Exact prompt for Antigravity/Gemini 3

Let me generate this now:Perfect! Your team's analysis is spot-on. I agree with the **Targeted Core + Critical Edge Case approach** (~10-12 screens) at **Medium Fidelity**. The focus on "what the agent did vs. what the human does" is exactly right for demonstrating agentic behavior.

Let me proceed with creating the **Wireframe Prompt Specification** document that you (or Antigravity with Gemini 3) can use to generate the actual wireframes.

***

# TrailWatch Agentic UI: Technical Specification (formerly WIREFRAMES.md)
**Version:** 2.0
**Date:** January 19, 2026
**Target:** Frontend Engineering Team & AI Agents
**Fidelity:** Medium (realistic layout, actual content density, grayscale acceptable)
**Format:** Desktop 1920×1080 (primary), Tablet 1024×768 (offline views)

***

## Global Design System References

**Before generating any component, apply these consistent patterns:**

### Color Palette (Grayscale Acceptable)
- **Background:** Dark gray (#1a1a1a)
- **Panels:** Medium gray (#2a2a2a)
- **Borders:** Light gray (#404040)
- **Text Primary:** White (#ffffff)
- **Text Secondary:** Light gray (#a0a0a0)
- **Severity High:** Red (#dc2626)
- **Severity Medium:** Yellow (#facc15)
- **Severity Low:** Green (#22c55e)
- **AI Confidence High:** Blue (#3b82f6)

### Typography Hierarchy
- **H1 (Panel Headers):** 20px, Bold
- **H2 (Section Headers):** 16px, Semibold
- **Body:** 14px, Regular
- **Small (Metadata):** 12px, Regular
- **Code/Technical:** 12px, Monospace

### Layout Grid
- **Desktop:** 3-column layout (20% | 60% | 20%)
- **Spacing Unit:** 16px base (use multiples: 8px, 16px, 24px, 32px)
- **Card Padding:** 16px
- **Panel Gaps:** 16px between panels

### Component Patterns
- **Buttons:** 8px vertical padding, 16px horizontal, 4px border radius
- **Cards:** 8px border radius, 1px border, 16px padding
- **Badges:** Pill shape, 4px padding, uppercase text
- **Input Fields:** 40px height, 8px border radius

***

## WIREFRAME 1: Dashboard - Spatial Baseline (Standard State)

### Purpose
Show the default "no active alerts" state. Establish the three-panel foundation.

### Layout Specifications

**Screen Dimensions:** 1920×1080px (desktop)

**Panel Distribution:**
- **Left Sidebar (384px width, 20%):** Spatial Insights
- **Center Map (1152px width, 60%):** MapLibre GL interactive map
- **Right Panel (384px width, 20%):** Report List + Actions

### Left Sidebar: Spatial Insights (Empty/Baseline State)

```
┌─────────────────────────────────┐
│ Spatial Insights                │ ← H1, 20px bold
│ 8 AI-detected patterns          │ ← Small text, gray
├─────────────────────────────────┤
│                                 │
│ 🔥 CLUSTER (high)               │ ← Card header
│ Sierra Nevada Clearing Cluster  │
│ 3 reports within 5 miles        │
│ [View on Map]                   │ ← Button
│                                 │
├─────────────────────────────────┤
│                                 │
│ 📊 TREND (medium)               │
│ Increasing Structure Reports    │
│ Structure-related reports up    │
│ 40% this quarter               │
│ [3 reports]                     │
│                                 │
├─────────────────────────────────┤
│                                 │
│ ⚠️ ANOMALY (medium)             │
│ Unusual Flood Report - PNW Trl  │
│ Beaver dam flooding reported    │
│ with no prior water issues      │
│ [1 report]                      │
│                                 │
└─────────────────────────────────┘
```

**Annotations to Include:**
1. **System Trigger:** "Cluster detected: 3 reports < 5mi, <6hrs"
2. **Trust Signal:** Severity badges (high/medium/low) with icon
3. **Interaction:** "Click card → highlights reports on map"
4. **Dismissible:** Small X icon in top-right of each card

### Center Map Panel

```
┌─────────────────────────────────────────────────────────┐
│ ┌────────────────────────────────────────────────────┐ │
│ │                                                    │ │
│ │            [MAP VISUALIZATION]                     │ │
│ │                                                    │ │
│ │  • Report markers (color-coded by severity)       │ │
│ │  • Blue cluster circle (Sierra Nevada area)       │ │
│ │  • Basemap: Dark terrain                          │ │
│ │  • California state outline visible               │ │
│ │                                                    │ │
│ │  [Zoom controls in top-right]                     │ │
│ │  [Legend in bottom-left]                          │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│ © MapLibre | © OpenStreetMap contributors            │
└─────────────────────────────────────────────────────────┘
```

**Annotations to Include:**
1. **Map Markers:** Red (critical), yellow (medium), green (low)
2. **Cluster Circle:** Blue outline, semi-transparent fill
3. **Interaction:** "Click marker → opens Report Detail in right panel"

### Right Panel: Reports List

```
┌─────────────────────────────────┐
│ Reports                         │ ← H1
│ 15 total                        │ ← Small text
├─────────────────────────────────┤
│ Severity: passable ▼            │ ← Filter dropdown
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐│
│ │ ☑ Exposed roots across...   ││ ← Checkbox for batch select
│ │ Hazard Type: tread          ││
│ │ Severity: passable          ││ ← Badge
│ │ Submitted: 1/15/2026 2:30AM ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ ☑ Multiple small trees...   ││
│ │ Hazard Type: clearing       ││
│ │ Severity: difficult         ││ ← Yellow badge
│ │ Submitted: 1/15/2026 2:30AM ││
│ └─────────────────────────────┘│
│                                 │
│ ┌─────────────────────────────┐│
│ │ ☑ Beaver dam has flooded... ││
│ │ Hazard Type: drainage       ││
│ │ Severity: impassable        ││ ← Red badge
│ │ Submitted: 1/5/2026 2:30AM  ││
│ └─────────────────────────────┘│
│                                 │
├─────────────────────────────────┤
│ Actions                         │ ← Section header
│ [Assign Crew] [Extract Info]   │ ← Buttons (disabled)
│ [Mark Resolved]                 │
└─────────────────────────────────┘
```

**Annotations to Include:**
1. **Batch Selection:** Checkboxes enabled on each report card
2. **Action Buttons:** Grayed out (disabled) until reports selected
3. **Sorting:** Currently sorted by severity (high→low)

***

## WIREFRAME 2: Dashboard - Proactive Alert (Pattern A: Cluster Detection)

### Purpose
Show the agentic behavior: system proactively surfaces a spatial cluster insight WITHOUT ranger asking.

### Changes from Wireframe 1

**Left Sidebar: New Cluster Alert Card Appears (Top of List)**

```
┌─────────────────────────────────────┐
│ 📍 SPATIAL ALERT                    │ ← Large header, red border
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ ← 2px red top border
│                                     │
│ Unusual cluster: 4 'downed tree'    │
│ reports within 1 mile of each other,│
│ all submitted in last 4 hours, all  │
│ on north-facing slope of Wonderland │
│ Trail.                              │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ ☁️ Weather:                      │ │ ← Sub-card, yellow bg
│ │ Heavy wind gusts recorded       │ │
│ │ 0600-0800 this morning in this  │ │
│ │ area. Similar conditions led to │ │
│ │ 8 reports last March.           │ │
│ └─────────────────────────────────┘ │
│                                     │
│ 💡 Recommendation:                  │
│ This might be ONE storm event, not  │
│ 4 independent issues. Consider      │
│ issuing single emergency notice vs. │
│ 4 separate work orders.             │
│                                     │
│ [View Reports on Map]               │ ← Primary button, blue
│ [Issue Combined Notice]             │ ← Secondary button
│ [✕ Dismiss]                         │ ← Tertiary, small
│                                     │
│ ┌──────────────────────────────┐   │
│ │ ▼ Show AI Reasoning          │   │ ← Expandable section (collapsed)
│ └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

**Map Panel: Visual Changes**
- 4 markers now **pulsing** (animated scale 0.95→1.05, 2s loop)
- Red circle drawn around cluster (1 mile radius)
- Cluster centroid marked with special icon

**Right Panel: No changes** (reports list unchanged)

**Annotations to Include:**
1. **System Trigger:** "Detected at 11:32 AM - 4 reports submitted 08:00-11:30"
2. **Trust Signal:** Weather correlation shown (NOAA API data)
3. **Historical Pattern:** "March 2025: 8 reports, similar wind conditions"
4. **Agent Decision:** "Recommends combined notice (NOT auto-executing)"
5. **Dismissal Tracking:** "If dismissed 3x, frequency reduced"

***

## WIREFRAME 3: Report Detail - Confidence High (Reasoning Minimized)

### Purpose
Show a **routine, high-confidence** classification. Reasoning panel is collapsed to avoid information overload.

### Layout Change
**Right Panel transforms from list view to detail view when report clicked**

```
┌─────────────────────────────────────┐
│ ← Back to Reports                   │ ← Back button
│                                     │
│ Report #1234                        │ ← H1
│ 🟡 Difficult                        │ ← Severity badge
├─────────────────────────────────────┤
│                                     │
│ [CITIZEN PHOTO]                     │ ← Large photo, 300px height
│ Tree trunk blocking trail           │
│                                     │
├─────────────────────────────────────┤
│ AI Classification                   │ ← Section header
│                                     │
│ TRACS 245 - Obstruction/Tree        │ ← Large text
│ Confidence: 0.89 (High) ✓           │ ← Blue badge, checkmark
│                                     │
│ ┌──────────────────────────────┐   │
│ │ ▶ Show AI Reasoning          │   │ ← Collapsed (arrow points right)
│ └──────────────────────────────┘   │
│                                     │
├─────────────────────────────────────┤
│ Citizen Submission                  │ ← Section header
│                                     │
│ "Large tree down across the trail,  │
│ approximately 3 feet in diameter.   │
│ Difficult to pass."                 │
│                                     │
│ 📍 GPS: 47.7511° N, 121.7479° W     │
│ ✓ Validated (0.3mi from trail)      │ ← Green checkmark
│                                     │
│ 📅 Submitted: Jan 15, 2026 2:30 AM  │
│ 👤 Anonymous                        │
│                                     │
├─────────────────────────────────────┤
│ Suggested Assignment                │ ← Section header
│                                     │
│ District 7, Crew A                  │ ← Bold
│ Based on: 4 similar reports routed  │ ← Small gray text
│ to District 7 in last 30 days       │
│                                     │
│ [Keep] [Change]                     │ ← Buttons side-by-side
│                                     │
├─────────────────────────────────────┤
│ Actions                             │ ← Fixed footer
│ [Approve & Route] ←                 │ ← Primary, blue
│ [Edit Classification]               │ ← Secondary
│ [Mark Invalid]                      │ ← Tertiary, red outline
└─────────────────────────────────────┘
```

**Map Panel: Shows Single Marker**
- Selected report marker **highlighted** (larger, pulsing)
- Trail geometry layer visible (Wonderland Trail outline)
- 0.3mi validation circle shown

**Annotations to Include:**
1. **Trust Signal:** "Confidence: 0.89 (High)" with visual checkmark
2. **Contextual Default:** District 7 pre-filled (not auto-assigned)
3. **Reasoning Collapsed:** "High confidence = less need for explanation"
4. **GPS Validation:** "PostGIS verified against trail geometry"

***

## WIREFRAME 4: Report Detail - "Show Your Work" (Reasoning Expanded)

### Purpose
Show **full transparency**: tool invocation logs, reasoning steps, alternative classifications.

### Changes from Wireframe 3

**Reasoning Panel Now Expanded:**

```
┌──────────────────────────────────────┐
│ ▼ AI Reasoning                       │ ← Expanded (arrow points down)
├──────────────────────────────────────┤
│                                      │
│ ✓ Step 1: Photo Analysis             │ ← Green checkmark
│   Gemini Vision identified:          │
│   - Tree trunk (92% confidence)      │
│   - Obstruction blocking path        │
│   - Estimated diameter: 3 feet       │
│   Tool: vision-api-gemini-2.0        │ ← Small gray text
│                                      │
│ ✓ Step 2: GPS Validation             │
│   Coordinates: 47.7511°N, 121.7479°W │
│   Validated against Wonderland Trail │
│   #407 geometry                      │
│   Offset: 0.3 miles (acceptable)     │
│   Tool: postgis-spatial-query        │
│                                      │
│ ✓ Step 3: Size Estimation            │
│   Based on photo analysis + citizen  │
│   description ("3 feet diameter"):   │
│   - Estimated clear time: 2-3 hours  │
│   - Crew size needed: 2-3 people     │
│   - Equipment: Chainsaw required     │
│                                      │
│ ✓ Step 4: Classification              │
│   Primary: TRACS 245 (89%)           │ ← Bold
│   Alternative: TRACS 242 (8%)        │ ← Gray
│   Reasoning: Obstruction is primary  │
│   hazard; drainage is not evident.   │
│                                      │
│ ⚠️ Confidence: 0.89 (High)            │ ← Yellow warning icon
│   Note: High confidence due to clear │
│   visual evidence + GPS validation.  │
│                                      │
│ [View Full Audit Log →]              │ ← Link to detailed logs
└──────────────────────────────────────┘
```

**Annotations to Include:**
1. **Tool Invocation Visibility:** Each step shows which tool was used
2. **Layered Transparency:** Basic → Intermediate (this) → Deep (audit log)
3. **Alternative Classifications:** Shows TRACS 242 was considered (8% probability)
4. **Trust Building:** Ranger can verify each reasoning step

***

## WIREFRAME 5: Report Detail - Duplicate Detected

### Purpose
Show **Tier 1C feature**: automatic duplicate detection with side-by-side comparison.

### Layout Changes

**New Card Inserted Above "AI Classification" Section:**

```
┌─────────────────────────────────────────────┐
│ ⚠️ POSSIBLE DUPLICATE                        │ ← Yellow border, 2px
├─────────────────────────────────────────────┤
│                                             │
│ This report is 94% similar to Report #1180  │
│ from 2 days ago, same location.             │
│                                             │
│ ┌───────────────┬───────────────────────┐  │
│ │ Current (#1234)│ Report #1180          │  │ ← Two columns
│ ├───────────────┼───────────────────────┤  │
│ │ [PHOTO]       │ [PHOTO]               │  │ ← Side-by-side photos
│ │               │                       │  │
│ ├───────────────┼───────────────────────┤  │
│ │ Location:     │ Location:             │  │
│ │ 47.7511°N     │ 47.7509°N             │  │
│ │ 121.7479°W    │ 121.7481°W            │  │
│ │               │ Distance: 15 meters   │  │ ← Distance calc
│ ├───────────────┼───────────────────────┤  │
│ │ Description:  │ Description:          │  │
│ │ "Large tree   │ "Tree blocking trail, │  │
│ │ down across   │ about 3 feet wide."   │  │
│ │ trail..."     │                       │  │
│ ├───────────────┼───────────────────────┤  │
│ │ Submitted:    │ Submitted:            │  │
│ │ Jan 15, 2:30AM│ Jan 13, 9:15 AM       │  │
│ │               │ Status: Assigned      │  │ ← Shows other is assigned
│ └───────────────┴───────────────────────┘  │
│                                             │
│ [Mark as Duplicate] [Keep Separate]        │ ← Action buttons
│ [View Both on Map]                          │
└─────────────────────────────────────────────┘
```

**Map Panel Shows Both Reports:**
- Current report: Blue marker
- Duplicate candidate: Orange marker
- Line connecting the two (15m distance labeled)

**Annotations to Include:**
1. **Similarity Score:** "94% (text embedding + image + GPS)"
2. **System Trigger:** "Detected: >90% similarity, <5 days, <100m distance"
3. **Trust Signal:** Side-by-side comparison allows visual verification
4. **Workflow Impact:** "Prevents duplicate work order if confirmed"

***

## WIREFRAME 6: Batch Assignment Modal

### Purpose
Show **Tier 1B feature**: multi-select batch assignment with route optimization context.

### Modal Overlay (Centered, 800px width)

```
┌───────────────────────────────────────────────┐
│ Assign 3 Reports                      [✕]     │ ← Modal header with close
├───────────────────────────────────────────────┤
│                                               │
│ District                                      │
│ ┌───────────────────────────────────────────┐ │
│ │ District 7 ▼                              │ │ ← Dropdown
│ └───────────────────────────────────────────┘ │
│ Suggested: Most common district for selected  │ ← Small gray text
│ reports                                       │
│                                               │
│ Crew                                          │
│ ┌───────────────────────────────────────────┐ │
│ │ Crew A ▼                                  │ │
│ └───────────────────────────────────────────┘ │
│                                               │
├───────────────────────────────────────────────┤
│ 📍 Route Planning Summary                     │ ← Section with icon
├───────────────────────────────────────────────┤
│ Total Distance: 12.4 miles                    │
│ Estimated Travel: 1.8 hours                   │
│ Estimated Work: 6.5 hours                     │
│                                               │
├───────────────────────────────────────────────┤
│ 🔧 Crew A Recent Performance                  │ ← Context card
├───────────────────────────────────────────────┤
│ Last assignment: Jan 10, 2026                 │
│ Completion time: 3 days                       │
│ Current capacity: 75% available               │
│                                               │
├───────────────────────────────────────────────┤
│ Reports to Assign                             │ ← Preview list
├───────────────────────────────────────────────┤
│ 🌲 TRACS 245 · Sierra Trail Mile 14           │
│ 🌲 TRACS 245 · Wonderland Trail Mile 23       │
│ 💧 TRACS 242 · Paradise Loop Mile 6           │
│                                               │
├───────────────────────────────────────────────┤
│                           [Cancel] [Assign ✓] │ ← Footer buttons
└───────────────────────────────────────────────┘
```

**Background (Dimmed):**
- Dashboard visible but darkened (50% opacity overlay)
- Selected reports highlighted on map (blue outlines)

**Annotations to Include:**
1. **Contextual Default:** District 7 pre-selected (explained why)
2. **Route Optimization:** "12.4 miles total" calculated from GPS coords
3. **Crew History:** "Last assignment Jan 10" provides context
4. **Batch Efficiency:** "Single action assigns 3 reports"

***

## WIREFRAME 7: Safety Circuit-Breaker (High-Risk Decision Guard)

### Purpose
Show **safety-critical UI pattern**: system refuses to allow easy approval for high-risk decisions.

### Report Detail for Critical Severity Report

```
┌─────────────────────────────────────┐
│ ← Back to Reports                   │
│                                     │
│ Report #1567                        │
│ 🔴 CRITICAL - Impassable            │ ← Red badge, all caps
├─────────────────────────────────────┤
│ [CITIZEN PHOTO: Bridge collapsed]   │
│                                     │
├─────────────────────────────────────┤
│ AI Classification                   │
│                                     │
│ TRACS 327 - Structure/Bridge Damage │
│ Confidence: 0.92 (High)             │
│                                     │
├─────────────────────────────────────┤
│ ⚠️ HIGH-RISK DECISION                │ ← Red border, 4px
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                     │
│ This report requires explicit       │
│ review before approval.             │
│                                     │
│ Required Checklist:                 │
│                                     │
│ ☐ I have reviewed the citizen photo │ ← Unchecked checkboxes
│   evidence                          │
│ ☐ GPS coordinates validated against │
│   trail geometry                    │
│ ☐ Severity classification is        │
│   appropriate (not over/under-      │
│   classified)                       │
│ ☐ Trail closure notice is justified │
│   and necessary                     │
│                                     │
│ Justification (Required):           │
│ ┌─────────────────────────────────┐ │
│ │ [Textarea - minimum 50 chars]   │ │ ← Empty textarea
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Approve High-Risk Decision]        │ ← Button DISABLED (grayed)
│ (Complete checklist to enable)      │ ← Small text below
│                                     │
│ High-risk decisions are logged for  │
│ audit compliance and require        │
│ explicit review.                    │
└─────────────────────────────────────┘
```

**Annotations to Include:**
1. **Circuit Breaker Active:** "Approval button disabled until checklist complete"
2. **Deliberate Friction:** "Designed to feel 'difficult' for safety"
3. **Audit Requirement:** "Justification logged for FedRAMP compliance"
4. **System Behavior:** "Cannot be batch-assigned; individual review required"

***

## WIREFRAME 8: Consistency Check (Pattern B)

### Purpose
Show **Tier 2B feature**: subtle intervention surfacing unconscious bias without accusation.

### Left Sidebar: New Card Appears (Below Cluster Alert)

```
┌─────────────────────────────────────┐
│ ⚠️ CONSISTENCY CHECK                 │ ← Yellow border
├─────────────────────────────────────┤
│                                     │
│ In the last 60 days, you've assigned│
│ 18 'tree down' reports to District  │
│ 3, but 0 to District 4 (which covers│
│ similar terrain).                   │
│                                     │
│ District 4 has submitted ZERO tree- │
│ down reports in that period.        │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ [BAR CHART]                     │ │ ← Visual
│ │ District 3: ████████████ (18)   │ │
│ │ District 4: (0)                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Possible explanations:              │
│ • District 4 terrain is genuinely   │
│   different (check?)                │
│ • Reporting bias (fewer submissions │
│   from District 4 area?)            │
│ • You have territory bias in        │
│   assignment patterns?              │
│                                     │
│ [View District 4 Coverage Map]      │
│ [Acknowledge Bias] [✕ Dismiss]      │
└─────────────────────────────────────┘
```

**Map Panel:**
- Shows District 3 boundary (blue outline)
- Shows District 4 boundary (orange outline, no markers)

**Annotations to Include:**
1. **Non-Accusatory Tone:** "Possible explanations" (not "you are biased")
2. **Data-Driven:** "18 vs 0" with bar chart visualization
3. **Ranger Agency:** Three action options (not a mandate)
4. **Pattern Detection:** "System detected after 60-day analysis"

***

## WIREFRAME 9: Offline/Degraded Mode (Tablet View)

### Purpose
Show **graceful degradation**: field coordinator offline sees cached data with clear staleness indicators.

### Screen Dimensions: 1024×768px (tablet landscape)

**Top Banner (Warning):**

```
┌──────────────────────────────────────────────┐
│ 📡 OFFLINE MODE                              │ ← Yellow background
│ Last data sync: 2 hours ago (9:42 AM)        │
│ Suggestions may be stale. Validate before    │
│ submitting.                                  │
└──────────────────────────────────────────────┘
```

**Simplified Two-Panel Layout:**

```
┌────────────────┬──────────────────────────────┐
│ Reports (40%)  │ Map (60%)                    │
│                │                              │
│ [List of       │ [Map showing cached markers] │
│  cached        │                              │
│  reports]      │ [Zoom controls disabled]     │
│                │                              │
│ ✓ Report #1234 │ Note: Live crew locations    │
│   TRACS 245    │ unavailable offline          │
│   [CACHED]     │ ← Gray badge                 │
│                │                              │
│ ✓ Report #1235 │                              │
│   TRACS 242    │                              │
│   [CACHED]     │                              │
└────────────────┴──────────────────────────────┘
```

**Actions Panel (Bottom):**

```
┌──────────────────────────────────────────────┐
│ Suggested Assignment (CACHED)                │
│ District 7, Crew A                           │
│ [OFFLINE] Last updated 2 hours ago; may be   │ ← Red warning text
│ stale                                        │
│                                              │
│ [Keep] [Change]                              │
│                                              │
│ [Queue for Sync] ← Button (instead of        │
│                    "Approve & Route")        │
└──────────────────────────────────────────────┘
```

**Annotations to Include:**
1. **Offline Indicator:** Yellow banner persistent at top
2. **Staleness Warning:** "Last updated 2 hours ago" on every cached element
3. **Degraded Functionality:** "Live crew locations unavailable"
4. **Queue Mechanism:** "Queue for Sync" (submits when reconnected)
5. **No Agentic Features:** Cluster detection, consistency checks disabled offline

***

## WIREFRAME 10: Feature Flag Control Panel (Admin)

### Purpose
Show **trust calibration**: admins can enable/disable agentic features per ranger or globally.

### Admin Dashboard (Desktop, 1920×1080)

```
┌───────────────────────────────────────────────────────────┐
│ TrailWatch Admin                                 [Logout] │
│                                                            │
│ ┌────────────────────┐                                    │
│ │ • Users            │                                    │
│ │ • Settings         │                                    │
│ │ ▶ Feature Flags    │ ← Selected                        │
│ │ • Audit Logs       │                                    │
│ └────────────────────┘                                    │
└───────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────────────────┐
│ Agentic UI Feature Flags                                  │
├───────────────────────────────────────────────────────────┤
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Structured AI Reasoning Display                       ││
│ │ Shows expandable reasoning panels with tool invocation││
│ │ logs                                                  ││
│ │                                                       ││
│ │ Status: ✅ Enabled for all users                      ││
│ │ Adoption: 87% of rangers expand reasoning at least 1x ││
│ │                                                       ││
│ │ [Disable Globally]                                    ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Duplicate Report Detection                            ││
│ │ Surfaces similar reports based on text + image + GPS  ││
│ │ similarity                                            ││
│ │                                                       ││
│ │ Status: ✅ Enabled for all users                      ││
│ │ Impact: 23 duplicate work orders prevented this month ││
│ │                                                       ││
│ │ [Disable Globally]                                    ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Spatial Cluster Alerts                                ││
│ │ Proactively suggests combined notices for clustered   ││
│ │ reports                                               ││
│ │                                                       ││
│ │ Status: 🟡 Beta - Enabled for 20% of rangers          ││
│ │ Acceptance Rate: 68% (rangers accept cluster insight) ││
│ │ Dismissal Rate: 32%                                   ││
│ │                                                       ││
│ │ [Enable for All] [Disable]                           ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
│ ┌────────────────────────────────────────────────────────┐│
│ │ Assignment Consistency Checks                         ││
│ │ Surfaces potential assignment bias patterns           ││
│ │                                                       ││
│ │ Status: 🔴 Alpha - Enabled for pilot group only       ││
│ │ (5 rangers)                                           ││
│ │ Feedback: Mixed (some rangers find it helpful, others││
│ │ find it intrusive)                                    ││
│ │                                                       ││
│ │ [Promote to Beta] [Keep in Alpha] [Disable]          ││
│ └────────────────────────────────────────────────────────┘│
│                                                            │
└───────────────────────────────────────────────────────────┘
```

**Annotations to Include:**
1. **Trust Dial:** "Admins can enable/disable features based on ranger feedback"
2. **Measured Impact:** Each feature shows metrics (adoption, acceptance rate)
3. **Gradual Rollout:** Alpha (5 rangers) → Beta (20%) → GA (100%)
4. **Feedback Loop:** "Mixed feedback" shown for consistency checks
5. **Safety Net:** "Disable Globally" always available

***

## ADDITIONAL WIREFRAMES (Optional: Rounds Out to 12 Screens)

### WIREFRAME 11: Report Detail - Low Confidence (Ambiguous Case)

**Purpose:** Show agent asking for help when uncertain

**Key Elements:**
- AI Confidence: 0.67 (Medium)
- Alert: "Unclear classification. Both TRACS 242 and 243 are defensible."
- Suggested Action: "You usually choose 243 for this district. Which intent?  "
- Reasoning shows why ambiguous (citizen photo shows both drainage + erosion)

### WIREFRAME 12: Audit Log Detail View

**Purpose:** Show complete decision trail for compliance

**Key Elements:**
- Timeline view of AI decision → Ranger review → Final action
- Tool invocation logs with timestamps
- Ranger justification (if overridden)
- Exportable for FedRAMP audits

***

## RENDERING INSTRUCTIONS FOR ANTIGRAVITY/GEMINI 3

**For Each Wireframe, Use This Prompt Template:**

```
Create a medium-fidelity wireframe for TrailWatch Agentic UI.

SCREEN: [Wireframe Name from above]
DIMENSIONS: [1920×1080 or 1024×768]
STYLE: Dark UI, grayscale acceptable, modern dashboard aesthetic

LAYOUT:
[Paste the ASCII layout from specification above]

DESIGN SYSTEM:
- Background: Dark gray (#1a1a1a)
- Panels: Medium gray (#2a2a2a)
- Text: White for primary, light gray for secondary
- Severity badges: Red (critical), Yellow (medium), Green (low)
- Buttons: 8px padding vertical, 16px horizontal, rounded corners
- Cards: 8px rounded corners, 16px padding, subtle borders

ANNOTATIONS:
Include numbered callouts (1, 2, 3...) pointing to:
[Paste annotation list from specification above]

FOCUS: Show realistic content density. This is an information-dense professional tool, not a minimalist consumer app.
```

***

## SUCCESS CRITERIA FOR WIREFRAMES

**Wireframes should demonstrate:**
1. **Agentic Behavior Visible:** Clear difference between "system proactively suggests" vs. "user requests"
2. **Trust Signals Present:** Confidence scores, reasoning panels, tool logs
3. **Safety Patterns Clear:** High-risk decisions feel deliberately difficult
4. **Information Density Appropriate:** Rangers can scan quickly, expand for details
5. **Graceful Degradation Shown:** Offline mode doesn't break core workflow

**What to avoid:**
- Chatbot-style interfaces
- Minimalist "white space" design (this is a data-dense professional tool)
- Auto-executing decisions (ranger always has final say)
- Hidden AI reasoning (transparency is paramount)

***

## Next Steps

1. **Generate wireframes 1-10** using Antigravity with prompts above
2. **Review with team:** Does the agentic behavior come through clearly?
3. **Iterate on 2-3 key screens** based on feedback
4. **Optional:** Generate wireframes 11-12 if time permits

Let me know if you need any prompt templates refined before sending to Antigravity!