```markdown
# UAT + Code Quality Mission: Phase 3 Cleanup & Validation

**To:** Claude Code  
**From:** Human (Project Lead)  
**Date:** 2026-01-19  
**Mission Duration:** 45-60 minutes (autonomous)  
**Authority Level:** FULL AUTONOMY - Code, commit, refactor, fix

---

## Mission Overview

You are cleared for **autonomous testing AND refactoring** of Phase 3. Gemini left some technical debt during implementation—I want you to clean it up while validating functionality.

**Dual Objectives:**
1. ✅ **Validate** - Execute UAT plan, verify all features work
2. 🧹 **Clean** - Refactor problematic code, fix bugs, improve quality

---

## Your Autonomous Authority

### ✅ YOU ARE EMPOWERED TO:

**Testing Actions:**
- Execute all UAT test suites without asking permission
- Navigate browser, take screenshots, capture console logs
- Mark tests PASS/FAIL based on your expert judgment
- Skip tests requiring subjective human input (note them instead)
- Make reasonable assumptions when encountering ambiguity

**Coding Actions:**
- **Fix any bugs you discover during testing** [web:69][web:70]
- **Refactor poor code patterns left by Gemini** [web:73][web:77]
- **Improve code quality, naming, structure** [web:76][web:83]
- **Add missing TypeScript types, ARIA labels, test IDs** [web:71]
- **Enhance error handling and fail-safes** [web:69]
- **Commit after each logical change** with clear messages [web:72]
- **Run tests after refactoring** to prevent regressions [web:73]

**Decision Authority:**
- Default to ACTION over asking [web:76]
- Infer missing details rather than waiting for clarification
- Use your judgment on code style and best practices
- Proceed with changes that improve maintainability [web:69][web:83]

### ❌ DO NOT:

- Wait for human confirmation on individual decisions
- Ask "Should I proceed?" questions mid-execution
- Stop for non-critical issues (note and continue)
- Make broad architectural changes (stick to tactical improvements)
- Modify build configuration or package.json without strong reason

---

## Code Quality Targets (Refactor As You Find)

### **High-Priority Cleanup (Fix During UAT)**

These are patterns Gemini likely left that you should improve [web:70][web:77]:

**TypeScript Quality:**
- Replace any `any` types with proper interfaces
- Add missing type annotations on function parameters/returns
- Fix incorrect type assertions or unsafe casts
- Ensure all React props have proper TypeScript interfaces

**Accessibility Gaps:**
- Add missing `aria-label`, `aria-expanded`, `aria-controls` attributes
- Add `data-testid` attributes for key interactive elements
- Verify keyboard navigation works (Tab, Enter, Space, Escape)
- Fix color contrast issues in dark theme

**React Best Practices:**
- Ensure hooks aren't called at module scope (causes crashes)
- Fix missing error boundaries or try-catch blocks
- Add proper cleanup in useEffect hooks
- Fix prop drilling (use context if excessive)

**Error Handling:**
- Add fail-safe defaults in `FeatureGate` component
- Handle undefined/null mode gracefully in `useUIMode`
- Add console.error logging for caught exceptions
- Validate data before rendering (prevent crashes on malformed data)

**Code Organization:**
- Extract magic strings to constants
- Remove commented-out code blocks
- Fix inconsistent naming (camelCase vs snake_case)
- Consolidate duplicate logic

**Example Refactorings to Look For:**

```typescript
// ❌ BAD (Gemini pattern) - Fix if you see this
const mode: any = useSearchParams().get('mode')
if (mode === 'moderate') { /* ... */ }

// ✅ GOOD (Your refactor)
const mode = useSearchParams().get('mode') ?? DEFAULT_MODE
const config = UI_MODE_CONFIG[mode as UIModeType] ?? UI_MODE_CONFIG[DEFAULT_MODE]
```

```typescript
// ❌ BAD - Missing ARIA
<button onClick={handleExpand}>View Reasoning</button>

// ✅ GOOD - Accessible
<button 
  onClick={handleExpand}
  aria-expanded={isExpanded}
  aria-controls="reasoning-panel"
  data-testid="reasoning-toggle"
>
  View Reasoning
</button>
```

---

## Commit Strategy

Use this pattern for all commits [web:72][web:77]:

**Bug Fixes:**
```
fix(phase3): prevent crash when mode param is invalid

- Add fallback to DEFAULT_MODE in useUIMode hook
- Add try-catch in FeatureGate component
- Add console warning for invalid modes
```

**Refactoring:**
```
refactor(phase3): improve FeatureGate type safety

