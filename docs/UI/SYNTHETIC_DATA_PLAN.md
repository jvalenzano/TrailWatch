# Comprehensive Synthetic Data Plan for Agentic UI & Demo

**Goal:** Create a realistic “Golden Dataset” that drives all wireframes and agentic behaviors (clustering, bias checks, duplicate detection) without needing live backend infrastructure for the demo.

## 1. DATASET COMPOSITION STRATEGY
We will construct a dataset of **20–25 reports** representing a "Day in the Life" of a Ranger District. This provides enough density for clustering but is small enough to manually curate for quality.

### Core Entities
*   **Report:** The central unit (photo, location, timestamps, classification).
*   **TrailSegment:** Geometry lines (GeoJSON) for validation context.
*   **WeatherContext:** Mocks for reasoning justification.
*   **AuditLog:** The reasoning chain for high-risk/AI actions.

### Data Distribution Target
*   **Total Reports:** 24
*   **Geographic Focus:** 3 specific trails in one fictional (or real mapped) region.
    *   *Trail A (River Valley):* 12 reports (high activity).
    *   *Trail B (North Ridge):* 8 reports (cluster activity).
    *   *Trail C (Beaver Pond):* 4 reports (low activity).
*   **Hazard Types:**
    *   Obstruction/Trees (TRACS 245): ~12 (Common).
    *   Erosion/Drainage (TRACS 233): ~6.
    *   Structure/Bridge (TRACS 327): ~2 (Critical).
    *   Invasive Species (TRACS 411): ~2.
    *   Wildlife/Other: ~2.

## 2. SYNTHETIC CONTENT SOURCING
Realism is key. We cannot generate generic placeholder text.

### Photos (The "Truth" Source)
*   **Source:** Unsplash, Pexels, or Flickr Creative Commons (US Forest Service streams are great).
*   **Constraint:** Must look like amateur "citizen science" photos (phone quality, sometimes blurry, clear hazard).
*   **Inventory:**
    *   Need ~5 "distinctly different" fallen trees.
    *   Need 2 "very similar" fallen trees (for duplicate detection).
    *   Need 1 "collapsed bridge" (or significantly damaged struct).
    *   Need ~10 generic trail textures/minor issues.

### Geospatial Data (The "Validation" Source)
*   **Source:** OpenStreetMap (OSM) exports for a real location (e.g., Mount Rainier, Olympic NP, or a generic forest in Oregon).
*   **Implementation:**
    *   Extract GeoJSON for 3 specific trails.
    *   "Day hike" scale: All points within a 10km sq box.
    *   *Cluster A:* Generate 4 points within 1 mile of each other on "North Ridge".
    *   *Validation:* Ensure points are mostly "on trail" (within 20m buffer) but include 1 "off trail" anomaly.

### Text Descriptions (The "Language" Source)
*   **Source:** LLM generation with "Citizen Persona".
*   **Persona Variations:**
    *   *The Hiker:* "Big tree down, had to climb over."
    *   *The Equestrian:* "Trail unsafe for horses, loose footing."
    *   *The Biker:* "Flow interrupted by washout near mile 3."
    *   *The Tourist:* "Scary bridge, looks broken."

## 3. DATA SCHEMA & ATTRIBUTES
We need a JSON structure that supports all UI wireframes.

```json
{
  "report_id": "TR-2026-001",
  "timestamp_submission": "2026-01-19T08:15:00Z",
  "citizen_data": {
    "description": "Large tree down...",
    "photo_url": "/assets/photos/tree_01.jpg",
    "gps_raw": { "lat": 46.852, "lng": -121.760 },
    "reporter_type": "hiker"
  },
  "ai_analysis": {
    "tracs_code": "245",
    "hazard_class": "obstruction",
    "confidence_score": 0.89,
    "classification_timestamp": "2026-01-19T08:16:00Z",
    "reasoning_steps": [
      { "step": "vision", "status": "success", "detail": "Identified tree trunk > 12in diameter" },
      { "step": "spatial", "status": "success", "detail": "On trail geometry (River Valley)" },
      { "step": "size", "status": "success", "detail": "Est. removal: 2-person crew" },
      { "step": "class", "status": "success", "detail": "TRACS 245 matched" }
    ]
  },
  "assignment": {
    "district_id": "07",
    "crew_id": "A",
    "status": "pending_review",
    "suggested_reason": "4 similar reports in District 7"
  },
  "pattern_detection": {
    "cluster_id": "CL-01",
    "is_duplicate_candidate": true,
    "similarity_target": "TR-2026-015"
  }
}
```

