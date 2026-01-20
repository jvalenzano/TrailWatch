# UI Consolidation Migration Track

**Status:** Planning  
**Created:** 2026-01-20  
**Goal:** Consolidate from three UI modes to single Agentic UI with progressive disclosure

---

## Quick Reference

**Main Document:** [MIGRATION_PLAN.md](./MIGRATION_PLAN.md)

**Timeline:** 2-3 weeks  
**Risk Level:** Medium

---

## Key Changes

### Before (Three Modes)
- Traditional: No AI visibility
- Moderate: AI transparency only
- Agentic: Full AI features

### After (Single Agentic UI)
- Always-on Agentic UI
- Progressive disclosure built into interface
- Onboarding tour for new users
- Collapsible/dismissible features

---

## Migration Phases

1. **Phase 1:** Preparation & Design (2 days)
2. **Phase 2:** Core Migration (3 days)
3. **Phase 3:** Progressive Disclosure (3 days)
4. **Phase 4:** Polish & Testing (2 days)
5. **Phase 5:** Cleanup & Deprecation (2 days)

---

## Files Affected

- **25+ files** use mode-related code
- **Key files:**
  - `ui-modes.ts` - Configuration
  - `UIModeContext.tsx` - State management
  - `Dashboard.tsx` - Layout selector
  - `FeatureGate.tsx` - Conditional rendering
  - `ModeSwitcher.tsx` - **DELETE**

---

## Success Criteria

- ✅ Single Agentic UI for all users
- ✅ 25% reduction in mode-related code
- ✅ Progressive disclosure working smoothly
- ✅ All tests passing (>80% coverage)
- ✅ No performance regressions

---

## Next Steps

1. Review migration plan
2. Approve UX mockups
3. Create feature branch
4. Begin Phase 1
