# Documentation & Organization Cleanup Plan

**Date:** 2026-01-20  
**Status:** Ready to execute

---

## 🧹 Cleanup Opportunities

### 1. Coverage Files (Generated - Should Not Be Tracked)
**Issue:** Coverage HTML/JSON files are being tracked in git  
**Impact:** Clutters git status, unnecessary diffs  
**Solution:** Add to `.gitignore`, remove from tracking

**Files to ignore:**
```
frontend/coverage/
```

### 2. One-Time Review Documents (Archive)
**Issue:** `wf6-review-summary.md` is a one-time review, no longer needed  
**Impact:** Clutters workflow directory  
**Solution:** Archive or delete

**Files to archive:**
- `.agent/workflows/wf6-review-summary.md` → Archive (completed review)

### 3. Redundant Workflow Documents (Consolidate)
**Issue:** Two WF9 planning documents - detailed plan vs simplified launch  
**Impact:** Confusion about which to use  
**Solution:** Keep simplified launch doc, archive detailed plan

**Files to consolidate:**
- Keep: `.agent/workflows/wf9-launch-subagents.md` (active, simplified)
- Archive: `.agent/workflows/wf9-parallel-execution-plan.md` (detailed reference, can archive after WF9 complete)

### 4. Unused Workflow Templates (Evaluate)
**Issue:** Several workflow template files may not be actively used  
**Impact:** Clutters directory  
**Solution:** Evaluate usage, archive if unused

**Files to evaluate:**
- `.agent/workflows/document-codebase.md` - Template? Used?
- `.agent/workflows/new-project-setup.md` - Template? Used?
- `.agent/workflows/start-feature.md` - Template? Used?
- `.agent/workflows/finish-feature.md` - Template? Used?

**Keep (Active):**
- `.agent/workflows/session-handover.md` - Active template
- `.agent/workflows/session-handover-output.md` - Active (updated regularly)
- `.agent/workflows/wf9-launch-subagents.md` - Active (current task)

---

## 📋 Execution Steps

### Step 1: Fix .gitignore (Coverage Files)
```bash
# Add coverage directory to .gitignore
echo "frontend/coverage/" >> .gitignore

# Remove coverage files from git tracking (keep local files)
git rm -r --cached frontend/coverage/
```

### Step 2: Archive One-Time Review Documents
```bash
# Create archive directory if needed
mkdir -p .agent/workflows/archive

# Move completed review to archive
git mv .agent/workflows/wf6-review-summary.md .agent/workflows/archive/
```

### Step 3: Archive Detailed WF9 Plan (After WF9 Complete)
**Wait until WF9 is complete, then:**
```bash
# Archive detailed plan (keep simplified launch doc)
git mv .agent/workflows/wf9-parallel-execution-plan.md .agent/workflows/archive/
```

### Step 4: Evaluate Workflow Templates
**Check if these are actively used:**
- If unused: Archive to `.agent/workflows/archive/`
- If used: Keep but document purpose

---

## ✅ Recommended Immediate Actions

**Do Now (Safe):**
1. ✅ Add `frontend/coverage/` to `.gitignore`
2. ✅ Remove coverage files from git tracking
3. ✅ Archive `wf6-review-summary.md` (completed review)

**Do After WF9 Complete:**
4. ⏳ Archive `wf9-parallel-execution-plan.md` (detailed reference)
5. ⏳ Evaluate workflow templates (archive if unused)

---

## 📁 Proposed Directory Structure

```
.agent/workflows/
├── session-handover.md              # Active template
├── session-handover-output.md        # Active (updated)
├── wf9-launch-subagents.md          # Active (current)
├── document-codebase.md              # Template (evaluate)
├── new-project-setup.md             # Template (evaluate)
├── start-feature.md                  # Template (evaluate)
├── finish-feature.md                 # Template (evaluate)
└── archive/                          # Completed/one-time docs
    ├── wf6-review-summary.md
    └── wf9-parallel-execution-plan.md (after WF9 complete)
```

---

## 🎯 Benefits

- **Cleaner git status** - No coverage file noise
- **Clearer workflow directory** - Only active docs visible
- **Better organization** - Archive for reference, active for use
- **Reduced confusion** - One source of truth per workflow
