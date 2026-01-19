# TrailWatch Agentic UI: Synthesis & Visual Framework

**Research Period:** January 2026  
**Researcher Role:** Senior Agentic UI/UX Expert  
**Audience:** Tech lead + design team (non-UX specialists)  
**Goal:** Raw ideas + frameworks to synthesize into design direction

---

## EXECUTIVE SUMMARY: The Paradigm Shift

### Traditional Dashboard (Old Spec)
```
┌─────────────────────────────────────┐
│  Map | List | Stats | Dropdowns    │  ← Passive data presentation
│                                     │
│  Ranger manually: Search > Read >   │  ← High cognitive load
│  Extract > Decide > Enter           │
│                                     │
│  Time per batch: 20 min             │
└─────────────────────────────────────┘
```

### Agentic Dashboard (New Vision)
```
┌─────────────────────────────────────┬──────────────────┐
│                                     │ Sidebar:         │
│  Map (Primary)                      │ 3 Spatial Hints  │
│  - Clustering by hazard             │ ───────────────  │
│  - Heat maps by density             │ 1) Drainage      │
│  - Real-time updates                │    cluster       │
│  - Click-to-inspect                 │    (17 reports)  │
│                                     │ 2) Erosion       │
│                                     │    trend +40%    │
│                                     │ 3) Rock fall     │
│                                     │    (urgent)      │
│                                     │ ───────────────  │
│  Ranger action flow:                │ Click insight    │
│  1. See hint                        │ → Map zooms      │
│  2. Click                           │ → Shows detail   │
│  3. Confirm AI suggestion           │ → Approve batch  │
│                                     │                  │
│  Time per batch: 5 min              │ AI Reasoning:    │
│                                     │ 92% confident    │
│                                     │ Why? [Details]   │
└─────────────────────────────────────┴──────────────────┘
```

---

## KEY INSIGHT #1: Geospatial Context is the Trust Builder

### Why Maps > Chat for Government

| Modality | Ranger Mental Model | Latency | Trust Mechanism |
|----------|-------------------|---------|-----------------|
| **Map** | "Show me the problem spatially" | Instant | Visual evidence (see cluster) |
| **Chat** | "I have to describe my question" | 2-4 sec NLP | Language parsing (error-prone) |
| **List** | "Scan 50 items" | Cognitive overhead | No pattern recognition |

### Visual Precedent: FEMA Disaster Response

FEMA's 2024 approach:
1. Pre-disaster imagery → identifies "built areas" (vulnerable zones)
2. Post-disaster aerial → maps damage extent
3. Geospatial damage assessment → within 72 hours, shows priorities
4. Machine learning → extracts features from imagery

**Result**: Rangers (FEMA personnel) make faster, better decisions because *spatial context is primary*.

**TrailWatch application**: Trail hazards are inherently geospatial → map-first UI is natural, not forced.

---

## KEY INSIGHT #2: Confidence ≠ Trust

### The Calibration Problem

```
Ranger sees: "AI says: Rock fall (92% confident) ✓"
├─ Scenario A (Bad): Ranger clicks approve without reading
│  └─ Result: Automation bias, ranger outsources decision
│
└─ Scenario B (Good): Ranger clicks "Why confident?"
   └─ Shows: [Photo + caption] [GPS validation] [Hiker corroboration]
   └─ Ranger reads evidence, makes informed decision
   └─ Ranger builds mental model: "AI is good at photo analysis"
```

### Design Pattern: Confidence as Conversation Opener

Instead of:
- "92% confidence ✓ APPROVE"

Use:
- "High confidence | Found via: Photo analysis + Hiker review"
- "Why this ranking? [Click to expand]"
- "Similar past cases: 3/3 were accurate rock falls"

**Outcome**: Ranger feels in control, not overruled by AI.

---

## KEY INSIGHT #3: Reversibility > Perfection

### Government Decision-Making Reality

Government workers are risk-averse because:
1. **Accountability**: "If something goes wrong, I'm blamed"
2. **Compliance**: "I need to justify every decision"
3. **Precedent**: "This is how we've always done it"

**Solution: Make all AI-assisted decisions reversible**

