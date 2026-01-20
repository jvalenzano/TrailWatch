# Phase 3: Safety & Governance - Technical Specification

**Objective:** Implement safety, auditability, and feedback mechanisms before connecting real AI backends.

---

## 1. Enhanced FeatureGate (React Context)

### Current State
The existing `FeatureGate` component (`frontend/src/components/common/FeatureGate.tsx`) uses URL params via `useUIMode()`. This works but has limitations:
- No centralized state management
- No ability to override features programmatically
- No audit trail of feature usage

### Target Architecture

```
UIModeProvider (React Context)
    │
    ├── Reads initial mode from URL (?mode=agentic)
    ├── Maintains feature override state
    ├── Exposes audit hooks for feature access
    │
    └── Children
         ├── FeatureGate (consumes context)
         └── useUIMode (consumes context)
```

### Context Shape

```typescript
interface UIModeContextValue {
    /** Current active mode configuration */
    mode: UIMode;
    /** Current mode name */
    modeName: UIModeName;
    /** Change the active mode */
    setMode: (mode: UIModeName) => void;
    /** Runtime feature overrides (for testing/admin) */
    overrides: Partial<UIFeatures>;
    /** Set a feature override */
    setOverride: (feature: keyof UIFeatures, value: boolean) => void;
    /** Clear all overrides */
    clearOverrides: () => void;
    /** Check if a feature is enabled (mode + overrides) */
    isFeatureEnabled: (feature: keyof UIFeatures) => boolean;
}
```

### Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `frontend/src/contexts/UIModeContext.tsx` | Create | New context provider |
| `frontend/src/hooks/useUIMode.ts` | Modify | Consume context instead of URL directly |
| `frontend/src/components/common/FeatureGate.tsx` | Modify | Use `isFeatureEnabled()` from context |
| `frontend/src/App.tsx` | Modify | Wrap with `UIModeProvider` |

### Behavior

1. **Initialization:** Provider reads `?mode=` from URL on mount
2. **Persistence:** Mode changes update URL params
3. **Overrides:** Admin can force-enable/disable features via `setOverride()`
4. **Fallback:** If context unavailable, `FeatureGate` fails closed (returns null)

---

## 2. AuditLogService

### Purpose
Track all AI-initiated actions with a standardized JSON schema for compliance and debugging.

### Log Entry Schema

```typescript
interface AuditLogEntry {
    /** Unique identifier for this entry */
    id: string;
    /** ISO 8601 timestamp */
    timestamp: string;
    /** Type of AI action */
    actionType: AuditActionType;
    /** Component that triggered the action */
    source: string;
    /** Human-readable description */
    description: string;
    /** Action-specific payload */
    payload: Record<string, unknown>;
    /** AI confidence if applicable (0-1) */
    confidence?: number;
    /** User who was logged in */
    userId?: string;
    /** Session identifier */
    sessionId: string;
    /** Feature flags active at time of action */
    activeFeatures: string[];
    /** Outcome of the action */
    outcome?: 'success' | 'failure' | 'pending' | 'cancelled';
}

type AuditActionType =
    | 'cluster_detected'      // AI identified a spatial cluster
    | 'duplicate_flagged'     // AI flagged potential duplicate
    | 'confidence_displayed'  // Confidence indicator shown to user
    | 'reasoning_expanded'    // User expanded reasoning panel
    | 'circuit_breaker_shown' // High-risk confirmation modal displayed
    | 'circuit_breaker_approved' // User approved high-risk action
    | 'circuit_breaker_rejected' // User rejected high-risk action
    | 'feedback_submitted'    // User submitted feedback
    | 'feature_gate_evaluated'; // Feature gate checked
```

### Service Interface

```typescript
interface AuditLogService {
    /** Log an AI action */
    log(entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'sessionId'>): void;

    /** Get logs for current session */
    getSessionLogs(): AuditLogEntry[];

    /** Get logs filtered by action type */
    getLogsByType(type: AuditActionType): AuditLogEntry[];

    /** Export logs as JSON */
    exportLogs(): string;

    /** Clear session logs */
    clearLogs(): void;
}
```

### Implementation Strategy

**Phase 3a (In-Memory):**
- Store logs in memory (SessionStorage backup)
- No backend integration
- Useful for development and demos

**Phase 4+ (Backend):**
- POST logs to `/api/audit/log` endpoint
- Batch uploads every 30 seconds
- Offline queue with retry

### Files to Create

| File | Description |
|------|-------------|
| `frontend/src/services/auditLog.ts` | Service implementation |
| `frontend/src/services/auditLog.test.ts` | Unit tests |
| `frontend/src/types/audit.ts` | TypeScript interfaces |
| `frontend/src/hooks/useAuditLog.ts` | React hook wrapper |

### Usage Example

