# Specification: Synthetic Data Quality Enhancement

**Track:** Synthetic Data Quality & Demo Enhancement  
**Version:** 1.0  
**Date:** 2026-01-20

## Purpose

Enhance the synthetic data corpus (`frontend/src/data/synthetic_day_in_life.json`) to support production-quality demos by adding realism, edge cases, and comprehensive scenario coverage.

## Scope

### In Scope

1. **Data Quality Improvements**
   - Confidence score distribution normalization
   - GPS validation edge cases
   - Photo quality variety
   - Temporal narrative enhancement
   - Reporter persona diversity

2. **Storytelling Enhancements**
   - "Aha!" moment scenarios
   - Escalation workflows
   - Assignment state variety

3. **Visual & UX Polish**
   - Additional photo assets
   - External intelligence variety
   - Weather context diversity

4. **Metadata & Audit Trail**
   - Submission metadata
   - Workflow timestamps
   - Pattern detection variety

5. **Demo Preparation**
   - Demo script scenarios
   - Interactive element support
   - Success metrics

6. **Repository Audit**
   - Type safety verification
   - Data consistency checks
   - Asset manifest accuracy
   - Documentation completeness

### Out of Scope

- Backend API changes
- UI component modifications (unless required for new data fields)
- Real data integration
- Performance optimization

## Requirements

### Functional Requirements

#### FR1: Confidence Score Distribution
- **Requirement:** Dataset must include reports across full confidence spectrum
- **Acceptance Criteria:**
  - At least 3 reports with confidence 0.30-0.50
  - At least 2 reports with confidence 0.50-0.70
  - At least 15 reports with confidence 0.70-0.95
  - At least 1 report with confidence >0.95

#### FR2: GPS Validation Edge Cases
- **Requirement:** Dataset must demonstrate GPS validation failure scenarios
- **Acceptance Criteria:**
  - At least 1 report with `gps_accurate: false` and `accuracy_meters > 100`
  - At least 1 report with degraded validation state
  - At least 1 report with GPS accurate but wrong trail segment

#### FR3: Photo Quality Variety
- **Requirement:** Dataset must include reports with varying photo quality
- **Acceptance Criteria:**
  - At least 2 reports with `photo_matches_hazard: false`
  - At least 1 report with multiple photos (2-3)
  - At least 1 report with no photo but high confidence
  - At least 1 report with blurry/poor quality photo

#### FR4: Temporal Narrative
- **Requirement:** Dataset must span multiple days with realistic timestamps
- **Acceptance Criteria:**
  - Reports from at least 3 different days
  - At least 2 reports with `status: "resolved"` and `resolved_at` timestamps
  - At least 2 reports with `status: "in_progress"` and crew assignments
  - At least 1 recurring issue with historical context

#### FR5: Reporter Diversity
- **Requirement:** Dataset must include diverse reporter personas
- **Acceptance Criteria:**
  - At least 1 report from `reporter_type: "equestrian"`
  - At least 1 report from `reporter_type: "biker"`
  - At least 1 report from `reporter_type: "tourist"`
  - Language patterns match persona types

#### FR6: External Intelligence
- **Requirement:** External intelligence must be used more comprehensively
- **Acceptance Criteria:**
  - At least 5 reports with external intelligence
  - At least 1 report with conflicting external sources
  - At least 1 report with multiple external sources (3+)

#### FR7: Assignment Workflow
- **Requirement:** Dataset must show complete assignment lifecycle
- **Acceptance Criteria:**
  - Reports in all assignment states: `pending_review`, `assigned`, `in_progress`, `resolved`
  - At least 1 report with reassignment history
  - All resolved reports have `resolved_at` timestamps

### Non-Functional Requirements

#### NFR1: Type Safety
- All data must validate against `HazardReport` TypeScript interface
- No type errors in `synthetic_day_in_life.json`

#### NFR2: Data Consistency
- All photo URLs must resolve to existing assets
- All trail IDs must be consistent
- All report IDs must be unique
- All timestamps must be valid ISO 8601 format

#### NFR3: Documentation
- All new reports must have clear descriptions
- All edge cases must be documented
- Demo script scenarios must be written

#### NFR4: Backward Compatibility
- Existing tests must continue to pass
- Existing UI components must work with enhanced data
- No breaking changes to data structure

## Data Schema Enhancements

### New Optional Fields

```typescript
interface HazardReport {
  // ... existing fields ...
  
  // Submission metadata
  submitted_via?: 'mobile_app' | 'web_form' | 'email' | 'api';
  device_info?: {
    platform?: string;
    app_version?: string;
  };
  submission_latency_seconds?: number;
  
  // Workflow timestamps
  triaged_at?: string;
  reviewed_at?: string;
  reviewed_by?: string;
  
  // Edit history
  edit_history?: Array<{
    timestamp: string;
    field: string;
    old_value: unknown;
    new_value: unknown;
    edited_by: string;
  }>;
}
```

## Demo Script Scenarios

### Scenario 1: Morning Storm Response
**Path:** Cluster Detection → Batch Assignment → Resolution  
**Reports:** NR-001, NR-002, NR-003, NR-004  
**Goal:** Show proactive cluster detection and coordinated response

### Scenario 2: False Alarm Investigation
**Path:** Low Confidence → Human Verification → Resolved  
**Reports:** [New low-confidence report]  
**Goal:** Show system handling uncertainty gracefully

### Scenario 3: Pattern Discovery
**Path:** Unrelated Reports → AI Connects Dots → New Insight  
**Reports:** [3 reports that form pattern]  
**Goal:** Show AI pattern recognition capabilities

### Scenario 4: High-Risk Decision
**Path:** Critical Hazard → Circuit Breaker → Escalation  
**Reports:** RV-007 (bridge collapse)  
**Goal:** Show safety circuit breaker in action

## Success Metrics

- **Data Quality:** 30+ reports with realistic distribution
- **Edge Cases:** All 17 improvement categories addressed
- **Type Safety:** 100% type coverage, zero errors
- **Test Coverage:** All existing tests pass, new tests added
- **Documentation:** Complete audit checklist, demo scripts

## Dependencies

- Phase 4 Agentic Mode UI (for integration testing)
- External Intelligence assets (already integrated)
- TypeScript type definitions (must be updated if schema changes)

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing tests | Medium | High | Run full test suite after each phase |
| Type errors from new fields | Low | Medium | Update TypeScript types first |
| Asset URLs broken | Low | Medium | Verify all URLs in audit phase |
| Demo script unclear | Low | Low | Document with screenshots |

## Acceptance Criteria Summary

- [ ] All functional requirements met
- [ ] All non-functional requirements met
- [ ] Repository audit completed
- [ ] Demo scripts documented
- [ ] All tests passing
- [ ] Type safety verified
- [ ] Documentation complete
