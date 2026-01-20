# Migration Plan: Consolidate to Single Agentic UI

**Track:** `ui-consolidation-migration`  
**Status:** Planning  
**Created:** 2026-01-20  
**Owner:** Strategic Decision

---

## Executive Summary

**Goal:** Migrate from three UI modes (Traditional, Moderate, Agentic) to a single Agentic UI with progressive disclosure built into the interface.

**Rationale:**
- Eliminate maintenance overhead of three code paths
- Simplify user experience (no mode switching)
- Better evangelize Agentic UI by showing full power
- Progressive disclosure within one interface is better UX than separate modes

**Timeline:** 2-3 weeks  
**Risk Level:** Medium (requires careful UX design for progressive disclosure)

**Design Approach:** Leverage existing 10 wireframes (WF1-WF10) as primary design reference. Only minimal additional wireframes needed for onboarding tour and collapsed states.

**Additional Wireframes Needed:** See `ADDITIONAL_WIREFRAMES_PROMPT.md` for designer specifications (5 new wireframes: WF11-WF15).

---

## Current State Analysis

### Architecture Overview

**Three Modes:**
- `traditional`: No AI visibility, list-first layout
- `moderate`: AI transparency visible, list-first layout
- `agentic`: Full AI features, map-first layout

**Key Components:**
- `ui-modes.ts`: Mode definitions and feature flags
- `UIModeContext`: Manages mode state from URL params
- `FeatureGate`: Conditional rendering based on mode
- `ModeSwitcher`: UI component for switching modes
- `Dashboard.tsx`: Main layout selector

**Files Affected:** 25+ files use mode-related code

### Current Feature Distribution

| Feature | Traditional | Moderate | Agentic |
|---------|------------|----------|---------|
| Confidence Indicators | ❌ | ✅ | ✅ |
| Reasoning Panel | ❌ | ✅ | ✅ |
| AI Attribution Badges | ❌ | ✅ | ✅ |
| Map Primary Layout | ❌ | ❌ | ✅ |
| Spatial Insights | ❌ | ❌ | ✅ |
| Batch Operations | ❌ | ❌ | ✅ |
| Streaming Extraction | ❌ | ❌ | ✅ |
| Feedback | ❌ | ✅ | ✅ |
| Audit Logging | ❌ | ✅ | ✅ |

---

## Target State

### Single Agentic UI with Progressive Disclosure

**Core Principles:**
1. **Always-on transparency** (non-intrusive)
   - Confidence indicators: Small badges, not prominent
   - Reasoning: Collapsible "Why?" panels, expanded on demand
   - AI attribution: Subtle badges, not banners

2. **Spatial insights** (dismissible, contextual)
   - Start with 1-2 high-priority insights visible
   - "Show more insights" expands sidebar
   - Dismissible cards with "Got it" or "Not now"

3. **Onboarding flow** (first-time experience)
   - First visit: 3-step tour highlighting key features
   - Tooltips for first interactions
   - "Skip tour" for experienced users

4. **Progressive power** (features unlock naturally)
   - Basic: View reports, see confidence
   - Intermediate: Spatial insights appear as data accumulates
   - Advanced: Batch operations unlock when multiple reports selected

### New Architecture

```typescript
// Single mode configuration
export const AGENTIC_UI_CONFIG = {
  // Always enabled
  features: {
    enable_confidence_indicators: true,
    enable_reasoning_panel: true,
    enable_ai_attribution_badges: true,
    mapPrimary: true,
    spatialInsights: true,
    batchOperations: true,
    streamingExtraction: true,
    enable_feedback: true,
    enable_audit_logging: true,
    enable_audit_viewer: true,
  },
  // Progressive disclosure settings
  progressiveDisclosure: {
    maxVisibleInsights: 3,        // Start with 3, expand to show all
    insightsCollapsible: true,    // Can collapse sidebar
    insightsDismissible: true,   // Can dismiss individual insights
    reasoningDefaultCollapsed: true, // Reasoning panels start collapsed
    showOnboardingTour: true,     // First-time user tour
  },
};
```

---

## Migration Phases

### Phase 1: Preparation & Design (Week 1, Days 1-2)

**Goal:** Leverage existing wireframes and design minimal additional UX flows

#### Tasks:
1. **Review Existing Wireframes** ✅
   - [x] Review 10 existing wireframes (WF1-WF10) - **Already complete**
   - [x] Wireframes define target Agentic UI state - **Source of truth**
   - [x] Progressive disclosure patterns already designed (dismissible cards, collapsible reasoning)

