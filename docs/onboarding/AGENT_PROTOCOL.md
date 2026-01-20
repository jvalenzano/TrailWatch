```markdown
# TrailWatch Agent Protocol

**Version:** 1.1  
**Target Audience:** Autonomous Agents (Claude Code, Gemini CLI, etc.)  
**Status:** Active  
**Last Updated:** 2026-01-19

This document outlines the operational protocols, coding standards, and workflow requirements for agents working on the TrailWatch codebase. **Adhere to these rules strictly.**

---

## 1. Core Operating Rules

### Communication Style
- **Concise:** No fluff. No "Here is the code". Just the status and the execution.
- **Direct:** Lists over paragraphs.
- **Code-First:** Show the diff/code first, explain only if complex/requested.

### Git Workflow (CRITICAL)
- **Protocol:** Follow [docs/onboarding/GIT_FLOW.md](docs/onboarding/GIT_FLOW.md) strictly.
- **Branches:**
  - `main`: Production/Demo only. NO DIRECT COMMITS.
  - `develop`: Integration testing.
  - `feature/*`: All active work happens here.
- **Merge Strategy:** Use `--no-ff` when merging to `develop` to preserve history.

### Workflow Efficiency
- **Proactive Fixes:** If you see a syntax error or bug in a file you are touching, fix it.
- **Clean Workspace:** No `tmp_` files or debug prints (`print()`, `console.log`) in final commits.
- **Destructive Acts:** Ask for confirmation before deleting >50 lines of code.

### Autonomous Authority
**You have FULL authority to:**
- Fix bugs (any severity)
- Refactor code within existing architecture
- Add tests for untested code
- Improve accessibility (ARIA, keyboard navigation)
- Enhance type safety (remove `any`, add interfaces)
- Optimize performance (memoization, lazy loading)
- Update documentation

**You MUST request approval for:**
- Changing database schema
- Adding new external dependencies (npm/pip packages)
- Modifying API contracts (breaking changes)
- Deleting entire features/components
- Changing build configuration (vite.config.ts, tsconfig.json)
- Modifying CI/CD workflows

**When in doubt:** Implement in a feature branch, document reasoning in commit message with `REVIEW:` tag.

---

## 2. Project Architecture & Context

### Documentation Entry Points
- **Quick Start:** `CLAUDE.md` (for Claude Code agents)
- **Workflow Guide:** `conductor/workflow.md` (Track-Based Workflow Pattern)
- **Quick Reference:** `conductor/QUICK_START.md` (if available)
- **Deep Dive:** `docs/onboarding/deep-dive.md`

### Tech Stack
**Frontend:**
- React 18, TypeScript, Vite, Tailwind CSS, MapLibre GL JS
- Testing: Vitest + React Testing Library + jest-axe

**Backend:**
- Python 3.11+, FastAPI, PostgreSQL 17 + PostGIS, Google ADK
- Testing: pytest + pytest-asyncio

**Forbidden:**
- OpenAI, LangChain, SQLite, Flask, `requests` library
- `var` in JavaScript, default exports, `any` type in TypeScript

### Key Directories
```
conductor/          # Project management and tracking
docs/adr/          # Architectural Decision Records (read before major changes)
src/               # Backend source
frontend/          # Frontend source
  ├── src/components/     # React components
  ├── src/hooks/          # Custom hooks
  ├── src/config/         # Configuration (UI modes, feature flags)
  └── src/mocks/          # MSW mock data
```

---

## 3. Workflow Standard (The Track-Based Workflow Pattern)

Agents operate within "Tracks" defined in the `conductor` folder. This pattern (formerly called "Conductor Pattern") organizes work into tracks, phases, and tasks with systematic checkpoints and audit trails.

### 1. Discovery Phase
- Read `conductor/NEXT.md` to find the active track
- Read `task.md` (if active) for immediate status
- Check `docs/adr/` for relevant architectural decisions

### 2. Planning Phase
- For complex changes, create `implementation_plan.md`
- Group changes by component
- **Wait for approval** if significant architectural change is proposed

### 3. Execution Phase (TDD Focus)
1. **Red:** Write failing tests first
2. **Green:** Implement the validation/logic
3. **Refactor:** Clean up code, types, and imports
4. **Verify:** Run pre-commit checks (see Section 5)

### 4. Completion Phase
- Update `plan.md` with task completion (mark `[x]` with commit SHA)
- Create checkpoint commit if phase complete
- Attach git note with verification report
- Update `tracks.md` if track complete
- Generate `SESSION_HANDOVER.md` if ending session

### Claude Code-Specific Guidance

**For Claude Code agents working in chat interface:**

1. **Track Discovery:**
   - Always read `conductor/NEXT.md` first to find active track
   - Read track's `spec.md` and `plan.md` before starting work
   - Check `docs/adr/` for architectural constraints

2. **Task Execution:**
   - Announce each task start: "Starting task: [Name]"
   - Follow TDD strictly: Red → Green → Refactor
   - Update `plan.md` status: `[ ]` → `[~]` → `[x]` + SHA
   - Commit after each task with git note

3. **Communication:**
   - Provide status updates after each task
   - Use format: ✅ Completed | 🔄 Next | ⚠️ Issues
   - Pause for user confirmation on checkpoints
   - Document deviations in commit messages

4. **Autonomous Execution:**
   - When given autonomy, follow workflow.md strictly
   - Only ask for approval if:
     - Quality gates fail after 2 fix attempts
     - Blocked for >15 minutes
     - Need to add new dependencies
     - Breaking changes required

---

## 4. Coding Standards

### Frontend (React/TypeScript)

**Typing Requirements:**
- Strict TypeScript. No `any` types.
- Define interfaces for all Props and return types
- Use `import type` for type-only imports

**React Safety Rules (CRITICAL):**

❌ **FORBIDDEN at Module Scope:**
```typescript
// ❌ FATAL: Crashes with blank screen
import { useSearchParams } from 'react-router-dom'
const [params] = useSearchParams() // Module scope = CRASH

export const MyComponent = () => { /* ... */ }
```

✅ **REQUIRED Pattern:**
```typescript
// ✅ SAFE: Hook inside component
export const MyComponent = () => {
  const [params] = useSearchParams() // Component scope
  // ...
}
```

**Verification Command:**
```bash
# Check for module-scope hook violations before committing
grep -n "^const.*use[A-Z]" frontend/src/**/*.tsx
```

**Styling:**
- Tailwind utilities only. No CSS-in-JS.
- Dark theme support required for all new components.

**Testing:**
- Vitest + React Testing Library
- Add `data-testid` attributes for interactive elements
- All new components require tests (80% coverage minimum)

**Accessibility (WCAG 2.1 AA):**
- Add `aria-label` to all icon-only buttons
- Add `aria-expanded` to collapsible elements
- Add `aria-controls` to link buttons with their target panels
- Ensure keyboard navigation (Tab, Enter, Space, Escape)
- Verify focus indicators visible (`ring-2 ring-indigo-500` or similar)

**Error Handling:**
```typescript
// ✅ REQUIRED: Try-catch with fail-safe defaults
try {
  const mode = useUIMode()
  return mode.features.showConfidence
} catch (error) {
  console.error('[FeatureGate] Mode resolution failed:', error)
  return false // Fail-safe default
}
```

### Backend (Python)

**Style:**
- PEP 8 compliance (enforced by `ruff`)
- Line length: 88 characters
- Google-style docstrings for all public functions

**Type Hints:**
```python
# ✅ REQUIRED: Type hints on all function signatures
def validate_trail(coords: tuple[float, float]) -> TrailValidationResult:
    """Validate GPS coordinates against USFS trail registry.
    
    Args:
        coords: Tuple of (latitude, longitude) in WGS84.
        
    Returns:
        TrailValidationResult with matched trail or validation failure.
        
    Raises:
        TrailNotFoundError: If coordinates don't match any known trail.
    """
    pass
