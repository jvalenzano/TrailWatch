# Handoff Document: Synthetic Data Quality Track

**For:** New Engineering Team  
**Date:** 2026-01-20  
**Status:** Ready for Implementation

---

## Welcome!

This document provides everything you need to understand and implement the Synthetic Data Quality & Demo Enhancement track. The work is well-scoped, documented, and ready for execution.

---

## Quick Start

### 1. Read These Documents (In Order)

1. **`index.md`** - Overview and context
2. **`DESIGN_CRITIQUE.md`** - Why we're doing this (the original analysis)
3. **`spec.md`** - Detailed requirements and acceptance criteria
4. **`plan.md`** - Phased implementation plan
5. **`AUDIT_CHECKLIST.md`** - Quality verification steps

### 2. Setup Your Environment

```bash
# Ensure you're on develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/synthetic-data-quality

# Verify you can run tests
cd frontend
npm install
npm test

# Verify TypeScript compilation
npm run build
```

### 3. Start with Phase 1

Begin with **Task 1.1** in `plan.md`. It's designed to be straightforward and will help you understand the codebase.

---

## Key Context

### What We're Doing

Enhancing the synthetic dataset (`frontend/src/data/synthetic_day_in_life.json`) to be production-quality demo-ready. The current dataset works but lacks:
- Realistic edge cases
- Temporal variety
- Reporter diversity
- Visual storytelling

### Why It Matters

This dataset powers all demos and UI testing. Making it realistic and comprehensive ensures:
- Better demo experiences
- More thorough testing
- Edge case coverage
- Production-readiness

### Current State

- **24 reports** in dataset
- **6 photo assets** (reused across reports)
- **2 external intelligence assets** (underutilized)
- **All reports from same day** (temporal weakness)
- **Mostly high confidence** (unrealistic distribution)

### Target State

- **30+ reports** with realistic distribution
- **10+ photo assets** with variety
- **5+ reports with external intelligence**
- **Reports spanning 3+ days**
- **Full confidence spectrum** (0.30 to 0.95+)

---

## Architecture Overview

### Data Structure

The dataset follows this structure:

```typescript
{
  reports: HazardReport[],
  insights: SpatialInsight[],
  weather_context: WeatherEvent,
  metadata: DatasetMetadata
}
```

### Key Files

- **`frontend/src/data/synthetic_day_in_life.json`** - The dataset (what we're enhancing)
- **`frontend/src/types/report.ts`** - TypeScript types (may need updates)
- **`frontend/src/hooks/useMockAgent.ts`** - Data loading hook
- **`frontend/public/assets/photos/`** - Photo assets
- **`frontend/public/assets/social/`** - External intelligence assets

### Integration Points

- **UI Components:** `ReportDetail`, `AgenticDashboard`, `SpatialInsightsSidebar`
- **Hooks:** `useMockAgent()`, `useReports()`
- **Types:** `HazardReport`, `ExternalIntelligence`, `PatternDetection`

---

## Implementation Strategy

### Phased Approach

We've broken the work into **7 phases** over **2-3 weeks**:

1. **Phase 1:** Foundation & Quick Wins (Days 1-2)
2. **Phase 2:** High-Priority Improvements (Days 3-5)
3. **Phase 3:** Medium-Priority Enhancements (Days 6-8)
4. **Phase 4:** Low-Priority Polish (Days 9-10)
5. **Phase 5:** Demo Preparation (Days 11-12)
6. **Phase 6:** Repository Audit (Days 13-14)
7. **Phase 7:** Finalization & Handoff (Day 15)

### Working Style

- **One phase at a time** - Complete each phase before moving to next
- **Test after each task** - Don't accumulate technical debt
- **Document as you go** - Update plan.md with progress
- **Ask questions early** - Better to clarify than assume

### Quality Gates

After each phase:
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No linter errors
- [ ] Data validates correctly
- [ ] Plan.md updated

---

## Common Pitfalls & Solutions

### Pitfall 1: Breaking Existing Tests
**Solution:** Run tests after each change. If tests break, fix immediately.

### Pitfall 2: Type Errors
**Solution:** Update TypeScript types first, then add data. Don't use `any`.

### Pitfall 3: Broken Asset URLs
**Solution:** Verify all URLs in audit phase. Use relative paths from `/assets/`.

### Pitfall 4: Inconsistent Data
**Solution:** Follow the patterns in existing reports. Keep IDs unique.

### Pitfall 5: Scope Creep
**Solution:** Stick to the plan. Document out-of-scope ideas for later.

---

## Testing Strategy

### Unit Tests
- Test data loading
- Test type validation
- Test edge cases

### Integration Tests
- Test UI with enhanced data
- Test all components render correctly
- Test demo scenarios

### Manual Testing
- Walk through demo scripts
- Verify visual assets display
- Check narrative flow

---

## Questions & Support

### If You Get Stuck

1. **Check the docs first** - Most answers are in spec.md or plan.md
2. **Review existing code** - See how current reports are structured
3. **Ask early** - Don't spend hours stuck on something

### Key Contacts

- **Track Owner:** Engineering Team Lead
- **Designer:** (Original critique author)
- **Technical Lead:** (For architecture questions)

### Resources

- **TypeScript Types:** `frontend/src/types/report.ts`
- **Existing Data:** `frontend/src/data/synthetic_day_in_life.json`
- **Workflow Guide:** `conductor/workflow.md`
- **Git Flow:** `docs/onboarding/GIT_FLOW.md`

---

## Success Metrics

You'll know you're done when:

- ✅ All 17 improvement categories addressed
- ✅ 30+ reports with realistic distribution
- ✅ All tests passing
- ✅ Audit checklist complete
- ✅ Demo scripts documented
- ✅ Ready for merge to develop

---

## Next Steps

1. **Read the documents** (index.md → spec.md → plan.md)
2. **Set up your environment** (git branch, npm install, tests)
3. **Start Phase 1, Task 1.1** (Setup & Documentation)
4. **Work through phases sequentially**
5. **Complete audit checklist** before merge

---

## Final Notes

- **Time is not a problem** - Take your time, do it right
- **Quality over speed** - Better to be thorough
- **Document everything** - Future you (and us) will thank you
- **Have fun!** - This is interesting work that will make a real difference

Good luck! 🚀