2. **Create Minimal Additional UX Flows**
   - [ ] Create onboarding tour flow diagram (3 steps)
   - [ ] Annotate existing wireframes with collapsed states
   - [ ] Document "Show more insights" interaction pattern

3. **Create Feature Flag System (Backward Compatible)**
   - [ ] Add `progressiveDisclosure` config to `ui-modes.ts`
   - [ ] Keep existing mode system temporarily (for rollback)
   - [ ] Add feature flags for new progressive disclosure features

4. **Documentation**
   - [ ] Update `docs/UI/UI_SPECIFICATION.md` with new single-mode design
   - [ ] Reference existing wireframes as implementation spec
   - [ ] Create migration guide for team
   - [ ] Document rollback procedure

**Deliverables:**
- Onboarding tour flow diagram
- Collapsed state annotations
- Feature flag system ready
- Documentation updated

**Note:** No new full mockups needed - existing 10 wireframes (WF1-WF10) serve as primary design reference.

---

### Phase 2: Core Migration (Week 1, Days 3-5)

**Goal:** Remove mode switching, consolidate to single Agentic UI

#### Tasks:
1. **Update Configuration**
   - [ ] Modify `ui-modes.ts` to export single `AGENTIC_UI_CONFIG`
   - [ ] Remove `traditional` and `moderate` mode definitions
   - [ ] Update `DEFAULT_MODE` to always be `agentic`
   - [ ] Keep mode system for backward compatibility (deprecated)

2. **Remove Mode Switching UI**
   - [ ] Remove `ModeSwitcher` component
   - [ ] Remove mode switching from `Dashboard.tsx`
   - [ ] Remove `?mode=` URL parameter handling (or make it no-op)
   - [ ] Update navigation/routing to not expose mode switching

3. **Update Layout Logic**
   - [ ] Update `Dashboard.tsx` to always use `MapFirstLayout`
   - [ ] Remove conditional layout rendering
   - [ ] Ensure map-primary layout is always active

4. **Remove FeatureGate Checks for Core Features**
   - [ ] Remove `FeatureGate` for always-on features:
     - `enable_confidence_indicators` → Always render
     - `enable_reasoning_panel` → Always render (collapsible)
     - `enable_ai_attribution_badges` → Always render
     - `mapPrimary` → Always true
   - [ ] Keep `FeatureGate` for progressive disclosure controls

**Files to Modify:**
- `frontend/src/config/ui-modes.ts`
- `frontend/src/contexts/UIModeContext.tsx`
- `frontend/src/pages/Dashboard.tsx`
- `frontend/src/components/common/ModeSwitcher.tsx` (delete)
- All files using `FeatureGate` for core features

**Deliverables:**
- Single Agentic UI working
- Mode switching removed
- All tests passing

---

### Phase 3: Progressive Disclosure Implementation (Week 2, Days 1-3)

**Goal:** Implement progressive disclosure patterns

#### Tasks:
1. **Spatial Insights Progressive Disclosure**
   - [ ] Reference: WF15 (collapsed/expanded states)
   - [ ] Update `SpatialInsightsSidebar` to support:
     - `maxVisible` prop (start with 3 insights per WF15)
     - Collapsible state (show 3, expand to show all)
     - "Show more" / "Show less" toggle
     - Dismissible individual insights (per WF5, WF8 patterns)
   - [ ] Add local storage to remember user preferences
   - [ ] Implement priority-based ordering

2. **Reasoning Panel Collapsible**
   - [ ] Reference: WF14 (collapsed state), WF4 (expanded state)
   - [ ] Update `ReasoningPanel` to be collapsible by default
   - [ ] Add "Why?" or "Show AI Reasoning" button (per WF14)
   - [ ] Remember expanded state per report (localStorage)
   - [ ] Smooth expand/collapse animation

3. **Confidence Indicators (Subtle)**
   - [ ] Update `ConfidenceIndicator` styling to be more subtle
   - [ ] Move from prominent badge to small icon + tooltip
   - [ ] Ensure accessibility (screen reader support)

4. **Onboarding Tour**
   - [ ] Reference: WF11-WF13 (onboarding tour steps)
   - [ ] Create `OnboardingTour` component
   - [ ] Implement 3-step tour per wireframes:
     1. WF11: Spatial Insights sidebar introduction
     2. WF12: Map interactions and clustering
     3. WF13: Reasoning panel transparency
   - [ ] Add "Skip tour" option
   - [ ] Store completion in localStorage
   - [ ] Show tour only on first visit
   - [ ] Match tooltip/overlay styling from wireframes

