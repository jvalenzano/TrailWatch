# Tracks Folder Reorganization Proposal

**Date:** 2026-01-20  
**Updated:** 2026-01-20 (Incorporated expert guidance)  
**Purpose:** Clean up tracks folder for clarity, consistency, and AI agent navigation

**Key Principle:** AI agents should be able to understand project state by reading one file (`tracks.yaml`). Everything else is progressive disclosure.

---

## Current State Analysis

### Tracks Inventory

| Track Folder | Status in tracks.md | Has index.md | Has metadata.json | Issues |
|--------------|---------------------|--------------|-------------------|--------|
| `agent_telemetry_dashboard/` | ❌ Not listed | ❌ No | ❌ No | Incomplete structure, only one markdown file |
| `frontend_dashboard_20260118/` | ✅ Listed (ACTIVE) | ✅ Yes | ✅ Yes | Good structure |
| `intake_agent_20260116/` | ✅ Listed (Complete) | ✅ Yes | ✅ Yes | Good structure |
| `phase2_agentic_ui/` | ❌ Not listed | ✅ Yes | ❌ No | Missing metadata, likely obsolete |
| `phase3_safeguards/` | ✅ Listed (Complete) | ✅ Yes | ✅ Yes | Good structure |
| `phase4-agentic-mode/` | ✅ Listed (Complete) | ✅ Yes | ✅ Yes | Good structure |
| `status_dashboard_20260118/` | ✅ Listed (Partial) | ✅ Yes | ✅ Yes | Good structure |
| `synthetic_data_quality_20260120/` | ✅ Listed (Planned) | ✅ Yes | ✅ Yes | Good structure |
| `wireframe_conformance_20260120/` | ✅ Listed (Planned) | ✅ Yes | ✅ Yes | Good structure |

### Issues Identified

1. **Inconsistent Naming:**
   - Some have dates: `intake_agent_20260116`, `frontend_dashboard_20260118`
   - Some don't: `phase2_agentic_ui`, `phase3_safeguards`, `phase4-agentic-mode`
   - Mixed separators: `phase4-agentic-mode` (hyphen) vs `phase3_safeguards` (underscore)

2. **Obsolete/Incomplete Tracks:**
   - `agent_telemetry_dashboard/` - Incomplete structure, not in tracks.md
   - `phase2_agentic_ui/` - Not in tracks.md, likely merged into `frontend_dashboard_20260118`

3. **Relationship Confusion:**
   - `frontend_dashboard_20260118` (main frontend track) vs `phase4-agentic-mode` (agentic mode work)
   - `phase2_agentic_ui`, `phase3_safeguards`, `phase4-agentic-mode` are sequential phases but separate tracks

4. **Missing Metadata:**
   - `phase2_agentic_ui` missing `metadata.json`
   - `agent_telemetry_dashboard` missing both `index.md` and `metadata.json`

---

## Proposed Organization (Updated per Expert Guidance)

### Principle: **Semantic Naming + Single Source of Truth**

**Key Changes from Original Proposal:**
1. **Drop dates from folder names** - Dates belong in metadata, not names
2. **Use semantic identifiers** - `frontend-dashboard/` not `frontend_dashboard_20260118/`
3. **Create `tracks.yaml`** - Single source of truth for AI agents
4. **Minimize context hops** - One file answers "what's active?"

All tracks should follow: `{descriptive-name}/` (hyphens, no dates)

### Track Categories (in tracks.yaml)

1. **active** - Currently in progress
2. **planned** - Ready to start, not yet begun
3. **complete** - Finished, kept for reference
4. **archived** - Obsolete or merged, moved to archive
5. **future** - Important future tracks, not yet ready to start

---

## Recommended Actions (Updated)

### 1. Create `tracks.yaml` as Single Source of Truth

**Priority:** P0 (Critical)

Create `conductor/tracks.yaml` with all tracks categorized:
- `active:` - Currently in progress
- `planned:` - Ready to start
- `complete:` - Finished
- `archived:` - Obsolete/merged
- `future:` - Important future tracks

**Benefits:**
- AI agents read one file to understand project state
- Machine-parseable (YAML)
- Human-readable
- Explicit categorization

**See:** `conductor/tracks.yaml` (drafted)

### 2. Archive Obsolete Tracks

**Move to `conductor/archive/tracks/`:**

- `phase2_agentic_ui/` 
  - **Reason:** Work merged into `frontend-dashboard`
  - **Action:** Move entire folder to archive