```
Ranger approves batch assignment (15 reports → Crew B)
     ↓
System logs: When, who, AI reasoning, confidence
     ↓
[Within 5 minutes]
Ranger can click "Undo" with new reasoning
     ↓
[After 5 minutes]
Requires manager override to reverse
     ↓
Full audit trail: Original decision + override + new reasoning
```

**Why this works**:
- Ranger can trust the system (mistakes are reversible)
- Compliance requirement met (full audit trail)
- Low barrier to AI adoption (no perfectionism pressure)

---

## KEY INSIGHT #4: Multi-Modal Input for Field Reality

### What Works (Production-Ready, Jan 2026)

| Input Method | Use Case | Tech | Constraint |
|-----------|----------|------|-----------|
| **Photo upload** | Citizen documents hazard | Cloud Storage + Gemini Vision | Works offline (queue locally) |
| **GPS coordinates** | Precise location | Phone geolocation + PostGIS | Works offline (log locally) |
| **Voice memo** | Hiker context ("heard crack before rockfall") | Web Speech API + Gemini | Browser-native, no SaaS |
| **Text description** | Narrative hazard details | Standard text input | Works offline |
| **Keyboard shortcuts** | Power user batch operations | HTML keyboard events | Fully accessible |

### What's Experimental (Avoid for MVP)

❌ Hand gesture recognition (too unreliable in field)  
❌ Complex voice commands ("Assign all critical drainage...") — NLP fragile  
❌ Emoji reactions — government users need audit trail  

---

## KEY INSIGHT #5: The Streaming Architecture Changes Everything

### SSE (Server-Sent Events) for Streaming Extraction

```
Timeline:
  t=0s: User uploads photo + text to Cloud Run
  t=0.5s: Cloud Run calls Vertex AI Gemini
  
  t=2s: First token arrives via SSE stream
        UI shows: "Analyzing... Found: Rock..."
        
  t=4s: Confidence update
        UI shows: "92% confidence | Analyzing location..."
        
  t=6s: Complete extraction
        UI shows: Full structured data + explanations
        
  Ranger sees the "thinking" in real-time, not waiting for final result
```

**Why this matters for government**:
- Transparent process (ranger sees work, not black box)
- Faster feedback (partial results appear immediately)
- Better UX (user sees activity, not spinning wheel)

**Tech stack**:
- Cloud Run (stateless) → calls Vertex AI
- Cloud Run returns EventSource stream (SSE)
- React client listens via `useEffect + EventSource`
- Or: Vercel AI SDK v5 (abstraction layer)

---

## KEY INSIGHT #6: Anti-Pattern: "Just Add a Chatbot"

### Why This Fails

```
Old Dashboard (map + list + filters)
     +
"AI Chatbot" (new sidebar)
     =
Worst of both worlds
```

**Failure mode**:
1. Ranger sees map
2. Ranger wants to ask about drainage cluster
3. Ranger types in chat: "Show drainage reports"
4. Chat responds: "Found 17 drainage reports..."
5. Ranger still has to manually click on map
6. Result: Extra step, more friction

**Better solution: Spatial suggestions (not chat)**

```
Sidebar: "3 Insights About Your Data"
───────────────────────────────────
1. Drainage cluster detected
   Bear Valley region, 17 reports, 40% of weekly volume
   [Suggest: Batch assign to Crew C] [Learn More]

2. Erosion trend
   North ridge +40% week-over-week
   [Suggest: Flag for field inspection] [Learn More]

3. Rock fall (new)
   Trail A km 3.2, high confidence
   [Suggest: Closure notice] [Approve] [Review]
```

Ranger clicks → Map updates → Shows detail → Approve/reject

**Why this works**: 
- Spatial-first (map stays primary)
- One-click actions (no typing)
- Explainable (ranger sees reasoning)

---

## TECH STACK RECOMMENDATION: MVP (3-4 Months)

### Frontend

```
React 19 + TypeScript
├─ Next.js 15 (for SSR, Cloud Run deployment)
├─ Deck.gl v9 (geospatial visualization)
├─ Mapbox GL JS (basemap)
│  └─ ⚠️ FedRAMP concern: May need Google Maps Tiles API swap
├─ React-Map-GL (state management)
├─ Tailwind CSS + Shadcn/ui (components)
└─ Vercel AI SDK v5 (streaming chat hooks)
   └─ Or: Custom AG-UI protocol for more control
```

