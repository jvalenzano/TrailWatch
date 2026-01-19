# TrailWatch Agentic UI Research: January 2026

## Raw Research Notes (Synthesis in Progress)

---

## 1. INTERACTION PARADIGMS: Beyond Chatbots

### Emerging Agentic UX Patterns (2025-2026)

**Source: agentic-design.ai/patterns/ui-ux-patterns**

Core paradigm shift: **From control-centric to outcome-oriented interaction**

Key patterns identified:
- **Progressive Disclosure of Reasoning** - Show agent reasoning steps in stages, not all at once
  - Don't overwhelm users with "thinking" output
  - Surface key decisions and confidence levels
  - Hide complexity behind collapsible/expandable sections
  
- **Mixed-Initiative Interfaces** - Humans and AI operating on shared goals
  - Users make high-level decisions ("prioritize drainage issues")
  - AI executes and refines (batch ops, assignments, routing)
  - Not command-driven, not fully autonomous
  - Example: User drags pins on map, AI suggests crew assignments based on proximity/skills
  
- **Confidence Visualization Patterns** - Build trust through transparency
  - Show uncertainty ranges, not false precision
  - Explain what drives confidence (data quality, model certainty)
  - Color gradients or visual indicators (Low/Med/High)
  - **Critical**: Avoid making low confidence "alarming" - normal uncertainty shouldn't trigger anxiety
  
- **Adaptive Interfaces** - Learns from user behavior
  - Capture signals: pauses, repeated actions, skipped steps
  - Offer context-aware help without interrupting workflow
  - Detect hesitation and proactively surface relevant info

- **Conversational Agent Interfaces** (NOT just chatbots)
  - Agent-driven, proactive interactions
  - Multimodal (text, voice, visual hints)
  - Context-aware modality selection (voice in field, visual on desktop)
  - Agents initiate suggestions, not just respond to commands

---

## 2. CONVERSATIONAL + VISUAL HYBRID: The Emerging Pattern

### What Works

**Deck.gl + Mapbox as Foundation**
- Deck.gl v9 now has full TypeScript support (2024)
- ~150K weekly downloads, enterprise-proven (Uber, CARTO use it)
- React integration via MapboxOverlay or reverse-controlled option
- GPU-powered rendering for large-scale geospatial data
- Can handle real-time streaming updates

**Hybrid Dashboard Structure:**
1. **Map as Primary Interface** (not secondary)
   - Geospatial context is king for trail data
   - Clustering, filtering, heat mapping built in
   - Click-to-inspect flow (map → detail view)

2. **Sidebar Conversational Panel** (not full-width chat)
   - "Smart suggestions" column, not a chatbot column
   - AI highlights spatial patterns: "Cluster of 5 rock-fall reports in Bear Valley"
   - Ranger can click suggestion → map highlights relevant region → shows triage queue
   - Works alongside map, not replacing it

3. **Inline AI Assistance in Detail Views**
   - When reviewing a citizen report, show AI's extraction highlighted
   - "Found: Rock in Trail (confidence: 92%), Location: Trail km 3.2"
   - Ranger can edit/approve inline
   - Confidence indicators + "Why confident?" explanation

### What's Failing

From Microsoft Research (2025):
- **Overreliance on AI**: Users make excuses for AI mistakes ("maybe the hiker data was wrong")
- **Loss of responsibility**: Ranger blames themselves for AI errors instead of questioning AI
- **Automation bias**: Clicking approve without reviewing because "AI probably got it right"
- **Chatbot trap**: Companies putting a chat window in legacy dashboards and calling it "AI-augmented"
  - Doesn't reduce cognitive load
  - Users have to translate map → natural language → ask agent → get response
  - Loses spatial context

### Government Risk: "Algorithmic Aversion"

OECD 2025 report: After chatbot failures in government (misinformation, hacking), agencies developed **algorithmic aversion** — reluctance to use algorithms despite superior performance.

**Key insight for TrailWatch:** Transparent AI isn't enough; need to show *how* AI reduces ranger workload while preserving decision authority. This is a trust calibration problem.

---

## 3. MULTIMODAL INPUT: Production-Ready vs. Experimental

### Production-Ready (as of Jan 2026)

**Voice Input**
- Web Speech API mature in Chrome/Edge
- Use case: Rangers dictating notes during triage
- Issue: Noisy office/dispatch centers may not work
- **Constraint check**: No third-party SaaS; must use browser APIs or GCP Speech-to-Text

