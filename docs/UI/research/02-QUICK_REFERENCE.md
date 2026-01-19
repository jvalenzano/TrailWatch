# TrailWatch Agentic UI: Quick Reference Card

**Laminate this** (or keep it open while reading the research)

---

## THE CENTRAL PARADIGM

```
OLD (Traditional Dashboard)    NEW (Agentic Dashboard)
────────────────────────────────────────────────────
List of 150 reports           Map with 3 AI hints
"Where's the problem?"        "Here's what changed"
Search → Read → Classify      Suggest → Confirm → Approve
20 minutes per batch          5 minutes per batch
```

---

## 6 KEY INSIGHTS (30-Second Summaries)

| # | Insight | So What? | Design Pattern |
|---|---------|---------|-----------------|
| **1** | **Maps > Chat** Spatial context = trust builder | Ranger's brain is spatial | Map-first UI, not chatbot sidebar |
| **2** | **Confidence ≠ Trust** Show reasoning, not %age | "92% confident" doesn't build trust | Show evidence + explain why |
| **3** | **Reversibility** Undo within 5 min is key | Rangers need safety net | All decisions logged + reversible |
| **4** | **Multimodal** Photo + GPS + voice works | Field reality is messy input | Cache locally, sync when connected |
| **5** | **Streaming** Real-time "thinking" > waiting | Rangers see progress, not spinning wheel | SSE from Cloud Run to React |
| **6** | **Spatial Hints** Not chat suggestions | Rangers don't think in natural language | Sidebar: Top 3 insights, 1-click actions |

---

## ANTI-PATTERNS: What NOT to Do

| ❌ Don't | ✅ Do Instead | Why |
|---------|--------------|-----|
| Add a chatbot sidebar | Spatial suggestions sidebar | Chat = wrong modality for spatial problems |
| Show 99.7% confidence | Show 92% confidence | Precision ≠ accuracy; honesty builds trust |
| Black-box AI decisions | Show reasoning + evidence | DARPA lesson: transparency = trust |
| Auto-approve everything | Require review + approval | Automation bias kills adoption |
| Hide low-confidence results | Flag for human review | "We're uncertain" builds credibility |
| Force rangers online | Offline-first with sync | Field reality: connectivity is spotty |

---

## THE TECH STACK (2026)

```
FRONTEND                BACKEND              GCP SERVICES
────────────────────────────────────────────────────────
React 19               Cloud Run             Vertex AI
TypeScript             Python service       Gemini (LLM)
Deck.gl v9 (maps)      SSE streaming        Cloud SQL + PostGIS
Mapbox GL JS           Audit logging        Cloud Storage
Vercel AI SDK v5       Error handling       BigQuery
Tailwind CSS                                (All FedRAMP ✓)
```

---

## DECISION TREE: Pick Your Streaming Approach

```
Start: "I want real-time extraction"
│
├─ "3-week MVP, happy with abstractions?"
│  └─→ USE: Vercel AI SDK v5
│      • useChat hook + SSE
│      • Works with Gemini via proxy
│      • Less control, faster shipping
│
└─ "Need fine-grained control over events?"
   └─→ USE: AG-UI protocol + custom Cloud Run
       • Full visibility of thinking steps
       • Tool-use visualization
       • More code, better transparency
```

---

## PROOF-OF-CONCEPT PHASES (3-4 Months)

### Month 1: Streaming Foundation
- Cloud Run accepts report + photo
- Calls Gemini, returns SSE stream
- React shows streaming extraction
- **Success**: Extraction < 6 seconds

### Month 2: Confidence & Trust
- Confidence visualization (4 levels)
- "Why confident?" explanations
- Map integration (Deck.gl)
- **Success**: Rangers understand AI reasoning

### Month 3: Mixed-Initiative Batch
- Sidebar: Top 3 spatial insights
- Click insight → map highlights → detail view
- Ranger confirms AI batch assignments
- **Success**: 15-report batch < 5 minutes

### Month 4: Offline & Polish
- Offline cache (SQLite + Service Worker)
- User testing with rangers
- Accessibility audit
- **Success**: Field rangers can work offline

---

## CONFIDENCE LEVELS: How to Visualize

```
0-40%: Red bar        "Low confidence | Review recommended"
                      "Missing data or conflicting evidence"

40-70%: Yellow bar    "Medium confidence | Likely correct"
                      "Most evidence aligns, some uncertainty"

70-90%: Green bar     "High confidence | Safe to approve"
                      "Strong evidence, similar past cases accurate"

90%+: Dark green      "Very high confidence | Proceed"
                      "Overwhelming evidence, high precision"
```

---

## VALIDATION: 5 Questions for USFS Rangers (Right Now)

