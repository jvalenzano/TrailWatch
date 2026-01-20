# 🚀 AUTONOMOUS NIGHTLY POLISH & VALIDATION AGENT

```
# Trail Watch Ranger Dashboard - Autonomous Overnight Polish Mode

## MISSION
Execute **Phases 5 & 6** autonomously through the night. Polish UI, add missing features, validate everything, create demo assets. Zero human intervention required.

## CONTEXT (Current Status - Jan 19, 2026)
```
Phase 0-4 ✅ COMPLETE (UAT passed, develop branch)
Phase 3.5 ✅ v0.3.0 (main branch) 
Phase 5 ⏳ POLISH & DEMO PREP (your responsibility)
Phase 6 ⏳ STREAMING EXTRACTION (optional)
```

## FULL AUTONOMY ENABLED
```
✅ Chrome browser control (full UI testing)
✅ npm install/build/test/lint commands
✅ Inline code edits (all files)
✅ Git commits/push (develop → main)
✅ File creation (docs, demos, tests)
✅ Sub-agent orchestration (spawn 6 agents)
```

## OVERNIGHT EXECUTION PLAN (12-16 hours)

### PHASE 5: POLISH & DEMO PREP (4-6 hours)
```
[ ] ModeSwitcher (floating toggle, dev-only)
[ ] Loading skeletons + empty states
[ ] Keyboard navigation (arrow keys, Enter, Escape)
[ ] Responsive breakpoints (1024px, 768px)
[ ] Visual polish (alignment, spacing, colors)
[ ] Demo script (docs/demo-script.md)
[ ] UAT validation + report
```

**Spawn Sub-Agents:**
1. **PolishAgent** - Loading states, skeletons, empty states
2. **KeyboardAgent** - Full keyboard navigation implementation
3. **ResponsiveAgent** - Mobile/tablet breakpoints
4. **VisualAgent** - Typography, spacing, alignment fixes
5. **DemoAgent** - Create demo script + screencast prep
6. **Validator** - Continuous testing + UAT reports

### PHASE 6: STREAMING EXTRACTION (3-4 hours)
```
[ ] useStreamingExtraction.ts (SSE consumer)
[ ] StreamingExtractionView.tsx
[ ] Update ReportDetail for streaming
[ ] Fallback handling (SSE error)
[ ] UAT validation
```

### CONTINUOUS VALIDATION LOOP (Running all night)
```
Every 30min:
- npm test (34+ new tests → 50+ target)
- npm run build (0 TS errors)
- npm run lint (0 errors)
- Browser smoke test (3 modes)
- Performance recording (DevTools)
```

## DETAILED EXECUTION SPECIFICATION

### Phase 5 Tasks (Execute in parallel)

**1. ModeSwitcher Component**
```
File: src/components/common/ModeSwitcher.tsx
- Floating button (bottom-right, dev-only)
- Toggle: traditional ↔ moderate ↔ agentic
- Persists in URL (?mode=...)
- Keyboard shortcut: Ctrl+M
```

**2. Loading States & Skeletons**
```
Files: 
- src/components/common/LoadingSkeleton.tsx
- Update ReportList, SpatialInsightsSidebar, MapView

Patterns:
- ReportList: Shimmering list items (3-5 items)
- Insights: Pulsing cards (2-3 cards)
- Map: Gray overlay + spinner
```

**3. Empty States**
```
Files:
- src/components/common/EmptyState.tsx
Cases:
- No reports: "No trail reports yet"
- No insights: "No spatial patterns detected"
- No crews: "No crews available"
```

**4. Keyboard Navigation**
```
Global:
- Arrow keys: Navigate reports/markers
- Enter: Select/activate
- Escape: Close panels/back
- Ctrl+F: Focus search
- Ctrl+M: Mode switcher
```

**5. Responsive Design**
```
Breakpoints:
1024px: Sidebar collapsible
768px: Stack vertical (insights top, map full, list bottom)
480px: Mobile hamburger menu
```

**6. Visual Polish Checklist**
```
[ ] Consistent 8px spacing grid
[ ] Typography scale (h1:36px, h2:24px, body:16px)
[ ] Card shadows/elevation consistent
[ ] Hover states on ALL interactive elements
[ ] Focus rings for accessibility
[ ] Color contrast AA compliant
```

### Phase 6: Streaming Extraction
```
1. SSE Hook: useStreamingExtraction.ts
   - Connects to /api/stream/extraction
   - Parses Server-Sent Events
   - Live confidence updates

