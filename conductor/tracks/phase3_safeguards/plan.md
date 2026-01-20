# Implementation Plan: Phase 3 Safety & Governance

**Objective:** Build the safety, auditability, and feedback systems before connecting real AI backends.

---

## Phase 3.1: Feature Flag Infrastructure (Context Migration)

- [x] **Create `UIModeContext.tsx`:** New React Context provider in `frontend/src/contexts/`
  - Wrap URL param logic from current `useUIMode`
  - Add `overrides` state for runtime feature toggles
  - Add `isFeatureEnabled()` helper that combines mode + overrides
- [x] **Update `useUIMode.ts`:** Refactor to consume context instead of direct URL access
- [x] **Update `FeatureGate.tsx`:** Use `isFeatureEnabled()` from context
- [x] **Wire Provider in `App.tsx`:** Wrap app with `UIModeProvider`
- [x] **Write Tests:** `UIModeContext.test.tsx` covering:
  - Initial mode from URL
  - Mode persistence to URL
  - Override behavior
  - Fallback when context missing

## Phase 3.2: Audit Log Service

- [x] **Create Types:** `frontend/src/types/audit.ts` with `AuditLogEntry`, `AuditActionType`
- [x] **Implement Service:** `frontend/src/services/auditLog.ts`
  - In-memory log storage
  - SessionStorage backup
  - `log()`, `getSessionLogs()`, `getLogsByType()`, `exportLogs()`, `clearLogs()`
- [x] **Create Hook:** `frontend/src/hooks/useAuditLog.ts` for React components
- [x] **Write Tests:** `auditLog.test.ts` covering:
  - Log entry creation with auto-generated id/timestamp/sessionId
  - Filtering by action type
  - Export to JSON
  - Session persistence

## Phase 3.3: Feedback Component

- [x] **Create Types:** `frontend/src/types/feedback.ts` with `FeedbackPayload`, component props
- [x] **Build `FeedbackComponent.tsx`:** Thumbs up/down UI with compact mode
  - Positive: Log immediately, show confirmation
  - Negative: Expand correction form
- [x] **Build `FeedbackForm.tsx`:** Correction text input with submit/cancel
- [x] **Create Hook:** `frontend/src/hooks/useFeedback.ts` for state management
- [x] **Write Tests:** `FeedbackComponent.test.tsx` covering:
  - Thumbs up/down interactions
  - Form expansion on negative
  - Submission and audit log integration
  - Accessibility (keyboard nav, ARIA)

## Phase 3.4: Feature Flag Updates

- [ ] **Update `ui-modes.ts`:** Add new feature flags:
  - `enable_feedback`
  - `enable_audit_logging`
  - `enable_audit_viewer`
- [ ] **Configure Defaults:** Traditional (all false), Moderate (feedback + logging), Agentic (all true)

## Phase 3.5: Integration & Wiring

- [ ] **Add Audit Logging:** Integrate `useAuditLog` into existing AI components:
  - `ClusterInsightCard` → log `cluster_detected`
  - `DuplicateInsightCard` → log `duplicate_flagged`
  - `ReasoningPanel` → log `reasoning_expanded`
  - `CircuitBreakerModal` → log `circuit_breaker_*`
- [ ] **Add Feedback UI:** Add `FeedbackComponent` to insight cards (behind feature gate)
- [ ] **Verify All Modes:** Test Traditional, Moderate, Agentic modes work correctly

---

## Completion Criteria

- [ ] FeatureGate uses React Context (verified in tests)
- [ ] Audit logs generated for all AI actions (check via `exportLogs()`)
- [ ] Users can submit thumbs up/down feedback
- [ ] Feedback persists in SessionStorage
- [ ] 80%+ test coverage on new code
- [ ] Zero jest-axe accessibility violations
- [ ] All three UI modes work correctly with new features gated appropriately

---

## Files Summary

### New Files
```
frontend/src/
├── contexts/
│   ├── UIModeContext.tsx
│   └── UIModeContext.test.tsx
├── services/
│   ├── auditLog.ts
│   └── auditLog.test.ts
├── components/feedback/
│   ├── FeedbackComponent.tsx
│   ├── FeedbackComponent.test.tsx
│   └── FeedbackForm.tsx
├── types/
│   ├── audit.ts
│   └── feedback.ts
└── hooks/
    ├── useAuditLog.ts
    └── useFeedback.ts
```

### Modified Files
```
frontend/src/
├── hooks/useUIMode.ts          # Consume context
├── components/common/FeatureGate.tsx  # Use isFeatureEnabled()
├── config/ui-modes.ts          # Add new feature flags
└── App.tsx                     # Wrap with UIModeProvider
```
