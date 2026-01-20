# Workflow Examples

**Purpose:** Concrete examples of the Track-Based Workflow Pattern in action  
**Last Updated:** 2026-01-20

---

## Example 1: Completed Track Structure

### Track: Intake Agent (`conductor/tracks/intake-agent/`)

**Files:**
- `index.md` - Track overview
- `spec.md` - Requirements (see below)
- `plan.md` - Task list with commit SHAs (see below)
- `metadata.json` - Track metadata

**plan.md Structure:**
```markdown
# Implementation Plan: Intake Agent

## Phase 1: API Endpoint and Basic Data Ingestion

- [x] **Task: Create FastAPI application structure** b37bdf9
    - [x] Create `main.py`
    - [x] Create `core` directory for settings
    - [x] Create `api` directory for routes
- [x] **Task: Define Pydantic models for report submission** 6e2d5f3
    - [x] Write tests for Pydantic models
    - [x] Implement Pydantic models for `ReportIn` and `ReportOut`
- [x] **Task: Create API endpoint for report submission** 6c2cbfb
    - [x] Write tests for `POST /api/v1/reports` endpoint
    - [x] Implement `POST /api/v1/reports` endpoint
- [x] **Task: Checkpoint Protocol 'Phase 1: API Endpoint and Basic Data Ingestion'** [checkpoint: 0719ee0]

## Phase 2: Database Integration

- [x] **Task: Set up database connection** 5d96d4b
    ...
- [x] **Task: Checkpoint Protocol 'Phase 2: Database Integration'** [checkpoint: 4f58e0c]

## Phase 3: TRACS-compliant Data Extraction and Confidence Scoring

- [x] **Task: Implement logic to extract TRACS category** ...
    ...
- [x] **Task: Checkpoint Protocol 'Phase 3: TRACS-compliant Data Extraction'** [checkpoint: 3eb7f41]
```

**Key Observations:**
- Each task has commit SHA (first 7 chars) after completion
- Checkpoint tasks record full checkpoint SHA
- Subtasks are indented and checked off
- Status progression: `[ ]` → `[~]` → `[x]` + SHA

---

## Example 2: Task Execution Flow

### Starting a Task

**1. Read plan.md:**
```markdown
- [ ] **Task: Add GPS validation edge cases**
    - [ ] Add report with gps_accurate: false, accuracy_meters: 150
    - [ ] Add report with degraded validation state
```

**2. Mark in progress:**
```markdown
- [~] **Task: Add GPS validation edge cases**
```

**3. Announce:**
> "Starting task: Add GPS validation edge cases from Phase 2"

**4. Execute TDD:**
- Write failing test
- Implement minimum code
- Refactor
- Verify coverage

**5. Commit:**
```bash
git commit -m "feat(data): Add GPS validation edge cases

- Add report with off-trail GPS (accuracy_meters: 150)
- Add report with degraded validation state
- Update confidence factors appropriately"
```

**6. Attach git note:**
```bash
git notes add -m "Task: Add GPS validation edge cases

Summary: Added two new reports demonstrating GPS validation failure scenarios.
This addresses requirement FR2 from spec.md.

Changes:
- frontend/src/data/synthetic_day_in_life.json (added 2 reports)
- frontend/src/types/report.ts (no changes, types already support)

Why: Edge cases are critical for demonstrating system robustness in demos.
These reports show how the system handles GPS validation failures gracefully."
abc1234
```

**7. Update plan.md:**
```markdown
- [x] **Task: Add GPS validation edge cases** abc1234
```

**8. Commit plan update:**
```bash
git commit -m "conductor(plan): Mark task 'Add GPS validation edge cases' as complete"
```

**9. Report:**
> ✅ **Completed:** Added GPS validation edge cases (commit: abc1234)  
> 🔄 **Next:** Add photo quality variety reports  
> ⚠️ **Issues:** None

---

## Example 3: Checkpoint Protocol Execution

### Phase Completion Scenario

**Context:** Phase 2 (High-Priority Improvements) just completed last task.

**Step 1: Announce Protocol Start**
> "Phase 2 complete. Starting checkpoint protocol."