- `agent_telemetry_dashboard/`
  - **Reason:** Incomplete structure, but important future track
  - **Action:** Move to archive, add to `future:` section in tracks.yaml
  - **Status:** Track definition preserved, will be resurrected when ready

### 3. Rename for Semantic Consistency

**Drop dates, use hyphens:**

- `intake_agent_20260116/` → `intake-agent/`
- `status_dashboard_20260118/` → `status-dashboard/`
- `frontend_dashboard_20260118/` → `frontend-dashboard/`
- `phase3_safeguards/` → `safeguards/`
- `phase4-agentic-mode/` → `agentic-mode/`
- `synthetic_data_quality_20260120/` → `synthetic-data-quality/`
- `wireframe_conformance_20260120/` → `wireframe-conformance/`

**Rationale:** Dates in folder names become stale context. Semantic names + metadata dates are clearer.

### 4. Update All References

- Update `tracks.yaml` (already created)
- Update `NEXT.md` with new track IDs
- Update `metadata.json` files with new track IDs
- Update dependency references
- Update any documentation references

### 5. Deprecate tracks.md

- Keep `tracks.md` as human-readable reference (optional)
- Or generate from `tracks.yaml` (future enhancement)
- AI agents should use `tracks.yaml` as source of truth

---

## Proposed Final Structure (Updated)

```
conductor/
├── tracks.yaml                     ← SINGLE SOURCE OF TRUTH (NEW)
├── tracks/
│   ├── intake-agent/               ✅ Complete
│   ├── status-dashboard/           [/] Partial (Phase 1 complete)
│   ├── frontend-dashboard/         [~] Active
│   ├── safeguards/                 [x] Complete
│   ├── agentic-mode/               [x] Complete
│   ├── synthetic-data-quality/     [ ] Planned
│   └── wireframe-conformance/      [ ] Planned
└── archive/tracks/
    ├── phase2-agentic-ui/          (merged into frontend-dashboard)
    └── agent-telemetry-dashboard/   (future track, incomplete structure)
```

**Key Changes:**
- All folder names use semantic identifiers (no dates)
- All folder names use hyphens (not underscores)
- `tracks.yaml` is the authoritative source
- Future tracks listed in `tracks.yaml` under `future:` section

---

## Status Standardization

### Status Values (in metadata.json)

- `"status": "complete"` - Track finished, all phases done
- `"status": "in_progress"` - Currently active work
- `"status": "planned"` - Ready to start, not yet begun
- `"status": "blocked"` - Waiting on dependency
- `"status": "archived"` - Moved to archive

### tracks.md Status Indicators

- `[x]` - Complete
- `[/]` - Partial (some phases done)
- `[~]` - In Progress
- `[ ]` - Planned
- `[!]` - Blocked

---

## AI Agent Navigation Improvements

### 1. `tracks.yaml` as Single Source of Truth

**Primary Navigation:** AI agents should read `conductor/tracks.yaml` first.

This file answers:
- "What's active?" → Check `active:` section
- "What's planned?" → Check `planned:` section
- "What's complete?" → Check `complete:` section
- "What's archived?" → Check `archived:` section
- "What's coming later?" → Check `future:` section

**Progressive Disclosure:**
- Need details? → Read track's `index.md` or `metadata.json`
- Need implementation? → Read track's `spec.md` and `plan.md`

### 2. Optional: `conductor/tracks/README.md`

Human-readable quick reference (optional, can be generated from tracks.yaml):

```markdown
# Tracks Directory

**For AI Agents:** Read `../tracks.yaml` first (single source of truth).

## Active Tracks
- `frontend-dashboard/` - Currently in progress
- `status-dashboard/` - Phase 1 complete

## Planned Tracks
- `wireframe-conformance/` - Ready to start
- `synthetic-data-quality/` - Ready to start

## Complete Tracks
- `intake-agent/` - Finished
- `safeguards/` - Finished
- `agentic-mode/` - Finished

## Track Structure
Every track must have:
- `index.md` - Track overview and status
- `metadata.json` - Track metadata (status, dates, dependencies)
- `spec.md` - Technical specification
- `plan.md` - Implementation plan with tasks

See `conductor/workflow.md` for track workflow.
```

### 2. Standardize index.md Format

All `index.md` files should include:

```markdown
# Track: [Name]

**Status:** [complete|in_progress|planned|blocked]  
**Type:** [feature|data|infrastructure|...]  
**Created:** YYYY-MM-DD  
**Updated:** YYYY-MM-DD

## Overview
[Brief description]

## Status
[Current phase, next steps]

## Key Documents
- [Specification](./spec.md)
- [Implementation Plan](./plan.md)
- [Metadata](./metadata.json)
```