**Camera/Photo Upload**
- Citizen hiker takes photo of rockfall
- Uploaded to Cloud Storage → Gemini Vision model extracts hazard data
- This is already in TrailWatch backend spec
- Frontend: Fallback support for offline; cache locally, sync when connected

**Gesture/Touch Input** (Experimental for field work)
- Pinch-to-zoom: Standard, all maps support it
- Swipe to pan: Standard
- Long-press for context menu: Common pattern
- **Experimental**: Gesture shortcuts (e.g., swipe-up to open triage queue) — nice-to-have, not MVP

**Keyboard Shortcuts**
- For power users (coordinators doing batch ops)
- E.g., Cmd+A to select all reports on map, Cmd+X to assign to work crew
- Standard accessibility (full keyboard navigation for screen readers)

### Avoid for Government Users
- **Hand gesture recognition** (gesture-to-face): Too experimental, unreliable in field conditions
- **Complex voice commands** ("Assign all critical drainage issues reported since Tuesday to crew B"): Fragile NLP; rangers lose trust
- **Emoji reactions**: Cute, but government users need audit trails; emoji ≠ clear decision intent

**Field Worker Reality:** Offline-capable mobile app with photo + voice memo is priority. Dashboard gesture shortcuts are secondary.

---

## 4. LIBRARIES & FRAMEWORKS: React/TypeScript Stack

### Geospatial Visualization

**Deck.gl (Recommended for TrailWatch)**
- Open-source, GCP-native (no licensing concerns)
- TypeScript support (v9+)
- React wrapper: `@deck.gl/react`
- Example layers for TrailWatch:
  - `ScatterplotLayer` (reports as points)
  - `HexagonLayer` (heat map of hazard density)
  - `IconLayer` (ranger location, crew status)
  - `GeoJsonLayer` (trail geometries, no-go zones)
- Performance: Handles 100K+ points smoothly

**Mapbox GL JS** (Basemap)
- De facto standard for web mapping
- Free tier sufficient for US-only data (TrailWatch scope)
- Good tile server integration
- SaaS model ⚠️ — FedRAMP question: Is Mapbox acceptable?
  - Alternative: Google Maps / GCP Maps Tiles API (FedRAMP-compliant)
  - Deck.gl can work with GCP Maps Tiles as well

**React-Map-GL**
- Official React wrapper for Mapbox
- Clean API for controlling map state
- Integrates well with Deck.gl

### Streaming & Real-Time AI Responses

**AG-UI Protocol** (DataCamp, Dec 2025)
- Event-sourcing model: Agent sends stream of events, not waiting for final response
- Separates "thinking steps" from final response
- Can surface partial results while agent is still reasoning
- Protocol-based: Language-agnostic (works with any LLM backend)
- **Implementation**: Server sends SSE (Server-Sent Events) stream to React client

**Example AG-UI flow for TrailWatch:**
```
User uploads citizen report → Gemini starts extracting hazard
Client opens SSE stream listening for:
- TEXT_MESSAGE_CONTENT (partial extraction as it arrives)
- TOOL_USE (showing map lookup, TRACS mapping)
- THINKING_STEP (reasoning traces: "Checking if coordinates valid...")
- FINAL_OUTPUT (complete structured hazard data)

UI displays:
1. Streaming text: "Found rock, confidence 85%..."
2. Tool use badge: "[Validating GPS coordinates]"
3. Confidence bar animates from 0 → 85%
4. Final result card shows approved extraction
```

**React Implementation Pattern:**
- Use `useEffect` + EventSource for streaming
- State batching with `useState` to avoid excessive re-renders
- Suspense boundaries for loading states
- Fallback: If stream fails, show cached partial result

**Vercel AI SDK** (alternative)
- Higher-level than AG-UI
- Built for React streaming
- Good for conversational AI, less tested for geospatial
- Smaller ecosystem for GIS use cases

### Confidence & Uncertainty Display

**Visual Patterns:**
- **Progress bar**: 0-100% (simple)
- **Color gradient**: Gray (uncertain) → Yellow (medium) → Green (high confidence)
- **Explanation badge**: Hover/click to see "Confidence driven by: GPS accuracy + hiker review score"
- **Uncertainty band**: Show range, not point estimate
  - Instead of "92% confidence", show "89-95% confidence" with gray band