**Step 2: Determine Phase Scope**
```bash
# Find previous checkpoint SHA from plan.md
# Previous phase checkpoint: abc1234

# List changed files
git diff --name-only abc1234 HEAD
```

**Output:**
```
frontend/src/data/synthetic_day_in_life.json
frontend/src/types/report.ts
frontend/src/components/ExternalIntelligence.tsx
frontend/src/components/ReportDetail.tsx
```

**Step 3: Verify Test Coverage**
- Check each code file has tests
- `synthetic_day_in_life.json` - No test needed (data file)
- `report.ts` - Has `report.test.ts` ✅
- `ExternalIntelligence.tsx` - Missing test, create one
- `ReportDetail.tsx` - Has `ReportDetail.test.tsx` ✅

**Step 4: Run Automated Tests**
> "I will now run the automated test suite to verify the phase. **Command:** `CI=true npm test`"

```bash
CI=true npm test
```

**Output:**
```
✓ 45 tests passing
✓ Coverage: 82%
```

**Step 5: Propose Manual Verification**
> "The automated tests have passed. For manual verification, please follow these steps:
>
> **Manual Verification Steps:**
> 1. **Start the development server with the command:** `cd frontend && npm run dev`
> 2. **Open your browser to:** `http://localhost:5173`
> 3. **Navigate to Agentic Dashboard mode**
> 4. **Select report NR-001 (storm cluster)**
> 5. **Confirm that you see:** External Intelligence section displaying social_tweet_storm.png and social_blog_header.png
> 6. **Select report with low confidence (0.42)**
> 7. **Confirm that you see:** Appropriate UI indicators for low confidence
> 8. **Select report with GPS validation failure**
> 9. **Confirm that you see:** GPS accuracy warning in reasoning panel
>
> **Does this meet your expectations? Please confirm with yes or provide feedback on what needs to be changed.**"

**Step 6: Await User Confirmation**
> [PAUSE - Wait for user response]

**Step 7: Create Checkpoint Commit**
```bash
git commit -m "conductor(checkpoint): Checkpoint end of Phase 2: High-Priority Improvements"
```

**Step 8: Attach Verification Report (Git Note)**
```bash
git notes add -m "Phase 2 Checkpoint: High-Priority Improvements

Automated Tests:
- Command: CI=true npm test
- Result: 45 tests passing, 82% coverage
- New tests added: ExternalIntelligence.test.tsx

Manual Verification:
- Steps provided to user
- User confirmed: Yes, meets expectations
- Verified: External intelligence displays correctly
- Verified: Low confidence reports show appropriate UI
- Verified: GPS validation failures handled gracefully

Files Changed:
- frontend/src/data/synthetic_day_in_life.json
- frontend/src/types/report.ts
- frontend/src/components/ExternalIntelligence.tsx
- frontend/src/components/ReportDetail.tsx

Checkpoint SHA: def5678"
def5678
```

**Step 9: Record Checkpoint SHA in plan.md**
```markdown
## Phase 2: High-Priority Improvements

- [x] **Task: Confidence Score Distribution** abc1234
- [x] **Task: GPS Validation Edge Cases** bcd2345
- [x] **Task: Photo Quality Variety** cde3456
- [x] **Task: Temporal Narrative Enhancement** def4567
- [x] **Task: Reporter Persona Diversity** efg5678
- [x] **Task: Checkpoint Protocol 'Phase 2: High-Priority Improvements'** [checkpoint: def5678]
```

**Step 10: Commit Plan Update**
```bash
git commit -m "conductor(plan): Mark phase 'High-Priority Improvements' as complete"
```

**Step 11: Announce Completion**
> "Phase 2 complete. Checkpoint created (def5678) with verification report attached as git note."

---

## Example 4: Git Note Format

### Task Summary Git Note

**Format:**
```
Task: [Task Name]

Summary: [Brief description of what was done]

Changes:
- [file1] (what changed)
- [file2] (what changed)

Why: [Rationale for the change]
```

