# Repository Hygiene Analysis - Phase 1

**Date:** 2026-01-20  
**Status:** Analysis Complete - Awaiting Approval  
**Scope:** `conductor/` directory (Phase 1)

---

## 1. Orphaned Files

### Files Not Referenced Anywhere

**FILE:** `conductor/tracks/TRACK_REORGANIZATION_PROPOSAL.md`  
**STATUS:** Analysis document, referenced in SESSION_HANDOVER.md  
**ACTION:** Keep (useful reference for reorganization decisions)

**FILE:** `conductor/WORKFLOW_IMPROVEMENTS_SUMMARY.md`  
**STATUS:** Summary document, not linked from index.md  
**ACTION:** Archive or link from index.md  
**REASON:** Useful historical record but not actively referenced

**FILE:** `conductor/setup_state.json`  
**STATUS:** Unknown purpose, not referenced  
**ACTION:** **FLAG FOR REVIEW** - Need to determine if in use

**FILE:** `conductor/tracks/agentic-mode/implementation_plan.md`  
**STATUS:** Referenced in NEXT.md but file was deleted during rename  
**ACTION:** **FLAG FOR REVIEW** - May need to restore or update reference

### Potentially Orphaned Documentation

**FILE:** `conductor/tracks/frontend-dashboard/NIGHTLY_POLISH.md`  
**STATUS:** Not referenced in index.md or plan.md  
**ACTION:** Review - May be active work document

**FILE:** `conductor/tracks/frontend-dashboard/phase6_streaming_UAT.md`  
**STATUS:** Referenced in playwright_visual_uat_plan.md  
**ACTION:** Keep (referenced)

**FILE:** `conductor/tracks/frontend-dashboard/playwright_visual_uat_plan.md`  
**STATUS:** Not referenced in index.md  
**ACTION:** Review - May be active UAT planning

---

## 2. Duplicate Content

### Multiple Workflow Documents

**FILES:**
- `conductor/workflow.md` - Main workflow documentation
- `conductor/WORKFLOW_ASSESSMENT.md` - Assessment document
- `conductor/WORKFLOW_EXAMPLES.md` - Examples
- `conductor/WORKFLOW_IMPROVEMENTS_SUMMARY.md` - Summary

**ANALYSIS:** Not duplicates - each serves different purpose:
- `workflow.md` - Authoritative workflow guide
- `WORKFLOW_ASSESSMENT.md` - Analysis and recommendations (historical)
- `WORKFLOW_EXAMPLES.md` - Concrete examples
- `WORKFLOW_IMPROVEMENTS_SUMMARY.md` - Implementation summary (historical)

**ACTION:** Consider archiving `WORKFLOW_ASSESSMENT.md` and `WORKFLOW_IMPROVEMENTS_SUMMARY.md` as they're historical records of completed work.

### Track Documentation

**NO DUPLICATES FOUND** - Each track has unique spec.md and plan.md

---

## 3. Naming Inconsistencies

### ✅ RESOLVED
All track folders now use semantic names with hyphens (no dates):
- `intake-agent/` ✅
- `status-dashboard/` ✅
- `frontend-dashboard/` ✅
- `safeguards/` ✅
- `agentic-mode/` ✅
- `synthetic-data-quality/` ✅
- `wireframe-conformance/` ✅

### Remaining Inconsistencies

**FILE:** `conductor/tracks/frontend-dashboard/phase6_streaming_UAT.md`  
**ISSUE:** Uses underscore in filename, inconsistent with kebab-case  
**ACTION:** Rename to `phase6-streaming-uat.md` (optional, low priority)

**FILE:** `conductor/tracks/frontend-dashboard/playwright_visual_uat_plan.md`  
**ISSUE:** Uses underscores in filename  
**ACTION:** Rename to `playwright-visual-uat-plan.md` (optional, low priority)

---

## 4. Incomplete Structures

### Tracks Directory

**ALL TRACKS NOW COMPLETE:**
- ✅ All tracks have `index.md`
- ✅ All tracks have `metadata.json`
- ✅ All tracks have `spec.md` or `plan.md`

### Missing Files

**FILE:** `conductor/tracks/agentic-mode/implementation_plan.md`  
**STATUS:** Referenced in NEXT.md but deleted during rename  
**ACTION:** **FLAG FOR REVIEW** - Check if needed or update NEXT.md reference

---

## 5. Stale Content

### Outdated References

**FILE:** `conductor/NEXT.md`  
**ISSUE:** References `phase4-agentic-mode/implementation_plan.md` (now `agentic-mode/`)  
**STATUS:** ✅ FIXED - Updated to reference `agentic-mode/`

**FILE:** `conductor/workflow.md`  
**ISSUE:** References old track paths with dates  
**ACTION:** **NEEDS UPDATE** - Search and replace old paths

**FILE:** `conductor/WORKFLOW_EXAMPLES.md`  
**ISSUE:** References `intake_agent_20260116/`  
**ACTION:** **NEEDS UPDATE** - Update to `intake-agent/`

**FILE:** `conductor/QUICK_START.md`  
**ISSUE:** References `intake_agent_20260116/`  
**ACTION:** **NEEDS UPDATE** - Update to `intake-agent/`

**FILE:** `conductor/WORKFLOW_ASSESSMENT.md`  
**ISSUE:** References old track paths  
**ACTION:** Archive (historical document) or update references

**FILE:** `conductor/tracks/TRACK_REORGANIZATION_PROPOSAL.md`  
**ISSUE:** Contains old track names in analysis section  
**ACTION:** Keep as-is (historical analysis document)

### Status Mismatches

**FILE:** `conductor/tracks/safeguards/metadata.json`  
**ISSUE:** Says `"status": "planned"` but tracks.md says complete  
**ACTION:** **NEEDS UPDATE** - Change to `"complete"`

**FILE:** `conductor/tracks/agentic-mode/metadata.json`  
**ISSUE:** Says `"status": "planned"` but tracks.md says complete  
**ACTION:** **NEEDS UPDATE** - Change to `"complete"`

---

## Summary by Category

| Category | Count | Priority | Action |
|----------|-------|----------|--------|
| Orphaned Files | 2 | Medium | Review setup_state.json, check implementation_plan.md |
| Duplicate Content | 0 | - | None found |
| Naming Inconsistencies | 2 | Low | Optional filename cleanup |
| Incomplete Structures | 1 | High | Fix implementation_plan.md reference |
| Stale Content | 6 | High | Update references in workflow docs |

---

## Recommended Actions

### High Priority
1. ✅ Update `safeguards/metadata.json` status to "complete"
2. ✅ Update `agentic-mode/metadata.json` status to "complete"
3. Update `workflow.md` - Replace old track path references
4. Update `WORKFLOW_EXAMPLES.md` - Replace old track path references
5. Update `QUICK_START.md` - Replace old track path references
6. Fix `NEXT.md` reference to implementation_plan.md (check if file exists)

### Medium Priority
7. Review `setup_state.json` - Determine if in use
8. Archive `WORKFLOW_ASSESSMENT.md` and `WORKFLOW_IMPROVEMENTS_SUMMARY.md` (historical)

### Low Priority
9. Rename UAT files to kebab-case (optional)

---

## Next Phase

After approval, proceed to:
- Phase 2: Consolidation (archive historical docs, update references)
- Phase 3: Structural improvements
- Phase 4: Verification

**Awaiting approval to proceed with Phase 2.**