### 3. Enhance metadata.json Schema

Standardize all metadata.json files:

```json
{
    "track_id": "descriptive_name_YYYYMMDD",
    "type": "feature|data|infrastructure",
    "status": "complete|in_progress|planned|blocked|archived",
    "created_at": "ISO8601",
    "updated_at": "ISO8601",
    "description": "One-line description",
    "dependencies": ["track_id_1", "track_id_2"],
    "phases": [
        {
            "name": "Phase Name",
            "status": "complete|in_progress|planned",
            "checkpoint_sha": "abc1234"
        }
    ]
}
```

---

## Implementation Steps (Updated)

### Step 1: Create `tracks.yaml` ✅ DONE
1. ✅ Created `conductor/tracks.yaml` with all tracks categorized
2. ✅ Includes `active`, `planned`, `complete`, `archived`, `future` sections
3. ✅ Machine-parseable, human-readable format

### Step 2: Archive Obsolete Tracks
1. Create `conductor/archive/tracks/` directory (if doesn't exist)
2. Move `phase2_agentic_ui/` → `archive/tracks/phase2-agentic-ui/`
3. Move `agent_telemetry_dashboard/` → `archive/tracks/agent-telemetry-dashboard/`

### Step 3: Rename Tracks (Semantic Names, No Dates)
1. Rename `intake_agent_20260116/` → `intake-agent/`
2. Rename `status_dashboard_20260118/` → `status-dashboard/`
3. Rename `frontend_dashboard_20260118/` → `frontend-dashboard/`
4. Rename `phase3_safeguards/` → `safeguards/`
5. Rename `phase4-agentic-mode/` → `agentic-mode/`
6. Rename `synthetic_data_quality_20260120/` → `synthetic-data-quality/`
7. Rename `wireframe_conformance_20260120/` → `wireframe-conformance/`

### Step 4: Update All References
1. Update `tracks.yaml` with new paths (already done)
2. Update `NEXT.md` with new track IDs
3. Update all `metadata.json` files with new `track_id` values
4. Update dependency references in metadata files
5. Update any documentation references

### Step 5: Update Track Metadata
1. Ensure all tracks have `metadata.json` with updated `track_id`
2. Ensure all tracks have proper `index.md`
3. Update `track_id` to match folder name (semantic, no dates)

### Step 6: Verify
1. ✅ `tracks.yaml` is complete and accurate
2. All tracks have `index.md` and `metadata.json`
3. All tracks listed in `tracks.yaml`
4. No broken references
5. Status indicators consistent
6. AI agents can read `tracks.yaml` to understand project state

---

## Questions for Decision (RESOLVED)

1. **Archive `agent_telemetry_dashboard`?**
   - ✅ **Decision:** Archive it (incomplete structure), but add to `future:` section in tracks.yaml
   - **Rationale:** Important future track, but incomplete structure is noise for AI agents now

2. **Naming Convention?**
   - ✅ **Decision:** Semantic names with hyphens, no dates (`frontend-dashboard/`)
   - **Rationale:** Dates in folder names become stale. Dates belong in metadata.

3. **Keep Complete Tracks in Main Folder?**
   - ✅ **Decision:** Yes, keep in `tracks/` for reference
   - **Rationale:** Complete tracks are useful reference for AI agents. Mark clearly in tracks.yaml.

4. **How to handle future tracks?**
   - ✅ **Decision:** Add `future:` section to tracks.yaml
   - **Rationale:** Distinguishes "planned" (ready now) from "future" (important but not ready)

---

## Benefits (Updated)

1. **Single Source of Truth:** `tracks.yaml` answers "what's active?" in one read
2. **Semantic Clarity:** Folder names describe what they are, not when they started
3. **AI Navigation:** Minimal context hops - read tracks.yaml, then drill down as needed
4. **Machine-Parseable:** YAML format enables automation and tooling
5. **Future Planning:** `future:` section distinguishes important future work from current priorities
6. **No Bloat:** Obsolete tracks archived, not deleted
7. **Traceability:** Complete tracks remain for reference

## Key Insight from Expert Guidance

**"AI agents should be able to understand project state by reading one file."**

`tracks.yaml` is that file. Everything else (index.md, spec.md, plan.md) is progressive disclosure for when details are needed.

---

**Status:** `tracks.yaml` created ✅  
**Next Step:** Review and approve this proposal, then execute Steps 2-6 (rename, archive, update references).