**Files to Create/Modify:**
- `frontend/src/components/insights/SpatialInsightsSidebar.tsx` (reference: WF15)
- `frontend/src/components/extraction/ReasoningPanel.tsx` (reference: WF14, WF4)
- `frontend/src/components/extraction/ConfidenceIndicator.tsx`
- `frontend/src/components/onboarding/OnboardingTour.tsx` (new, reference: WF11-WF13)
- `frontend/src/hooks/useOnboarding.ts` (new)

**Design References:**
- Existing wireframes: `docs/UI/wireframes/wf1-wf10*.png` (primary reference)
- New wireframes: `docs/UI/wireframes/wf11-wf15*.png` (progressive disclosure states)
- See: `ADDITIONAL_WIREFRAMES_PROMPT.md` for designer specifications

**Deliverables:**
- Progressive disclosure working
- Onboarding tour implemented
- User preferences persisted

---

### Phase 4: Polish & Testing (Week 2, Days 4-5)

**Goal:** Polish UX and comprehensive testing

#### Tasks:
1. **UX Polish**
   - [ ] Refine animations (expand/collapse)
   - [ ] Ensure consistent spacing and typography
   - [ ] Verify accessibility (keyboard nav, screen readers)
   - [ ] Test responsive breakpoints

2. **Testing**
   - [ ] Update all unit tests (remove mode-specific tests)
   - [ ] Add tests for progressive disclosure features
   - [ ] Add tests for onboarding tour
   - [ ] Integration tests for single-mode flow
   - [ ] E2E tests with Playwright

3. **Documentation Updates**
   - [ ] Update `CLAUDE.md` (remove mode references)
   - [ ] Update `spec.md` (single Agentic UI)
   - [ ] Update component documentation
   - [ ] Create user guide for new UI

**Deliverables:**
- All tests passing (>80% coverage)
- Documentation updated
- UX polished and accessible

---

### Phase 5: Cleanup & Deprecation (Week 3, Days 1-2)

**Goal:** Remove deprecated code and finalize migration

#### Tasks:
1. **Remove Deprecated Code**
   - [ ] Remove `UIModeName` type (or keep as alias)
   - [ ] Remove `UI_MODES` object (keep only `AGENTIC_UI_CONFIG`)
   - [ ] Remove mode switching logic from `UIModeContext`
   - [ ] Simplify `FeatureGate` (remove mode checks)
   - [ ] Remove mode-related tests

2. **Update Type Definitions**
   - [ ] Simplify `UIFeatures` interface (remove mode-specific flags)
   - [ ] Update `UIMode` interface or remove if not needed
   - [ ] Update all type imports

3. **Final Verification**
   - [ ] Code review
   - [ ] Performance testing
   - [ ] Accessibility audit
   - [ ] Browser compatibility testing

**Deliverables:**
- Clean codebase (no deprecated code)
- Type system simplified
- All checks passing

---

## Detailed File Changes

### Files to Delete
- `frontend/src/components/common/ModeSwitcher.tsx`
- `frontend/src/components/common/ModeSwitcher.test.tsx`

### Files to Modify

#### Core Configuration
- `frontend/src/config/ui-modes.ts`
  - Remove `traditional` and `moderate` modes
  - Export single `AGENTIC_UI_CONFIG`
  - Add `progressiveDisclosure` config

#### Context & Hooks
- `frontend/src/contexts/UIModeContext.tsx`
  - Remove mode switching logic
  - Simplify to always use Agentic config
  - Keep feature override system for testing

- `frontend/src/hooks/useUIMode.ts`
  - Simplify (no mode switching)
  - Keep feature checking

#### Components
- `frontend/src/pages/Dashboard.tsx`
  - Remove mode switching
  - Always use `MapFirstLayout`
  - Remove conditional layout rendering

- `frontend/src/components/common/FeatureGate.tsx`
  - Simplify (no mode checks needed for core features)
  - Keep for progressive disclosure controls

- `frontend/src/components/insights/SpatialInsightsSidebar.tsx`
  - Add progressive disclosure props
  - Add collapsible/dismissible functionality

- `frontend/src/components/extraction/ReasoningPanel.tsx`
  - Add collapsible state
  - Default to collapsed