1. **Volume**: How many reports/day? (Changes UI density)
2. **Workflow**: How do you currently handle 15 reports? (What's slow?)
3. **Hardware**: Mostly desktop or mobile? (Affects UX)
4. **Trust**: What would make you trust AI suggestions? (Design insight)
5. **Biggest concern**: What worries you about AI? (Risk mitigation)

(See **Research** doc Section 20 for full 20-question guide)

---

## GOVERNMENT USER PSYCHOLOGY

**What rangers fear:**
- "AI will decide for me" → Solution: Mixed-initiative (AI suggests, you decide)
- "If it's wrong, I'm blamed" → Solution: Reversible decisions + audit trail
- "This isn't how we do it" → Solution: Show time savings with data

**What builds trust:**
- Transparency (show reasoning)
- Reversibility (undo button)
- Explainability (why this suggestion?)
- Accountability (audit everything)

**What kills trust:**
- Black boxes
- Automation bias (click approve without reading)
- Overconfidence ("99.7%")
- One failure = reject all AI

---

## DEPLOYMENT CHECKLIST

### Before MVP Launch
- [ ] Cloud Run service deployed
- [ ] Vertex AI API enabled
- [ ] Cloud SQL + PostGIS configured
- [ ] Cloud Storage bucket created
- [ ] FedRAMP compliance audit done
- [ ] Mapbox GL → Google Maps Tiles (if FedRAMP required)
- [ ] Security review (no API keys in frontend)
- [ ] Monitoring/logging in BigQuery
- [ ] User testing with 3-5 rangers
- [ ] Undo/reversibility button working

### After 1 Month
- [ ] Measure: Extraction latency (target < 6s)
- [ ] Measure: Ranger approval % (high = trusted AI)
- [ ] Measure: Time per batch vs. baseline
- [ ] Iterate: Adjust confidence thresholds
- [ ] Iterate: Refine spatial suggestion algorithm

---

## LIBRARIES & VERSIONS (Jan 2026)

| Library | Version | Purpose | Notes |
|---------|---------|---------|-------|
| React | 19+ | UI framework | Server components support |
| TypeScript | 5.3+ | Type safety | JSX + strict mode |
| Next.js | 15+ | SSR + deployment | Cloud Run friendly |
| Deck.gl | v9+ | Geospatial viz | TypeScript support, GPU |
| Mapbox GL JS | 3.x | Basemap | ⚠️ FedRAMP concern |
| Google Maps Tiles | latest | Basemap (FedRAMP) | Alternative to Mapbox |
| Vercel AI SDK | v5+ | Streaming chat | useChat hook |
| Tailwind CSS | 3.4+ | Styling | Utility-first |
| Shadcn/ui | latest | Accessible components | Built on Radix |

---

## ERROR RECOVERY: What Goes Wrong & How to Fix

| Problem | Root Cause | Fix |
|---------|-----------|-----|
| "Extraction takes 15+ sec" | Cold start | Min instances=1 or pre-warm |
| "Map not updating" | React state issue | Check useEffect + EventSource |
| "Rangers bypass AI suggestions" | Don't understand reasoning | Add explanation cards |
| "Undo button not working" | Audit trail missing | Log all decisions to BigQuery |
| "FedRAMP rejection" | Third-party libs | Audit npm, swap Mapbox |
| "Offline reports lost" | No local cache | Add SQLite + Service Worker |

---

## COST ESTIMATE (Annual, 1000 reports/day)

```
Cloud Run execution:    $1,200  (4GB mem, ~10s per request)
Vertex AI API:          $2,000  (vision + text tokens)
Cloud Storage:          $500    (photos, ~1GB/month)
Cloud SQL:              $3,000  (managed PostGIS)
BigQuery:               $2,000  (logging + analytics)
Mapbox GL:              $0-500  (free tier or paid)
────────────────────────────────
TOTAL:                  ~$9,000-10,000/year
```

*(Scales linearly with volume)*

---

## KEY REFERENCES (By Document)

| Question | Where to Find | Time |
|----------|---------------|------|
| "What's the paradigm shift?" | Synthesis p.1 | 5 min |
| "Why maps over chat?" | Synthesis p.2 | 3 min |
| "How do I build it?" | Implementation p.1-3 | 30 min |
| "What could go wrong?" | Research p.6 | 15 min |
| "DARPA lesson?" | Research p.5 + Synthesis p.12 | 10 min |
| "What do I ask rangers?" | Research p.20 | 5 min |
| "Full architecture?" | Implementation p.1 | 10 min |
| "Code examples?" | Implementation p.2 | 20 min |

---

## REMEMBER

```
Traditional Dashboard thinking:
  "Let's make the UI fast"
  (Ranger still takes 20 min)

Agentic thinking:
  "Let's reduce cognitive load"
  (Ranger takes 5 min, trusts the system)

The difference:
  UX speed < decision speed < understanding
```

---

## ONE-LINER

**Spatial-first dashboard with transparent AI suggestions = Rangers make better decisions faster.**

---

**Last updated**: January 19, 2026  
**For**: TrailWatch MVP team  
**Keep with**: agentic_ui_research.md, synthesis, implementation guide