**React Component Pattern:**
```typescript
<ConfidenceIndicator 
  value={0.92}
  factors={['gps_accuracy', 'hiker_credibility']}
  onExplainClick={() => showExplanation()}
/>
```

### Error Handling & Undo

**Design Pattern: Confirm Before Committing**
- Ranger reviews extraction
- Ranger clicks "Approve & Close Trail"
- UI shows confirmation dialog with AI reasoning
- After approval, audit trail logged (when, who, confidence, reasoning)

**Undo Pattern:**
- Ranger can "Undo last decision" if made within 5 minutes
- Useful for fat-finger mistakes (mis-assigned crew)
- After 5 minutes, requires manager override (to preserve audit trail)

---

## 5. GOVERNMENT/GIS PRECEDENTS

### Relevant Case Studies

**FEMA Disaster Response (2024-2025)**
- Uses pre/post-disaster aerial imagery + geospatial damage assessments
- Within 72 hours, estimates damaged buildings and severity
- Machine learning + SAR (Synthetic Aperture RADAR) identify features of interest
- GIS software integrates geospatially-referenced data
- **Key insight for TrailWatch**: Geospatial layer is the decision enabler; AI is the annotation layer
- **Trust mechanism**: Humans validate AI damage assessments before resource allocation

**NOAA/NPS Precedents** (hinted in searches, not fully available)
- Likely use similar patterns: map-first, AI-assist, human sign-off
- Precedent for multiagency coordination (FEMA ↔ local)
- FedRAMP compliance standard across federal GIS

**Interface Design Lessons from FEMA:**
1. Situational awareness is paramount → spatial visualization first
2. Time-constrained decision makers → triage queues matter
3. Multi-stakeholder workflows → clear handoff points
4. Audit trails non-negotiable → log all AI reasoning

### Why Traditional Gov Dashboards Fail

OECD 2025 Implementation Report:
- **Risk aversion**: After AI chatbot failures, agencies over-correct
- **Skills gaps**: Rangers and coordinators not trained on AI-assisted workflows
- **Poor data quality**: Citizen input is unstructured; AI handling this is actually a win
- **Lack of guidance**: No clear "when to trust AI vs. when to question it"
- **Legacy systems**: Existing tools don't integrate well; new AI UI feels bolted-on

**TrailWatch opportunity:** If we design for trust-by-design (not trust-by-disclaimer), we can overcome risk aversion.

---

## 6. ANTI-PATTERNS: What Not to Do

### The Chatbot Trap
❌ **"Just add a chat window to the dashboard"**
- Rangers don't think in natural language about spatial problems
- "I need to see drainage reports in the Bear Valley section"
  - With chatbot: Type message → wait for NLP parsing → get text results → mentally map to geography
  - With agentic map: Click region → see clustered reports → select → assign
- Adds friction, not reduces it

### Overconfidence Indicators
❌ **Show false precision**
- "92.371% confidence this is a rock fall" → Users think it's ground truth
- Better: "High confidence (92%) | Likely rock fall"
- Even better: "High confidence | Why? Photo shows boulder + hiker review confirms"

### Invisible AI Reasoning
❌ **Black-box decisions**
- Ranger sees: "Assigned to Crew B"
- Doesn't see: AI reasoning (proximity, skill match, workload)
- Result: Ranger doubts the assignment and reassigns manually
- Better: Show "Assigned to Crew B because closest (2 mi away) & trained in rock removal"

### Automation Bias
❌ **Make AI approval too easy**
- Single-click approve → ranger stops reading the actual extraction
- Better: Require inline review (highlight extracted text, confirm each field)
- Or: Multi-step approval (preview → review → confirm → audit log)

### Cognitive Overload
❌ **Too many AI suggestions at once**
- Map shows 50 colored points, sidebar has 10 AI insights, triage queue has 30 items
- Ranger is paralyzed by choice
- Better: Progressive disclosure
  1. Show critical hazards first (closures only)
  2. On-demand: "Show me drainage recommendations"
  3. Filtering: Rangers can hide certain hazard types

### Offline Amnesia
❌ **AI features require live connection**
- Ranger in field, offline
- Can't see AI-extracted data because backend inference is down
- Better: Cache extracted data locally; sync when connected
- Or: Run lightweight inference client-side (Gemini Nano?)

