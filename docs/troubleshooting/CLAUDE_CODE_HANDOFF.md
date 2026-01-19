# Context: Switching from Gemini to Claude Code

## Current Situation
I'm switching from Gemini Code to you (Claude Code) mid-project. Gemini encountered stability issues during Phase 3 implementation. Here's where we left off:

**Project:** TrailWatch Dashboard (React 18 + TypeScript + Vite)
**Branch:** `feature/dashboard-phase-3-moderate`
**Phase Status:** Phase 3 (Moderate Mode Integration) - **IMPLEMENTATION COMPLETE**, awaiting UAT

## What Just Happened (Last 2 Hours)

### The Problem We Solved
The app had a "silent death" crash - blank white screen, zero console errors, even the first line of `main.tsx` wouldn't execute. This was caused by:
1. **Root cause:** Malformed string literal in `src/types/report.ts` (hidden Unicode character in `severity_estimate` field)
2. **Cascading failure:** ESM module parse-time error poisoned the entire dependency graph
3. **Why it was hard to debug:** Parse-time errors happen before React error boundaries initialize, so nothing could catch them

**Resolution:** Rewrote `report.ts` with clean syntax, switched to `import type { HazardReport }` to optimize module resolution.

### What We Just Implemented (Phase 3)
Successfully integrated AI transparency features controlled by UI mode feature flags:

**New Components:**
- `ExtractionDisplay.tsx` - Shows confidence indicators and reasoning panels
- `FeatureGate.tsx` - Fail-safe feature flag wrapper with try-catch and fallback support
- `AIAttributionBadge.tsx` - Granular AI disclosure badges on extracted fields
- `ui-modes.ts` - Standardized feature flags with lifecycle metadata

**Feature Flags Added:**
- `enable_confidence_indicators` - Shows AI confidence percentages
- `enable_reasoning_panel` - Expandable "Why did AI classify this?" section
- `enable_ai_attribution_badges` - Badges on AI-extracted fields

**Three UI Modes:**
1. **Traditional** (`/?mode=traditional`) - No AI transparency features
2. **Moderate** (`/?mode=moderate`) - Full transparency layer enabled
3. **Agentic** (`/?mode=agentic`) - Reserved for Phase 4 (map-first layout)

**Testing Status:**
✅ Automated tests passing (Vitest + jest-axe accessibility checks)
✅ Feature gate handles edge cases (invalid modes, missing config)
✅ Zero console errors in all three modes
⏳ **PENDING:** Browser-based UAT (User Acceptance Testing)

## What I Need You To Do

### Immediate Task: User Acceptance Testing
I need you to perform comprehensive browser-based UAT following this test plan:

**Test Suite Overview:**
1. **Mode Isolation** - Verify traditional/moderate/agentic modes show correct features
2. **Edge Cases** - Test invalid mode params, missing mode, mode switching
3. **Accessibility** - Keyboard navigation, ARIA attributes, color contrast
4. **Telemetry** - Verify analytics events fire correctly
5. **Visual Regression** - Check dark theme consistency, responsive layout

**Test Environment:**
- URL: `http://localhost:5173`
- Modes to test: `/?mode=traditional`, `/?mode=moderate`, `/?mode=agentic`
- Browser: Chrome/Chromium preferred
- Viewport: Desktop (1920x1080) primary, mobile (375x667) secondary

**Expected Findings:**
- In **traditional mode**: Zero AI transparency elements visible
- In **moderate mode**: Confidence badges, reasoning panels, AI attribution badges all present
- In **agentic mode**: Same as moderate (Phase 4 features not yet implemented)

### Success Criteria for UAT
- [ ] All three modes render without console errors
- [ ] Confidence indicators visible in moderate/agentic modes
- [ ] Reasoning panel expands/collapses smoothly
- [ ] AI attribution badges present on extracted fields (Hazard, Reporter, Severity)
- [ ] Keyboard navigation works (Tab to panel, Enter/Space to expand)
- [ ] Invalid mode (`/?mode=xyz`) falls back to traditional gracefully
- [ ] Zero WCAG AA violations (color contrast, ARIA labels)

### Reporting Format
After testing, provide:
```markdown
## Phase 3 UAT Results
**Date:** 2026-01-19
**Tester:** Claude Code
**Status:** ✅ PASS / ⚠️ PASS WITH ISSUES / ❌ FAIL

### Test Summary
- Tests Passed: X/30
- Blockers: Y (P0 issues preventing Phase 4)
- Nice-to-Haves: Z (polish items)

### Critical Findings
[Any P0 blockers found]

### Screenshots
[Key screenshots showing pass/fail states]

### Recommendation
Phase 3 is [READY FOR PHASE 4 / NEEDS FIXES] based on...
```