- Replace 'any' with UIModeConfig interface
- Add proper TypeScript generics
- Extract mode validation to helper function
```

**Accessibility:**
```
a11y(phase3): add ARIA attributes to reasoning panel

- Add aria-expanded to toggle button
- Add aria-controls linking to panel ID
- Add data-testid for automated testing
```

**Testing:**
```
test(phase3): add missing test coverage for edge cases

- Test invalid mode fallback behavior
- Test FeatureGate with undefined mode
- Test ReasoningPanel keyboard navigation
```

---

## UAT Test Execution (Your Approved Plan)

Execute your UAT plan as written, with these additions:

### **During Each Test:**
1. **Before** - Screenshot initial state
2. **Test** - Execute the test action
3. **Observe** - Check console, verify expected behavior
4. **Fix** - If bug found, fix it immediately [web:69][web:76]
5. **Validate** - Re-run test to confirm fix works
6. **Commit** - Commit the fix with clear message
7. **After** - Screenshot fixed state

### **Console Log Validation Rules:**
```
✅ IGNORE (expected):
- [vite] connected
- [vite] hmr update
- [MSW] Mocking enabled
- Download the React DevTools

❌ FIX IMMEDIATELY (errors):
- Uncaught TypeError
- ReferenceError
- SyntaxError
- Failed to fetch
- 404 errors
- React warnings

⚠️ FIX IF TIME (warnings):
- React.memo warnings
- PropTypes warnings
- Deprecation notices
```

### **Element Detection Strategy:**

For Suite 3 (Component Functionality), use this fallback chain [web:73]:

```typescript
// Finding Confidence Indicator
1. Try: document.querySelector('[data-testid="confidence-indicator"]')
2. Fallback: document.querySelector('.confidence-badge')
3. Fallback: Array.from(document.querySelectorAll('*')).find(el => /\d+%/.test(el.textContent))

// Finding Reasoning Button
1. Try: document.querySelector('button[aria-expanded]')
2. Fallback: document.querySelector('button:has-text("Reasoning")')
3. Fallback: document.querySelector('[data-testid="reasoning-toggle"]')

// If element not found: Add the data-testid yourself, commit, re-test
```

---

## Refactoring Priorities (Clean As You Go)

### **Tier 1: Critical (Must Fix)**
- Type safety issues (`any` types, missing interfaces)
- Accessibility violations (missing ARIA, no keyboard nav)
- Error handling gaps (unguarded nulls, missing try-catch)
- Console errors/warnings that break functionality

### **Tier 2: Important (Should Fix)**
- Inconsistent naming conventions
- Duplicate code blocks
- Missing TypeScript return types
- Poor variable names (`temp`, `data`, `result`)
- Commented-out code

### **Tier 3: Nice-to-Have (If Time)**
- Extract magic numbers to constants
- Add JSDoc comments to complex functions
- Consolidate similar components
- Improve CSS class naming

**Refactoring Safety Rules** [web:69][web:73]:
1. **Small scope** - One logical change per commit
2. **Test after each** - Run `npm test` before committing
3. **Verify in browser** - Reload and check it still works
4. **Document reasoning** - Explain "why" in commit message

---

## Autonomous Decision Framework

When you encounter ambiguity, use this decision tree [web:76]:

```
Question: "Is this element broken or just styled differently?"
→ If it renders and functions: Note as cosmetic, continue
→ If it doesn't render or throws error: Fix immediately

Question: "Should I refactor this questionable code?"
→ If it violates TypeScript/React best practices: Yes, refactor
→ If it's just "not my style": Leave it, note in report

Question: "This test is unclear, what's the expected behavior?"
→ Infer from context (mode names, feature descriptions)
→ Test the most logical interpretation
→ Document your assumption in report

Question: "Should I add this nice-to-have improvement?"
→ If it takes <5 minutes and improves quality: Yes
→ If it's a rabbit hole: Note for future work