### Over-Reliance on AI Attribution
❌ **"AI says it's safe, so ranger approves without review"**
- Citation: Microsoft 2025 research on GenAI reliance
- Ranger loses decision-making muscle
- Better: Require rangers to understand the evidence, not just trust the label
- Design pattern: "Ranger must click 3+ extracted fields to approve"

---

## 7. TRUST & ADOPTION: The Real Challenge

### Why Rangers Might Reject TrailWatch AI

1. **Loss of autonomy**: "AI is deciding for me"
   - Solution: Mixed-initiative framing ("AI suggests, you decide")

2. **Accountability shift**: "If something goes wrong, I blamed the AI?"
   - Solution: Audit trails showing ranger approval + reasoning

3. **Unfamiliar workflow**: "This isn't how we used to do it"
   - Solution: Onboarding, training, buy-in from ranger reps

4. **Fear of mistakes**: "What if AI misclassified a hazard?"
   - Solution: Show confidence, allow override, log all decisions

5. **Performance anxiety**: "What if I'm slower using this than before?"
   - Solution: Measure task time and show improvements (data-driven)

### Building Trust: Design Principles for Government Users

1. **Explainability > Accuracy**
   - Rangers care more about understanding *why* than blind accuracy
   - "92% confident this is rock debris (found via photo analysis + hiker description)"

2. **Reversibility > Automation**
   - Undo within 5 min (reversible decision)
   - Manual override always available
   - Don't "optimize away" human control

3. **Transparency > Efficiency**
   - Show reasoning traces, even if it takes 3 clicks instead of 1
   - Better: Ranger understands and trusts vs. ranger clicks blind and doubts

4. **Auditable > Opaque**
   - Every AI decision logged with reasoning, confidence, source data
   - Regulatory/legal requirement + builds confidence

5. **Localized Feedback > Global Metrics**
   - Rangers care: "Did this batch operator work for *me*?"
   - Not: "System-wide 94% accuracy" (abstract, not actionable)

---

## 8. RESEARCH INSIGHTS: "Aha" Moments

### AG-UI Protocol Insight
- Separating thinking steps from final output is game-changing for agentic UX
- Users can see *what* the AI is doing while it reasons
- Builds confidence in process, not just result
- Implementable via SSE (Server-Sent Events) from GCP Vertex AI

### Mixed-Initiative vs. Autonomous
- Rangers + AI aren't competing for control
- Rangers set goals/constraints; AI executes + suggests refinements
- Example: "Assign these 15 rock reports to available crews"
  - AI: Suggests optimal assignment (by proximity, skill, workload)
  - Ranger: Reviews, tweaks crew assignments if local knowledge overrides AI
  - Final decision: Ranger approves and logs it
- This reduces friction AND preserves decision authority

### Confidence as UI Element
- Not just a number; it's a conversation opener
- Click "Why 92%?" → See evidence
- Builds mental model of AI reliability
- Ranger learns: "This AI is good at photo analysis, mediocre at GPS validation"

### Geospatial Context is Trust Builder
- Humans are spatial beings; maps are intuitive
- Compared to chatbot conversation (abstract), map interaction feels concrete
- Ranger sees cluster of reports → clicks → sees detail → trusts the pattern

### Field/Desktop Split
- Citizens (field) need mobile + offline + simple
- Rangers (triage) need rich visualization + decision tools
- Different agentic UX patterns for each; don't try to unify

---

## 9. GCP STACK: What's Actually Available

### Vertex AI Streaming & Real-Time

- **Streaming Ingestion** (Feature Store + Matching Engine): Real-time vector updates
- **Streaming API** (nascent): For real-time model predictions
- **Cloud Run**: Stateless inference service
  - Can return SSE (Server-Sent Events) stream to frontend
  - Good for streaming Gemini responses during extraction

### Frontend Integration Options

**Option A: Direct Gemini API from Frontend (NOT recommended for gov)**
- Security: API keys exposed to browser
- ❌ FedRAMP issue: Data leaves GCP cloud boundary

**Option B: Cloud Run Proxy (Recommended)**
- Frontend calls Cloud Run endpoint
- Cloud Run calls Vertex AI Gemini
- Cloud Run returns SSE stream to frontend
- Keeps data within GCP; can add audit logging

**Option C: Cloud Functions (for batch processing)**
- Less suited for streaming
- Good for async extraction (citizen uploads → function processes → stores → notifies ranger)

### FedRAMP-Compliant Stack