2. Streaming View: StreamingExtractionView.tsx
   - Live typewriter effect for description
   - Confidence bar animates 0→95%
   - "Extracting..." → "Complete ✓"

3. ReportDetail Integration
   - Show streaming view when extractionStatus="pending"
   - Fallback to static when "complete"
```

## QUALITY GATES (Mandatory)

**Every Commit Must Pass:**
```
npm test                    # 50+ tests
npm run build              # 0 TS errors  
npm run lint               # 0 errors
npm run analyze            # Bundle < 500kb
BrowserStack screenshots   # All breakpoints
Lighthouse audit           # PWA score 90+
```

## SUB-AGENT ORCHESTRATION

**Spawn Immediately:**
```
Task("PolishAgent").priority(HIGH).spawn()
Task("KeyboardAgent").priority(MEDIUM).spawn()
Task("ResponsiveAgent").priority(MEDIUM).spawn()
Task("DemoAgent").priority(LOW).spawn()
Task("Validator").continuous().spawn()
Task("PerformanceAgent").interval(30m).spawn()
```

## GIT & DEPLOYMENT

**Commit Strategy:**
```
feat(phase5): add ModeSwitcher + loading states
fix(phase5): responsive breakpoints
docs(phase5): demo script + UAT report
feat(phase6): streaming extraction UI
chore(phase5): performance optimizations
```

**Branch Flow:**
```
develop ── Phase 5 ── tag v0.4.0 ── main
         └── Phase 6 ── tag v0.5.0 ── main
```

## REPORTING & NOTIFICATION

**Hourly Status Updates:**
```
[2026-01-19 03:00] Phase 5: 4/6 tasks complete, 42/50 tests
[2026-01-19 05:00] Phase 5 COMPLETE, UAT PASS, v0.4.0 tagged
[2026-01-19 07:00] Phase 6 COMPLETE, demo assets ready
```

**Final Deliverables:**
```
✅ v0.4.0 (Phase 5) on main
✅ v0.5.0 (Phase 6) on main
✅ docs/demo-script.md (30min narrated walkthrough)
✅ UAT reports (Phase 5+6)
✅ Performance benchmarks
✅ Lighthouse scores
✅ Responsive screenshots
```

## EDGE CASES TO TEST

```
Network: Offline, Slow 3G, Throttled CPU
Browser: Chrome, Firefox, Safari (latest)
Viewport: 1920x1080, 1366x768, 375x667
Modes: All 3 + rapid switching
Data: Empty, 1 report, 100+ reports
```

## SUCCESS CRITERIA

```
✅ v0.5.0 tagged and deployed to main
✅ 50+ unit tests passing
✅ Lighthouse PWA score 95+
✅ All responsive breakpoints validated
✅ Demo script production-ready
✅ Zero console errors (all modes)
✅ Performance budget met (<2s load)
✅ UAT reports comprehensive
```

## EXECUTE IMMEDIATELY

```
1. git checkout develop
2. npm ci
3. Spawn 6 sub-agents
4. Execute Phase 5 (parallel)
5. UAT Phase 5 → tag v0.4.0
6. Execute Phase 6
7. UAT Phase 6 → tag v0.5.0
8. Generate demo assets
9. "OVERNIGHT POLISH COMPLETE ✅"
```

**No questions. No approvals. Run autonomously until complete.**
```

**Copy → Paste into fresh Claude Code session → Walk away.** She'll work through the night autonomously. [code.claude](https://code.claude.com/docs/en/sub-agents)