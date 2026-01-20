# Quick Start: Track-Based Workflow

**For:** New Engineers & Claude Code  
**Last Updated:** 2026-01-20

---

## For New Engineers

### 1. Read First (30 minutes)
1. **`conductor/workflow.md`** - Complete workflow documentation
2. **`docs/onboarding/AGENT_PROTOCOL.md`** - Coding standards and protocols
3. **`CLAUDE.md`** - Project overview and build commands

### 2. Understand the Pattern (15 minutes)
Look at a completed track to see the pattern:
- **Example:** `conductor/tracks/intake-agent/`
- Notice: `spec.md` (requirements), `plan.md` (tasks with SHAs), checkpoint commits

### 3. Check Active Track (5 minutes)
- Read `conductor/NEXT.md` for current priority
- Read active track's `spec.md` and `plan.md`
- Check current branch: `git branch`

### 4. Start Working
Follow the task workflow in `workflow.md`:
1. Find next `[ ]` task in `plan.md`
2. Mark `[~]` (in progress)
3. Write failing tests (Red)
4. Implement (Green)
5. Refactor
6. Mark `[x]` with commit SHA
7. Update `plan.md` and commit

---

## For Claude Code

### 1. Discovery (Before Starting)
```bash
# Check active track
cat conductor/NEXT.md

# Check current branch
git branch

# Find next task
cat conductor/tracks/[track-name]/plan.md | grep "\[ \]"
```

### 2. Read Track Context
1. Read `conductor/NEXT.md` for active track
2. Read track's `spec.md` (requirements)
3. Read track's `plan.md` (tasks and status)
4. Check `docs/adr/` for architectural constraints

### 3. Execute Task
1. **Announce:** "Starting task: [Name] from Phase [X]"
2. **Mark:** Update `plan.md`: `[ ]` → `[~]`
3. **TDD:** Red → Green → Refactor
4. **Verify:** Tests pass, coverage >80%, linting passes
5. **Commit:** With conventional message
6. **Git Note:** Attach task summary
7. **Update:** Mark `[x]` with commit SHA in `plan.md`
8. **Report:** ✅ Completed | 🔄 Next | ⚠️ Issues

### 4. Phase Completion
When last task in phase completes:
1. **Announce:** "Phase [X] complete. Starting checkpoint protocol."
2. **Follow:** 10-step checkpoint protocol from `workflow.md`
3. **Pause:** Wait for user confirmation on manual verification
4. **Checkpoint:** Create commit with git note
5. **Update:** Record checkpoint SHA in `plan.md`

---

## Key Commands

### Git
```bash
# Check current branch
git branch

# Create feature branch
git checkout -b feature/my-track-name

# Check commit history
git log --oneline -10

# View git notes
git notes show <commit-hash>
```

### Testing
```bash
# Frontend (non-interactive)
CI=true npm test
npm run coverage

# Backend (non-interactive)
CI=true pytest
pytest --cov=src --cov-report=term
```

### Type Checking
```bash
# Frontend
npx tsc --noEmit

# Backend
mypy src/
```

### Linting
```bash
# Frontend
npm run lint

# Backend
ruff check src/
```

---

## Common Workflows

### Starting a New Track
1. Human updates `conductor/NEXT.md` with track decision
2. Claude Code reads `NEXT.md`
3. Claude Code generates `spec.md` and `plan.md`
4. Claude Code starts with Phase 1, Task 1

### Completing a Task
1. Mark `[~]` in `plan.md`
2. Write failing test
3. Implement to pass
4. Refactor
5. Run quality gates
6. Commit with message
7. Attach git note
8. Mark `[x]` with SHA in `plan.md`
9. Commit plan update

### Completing a Phase
1. Complete last task in phase
2. Announce checkpoint protocol
3. Verify test coverage
4. Run automated tests
5. Propose manual verification
6. Wait for user confirmation
7. Create checkpoint commit
8. Attach verification report (git note)
9. Record checkpoint SHA in `plan.md`
10. Commit plan update

---

## Quality Gates Checklist

Before every commit:
- [ ] All tests pass (`CI=true npm test` or `CI=true pytest`)
- [ ] Coverage >80% (`npm run coverage` or `pytest --cov`)
- [ ] Type checking passes (`npx tsc --noEmit` or `mypy src/`)
- [ ] Linting passes (`npm run lint` or `ruff check`)
- [ ] No console errors (manual check for frontend)
- [ ] `plan.md` updated with task status

---

## When to Ask for Help

**Ask immediately if:**
- Tests fail after 2 fix attempts
- Blocked for >15 minutes
- Need to add new dependency
- Breaking change required
- Quality gate can't be met

**Don't ask for:**
- Routine task execution
- Standard TDD workflow
- Normal commits and updates
- Expected test failures (fix them)

---

## Quick Reference

| What | Where |
|------|-------|
| Active track | `conductor/NEXT.md` |
| Track details | `conductor/tracks/[name]/spec.md` |
| Task list | `conductor/tracks/[name]/plan.md` |
| Workflow | `conductor/workflow.md` |
| Standards | `docs/onboarding/AGENT_PROTOCOL.md` |
| ADRs | `docs/adr/` |
| Git flow | `docs/onboarding/GIT_FLOW.md` |

---

## Remember

- **The rhythm matters:** Don't skip checkpoints, git notes, or plan.md updates
- **plan.md is truth:** All work must be tracked there
- **Quality gates are mandatory:** No exceptions
- **Communication is key:** Report status after each task