Question: "The dev server won't start, what do I do?"
→ Check port 5173: lsof -ti:5173
→ Kill process: kill -9 <PID>
→ Retry npm run dev
→ If fails twice: Report as blocker
```

---

## Failure Recovery Protocols

### **If Test Fails:**
1. Screenshot the failure state
2. Capture full console logs
3. Analyze root cause (is it a bug or test issue?)
4. Fix the bug if you can identify it [web:69]
5. Re-run test to validate fix
6. Commit fix with descriptive message
7. Continue to next test

### **If Refactoring Breaks Something:**
1. Run `npm test` to identify failure
2. Check browser console for new errors
3. **Option A:** Fix the regression immediately
4. **Option B:** Revert last commit (`git reset --hard HEAD~1`)
5. Note in report: "Attempted refactor X, caused regression Y, reverted"

### **If You're Unsure:**
- **Default to action** [web:76] - Make your best judgment call
- Document assumption in commit message
- Include "VERIFY:" tag for human review later
- Example: `refactor(phase3): extract mode validation logic (VERIFY: assumptions about invalid mode handling)`

---

## Time Budget & Prioritization

**Total Time:** 45-60 minutes  
**Breakdown:**
- Suite 1 (Mode Isolation): 10 minutes
- Suite 2 (Edge Cases): 10 minutes  
- Suite 3 (Component Functionality): 15 minutes
- Suite 4 (Accessibility): 10 minutes
- Suite 5 (Console Errors): 5 minutes
- Refactoring/Fixes: 15-20 minutes (concurrent with testing)
- Report Writing: 5 minutes

**If Running Short on Time:**
- Prioritize Tier 1 refactorings only
- Complete critical tests (Suite 1, 3, 5)
- Note skipped tests in report
- Generate partial UAT report with what you completed

---

## Final Deliverable Format

After completing testing and refactoring, provide:

```markdown
## Phase 3 UAT + Refactoring Report

**Date:** 2026-01-19
**Tester/Engineer:** Claude Code
**Duration:** [actual time]
**Status:** ✅ PASS / ⚠️ PASS WITH NOTES / ❌ FAIL

***

### Executive Summary
[2-3 sentences: Overall quality, major findings, recommendation]

***

### Test Results Summary
- **Tests Executed:** X/Y
- **Tests Passed:** A
- **Tests Failed:** B (with fixes applied)
- **Tests Skipped:** C (with reasons)

***

### Bugs Fixed During Testing

| Bug | Severity | Fix Description | Commit SHA |
|-----|----------|-----------------|------------|
| Missing ARIA on reasoning button | Medium | Added aria-expanded attribute | abc1234 |
| Invalid mode crashes app | High | Added fallback to DEFAULT_MODE | def5678 |
| ... | ... | ... | ... |

***

### Code Quality Improvements

| Refactoring | Category | Impact | Commit SHA |
|-------------|----------|--------|------------|
| Replaced 'any' types in FeatureGate | TypeScript | Type safety | ghi9012 |
| Extracted mode constants | Organization | Maintainability | jkl3456 |
| ... | ... | ... | ... |

***

### Test Suite Details

#### Suite 1: Mode Isolation ✅ PASS
- Traditional mode: ✅ Zero AI elements
- Moderate mode: ✅ All transparency features visible
- Agentic mode: ✅ Same as moderate (expected)
[Screenshots attached]

[Repeat for all suites...]

***

### Known Issues (Not Fixed)

| Issue | Severity | Reason Not Fixed | Recommendation |
|-------|----------|------------------|----------------|
| Color contrast slightly low on badge | Low | Requires design decision | Consult designer |
| ... | ... | ... | ... |

***

### Recommendations

**Phase 3 Status:** [READY FOR PHASE 4 / NEEDS MINOR FIXES / BLOCKED]

**Reasoning:** [Explain your assessment]

**Next Steps:**
1. [Action item 1]
2. [Action item 2]

***

### Appendix: All Commits Made

```bash
git log --oneline --since="2026-01-19 00:00"
```
[Paste output]
```

---

## Pre-Flight Checklist

Before you begin autonomous execution:

- [ ] Read this entire mission brief
- [ ] Understand you have FULL authority to code and commit
- [ ] Start dev server: `cd frontend && npm run dev`
- [ ] Wait for "Local: http://localhost:5173" message
- [ ] Create browser context via MCP tools
- [ ] Set mental timer: 45-60 minutes total

---

## Final Instruction

**You are cleared for autonomous operation** [web:76][web:82]. 

**Default to action over discussion.** When you see poor code, refactor it. When you find bugs, fix them. When tests fail, debug and resolve. Commit frequently with clear messages. Run tests after changes. Document everything in your final report.

**Philosophy:** You are not just a tester—you are a **code quality engineer** [web:69][web:73]. Gemini left technical debt; you're cleaning it up while validating functionality. Leave the codebase better than you found it [web:83].

**Trust your judgment.** You have Claude Opus 4.5's reasoning capabilities. Use them. Make Phase 3 production-ready.

**I will return in 60 minutes. Begin autonomous testing and refactoring now.** 🚀

