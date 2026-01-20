# Glossary: Track-Based Workflow Terminology

**Last Updated:** 2026-01-20

This glossary defines all terms used in the Track-Based Workflow Pattern.

---

## Core Concepts

### Track
A major feature or component development effort. Examples:
- "Intake Agent Track"
- "Ranger Dashboard (Frontend) Track"
- "Synthetic Data Quality Track"

**Structure:**
- Located in `conductor/tracks/[track-name]/`
- Contains: `index.md`, `spec.md`, `plan.md`, `metadata.json`
- May contain: `walkthrough.md`, `UAT.md`, other documentation

**Lifecycle:**
- Created when strategic decision is made
- Tracked in `conductor/tracks.md`
- Completed when all phases done and merged

### Phase
A logical grouping of related tasks within a track. Phases represent major milestones.

**Examples:**
- Phase 1: API Endpoint and Basic Data Ingestion
- Phase 2: Database Integration
- Phase 3: TRACS-compliant Data Extraction

**Completion:**
- Triggered when last task in phase completes
- Requires checkpoint protocol (10 steps)
- Creates checkpoint commit with git note
- Records checkpoint SHA in `plan.md`

### Task
A single, completable unit of work tracked in `plan.md`.

**Status States:**
- `[ ]` - Pending (not started)
- `[~]` - In Progress (actively working)
- `[x]` - Complete (with commit SHA, e.g., `[x] abc1234`)

**Lifecycle:**
1. Selected from `plan.md` (sequential order)
2. Marked `[~]` when starting
3. Executed via TDD (Red → Green → Refactor)
4. Marked `[x]` with commit SHA when done
5. `plan.md` updated and committed

### Checkpoint
A phase completion commit that includes:
- All code changes for the phase
- Verification report (attached as git note)
- Recorded SHA in `plan.md` format: `[checkpoint: abc1234]`

**Purpose:**
- Creates audit trail
- Enables rollback if needed
- Documents verification process
- Maintains context continuity

### Track-Based Workflow Pattern
The systematic development approach using tracks, phases, and tasks with checkpoints and audit trails. Formerly called "Conductor Pattern" (when using Gemini CLI tool).

**Key Features:**
- Strategic/Tactical separation (human strategy, agent tactics)
- TDD workflow (Red → Green → Refactor)
- Quality gates (tests, coverage, linting)
- Git notes for audit trail
- Checkpoint protocol for phase completion

---

## Workflow Artifacts

### plan.md
The source of truth for track execution. Contains:
- Phase structure
- Task list with status
- Commit SHAs for completed tasks
- Checkpoint SHAs for completed phases

**Format:**
```markdown
## Phase 1: Example Phase

- [x] **Task: Example Task** abc1234
    - [x] Subtask 1
    - [x] Subtask 2
- [x] **Task: Checkpoint Protocol** [checkpoint: def5678]
```

### spec.md
Detailed requirements and acceptance criteria for a track. Contains:
- Purpose and scope
- Functional requirements
- Non-functional requirements
- Success criteria
- Dependencies

### index.md
Track overview and status. Contains:
- Track description
- Status (planned, in progress, complete)
- Links to key documents
- Dependencies

### metadata.json
Track metadata in JSON format. Contains:
- `track_id`: Unique identifier
- `type`: Track type (feature, data_quality, etc.)
- `status`: Current status
- `created_at`, `updated_at`: Timestamps
- `dependencies`: Array of dependent track IDs

### NEXT.md
Mission brief for handoff between strategic planning and tactical execution. Contains:
- Current status of completed tracks
- Active track information
- Priority queue
- Future considerations

**Purpose:**
- Lightweight context (<50 lines)
- Updated after each track completes
- Read by Claude Code before starting work

---

## Git Concepts

### Git Notes
Git's mechanism for attaching metadata to commits without modifying commit history. Used for:
- Task summaries (what changed, why, files affected)
- Verification reports (test results, manual verification steps)
- Audit trail preservation

**Command:**
```bash
git notes add -m "<note content>" <commit-hash>
```

**Viewing:**
```bash
git notes show <commit-hash>
```

### Commit SHA
The unique identifier for a commit (first 7 characters used in `plan.md`).

**Usage:**
- Recorded in `plan.md` after task completion
- Links task to specific commit
- Enables traceability

**Example:**
```markdown
- [x] **Task: Create API endpoint** abc1234
```

### Checkpoint SHA
The commit hash of a phase completion checkpoint (first 7 characters).

**Format in plan.md:**
```markdown
## Phase 1: Example Phase
- [x] **Task: Checkpoint Protocol** [checkpoint: def5678]
```

---

## Quality Concepts

### Quality Gates
Mandatory checks before marking a task complete:
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] Type safety (no errors)
- [ ] Linting passes (zero errors)
- [ ] Documentation updated
- [ ] No security vulnerabilities

**Fail-Fast Rule:** If any gate fails, DO NOT COMMIT. Fix first.

### TDD (Test-Driven Development)
The development workflow:
1. **Red:** Write failing tests first
2. **Green:** Implement minimum code to pass
3. **Refactor:** Improve code with safety net

**Critical:** Tests must fail first (Red phase) before implementation.

### Coverage Target
Minimum 80% code coverage for all modules.

**Frontend:** `npm run coverage`  
**Backend:** `pytest --cov=src`

---

## Communication Patterns

### Status Reporting Format
After each task, Claude Code should provide:
- ✅ What was completed
- 🔄 What's next
- ⚠️ Any issues or deviations

### Announcement Patterns
- **Task Start:** "Starting task: [Name] from Phase [X]"
- **Task Complete:** "Task complete: [Name] (commit: abc1234)"
- **Phase Complete:** "Phase [X] complete. Checkpoint protocol starting..."
- **Blocked:** "Blocked on [issue]. See BLOCKED.md for details."

---

## Branch Strategy

### feature/* Branch
All active work happens on feature branches:
- Created from `develop`
- Named: `feature/[track-name]` or `feature/[descriptive-name]`
- Merged to `develop` when track/phase complete
- Deleted after merge

### develop Branch
Integration branch:
- Receives merges from `feature/*` branches
- Used for testing multiple features together
- Should always compile/run

### main Branch
Production/demo branch:
- Only merges from `develop` after full validation
- Every merge = version tag
- Protected: No direct commits

---

## Related Terms

### Strategic Layer
Human decision-making about:
- Track selection
- Priority ordering
- Architectural decisions
- Resource allocation

**Frequency:** Every 3-5 tracks (~15 min/week)

### Tactical Layer
Claude Code execution of:
- Task implementation
- TDD workflow
- Quality gates
- Checkpoint protocol

**Frequency:** Daily execution

### Handoff Artifact
Document that transfers context from strategic to tactical layer. `NEXT.md` is the primary handoff artifact.

---

## Cross-References

- **Workflow Details:** `conductor/workflow.md`
- **Quick Start:** `conductor/QUICK_START.md`
- **Agent Protocol:** `docs/onboarding/AGENT_PROTOCOL.md`
- **Git Flow:** `docs/onboarding/GIT_FLOW.md`
- **ADR-002:** `docs/adr/ADR-002-conductor-workflow-pattern.md` (Strategic/Tactical separation)
