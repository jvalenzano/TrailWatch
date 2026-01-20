# Repository Audit Checklist: Synthetic Data Quality Track

**Purpose:** Comprehensive correctness and accuracy verification after data quality improvements  
**Date:** 2026-01-20  
**Status:** Template (to be completed during implementation)

---

## Pre-Audit Preparation

- [ ] All code changes committed to feature branch
- [ ] All tests passing locally
- [ ] TypeScript compilation successful
- [ ] No linter errors
- [ ] Branch is up-to-date with `develop`

---

## Phase 1: Data Integrity

### JSON Structure Validation
- [ ] `synthetic_day_in_life.json` is valid JSON
- [ ] All reports have required fields (id, location, hazard_type, etc.)
- [ ] All report IDs are unique
- [ ] All timestamps are valid ISO 8601 format
- [ ] All coordinates are valid (latitude: -90 to 90, longitude: -180 to 180)

### Type Safety
- [ ] All reports match `HazardReport` TypeScript interface
- [ ] No `any` types introduced
- [ ] All optional fields properly typed
- [ ] TypeScript compilation: `npm run build` (or equivalent) succeeds
- [ ] No type errors in IDE

### Data Consistency
- [ ] All `trail_id` values reference existing trails
- [ ] All `trail_name` values are consistent with `trail_id`
- [ ] All `district_id` values are valid (format: "03", "04", etc.)
- [ ] All `crew_id` values are valid (if present)
- [ ] All `similar_reports` arrays contain valid report IDs
- [ ] All `pattern_detection.duplicate_of` references exist
- [ ] All `pattern_detection.cluster_id` values are consistent

---

## Phase 2: Asset Verification

### Photo Assets
- [ ] All photo URLs in `photos` arrays resolve to existing files
- [ ] All photo files exist in `frontend/public/assets/photos/`
- [ ] No broken image links (verify manually or with script)
- [ ] Photo filenames match manifest
- [ ] All photos are appropriate format (jpg, png)

### External Intelligence Assets
- [ ] All `external_intelligence[].asset_url` values resolve
- [ ] All social media assets exist in `frontend/public/assets/social/`
- [ ] Asset manifest (`visual_assets_manifest.md`) is accurate
- [ ] No orphaned assets (assets not referenced in data)

### Asset Manifest Accuracy
- [ ] `visual_assets_manifest.md` lists all photos
- [ ] `visual_assets_manifest.md` lists all social assets
- [ ] Manifest descriptions match actual usage
- [ ] No typos in asset paths

---

## Phase 3: Business Logic Validation

### Confidence Scores
- [ ] All confidence scores are between 0.0 and 1.0
- [ ] Confidence distribution matches requirements (see spec)
- [ ] Low-confidence reports have appropriate `confidence_factors`
- [ ] High-confidence reports have strong `confidence_factors`

### GPS Validation
- [ ] All `gps_accurate` values are boolean
- [ ] Reports with `gps_accurate: false` have appropriate `accuracy_meters`
- [ ] Edge cases (off-trail, degraded validation) are present
- [ ] GPS coordinates are within reasonable bounds for Pacific Northwest

### Severity & Priority
- [ ] All `severity_estimate` values are valid enum
- [ ] All `triage_result.severity` values match `severity_estimate`
- [ ] All `assignment.priority` values are valid enum
- [ ] Priority matches severity (critical → urgent, etc.)

### Pattern Detection
- [ ] All cluster members have same `cluster_id`
- [ ] All duplicate pairs have `is_duplicate: true` and `duplicate_of` set
- [ ] Similarity scores are between 0.0 and 1.0
- [ ] Pattern detection metadata is consistent

### Assignment Workflow
- [ ] All assignment statuses are valid enum
- [ ] Resolved reports have `resolved_at` timestamps
- [ ] In-progress reports have `crew_id` assigned
- [ ] Workflow progression is logical (pending → assigned → in_progress → resolved)

---

## Phase 4: Temporal & Narrative Consistency

### Timestamps
- [ ] All `submitted_at` timestamps are chronologically consistent
- [ ] `triaged_at` (if present) is after `submitted_at`
- [ ] `reviewed_at` (if present) is after `triaged_at`
- [ ] `resolved_at` (if present) is after `reviewed_at`
- [ ] Reports span multiple days as required

### Weather Context
- [ ] Weather timestamps align with report timestamps
- [ ] Storm cluster reports have matching weather context
- [ ] Weather data is realistic for Pacific Northwest
- [ ] `relevant_to_hazard` flags are accurate

### Narrative Flow
- [ ] Storm cluster reports are temporally close (within 4 hours)
- [ ] Duplicate reports are temporally close (within 48 hours)
- [ ] Recurring issues have appropriate historical context
- [ ] Escalation scenarios show logical progression

---

## Phase 5: Code Quality

### TypeScript
- [ ] No `@ts-ignore` or `@ts-expect-error` comments
- [ ] All imports are used
- [ ] No unused variables
- [ ] No console.log statements (use proper logging)

### Tests
- [ ] All existing tests pass
- [ ] New edge case tests added
- [ ] Test coverage maintained or improved
- [ ] No flaky tests

### Linting
- [ ] ESLint passes with no errors
- [ ] Prettier formatting applied
- [ ] No warnings (or warnings are documented)

---

## Phase 6: Documentation

### Code Documentation
- [ ] Complex logic has inline comments
- [ ] Edge cases are documented
- [ ] New fields have JSDoc comments

### Track Documentation
- [ ] `index.md` is complete
- [ ] `spec.md` reflects final implementation
- [ ] `plan.md` shows all tasks completed
- [ ] `DESIGN_CRITIQUE.md` is preserved

### Demo Documentation
- [ ] Demo script scenarios are documented
- [ ] Demo paths are clear and testable
- [ ] Screenshots or wireframes included (if applicable)

---

## Phase 7: Integration Testing

### UI Integration
- [ ] All reports display correctly in dashboard
- [ ] External intelligence assets render properly
- [ ] Low-confidence reports show appropriate UI
- [ ] Edge cases don't break UI components

### Data Loading
- [ ] `useMockAgent()` hook loads all reports
- [ ] No runtime errors when loading data
- [ ] Filtering and sorting work correctly
- [ ] Map markers display correctly

### Pattern Detection
- [ ] Cluster insights display correctly
- [ ] Duplicate detection UI works
- [ ] Bias check insights render
- [ ] Pattern metadata is accessible

---

## Phase 8: Final Verification

### Manual Testing
- [ ] Demo script scenarios can be executed
- [ ] All edge cases can be demonstrated
- [ ] No obvious data quality issues
- [ ] Narrative flow is compelling

### Performance
- [ ] Data file size is reasonable (< 500KB)
- [ ] Loading time is acceptable (< 100ms)
- [ ] No memory leaks in data processing

### Security
- [ ] No sensitive data in synthetic dataset
- [ ] No PII (personally identifiable information)
- [ ] All data is properly sanitized

---

## Audit Sign-Off

**Auditor:** _________________  
**Date:** _________________  
**Status:** ☐ Pass  ☐ Fail  ☐ Conditional Pass

**Notes:**
```
[Space for audit notes]
```

---

## Post-Audit Actions

If audit fails:
- [ ] Create issue ticket for each failure
- [ ] Prioritize fixes (critical → high → medium → low)
- [ ] Re-audit after fixes applied

If audit passes:
- [ ] Merge to `develop` branch
- [ ] Update `conductor/tracks.md` with completion status
- [ ] Tag release if merging to `main`