### Streaming

```
Option A (Simpler): Vercel AI SDK v5
├─ useChat hook for message history
├─ SSE-based streaming
├─ Works with Gemini via proxy
└─ Less control over thinking steps

Option B (More Control): AG-UI Protocol
├─ Custom Cloud Run endpoint
├─ EventSource stream with structured events
├─ Explicit thinking/tool-use visualization
└─ More code, better transparency
```

### Backend

```
GCP Cloud Run
├─ Python service (calls Vertex AI)
├─ Returns SSE stream
├─ Audit logging
└─ FedRAMP-compliant

GCP Services:
├─ Vertex AI Gemini (extraction)
├─ Cloud SQL + PostGIS (trail geometries)
├─ Cloud Storage (photos)
└─ BigQuery (analytics, audit)
```

### Offline Mobile

```
React Native or Flutter (separate app)
├─ SQLite (local cache)
├─ Service Worker sync (web PWA fallback)
├─ Queues reports locally
└─ Syncs when connected
```

---

## DESIGN PATTERN: Mixed-Initiative Batch Assignment

### User Flow Diagram

```
Scenario: Ranger has 15 new reports, needs to assign crews

Step 1: Open Dashboard
┌──────────────────────────────────┐
│ Map shows 15 new reports         │
│ Color-coded by hazard type       │
│ Sidebar shows: "1 Batch insight" │
└──────────────────────────────────┘

Step 2: Sidebar Suggestion Appears
┌──────────────────────────────────┐
│ "Batch assignment suggested"     │
│ 15 reports → Crew assignments    │
│                                  │
│ Crew A: 3 reports (nearby)       │
│ Crew B: 7 reports (close)        │
│ Crew C: 5 reports (far)          │
│                                  │
│ Why this assignment?             │
│ [Show: Proximity + Skills]       │
└──────────────────────────────────┘

Step 3: Ranger Reviews
├─ Clicks "Proximity" → Shows distances
├─ Clicks "Skills" → Shows crew training
├─ Sees confidence: "92% optimal routing"
└─ Can manually adjust (drag/drop if desired)

Step 4: Ranger Approves
├─ Clicks "Confirm Assignment"
├─ System shows: "Assigning 15 reports to 3 crews..."
├─ Real-time: Map updates with color-coded crew assignments
├─ Audit trail created: [Ranger name] [Timestamp] [AI reasoning] [Confidence]
└─ Undo button appears (5-min window)

Step 5: Field Crew Gets Notification
├─ Mobile app updates: "You have 7 new assignments"
├─ Auto-sorted by proximity
├─ Ranger can tweak routing if field conditions change
└─ Real-time feedback to decision dashboard
```

---

## PATTERN: Confidence Visualization (4 Levels)

### Visual Design

```
Level 1: NO EVIDENCE (Gray)
  │░░░░░░░░░░│ 0%
  │ Cannot determine                  │
  │ [More info needed]                │

Level 2: LOW-MEDIUM (Yellow)
  │░░░░░░░░░░│ 50%
  │ Partial evidence                  │
  │ Found: Rock (via photo)           │
  │ Missing: Hiker review confirmation│
  │ [Review recommended]              │

Level 3: HIGH (Green)
  │░░░░░░░░░░│ 85%
  │ Strong evidence                   │
  │ Found via: Photo + hiker review + GPS │
  │ Similar past cases: 8/10 accurate │
  │ [Confident to approve]            │

Level 4: VERY HIGH (Dark Green)
  │░░░░░░░░░░│ 95%
  │ Overwhelming evidence             │
  │ Photo clear + hiker firsthand     │
  │ [Safe to approve]                 │
```

### Implementation in React

```typescript
<ConfidenceIndicator
  confidence={0.92}
  level="high"
  factors={['photo_analysis', 'hiker_credibility']}
  onExplainClick={() => setShowExplanation(true)}
/>

// Rendered as:
// Green bar at 92% + "High confidence" label
// Click for breakdown of factors
```

