# Workflow Assessment & Improvement Recommendations

**Date:** 2026-01-20  
**Assessor:** Claude Code  
**Purpose:** Evaluate Conductor workflow pattern for Claude Code integration

---

## Executive Summary

Your Conductor workflow pattern is **well-architected and production-ready**. The rhythm you've established—tracks, phases, tasks, checkpoints, git notes—creates excellent traceability and maintains context continuity. However, there are **terminology ambiguities** and **Claude Code-specific adaptations** needed to ensure seamless transition from Gemini CLI.

**Overall Grade:** A- (Excellent foundation, needs clarity improvements)

---

## Workflow Understanding Summary

### The Core Pattern (What Works Well)

1. **Strategic/Tactical Separation** (ADR-002)
   - Human makes strategic decisions (track selection, priorities)
   - Claude Code executes tactically (TDD, implementation, checkpoints)
   - `NEXT.md` serves as handoff artifact

2. **Track Structure**
   - Each track: `index.md`, `spec.md`, `plan.md`, `metadata.json`
   - Tasks tracked in `plan.md` with status: `[ ]` → `[~]` → `[x]` + commit SHA
   - Phases with checkpoint commits and git notes

3. **TDD Workflow**
   - Red: Write failing tests first
   - Green: Implement minimum code
   - Refactor: Improve with safety net
   - Verify: Coverage >80%, all quality gates

4. **Checkpoint Protocol**
   - Phase completion triggers verification
   - Automated tests + manual verification plan
   - Git notes for audit trail
   - Checkpoint SHA recorded in `plan.md`

5. **Quality Gates**
   - Tests pass, coverage >80%, type safety, linting, accessibility
   - Pre-commit validation required
   - Fail-fast rule

### The Rhythm You've Established

```
Human Strategy → NEXT.md → Claude Code Execution → plan.md Updates → 
Phase Checkpoint → Git Notes → tracks.md Update → Repeat
```

This creates:
- **Traceability:** Every task linked to commit SHA
- **Context Continuity:** Git notes preserve reasoning
- **Accountability:** Checkpoints force verification
- **Scalability:** Pattern works for solo or team

---

## Critical Issues & Improvements

### Issue 1: Terminology Confusion ⚠️ **HIGH PRIORITY**

