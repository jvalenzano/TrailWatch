# Repository Cleanup Plan - Next Steps

**Date:** 2026-01-20  
**Status:** Ready for Execution  
**Priority:** High

---

## Executive Summary

Track reorganization is complete, but **3 leftover directories with dates** remain in `conductor/tracks/`. Additionally, Phase 2 of the repository hygiene sweep needs to be completed.

---

## Phase 1: Remove Leftover Dated Track Directories

### Problem
During track reorganization, the old directories were renamed but **not removed**. These directories only contain minimal `index.md` files and are obsolete:

- ❌ `conductor/tracks/frontend_dashboard_20260118/` (obsolete, `frontend-dashboard/` exists)
- ❌ `conductor/tracks/intake_agent_20260116/` (obsolete, `intake-agent/` exists)
- ❌ `conductor/tracks/status_dashboard_20260118/` (obsolete, `status-dashboard/` exists)

### Action Plan

#### Step 1.1: Archive Old Directories (Preserve History)
Move to archive for historical reference:
```bash
mv conductor/tracks/frontend_dashboard_20260118 conductor/archive/tracks/
mv conductor/tracks/intake_agent_20260116 conductor/archive/tracks/
mv conductor/tracks/status_dashboard_20260118 conductor/archive/tracks/
```

**Rationale:** Preserve history while cleaning up active directory structure.

#### Step 1.2: Update Active References
Check and update any **active** (non-historical) references:

**Files to Check:**
- [ ] `conductor/WORKFLOW_EXAMPLES.md` (line 378: references `frontend_dashboard_20260118`)
- [ ] `docs/adr/ADR-001-trail-validation-architecture.md` (line 376: references `intake_agent_20260116`)

**Decision:** 
- If these are **historical examples** → Keep as-is (document context)
- If these are **active references** → Update to new semantic names

**Recommendation:** Update `WORKFLOW_EXAMPLES.md` since it's a workflow guide (not historical). Keep ADR-001 as-is since it's an architecture decision record with historical context.

---

## Phase 2: Complete Repository Hygiene Sweep

### 2.1: Archive Historical Documents

**Move to `conductor/archive/docs/`:**
- [ ] `conductor/WORKFLOW_ASSESSMENT.md` → `conductor/archive/docs/WORKFLOW_ASSESSMENT.md`
- [ ] `conductor/WORKFLOW_IMPROVEMENTS_SUMMARY.md` → `conductor/archive/docs/WORKFLOW_IMPROVEMENTS_SUMMARY.md`

**Rationale:** These documents record completed work. Useful for reference but not actively needed in main directory.

### 2.2: Review setup_state.json

**File:** `conductor/setup_state.json`  
**Content:** `{"last_successful_step": "3.3_initial_track_generated"}`

**Action Required:**
1. Check if referenced by any scripts or automation tools
2. Search codebase for `setup_state.json` references
3. **If unused:** Archive to `conductor/archive/misc/setup_state.json`
4. **If in use:** Document its purpose in a comment or README

**Current Status:** Not referenced anywhere in codebase (per hygiene report)

**Recommendation:** Archive it. If needed later, it's preserved in archive.

### 2.3: Optional Filename Cleanup (Low Priority)

**Files with underscores (cosmetic):**
- `conductor/tracks/frontend-dashboard/phase6_streaming_UAT.md` → `phase6-streaming-uat.md`
- `conductor/tracks/frontend-dashboard/playwright_visual_uat_plan.md` → `playwright-visual-uat-plan.md`

**Priority:** Low (cosmetic improvement)  
**Action:** Defer unless specifically requested

---

## Phase 3: Verification & Documentation

### 3.1: Verify Track Structure
- [ ] Confirm only semantic-named tracks exist in `conductor/tracks/`
- [ ] Verify `tracks.yaml` is accurate and complete
- [ ] Check that all active references use new semantic names

### 3.2: Update Cleanup Log
- [ ] Document Phase 1 cleanup (dated directories archived)
- [ ] Document Phase 2 cleanup (historical docs archived)
- [ ] Update `conductor/archive/cleanup-log.md`

### 3.3: Update Hygiene Report
- [ ] Mark Phase 2 as complete in `REPOSITORY_HYGIENE_REPORT.md`
- [ ] Add completion summary

---

## Execution Checklist

### Immediate Actions (High Priority)
- [ ] **Step 1.1:** Archive 3 dated track directories
- [ ] **Step 1.2:** Update `WORKFLOW_EXAMPLES.md` reference
- [ ] **Step 2.1:** Archive historical workflow documents
- [ ] **Step 2.2:** Archive `setup_state.json` (after verification)

### Verification (Before Commit)
- [ ] Run grep to verify no active references to old directory names
- [ ] Verify `tracks.yaml` accuracy
- [ ] Check that all tracks in `tracks/` use semantic names only

### Documentation Updates
- [ ] Update `cleanup-log.md`
- [ ] Update `REPOSITORY_HYGIENE_REPORT.md` with Phase 2 completion
- [ ] Update `TRACK_REORGANIZATION_COMPLETE.md` if needed

---

## Expected Outcome

After completion:
- ✅ Only semantic-named tracks in `conductor/tracks/`
- ✅ All dated directories archived (preserved for history)
- ✅ Historical documents archived
- ✅ Active references updated
- ✅ Clean, maintainable directory structure
- ✅ `tracks.yaml` remains single source of truth

---

## Files to Create/Modify

### Files to Move
- `conductor/tracks/frontend_dashboard_20260118/` → `conductor/archive/tracks/`
- `conductor/tracks/intake_agent_20260116/` → `conductor/archive/tracks/`
- `conductor/tracks/status_dashboard_20260118/` → `conductor/archive/tracks/`
- `conductor/WORKFLOW_ASSESSMENT.md` → `conductor/archive/docs/`
- `conductor/WORKFLOW_IMPROVEMENTS_SUMMARY.md` → `conductor/archive/docs/`
- `conductor/setup_state.json` → `conductor/archive/misc/` (after verification)

### Files to Update
- `conductor/WORKFLOW_EXAMPLES.md` (line 378)
- `conductor/archive/cleanup-log.md`
- `conductor/REPOSITORY_HYGIENE_REPORT.md`

---

## Notes

- **Preservation:** All old directories and files are archived, not deleted
- **Historical Context:** ADR documents and historical analysis keep old references for context
- **Active References:** Only workflow guides and active documentation need updates
- **Verification:** Always verify with grep before final commit

---

**Ready for execution. All actions are non-destructive (archive, not delete).**
