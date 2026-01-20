# Task 4: Reasoning Panel & Report Detail Enhancements

**Role:** Frontend Developer
**Objective:** Implement the "Transparent Reasoning" UI for high-confidence reports (Wireframes 3 & 4).

## Context
In Agentic Mode, when a user views a report (either by clicking a map marker or from the list), they need to see *why* the AI made its decision.
Reference: **WF3 (Report Detail)** and **WF4 (Reasoning Chain)**.

## Specifications

### 1. `src/components/agentic/ReasoningPanel.tsx` (Create)
**Purpose:**
Display the "Chain of Thought" (CoT) logic steps that led to the triage classification.

**Visuals (WF4):**
-   A vertical list of steps.
-   Each step has a status: `success` (green check), `warning` (amber yield), or `info` (blue dot).
-   **Animation:** Use `framer-motion` (or just CSS transitions) to stagger the appearance of steps if possible, or static is fine for MVP.
-   **Dark Mode:** Deep gray card background (`bg-gray-800`).

**Props:**
```typescript
interface ReasoningStep {
  step: string; // e.g., "Visual Analysis"
  status: 'success' | 'warning' | 'info';
  detail: string; // e.g., "Identified fallen tree > 12in diameter"
}
interface ReasoningPanelProps {
  steps: ReasoningStep[];
  overallConfidence: number; // 0.0 - 1.0, display as percentage
}
```

### 2. `src/components/ReportDetail.tsx` (Update)
**Purpose:** enhance the existing `ReportDetail` to support the Agentic view.

**Changes:**
-   **Conditional Rendering:** If `mode === 'agentic'` (check via `useUIMode`), render the `ReasoningPanel` below the description.
-   **Confidence Badge:** Add a high-visibility badge (e.g., "89% Confidence") near the header using the color-coding logic (Red/Amber/Green).
-   **Mock Data Connection:** Ensure it displays data from the `triage_result` field if available.

### 3. `src/components/common/ConfidenceBadge.tsx` (Create - Optional but recommended)
-   Small component to render the percentage pill.
-   Green (>80%), Amber (50-79%), Red (<50%).

## Workflow
1.  **Component:** Create `ReasoningPanel.tsx` and `ConfidenceBadge.tsx`.
2.  **Test:** Create `ReasoningPanel.test.tsx` (Verify it renders steps and handles empty states).
3.  **Integration:** Edit `ReportDetail.tsx` (read it first!) to conditionally include the new components.
4.  **Data:** Use the `mockReports` we verified earlier which already have `triage_result`.

## Deliverables
-   `src/components/agentic/ReasoningPanel.tsx`
-   `src/components/agentic/ReasoningPanel.test.tsx`
-   `src/components/common/ConfidenceBadge.tsx`
-   Updated `src/components/ReportDetail.tsx`