```

**Async Requirements:**
- Use `async/await` for all I/O operations
- Use `httpx` (not `requests`) for HTTP calls
- Database queries must use async SQLAlchemy

**Logging:**
- Use `structlog` for structured JSON logging
- **Never** log PII (email, phone, full name)
- Always include context: `report_id`, `confidence`, `tracs_category`

**Error Handling:**
```python
# ✅ REQUIRED: Specific exception types
try:
    result = validate_trail(gps_coords)
except TrailNotFoundError as e:
    logger.warning("trail_not_found", coords=gps_coords)
    return {"validated": False, "reason": str(e)}
except Exception as e:
    logger.error("unexpected_error", error=str(e))
    raise  # Re-raise unexpected errors
```

---

## 5. Pre-Commit Validation (REQUIRED)

Before every commit, run these checks:

### Frontend
```bash
# TypeScript compilation (catches parse errors)
npx tsc --noEmit

# Linting (catches syntax issues)
npm run lint

# Tests (catches logic errors)
npm test

# Coverage check
npm run coverage
```

### Backend
```bash
# Type checking
mypy src/

# Linting
ruff check src/

# Tests (non-interactive mode required)
CI=true pytest

# Coverage check
pytest --cov=src --cov-report=term
```

### JSON Files
```bash
# Validate JSON syntax (prevents parse-time errors)
npx jsonlint path/to/file.json
```

**Fail-Fast Rule:** If any check fails, **DO NOT COMMIT**. Fix the issue first.

---

## 6. Quality Gates (Required Before PR)

All code changes must meet:

| Metric | Threshold | Check Command |
|--------|-----------|---------------|
| Test Coverage | ≥80% | `npm run coverage` or `pytest --cov` |
| Type Safety | 100% | `npx tsc --noEmit` (zero errors) |
| Linting | Zero errors | `npm run lint` or `ruff check` |
| Accessibility | Zero violations | `npm run test:a11y` (jest-axe) |
| Console Errors | Zero | Manual verification in browser |

**Commit Rejection Criteria:**
- ❌ Test coverage drops below 80%
- ❌ TypeScript compilation fails
- ❌ Linting errors present
- ❌ Console shows errors in any UI mode
- ❌ Accessibility violations found

**Exception Process:** If a quality gate must be skipped (e.g., legacy code without tests), add `TECH-DEBT:` tag to commit message with justification.

---

## 7. Agent Tooling Best Practices

### File Operations
- **Always use absolute paths** to avoid ambiguity
- Example: `/Users/jvalenzano/Documents/10-TrailWatch/frontend/src/App.tsx`

### Terminal Commands
- **Non-Interactive:** Ensure commands don't require user input
  - ✅ `CI=true pytest`
  - ✅ `npm install --no-audit`
  - ❌ `psql` (requires password)
- **Backgrounding:** Use specialized tools for long-running processes (dev servers)

### Search Operations
- Use `grep_search` or `find_by_name` (ripgrep/fd) for code navigation
- Use `git grep` for searching within version-controlled files

---

## 8. Commit Strategy

### Frequency
Commit after every logical unit:
- Bug fix
- New feature
- Refactoring
- Documentation update

### Format (Conventional Commits)
```
<type>(scope): <description>