```typescript
import { useAuditLog } from '../hooks/useAuditLog';

function ClusterInsightCard({ cluster }: Props) {
    const { log } = useAuditLog();

    useEffect(() => {
        log({
            actionType: 'cluster_detected',
            source: 'ClusterInsightCard',
            description: `Spatial cluster detected: ${cluster.reports.length} reports`,
            payload: {
                clusterId: cluster.id,
                reportIds: cluster.reports.map(r => r.id),
                boundingBox: cluster.bbox,
            },
            confidence: cluster.confidence,
            activeFeatures: ['spatialInsights', 'enable_confidence_indicators'],
        });
    }, [cluster.id]);

    // ... render
}
```

---

## 3. FeedbackComponent

### Purpose
Allow users to provide thumbs up/down feedback on AI decisions with optional correction text.

### Component Interface

```typescript
interface FeedbackComponentProps {
    /** Unique ID of the item being rated (report ID, cluster ID, etc.) */
    targetId: string;
    /** Type of AI output being rated */
    targetType: 'cluster' | 'duplicate' | 'confidence' | 'classification';
    /** What the AI predicted/decided */
    aiOutput: string;
    /** Callback when feedback is submitted */
    onSubmit?: (feedback: FeedbackPayload) => void;
    /** Compact mode for inline use */
    compact?: boolean;
}

interface FeedbackPayload {
    targetId: string;
    targetType: string;
    rating: 'positive' | 'negative';
    correctionText?: string;
    /** What the user believes is correct */
    userCorrection?: string;
    /** Timestamp */
    timestamp: string;
}
```

### UI Design

**Compact Mode (inline):**
```
[AI: High confidence] [thumbs-up] [thumbs-down]
```

**Expanded Mode (after thumbs down):**
```
+----------------------------------------+
| Help us improve                        |
|                                        |
| What should the result have been?      |
| +----------------------------------+   |
| | [Text input for correction]      |   |
| +----------------------------------+   |
|                                        |
| [Cancel]                    [Submit]   |
+----------------------------------------+
```

### Behavior

1. **Initial State:** Show thumbs up/down buttons
2. **Positive Feedback:** Log immediately, show brief "Thanks!" confirmation
3. **Negative Feedback:** Expand to show correction form
4. **Submit Correction:** Log feedback + correction, collapse back
5. **Audit Integration:** All feedback submissions logged via AuditLogService

### Accessibility Requirements

- `aria-label` on thumbs buttons: "Mark AI prediction as correct" / "Mark AI prediction as incorrect"
- `aria-expanded` on feedback form
- Focus management: Move focus to correction input when expanded
- Keyboard support: Enter to submit, Escape to cancel

### Files to Create

| File | Description |
|------|-------------|
| `frontend/src/components/feedback/FeedbackComponent.tsx` | Main component |
| `frontend/src/components/feedback/FeedbackComponent.test.tsx` | Unit tests |
| `frontend/src/components/feedback/FeedbackForm.tsx` | Expanded form sub-component |
| `frontend/src/types/feedback.ts` | TypeScript interfaces |
| `frontend/src/hooks/useFeedback.ts` | State management hook |

### Integration Points

```tsx
// In ClusterInsightCard.tsx
<InsightCard>
    <ClusterInfo cluster={cluster} />
    <FeatureGate feature="enable_feedback">
        <FeedbackComponent
            targetId={cluster.id}
            targetType="cluster"
            aiOutput={`${cluster.reports.length} related reports detected`}
            compact
        />
    </FeatureGate>
</InsightCard>
```

---

## 4. New Feature Flags

Add to `UIFeatures` interface in `frontend/src/config/ui-modes.ts`:

```typescript
interface UIFeatures {
    // ... existing flags

    /** Enable user feedback on AI decisions */
    enable_feedback: boolean;
    /** Enable audit logging (for debugging) */
    enable_audit_logging: boolean;
    /** Show audit log viewer (admin only) */
    enable_audit_viewer: boolean;
}
```

### Flag Defaults by Mode

| Feature | Traditional | Moderate | Agentic |
|---------|-------------|----------|---------|
| `enable_feedback` | false | true | true |
| `enable_audit_logging` | false | true | true |
| `enable_audit_viewer` | false | false | true |

---

## 5. Testing Strategy

### Unit Tests
- `UIModeContext`: Provider initialization, override behavior, persistence
- `AuditLogService`: Log creation, filtering, export
- `FeedbackComponent`: User interactions, form validation, submission

### Integration Tests
- Feature gate + audit logging integration
- Feedback submission + audit log entry creation
- Mode switching preserves audit logs

### Accessibility Tests (jest-axe)
- FeedbackComponent keyboard navigation
- Focus management on expand/collapse
- ARIA attributes correct

---

## 6. Success Criteria

- [ ] FeatureGate uses React Context (not URL directly)
- [ ] All AI actions are logged with standardized schema
- [ ] Users can provide feedback on AI decisions
- [ ] Feedback persists in session storage
- [ ] 80%+ test coverage on new code
- [ ] Zero accessibility violations (jest-axe)
- [ ] Works in all three UI modes (with appropriate feature gates)