- Google Cloud (GCP): FedRAMP-authorized (DoD P-ATO)
- Vertex AI: FedRAMP-compliant
- Cloud Run: FedRAMP-compliant
- Cloud Storage: FedRAMP-compliant
- BigQuery: FedRAMP-compliant
- ⚠️ **Mapbox GL JS**: NOT FedRAMP-certified (SaaS)
  - Alternative: Google Maps Tiles API (FedRAMP-certified)
  - Deck.gl works with both

---

## 10. CREATIVE / CHALLENGING IDEAS

### Idea 1: "Ambient Triage"
- Ranger opens dashboard, doesn't even click
- Sidebar widget shows top 3 recommendations:
  - "17 drainage reports this week (unusual) | Recommend: Batch assign to crew C"
  - "Trail closure: Rock fall at km 3.2 (High confidence) | Approve notice?"
  - "Trend alert: Erosion reports up 40% in past 10 days (data: spring melt?)"
- No chat, no prompting; AI proactively surfaces insights
- Ranger can dismiss or click to explore
- Design challenge: Avoid alert fatigue

### Idea 2: "Explain the Disagreement"
- Ranger overrides AI assignment ("No, assign this to crew D, not B")
- System logs it and learns ranger's local knowledge
- Over time, AI improves by learning ranger's criteria
- UI shows: "You usually prefer crew D for drainage work (3/5 times)"
- Builds collaborative model, not command-and-control

### Idea 3: "Confidence as Filter"
- Instead of showing all 150 reports, show only those AI is confident about (>85%)
- Ranger can toggle down to 70% to see more
- Reduces cognitive load; lets ranger focus on well-classified hazards first
- Design: Slider on map, updates live ("Showing 47 reports")

### Idea 4: "Crew Perspective View"
- Flip the UI: Instead of ranger → crew, show crew→task
- Crew arrives at trailhead; sees their assigned tasks via mobile app
- AI re-orders tasks by proximity (as they move)
- Chat-like interface with ranger ("Found another hazard here, OK to fix?")
- Feeds back to ranger dashboard in real-time
- Creates closed-loop feedback cycle

### Idea 5: "Temporal Reasoning"
- Don't just cluster reports by location; cluster by time
- "This 3-rock-fall cluster happened within 48 hours → likely same storm event"
- AI suggests: "Consider trail closure or all-hands inspection"
- Helps ranger understand causality, not just spatial correlation

---

## 11. LEAN FRAMEWORK: Confidence Vs. Overreliance Spectrum

### The Trust Calibration Problem

Governments have learned the hard way: **showing confidence doesn't build trust; transparency does**.

**Bad framing:**
- "AI says: Rock fall (92% confident) ✓ APPROVE"
- Ranger clicks approve without reading ranger text (automation bias)
- Ranger outsources decision to AI

**Good framing:**
- "Rock fall detected via: Photo analysis + Hiker description"
- Show evidence: [Photo thumbnail] + [Citation: "Boulder visible at km 3.2"]
- Ranger reads evidence, makes decision
- Ranger builds mental model of AI reliability over time

**Design pattern for TrailWatch:**
1. **Confidence as conversation starter, not decision closer**
   - Low confidence (< 70%): "Review recommended. Why? Multiple photos conflicting."
   - High confidence (> 90%): "High confidence. Evidence: Clear photo + multiple corroborating reports."

2. **Reversible decisions only**
   - Ranger can undo/override within 5 min (logged)
   - Can't make permanent closure notices without manual review

3. **Feedback loop**
   - Log ranger decisions
   - If ranger overrides AI frequently for same pattern → Retrain or alert
   - "You're 3x more likely to assign drainage issues to Crew B" (learning, not judging)

---

## 12. UNKNOWNS / TO RESEARCH FURTHER

- [ ] Does USFS have precedent for agentic UI? (Likely not; but worth asking)
- [ ] What's the actual triage queue size? (Impacts UI design; 10 items vs. 100 items very different)
- [ ] Ranger hardware profile? (Mobile, laptop, tablet? Desktop?Offline conditions?)
- [ ] Existing TRACS taxonomy complexity? (How many hazard types?)
- [ ] Volume of citizen reports? (10/week vs. 100/day changes streaming needs)
- [ ] FedRAMP compliance required at MVP? (Affects library choices)
- [ ] Regional variation? (USFS rangers in Alaska vs. California have different needs)

---

*Research compiled January 2026. Focus on January 2026 capabilities + trends, government precedent, and trust-by-design for non-technical users.*