[optional body]
```

**Types:**
- `fix`: Bug fixes
- `feat`: New features
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `a11y`: Accessibility improvements
- `perf`: Performance improvements

**Examples:**
```
fix(phase3): prevent crash when mode param is invalid

- Add fallback to DEFAULT_MODE in useUIMode hook
- Add try-catch in FeatureGate component
- Add console warning for invalid modes
```

```
a11y(phase3): add ARIA attributes to reasoning panel

- Add aria-expanded to toggle button
- Add aria-controls linking to panel ID
- Add data-testid for automated testing
```

### Self-Correction
If a previous commit was broken, fix it in a new commit. Do not force push or amend.

---

## 9. Failure Recovery Protocols

### If Agent Gets Stuck (>5 minutes on one task)
1. Document current state in `task.md`
2. Create `BLOCKED.md` with:
   - What you attempted
   - Why it failed
   - What you need to proceed
3. Move to next actionable task (don't spin wheels)

### If Agent Breaks Something
1. **DO NOT PANIC-COMMIT** fixes
2. Run full test suite to identify scope of breakage
3. **Option A:** Fix regression immediately if obvious
4. **Option B:** Revert breaking commit (`git reset --hard HEAD~1`)
5. Document in `task.md`: "Attempted X, caused Y, reverted/fixed"

### If External Dependency Fails (API down, rate limit)
1. Add graceful degradation (mock data, cached response)
2. Log warning: `logger.warning("dependency_unavailable", service="RIDB")`
3. Continue with degraded functionality
4. Document in `task.md`: "External service X unavailable, implemented fallback"

### If Tests Fail After Refactoring
1. Read test failure messages carefully (don't assume)
2. Check if test expectations need updating (not just code)
3. Verify mocks still match real implementations
4. If multiple tests fail: Revert and take smaller steps

**Escalation Path:** If blocked for >15 minutes, generate `SESSION_HANDOVER.md` and yield to human.

---

## 10. Console Error Validation Rules

When checking for "zero console errors":

✅ **IGNORE (expected):**
- `[vite] connected`
- `[vite] hmr update`
- `[MSW] Mocking enabled`
- `Download the React DevTools`

❌ **FIX IMMEDIATELY (errors):**
- `Uncaught TypeError`
- `ReferenceError`
- `SyntaxError`
- `Failed to fetch`
- `404` errors
- React error boundaries triggered

⚠️ **FIX IF TIME (warnings):**
- React.memo warnings
- PropTypes warnings
- Deprecation notices

---

## 11. Testing Requirements

### Frontend (Vitest)
```bash
# Run all tests
npm test

# Run specific test file
npm test -- src/components/FeatureGate.test.tsx

# Watch mode (for development)
npm run test:watch

# Coverage report
npm run coverage
```

**Test Structure:**
```typescript
describe('FeatureGate', () => {
  it('hides children when feature disabled', () => {
    render(
      <TestWrapper mode="traditional">
        <FeatureGate feature="enable_confidence_indicators">
          <div>Should not render</div>
        </FeatureGate>
      </TestWrapper>
    )
    expect(screen.queryByText('Should not render')).not.toBeInTheDocument()
  })
})
```

### Backend (pytest)
```bash
# Run all tests (non-interactive mode)
CI=true pytest

# Run specific test file
CI=true pytest tests/test_api.py

# Run with coverage
CI=true pytest --cov=src --cov-report=term

# Run specific test function
CI=true pytest tests/test_api.py::test_create_report
```

**Test Structure:**
```python
@pytest.mark.asyncio
async def test_validate_trail_success():
    """Test successful trail validation with valid GPS coordinates."""
    coords = (37.123, -120.456)
    result = await validate_trail(coords)
    
    assert result.validated is True
    assert result.trail_name == "Pacific Crest Trail"
    assert result.confidence > 0.8
```

---