**Problem:** The term "Conductor" is used in three different ways:
1. The Gemini CLI tool (which you're replacing)
2. The workflow pattern (which you're keeping)
3. The directory name (`conductor/`)

**Impact:** New team members and Claude Code may be confused about what "Conductor" means.

**Recommendation:**
- Rename the workflow pattern to **"Track-Based Workflow"** or **"Phase-Based Development"**
- Keep `conductor/` directory name (it's fine)
- Update all documentation to say "Track-Based Workflow Pattern" instead of "Conductor Pattern"
- Add glossary in `workflow.md`:

```markdown
## Terminology

- **Track:** A major feature or component development effort (e.g., "Intake Agent Track")
- **Phase:** A logical grouping of related tasks within a track
- **Task:** A single, completable unit of work tracked in `plan.md`
- **Checkpoint:** A phase completion commit with verification report (git note)
- **Track-Based Workflow:** The development pattern using tracks/phases/tasks (formerly called "Conductor Pattern")
```

### Issue 2: Claude Code Command Interpretation ⚠️ **HIGH PRIORITY**

**Problem:** `workflow.md` says "Command Claude Code with an explicit assignment" but doesn't specify how Claude Code should interpret this in a chat interface.

**Current:**
```
Create a new track: Trail Validation Service — Implement PostGIS-based 
GPS-to-trail snapping per ADR-001...
```

**Recommendation:** Add a section clarifying Claude Code interaction patterns:

```markdown
## Claude Code Interaction Patterns

### Starting a Track
When you want Claude Code to begin a new track, provide:

1. **Explicit Instruction:** "Create a new track: [Track Name]"
2. **Context Reference:** "See `conductor/NEXT.md` for details"
3. **Expected Output:** "Generate `spec.md` and `plan.md` in `conductor/tracks/[track-name]/`"

**Example:**
```
Create a new track: Synthetic Data Quality Enhancement
- See conductor/NEXT.md for priority
- Reference: conductor/tracks/synthetic-data-quality/DESIGN_CRITIQUE.md
- Generate spec.md and plan.md following the pattern in conductor/tracks/intake-agent/
```

### Task Execution
Claude Code should:
1. Read `plan.md` to find next `[ ]` task
2. Announce: "Starting task: [Task Name]"
3. Mark `[~]` in plan.md
4. Follow TDD workflow
5. Mark `[x]` with commit SHA
6. Update plan.md and commit

### Phase Completion
Claude Code should:
1. Detect phase completion (last task in phase)
2. Announce: "Phase [X] complete. Starting checkpoint protocol."
3. Follow 10-step checkpoint protocol from workflow.md
4. Pause for user confirmation on manual verification
```

### Issue 3: Communication Rhythm Not Documented ⚠️ **MEDIUM PRIORITY**

**Problem:** The workflow doesn't specify how Claude Code should communicate progress, which is critical for maintaining the rhythm.

**Recommendation:** Add "Communication Standards" section:

```markdown
## Communication Standards for Claude Code

### Progress Updates
- **Task Start:** "Starting task: [Name] from Phase [X]"
- **Task Complete:** "Task complete: [Name] (commit: abc1234)"
- **Phase Complete:** "Phase [X] complete. Checkpoint protocol starting..."
- **Blocked:** "Blocked on [issue]. See BLOCKED.md for details."

### Status Reporting
After each task, provide:
- ✅ What was completed
- 🔄 What's next
- ⚠️ Any issues or deviations

### Checkpoint Communication
When phase completes:
1. Announce protocol start
2. Show test results
3. Present manual verification plan
4. **WAIT for user confirmation** (critical!)
5. Create checkpoint commit
6. Announce completion with checkpoint SHA
```

### Issue 4: ADR-003 Needs Update ⚠️ **MEDIUM PRIORITY**

**Problem:** ADR-003 is Gemini CLI-specific (YOLO mode, sandbox flags) and doesn't apply to Claude Code.

**Recommendation:** 
- Update ADR-003 to be tool-agnostic
- Add Claude Code-specific section:

```markdown
## Claude Code Autonomous Execution

Claude Code operates in a chat interface and doesn't have "YOLO mode" or sandbox flags.
Instead:

1. **Explicit Autonomy:** When you want autonomous execution, state: "Execute this track autonomously. Follow the workflow in conductor/workflow.md. Only ask for approval if blocked or if quality gates fail."

2. **Safety Boundaries:** Claude Code should:
   - Never commit to `main` or `develop` directly
   - Always run tests before committing
   - Ask before deleting >50 lines of code
   - Ask before adding new dependencies

3. **Progress Reporting:** Claude Code should provide status updates after each task completion.
```

### Issue 5: Missing "Quick Start" for New Team ⚠️ **MEDIUM PRIORITY**

**Problem:** New engineers need to understand the workflow quickly, but it's spread across multiple documents.

**Recommendation:** Create `conductor/QUICK_START.md`:

```markdown
# Quick Start: Track-Based Workflow

## For New Engineers

1. **Read First:** `conductor/workflow.md` (30 min read)
2. **Understand Pattern:** Look at completed track: `conductor/tracks/intake-agent/`
3. **Check Active Track:** Read `conductor/NEXT.md`
4. **Start Working:** Follow task workflow in `workflow.md`

## For Claude Code

1. **Read:** `CLAUDE.md` and `conductor/workflow.md`
2. **Check:** `conductor/NEXT.md` for active track
3. **Read:** Track's `spec.md` and `plan.md`
4. **Execute:** Follow TDD workflow, update plan.md, create checkpoints

## Key Commands

```bash
# Check current branch
git branch

# Find next task
cat conductor/tracks/[track-name]/plan.md | grep "\[ \]"

# Run tests
CI=true npm test  # Frontend
CI=true pytest   # Backend

# Check coverage
npm run coverage  # Frontend
pytest --cov=src  # Backend
```
```

### Issue 6: Workflow Rhythm Not Emphasized ⚠️ **LOW PRIORITY**

**Problem:** The importance of maintaining the rhythm isn't explicitly stated.

**Recommendation:** Add to `workflow.md` introduction:

```markdown
## Why This Workflow Matters

This workflow pattern creates a **sustainable development rhythm** that:
- Maintains context across sessions (git notes, checkpoints)
- Enables parallel work (clear track boundaries)
- Provides audit trail (every task linked to commit)
- Scales from solo to team (consistent patterns)

**Maintaining the rhythm is critical.** Don't skip checkpoints, don't skip git notes, don't skip plan.md updates. These artifacts are what make the workflow work.
```

---

## Recommended Documentation Updates

### Priority 1 (Do Now)

1. **Update `workflow.md`:**
   - Add Terminology section
   - Add Claude Code Interaction Patterns section
   - Add Communication Standards section
   - Emphasize rhythm importance

2. **Update `AGENT_PROTOCOL.md`:**
   - Change "Conductor Pattern" → "Track-Based Workflow Pattern"
   - Add Claude Code-specific guidance

3. **Update `ADR-003`:**
   - Make tool-agnostic
   - Add Claude Code section

### Priority 2 (Do Soon)

4. **Create `conductor/QUICK_START.md`**
   - Quick reference for new team members
   - Claude Code quick start guide

5. **Create `conductor/GLOSSARY.md`**
   - Define all terms (Track, Phase, Task, Checkpoint, etc.)
   - Cross-reference to examples

### Priority 3 (Nice to Have)

6. **Create `conductor/WORKFLOW_EXAMPLES.md`**
   - Show example of completed track
   - Show example checkpoint protocol execution
   - Show example git note format

---

## Strengths to Preserve

✅ **Keep These Patterns:**
- Track/Phase/Task hierarchy
- `plan.md` as source of truth
- Checkpoint protocol with git notes
- TDD workflow (Red-Green-Refactor)
- Quality gates before commit
- `NEXT.md` as handoff artifact
- Strategic/Tactical separation

✅ **These Are Excellent:**
- Git notes for audit trail
- Checkpoint SHA in plan.md
- Manual verification requirement
- Fail-fast quality gates
- Comprehensive test coverage requirements

---

## Summary

Your workflow is **production-ready and well-designed**. The main improvements needed are:

1. **Clarity:** Remove "Conductor" terminology confusion
2. **Adaptation:** Add Claude Code-specific interaction patterns
3. **Communication:** Document how Claude Code should report progress
4. **Onboarding:** Create quick start guide for new team

The rhythm you've established is valuable—these changes will make it easier for Claude Code and new team members to maintain it.

**Next Steps:**
1. Review this assessment
2. Prioritize which improvements to implement
3. I can help update the documentation files