### Suggested Enhancements (for richer agentic behavior):
*   `pattern_detection`: `is_duplicate`, `duplicate_of`, `cluster_id`, `similarity_score`.
*   `safety_alert`: boolean (for high-risk structural hazards).
*   `weather_context`: key weather fields used in reasoning.
*   You want 20–25 reports:
    *   3–4 critical (esp. collapsed bridge, extreme erosion).
    *   10–12 medium.
    *   8–10 low.

## 4. AGENTIC PATTERN REQUIREMENTS (HOW TO INSTANTIATE)

### Pattern A: Cluster Detection
**Requirements:**
*   4 reports
*   Same hazard type (e.g., downed trees, TRACS 245)
*   Within 1 mile radius
*   Submitted within 4-hour window
*   Weather: storm with strong winds 6:00–8:00 AM

**Implementation:**
*   Choose 1 trail: e.g., Wonderland Trail.
*   Pick base coordinate (one Turf along point).
*   Generate 3 additional points using turf.destination within 1 mile.
*   Assign 4 fixed timestamps from the pattern above.
*   All hazard type: "obstruction" / "clearing" with TRACS 245.
*   Attach weather mock as context for those reports.

**Store cluster metadata:**
```json
"pattern_detection": {
    "is_cluster_member": true,
    "cluster_id": "CLU-2026-01-17-STORM-WLT",
    "cluster_reason": "4 reports within 1 mile and 4 hours; storm winds 35 mph"
}
```

### Pattern B: Consistency Check (District Bias)
**Requirements (for a specific wireframe):**
*   18 reports assigned to District 3 for “tree down” hazard type.
*   0 reports to District 4 even though terrain is similar.

**Implementation:**
*   For 12–15 obstruction/clearing hazards across multiple trails:
*   Set `assignment.district = "3"`.
*   For comparable hazards (same hazard types on similar terrain):
*   Intentionally leave `district = "3"` and avoid using "4".
*   This gives you a dataset where a consistency rule can highlight skewed assignments.

### Duplicate Detection (Wireframe 5)
**Pair:**
*   `report_id = "1180"` at 2026-01-17T06:30:00Z
*   `report_id = "1234"` at 2026-01-19T08:15:00Z
*   Same photo or near-identical photos.
*   GPS difference ~15 m.
*   Hazard type & TRACS identical.
*   Computed similarity score ~0.94.

**Annotate:**
```json
"pattern_detection": {
    "is_duplicate": true,
    "duplicate_of": "1180",
    "similarity_score": 0.94,
    "duplicate_reason": "Same photo hash, location distance 15m, identical hazard type"
}
```

### High-Risk Decision (Wireframe 7)
**Bridge collapse scenario:**
*   Hazard: "structure", TRACS 327.
*   Severity: "critical".
*   Photo: AI-generated destroyed bridge.
*   `safety_alert`: true.
*   Add `human_review_flag`: true and high priority:
```json
"assignment": {
    "district": "5",
    "crew": "B",
    "status": "pending",
    "priority": "urgent"
},
"safety_alert": true
```

## 5. GENERATION WORKFLOW

### High-Level Steps
1.  **Define 20–25 report “slots” in a spreadsheet:**
    *   report_id, trail_name, hazard_type, TRACS, severity, is_cluster, is_duplicate, is_high_risk, district, etc.