---

## GOVERNMENT ANTI-PATTERNS: What NOT to Do

### Anti-Pattern 1: Invisible AI

❌ **Bad**: AI recommends action, no explanation
```
Ranger sees: "Assigned to Crew B ✓"
Ranger thinks: "Why Crew B? I would've chosen Crew A..."
Ranger action: Manually reassigns, ignores AI
```

✅ **Good**: Show reasoning
```
Ranger sees: "Assigned to Crew B"
            "Why? Closest (2mi) + trained (rock removal) + available"
Ranger thinks: "That makes sense"
Ranger action: Approves, trusts AI
```

### Anti-Pattern 2: Overconfidence

❌ **Bad**: AI shows "99.7% confident"
- False precision (not real)
- Users think it's infallible
- When it fails, trust collapses

✅ **Good**: Show "High confidence (92%)"
- Honest about uncertainty
- Users expect occasional mistakes
- When it fails, it's "acceptable uncertainty"

### Anti-Pattern 3: No Undo

❌ **Bad**: Ranger approves batch, can't reverse
- "If I made a mistake, I'm accountable"
- Rangers become overly cautious
- Slows adoption

✅ **Good**: Undo within 5 minutes
- "I can reverse this if I realize I was wrong"
- Encourages confidence
- Audit trail captures both decisions

### Anti-Pattern 4: Over-Automation

❌ **Bad**: "AI will handle crew assignment automatically"
- Ranger feels out of control
- "What if AI makes mistake?"
- Ranger overrides system repeatedly

✅ **Good**: "AI suggests, you confirm"
- Ranger is decision-maker
- AI is advisor
- Ranger builds confidence over time

### Anti-Pattern 5: Algorithmic Aversion (Post-Failure)

❌ **Bad**: After one chatbot failure (misinformation), agency abandons all AI
- Real example: OECD 2025 findings on government adoption
- Results in slower, worse outcomes
- Users resort to manual processes

✅ **Good**: Build trust through transparency + oversight
- Users see reasoning
- Users can override
- Users learn system reliability over time
- Failures are expected + logged, not catastrophic

---

## CASE STUDY: DARPA ASTARTE (Military C2)

### The Lesson

DARPA tested AI-augmented command-and-control system (ASTARTE) with military personnel (2023).

**Key finding**: Transparency of decision process > accuracy of recommendation

```
Test 1: Black-box AI recommendations
└─ Result: Commanders ignored AI, used legacy system
└─ Trust: Low
└─ Reason: "I don't understand why the system said that"

Test 2: AI recommendations + reasoning (why this course of action)
└─ Result: Commanders reduced legacy system usage by 60%
└─ Trust: High
└─ Reason: "I see the logic, makes sense"
```

**Quote**: 
> "Role players reported a greater understanding of how the ASTARTE system executes tasks. We observed significantly reduced reliance on legacy C2 systems while using the ASTARTE software." — Dr. Mary Schurgot, DARPA

**Implication for TrailWatch**:
- Show reasoning = Rangers will trust AI
- Black box = Rangers will ignore AI
- This is more important than accuracy

---

## RESEARCH GAP: Questions to Validate with USFS

### Before Design Starts

**Volume & Frequency**:
1. How many citizen reports per day? (10? 100? 1000?)
2. How many rangers staff your district? (triage one person or team?)
3. Batch size typical? (1 report? 15? 50?)

**Hardware & Connectivity**:
4. Ranger primary device? (Desktop, laptop, mobile?)
5. Office or field-based most of time?
6. Do rangers need offline capability?
7. Network connectivity in field? (LTE? WiFi hotspot? Offline-only?)

**Current Workflow**:
8. How do you currently handle 15 reports? (Describe workflow time)
9. What's most time-consuming? (Reading? Classification? Assignment?)
10. Do you use TRACS taxonomy in daily work?
11. How many hazard types do you typically manage?

**Decision Authority**:
12. Can a single ranger approve trail closure notice?
13. Is there a manager override process?
14. How long do decisions take from submission to action?