**Example:**
```
Task: Add low-confidence reports

Summary: Added 3 reports with confidence scores 0.35-0.55 to demonstrate system handling of uncertainty.

Changes:
- frontend/src/data/synthetic_day_in_life.json (added 3 reports: RV-013, NR-009, BP-005)
- frontend/src/components/ReportDetail.tsx (no changes, existing UI handles low confidence)

Why: Real-world data has significant low-confidence reports. Demo needs to show how system handles uncertainty gracefully, not just high-confidence cases.
```

### Checkpoint Verification Report Git Note

**Format:**
```
Phase [X] Checkpoint: [Phase Name]

Automated Tests:
- Command: [exact command]
- Result: [test results]
- New tests added: [list]

Manual Verification:
- Steps provided to user
- User confirmed: [yes/no/feedback]
- Verified: [what was verified]

Files Changed:
- [list of files]

Checkpoint SHA: [full SHA]
```

**Example:**
```
Phase 2 Checkpoint: High-Priority Improvements

Automated Tests:
- Command: CI=true npm test
- Result: 45 tests passing, 82% coverage
- New tests added: ExternalIntelligence.test.tsx, report.test.ts (edge cases)

Manual Verification:
- Steps provided to user
- User confirmed: Yes, all verification steps passed
- Verified: External intelligence displays correctly in report details
- Verified: Low confidence reports show warning indicators
- Verified: GPS validation failures show in reasoning panel
- Verified: Photo quality variety renders appropriately

Files Changed:
- frontend/src/data/synthetic_day_in_life.json
- frontend/src/types/report.ts
- frontend/src/components/ExternalIntelligence.tsx
- frontend/src/components/ReportDetail.tsx
- frontend/src/components/ExternalIntelligence.test.tsx

Checkpoint SHA: def5678a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

---

## Example 5: Communication Patterns

### Task Start Announcement
> "Starting task: Add GPS validation edge cases from Phase 2"

### Task Progress Update
> "Working on GPS validation edge cases:
> - ✅ Created test for off-trail GPS scenario
> - 🔄 Implementing report data structure
> - ⚠️ None"

### Task Completion Report
> "✅ **Completed:** Add GPS validation edge cases (commit: abc1234)
> 
> Changes:
> - Added 2 reports with GPS validation failures
> - Updated confidence factors appropriately
> - Tests passing, coverage maintained
> 
> 🔄 **Next:** Add photo quality variety reports
> 
> ⚠️ **Issues:** None"

### Phase Completion Announcement
> "Phase 2 complete. Starting checkpoint protocol.
> 
> Phase Summary:
> - 5 tasks completed
> - 8 reports added to dataset
> - 2 new components created
> - All quality gates passed
> 
> Proceeding with verification..."

### Blocked Status
> "⚠️ **Blocked:** Unable to source appropriate photo asset for blurry photo scenario
> 
> Attempted:
> - Searched Unsplash for 'blurry trail photo'
> - Checked existing assets
> 
> Need:
> - Decision: Use existing asset with note, or create new asset?
> 
> See: conductor/tracks/synthetic_data_quality_20260120/BLOCKED.md"

---

## Example 6: NEXT.md Update

### Before Track Completion
```markdown
## Active Track

🎯 **Ranger Dashboard (Frontend)** — In Progress
- Track: `frontend-dashboard`
- **Current Branch:** `feature/dashboard-phase-4-agentic`
- Phase 0-3 complete
- Phase 4 awaiting approval
```

### After Track Completion
```markdown
## Active Track

🎯 **Synthetic Data Quality & Demo Enhancement** — In Progress
- Track: `synthetic_data_quality_20260120`
- **Current Branch:** `feature/synthetic-data-quality`
- Phase 1 complete (checkpoint: abc1234)
- Phase 2 in progress

## Recently Completed

✅ **Ranger Dashboard (Frontend)** — Complete
- Checkpoint: `def5678`
- All phases complete, merged to develop
```

---

## Key Takeaways

1. **plan.md is the source of truth** - Every task must be tracked there
2. **Commit SHAs link tasks to code** - Enables full traceability
3. **Git notes preserve context** - Why decisions were made
4. **Checkpoints create audit trail** - Verification documented
5. **Communication maintains rhythm** - Status updates keep everyone aligned

These examples show the pattern in action. Follow them as templates for your own work.