2.  **Generate / source photos** and map them to those slots.
3.  **Generate GPS points** and assign to slots.
4.  **Generate descriptions** per slot (template/LLM).
5.  **Generate timestamps** and assign (cluster, duplicate, background).
6.  **Generate AI classifications** (TRACS, confidence, reasoning).
7.  **Export unified JSON.**
8.  **Create mock API responses** for weather, PostGIS, and pattern services.

### Concrete Script/Tool Stack
*   Node.js for generation scripts.
*   Turf.js for GeoJSON operations.
*   Claude API (optional but recommended) for natural descriptions.
*   Static JSON + MSW for front-end integration.

## 6. LEGAL & LICENSING CONSIDERATIONS
**Rules of thumb:**
*   **Photos:** Only use CC0/CC-BY/comparable and AI-generated content.
*   **Trail Data:** OpenStreetMap ODbL – include small attribution in README (e.g., “© OpenStreetMap contributors”).
*   **Text & Metadata:** Fully synthetic; no PII.
*   **Weather:** Synthetic; no need for real NOAA contracts for a demo.

**Create:**
*   `photos_manifest.csv` with license info.
*   `LICENSES.md` or README section summarizing data sources and licenses.

## 7. INTEGRATION GUIDANCE

### Loading Data in a React App
**Option 1: Static JSON import (fastest)**
*   Put `synthetic_reports.json` in `src/data/` or `public/data/`.
*   Import directly for local state:
```javascript
import reports from "@/data/synthetic_reports.json";
export function useReports() {
    return {
        reports,
        loading: false,
        error: null
    };
}
```

**Option 2: MSW for realistic API**
*   Setup msw handlers for endpoints:
    *   `GET /api/reports`
    *   `GET /api/patterns/clusters`
    *   `GET /api/patterns/duplicates`
    *   `POST /api/validate/location`
    *   `GET /api/weather`
*   Those handlers return views over your static `synthetic_reports.json` + mock weather/validation JSON.

### Serving Photos
*   Easiest: `/public/assets/photos/...` and reference via `/assets/photos/filename.jpg`.
*   If you want streaming/CDN: upload to Cloudinary or S3, but not necessary for local demo.
*   For fully offline portability: embed base64, but that’s heavier.

## 8. IMPLEMENTATION PLAN & ESTIMATED TIME
**Rough breakdown (assuming environment/tools are installed):**
*   **Photos:** 2–3 hours: search + download + organize + manifest.
*   **Trails & GPS:** 1–1.5 hours: OSM extraction + coordinate generation + spot checks.
*   **Text Descriptions:** 1.5–2 hours: templates + LLM calls + review.
*   **Classification & Patterns:** 1.5–2 hours: TRACS mapping, confidence, reasoning text, cluster / duplicate labels.
*   **Assembly & Integration:** 2–3 hours: join all data, output JSON, integrate with React/MSW, verify wireframes.

**Total:** ~8–12 hours of focused work.

## 9. SUCCESS CRITERIA CHECKLIST
**Before demo:**
*   [ ] 20–25 reports in JSON, JSON schema validates.
*   [ ] 15–18 photos wired up; all links resolve in UI.
*   [ ] At least:
    *   4 cluster reports (Pattern A) visible and flagged.
    *   1 duplicate pair with similarity >0.9.
    *   1 critical structural hazard with safety circuit breaker.
*   [ ] District/crew assignments show skew to demonstrate consistency check logic.
*   [ ] Weather endpoint returns “stormy morning” data aligned with cluster timestamps.
*   [ ] All wireframes 1–10 can be driven from this dataset without manual hacks.

## 10. NEXT STEPS
1.  Decide which 3–5 trails you want to “canonize” for the demo.
2.  Start with photo sourcing and OSM extraction (they’re the only parts that touch external systems).
3.  Set up a simple Node repo with:
    *   `scripts/` for GPS, descriptions, assembly
    *   `assets/photos/`
    *   `output/synthetic_reports.json`
4.  Integrate static JSON into your React app, then optionally layer MSW on top.

Once you’ve picked your actual trail list and hazard distribution, you can iterate quickly on the dataset to match new wireframes and behaviors.