## Context You Should Know

### Recent Debugging Lessons Learned
1. **Silent failures** (no console errors) = parse-time syntax errors, not runtime errors
2. **Module import failures** require commenting out the *import itself*, not just usage
3. **React Router hooks** (`useSearchParams`) CANNOT be called at module scope (causes silent crash)
4. **MSW service worker** must be initialized before React renders in `main.tsx`
5. **Vite HMR** doesn't protect against top-level side effects in imported modules

### Known Technical Constraints
- **Forbidden:** OpenAI, LangChain, SQLite, Flask, `requests` library, `var` keyword, default exports, `any` type
- **Required:** httpx (not requests), pytest with `CI=true` flag, named exports only, 80%+ test coverage
- **Testing:** Always use `CI=true pytest` (avoids interactive prompts that hang automation)

### Architecture Notes
- **Feature flags** have 90-day sunset (expires 2026-04-18) - Phase 3 flags are temporary
- **UI modes** controlled by URL param (`?mode=traditional|moderate|agentic`)
- **FeatureGate** component has fail-safe try-catch to prevent router crashes
- **Telemetry** fires on reasoning panel expand/collapse (check Network tab for events)

## Files You Should Read First
1. `CLAUDE.md` - Your onboarding doc (already read during `/init`)
2. `frontend/src/config/ui-modes.ts` - Feature flag configuration
3. `frontend/src/components/common/FeatureGate.tsx` - Feature gate implementation
4. `frontend/src/components/extraction/ExtractionDisplay.tsx` - Main transparency UI

## Questions You Might Have

**Q: Why are we switching from Gemini?**
A: Gemini Code had stability issues (silent hangs, YOLO mode scheduler bugs). You (Claude) are more reliable for systematic testing tasks.

**Q: What's the current git state?**
A: On `feature/dashboard-phase-3-moderate` branch. All code committed. Clean working directory.

**Q: Can I modify code if I find bugs during UAT?**
A: Yes, but **report findings first** before fixing. I want to know what broke vs. what you proactively improved.

**Q: What if localhost:5173 isn't running?**
A: Start it with `cd frontend && npm run dev`. Wait for "Local: http://localhost:5173" message.

## What Comes After UAT
Once Phase 3 passes UAT:
- **Next:** Phase 4 (Agentic Mode) - Map-first layout with spatial insights sidebar
- **Blocked by:** Phase 3 UAT sign-off (that's you!)

---

# Your Mission
Open a browser, navigate to `http://localhost:5173/?mode=moderate`, and systematically verify the AI transparency layer works as designed. Document what you find. Let's ship Phase 3. 🚀
```

***

## Why This Prompt Works

### 1. **Immediate Context Window**
Claude gets the "last 2 hours" summary first, so she knows:
- Why the screen was blank (parse-time error)
- What got fixed (report.ts rewrite)
- What just shipped (Phase 3 features)

### 2. **Clear Mission**
The prompt says **"perform UAT"** with specific test cases, not vague "test the app." Claude knows exactly what success looks like.

### 3. **Environmental Awareness**
Includes critical details:
- Exact URLs to test (`/?mode=moderate`)
- Commands to run (`npm run dev`)
- Expected console output ("Local: http://localhost:5173")

### 4. **Failure Modes Pre-Disclosed**
Claude knows about:
- React Router hook crashes (module-scope `useSearchParams`)
- MSW initialization order issues
- Invalid mode fallback behavior

This prevents her from reporting "bugs" that are actually expected behavior.

### 5. **Actionable Reporting Format**
The markdown template tells Claude **exactly** how to structure findings, making your review trivial.

### 6. **Phase Context**
Claude understands she's the **gatekeeper** for Phase 4. Her sign-off matters.

***

## Customization Options

If you want Claude to **fix issues proactively** instead of just reporting:

```markdown
## Your Mission (Alternative: Fix-As-You-Go Mode)
Perform UAT on Phase 3. If you find **minor bugs** (styling, missing ARIA labels, incorrect fallbacks), fix them immediately and note in your report. If you find **blockers** (crashes, broken features), stop and report immediately without fixing.

**Minor bug examples:** Color contrast fails, tooltip missing, animation janky
**Blocker examples:** Console errors, white screen, feature doesn't render
```

If you want Claude to **only test critical path** (faster):

```markdown
## Your Mission (Fast Track)
Perform **smoke test only** - verify:
1. Traditional mode shows zero AI elements
2. Moderate mode shows all three transparency features
3. Invalid mode falls back gracefully
4. Zero console errors in all modes

Skip: Accessibility audit, telemetry verification, cross-browser testing
```

***

