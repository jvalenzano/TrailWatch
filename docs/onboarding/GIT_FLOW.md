# Simplified Git Flow

This project follows a simplified Git Flow adapted for a solo developer working with AI agents.

## Branching Model

We use a **3-branch model**:

### 1. `main` (Production)
- **Purpose:** Always deployable, demo-ready code.
- **Rules:**
    - ✅ Only merge from `develop` after full validation.
    - ✅ Every merge = tag with version (e.g., `v1.0.0`).
    - ✅ Protected: No direct commits.
    - ✅ Clean commit history (squash or rebase recommended).

### 2. `develop` (Integration)
- **Purpose:** Integration testing for completed features.
- **Rules:**
    - ✅ Merge `feature/*` branches here first.
    - ✅ Run full test suite before merging to `main`.
    - ✅ Can have minor bugs (but nothing blocking).
    - ✅ Should always compile/run.
    - **Usage:** Testing multiple phases together; your daily integration point.

### 3. `feature/*` (Development)
- **Purpose:** Individual phase/feature development.
- **Naming Convention:**
    - `feature/dashboard-phase-3-moderate`
    - `feature/backend-extraction-streaming`
    - `feature/uat-phase-3-fixes`
- **Rules:**
    - ✅ Branch from `develop` (not `main`).
    - ✅ One logical phase/feature per branch.
    - ✅ Merge to `develop` when phase complete.
    - ✅ Delete after merging.

---

## Workflow Steps

### Step 1: Start a Feature
```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create new feature branch
git checkout -b feature/my-new-feature
```

### Step 2: Develop & Commit
- Follow the [Commit Strategy](./AGENT_PROTOCOL.md#8-commit-strategy).
- Commit often: `feat(scope): description`.

### Step 3: Finish Feature (Merge to Develop)
```bash
# Ensure feature branch is clean and pushed
git push origin feature/my-new-feature

# Switch to develop
git checkout develop

# Merge feature (create merge commit for history)
git merge feature/my-new-feature --no-ff -m "Merge feature/my-new-feature: Brief summary of changes"

# Run tests
npm test
```

### Step 4: Release (Merge to Main)
```bash
# Switch to main
git checkout main

# Merge develop
git merge develop --no-ff

# Tag release
git tag -a v1.0.0 -m "Release v1.0.0: Features X, Y, Z"

# Push
git push origin main --tags
```

---

## Agent Rules
- **NEVER** commit directly to `main`.
- **ALWAYS** check which branch you are on before starting work (`git branch`).
- **ALWAYS** Create a new branch for a new task/phase.