**Integration**:
15. Do you use any existing GIS tools? (ArcGIS? OpenStreetMap?)
16. Do you have a USFS-wide system we need to integrate with?
17. Can we store data in GCP or is there a data residency requirement?

**Trust & Adoption**:
18. What would make you trust AI-assisted decisions?
19. Have you tried AI tools before? How did it go?
20. What's your biggest concern about AI in trail management?

---

## PROOF-OF-CONCEPT ROADMAP (3-4 Months)

### Month 1: Streaming Foundation

**Week 1-2: Backend Setup**
- Cloud Run service
- Vertex AI Gemini integration
- SSE streaming to React client
- Dummy photo uploads

**Week 3-4: Frontend Streaming**
- React component consumes SSE stream
- Shows partial extraction in real-time
- Test latency: "How fast does ranger see first result?"

**Success Metric**: Extraction appears on screen within 6 seconds of upload

### Month 2: Confidence & Trust

**Week 5-6: Confidence Visualization**
- Display confidence % + explanation
- "Why confident?" expandable section
- Show factors (photo quality, GPS accuracy, hiker credibility)

**Week 7-8: Map Integration**
- Deck.gl + Mapbox basemap
- Plot reports as points
- Click-to-inspect detail view
- Show extracted data + confidence

**Success Metric**: Rangers say "I understand why AI thinks this is a rock fall"

### Month 3: Mixed-Initiative

**Week 9-10: Spatial Suggestions**
- Sidebar: Top 3 insights about data
- "Drainage cluster in Bear Valley (17 reports)"
- Click → map updates + shows detail

**Week 11-12: Batch Assignment**
- Ranger confirms AI batch suggestions
- Map updates with crew assignments
- Undo button + audit logging
- Real-time sync to mobile crew app

**Success Metric**: 15-report batch takes < 5 min (vs. 20 min baseline)

### Month 4: Polish & Offline

**Week 13-16:**
- Offline capability (cache, sync)
- Accessibility audit (keyboard nav, screen readers)
- User testing with actual rangers
- Iterate on design
- Documentation

---

## TECH DECISION TREE

```
Starting point: "I want agentic UI for TrailWatch"

Question 1: How much control over streaming events do you need?
├─ "I want quick MVP, happy with abstractions?"
│  └─→ USE: Vercel AI SDK v5
│      • useChat hook + SSE
│      • Works with Gemini via proxy
│      • Less control, faster shipping
│
└─ "I need fine-grained control over events?"
   └─→ USE: AG-UI protocol + custom Cloud Run
       • Full visibility of thinking steps
       • Tool-use visualization
       • More code, better transparency

Question 2: FedRAMP required at MVP?
├─ "Yes, FedRAMP must be compliant from day 1"
│  └─→ Replace: Mapbox GL JS → Google Maps Tiles API
│     Check: All GCP services are FedRAMP-authorized
│
└─ "No, FedRAMP can wait for Phase 2"
   └─→ OK: Use Mapbox GL JS now, migrate later

Question 3: Offline capability essential?
├─ "Yes, rangers need to work offline"
│  └─→ Add: SQLite + Service Worker (PWA)
│     Or: React Native app for mobile
│
└─ "No, always connected (office-based)"
   └─→ Skip: Just use web dashboard, no PWA needed

Question 4: Team expertise?
├─ "We're React/TypeScript experts"
│  └─→ Recommended: AG-UI protocol (more control)
│
└─ "We prefer higher-level abstractions"
   └─→ Recommended: Vercel AI SDK v5 (faster shipping)
```

---

## FINAL THOUGHT: Trust-by-Design, Not Disclaimer

Government agencies have learned: **Transparency > Disclaimers**

A chatbot that says "I might be wrong" but doesn't show reasoning → users don't trust it.

A system that shows reasoning + confidence + allows override → users trust it, even with uncertainty.

**Design principle for TrailWatch**:
- Make AI thinking visible at every step
- Let rangers override without guilt
- Log everything for compliance
- Treat rangers as decision-makers, AI as advisor

This is harder to build (more UI complexity, more data logging) but results in **adoption** rather than **resistance**.

---

*Synthesis prepared January 2026. Raw research available in `agentic_ui_research.md`.*