- `frontend/src/components/extraction/ConfidenceIndicator.tsx`
  - Update styling to be more subtle

- `frontend/src/components/extraction/ExtractionDisplay.tsx`
  - Remove `FeatureGate` checks (always show)
  - Update to use collapsible reasoning

- `frontend/src/components/ReportDetail.tsx`
  - Remove mode-specific conditionals
  - Always show all features

- `frontend/src/components/ReportListItem.tsx`
  - Always show confidence indicators (subtle)

#### New Files to Create
- `frontend/src/components/onboarding/OnboardingTour.tsx`
- `frontend/src/hooks/useOnboarding.ts`
- `frontend/src/hooks/useProgressiveDisclosure.ts`

### Test Files to Update
- All `*.test.tsx` files that reference modes
- Remove mode-specific test cases
- Add progressive disclosure tests

---

## Rollback Strategy

### If Issues Arise

1. **Quick Rollback (Git)**
   - Revert to previous commit
   - All changes in single feature branch for easy revert

2. **Feature Flag Rollback**
   - Keep old mode system as fallback
   - Add feature flag: `ENABLE_SINGLE_AGENTIC_UI`
   - If false, use old three-mode system

3. **Gradual Rollback**
   - Phase 1-2: Can rollback easily (no UX changes)
   - Phase 3: Progressive disclosure can be disabled via config
   - Phase 4-5: Full rollback via git revert

### Rollback Procedure

```bash
# Option 1: Git revert
git revert <migration-commit-sha>

# Option 2: Feature flag
# Set in environment or config:
ENABLE_SINGLE_AGENTIC_UI=false
```

---

## Testing Strategy

### Unit Tests
- [ ] Remove mode-specific test cases
- [ ] Test progressive disclosure hooks
- [ ] Test onboarding tour
- [ ] Test collapsible/dismissible components

### Integration Tests
- [ ] Test single-mode flow end-to-end
- [ ] Test progressive disclosure interactions
- [ ] Test onboarding tour flow

### E2E Tests (Playwright)
- [ ] First-time user flow (with tour)
- [ ] Returning user flow (no tour)
- [ ] Progressive disclosure interactions
- [ ] Accessibility (keyboard nav, screen readers)

### Manual Testing Checklist
- [ ] All features work without mode switching
- [ ] Progressive disclosure feels natural
- [ ] Onboarding tour is helpful, not annoying
- [ ] Performance is acceptable
- [ ] Accessibility standards met (WCAG 2.1 AA)

---

## Success Criteria

### Functional
- ✅ Single Agentic UI works for all users
- ✅ No mode switching UI visible
- ✅ Progressive disclosure works smoothly
- ✅ Onboarding tour helps new users
- ✅ All existing features work

### Technical
- ✅ Codebase simplified (25% reduction in mode-related code)
- ✅ All tests passing (>80% coverage)
- ✅ No performance regressions
- ✅ TypeScript types simplified

### UX
- ✅ Users can discover features naturally
- ✅ No overwhelming information overload
- ✅ Accessibility maintained/improved
- ✅ User feedback positive

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Users overwhelmed by full Agentic UI | High | Progressive disclosure, onboarding tour |
| Performance issues | Medium | Lazy loading, code splitting |
| Accessibility regressions | High | Comprehensive a11y testing |
| User resistance to change | Medium | Clear communication, training |
| Rollback complexity | Low | Feature flags, git strategy |

---

## Communication Plan

### Internal Team
- [ ] Announce migration plan
- [ ] Share UX mockups for feedback
- [ ] Weekly status updates

### Users (Forest Service)
- [ ] Announcement before migration
- [ ] User guide for new UI
- [ ] Training session (optional)
- [ ] Feedback collection mechanism

---

## Timeline

**Week 1:**
- Days 1-2: Preparation & Design
- Days 3-5: Core Migration

**Week 2:**
- Days 1-3: Progressive Disclosure
- Days 4-5: Polish & Testing

**Week 3:**
- Days 1-2: Cleanup & Deprecation
- Days 3-5: Buffer for issues/fixes

**Total:** 2-3 weeks

---

## Next Steps

1. **Review this plan** with team
2. **Approve UX mockups** for progressive disclosure
3. **Create feature branch:** `feature/ui-consolidation-migration`
4. **Begin Phase 1** (Preparation & Design)

---

**Status:** Ready for review and approval
