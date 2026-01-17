# TrailWatch - Local Git Workflow Guide

## ✅ Git Now Initialized

Your TrailWatch project now has full version control **locally** without any GitHub connection.

## Basic Workflow

### Making Changes
```bash
# 1. Check status
git status

# 2. Stage changes
git add file.py                    # Add specific file
git add src/                        # Add directory
git add .                          # Add all changes

# 3. Commit with message
git commit -m "Add intake agent implementation"

# Multi-line commit (opens editor)
git commit
```

### Viewing History
```bash
# See commit log
git log                            # Full log
git log --oneline                  # Compact view
git log --graph --all              # Visual branch diagram

# See what changed
git diff                           # Uncommitted changes
git diff HEAD~1                    # Changes vs last commit
git show <commit-hash>             # Specific commit details
```

### Branching (Best Practice for Features)
```bash
# Create feature branch
git checkout -b feature/intake-agent

# Switch branches
git checkout main
git checkout feature/intake-agent

# List branches
git branch

# Merge feature into main
git checkout main
git merge feature/intake-agent
```

### Undoing Changes
```bash
# Discard uncommitted changes
git checkout -- file.py            # Single file
git reset --hard HEAD              # All changes (CAREFUL!)

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1            # CAREFUL!
```

## Recommended Workflow for TrailWatch

### Option 1: Main-Only (Simple)
```bash
# Work directly on main branch
git add .
git commit -m "Descriptive message"
```

**Good for:** Solo prototyping, quick iterations

### Option 2: Feature Branches (Recommended)
```bash
# Create branch per Project
git checkout -b project-1-intake-agent
# ... make changes ...
git commit -m "Implement TRACS mapping"

# When done, merge to main
git checkout main
git merge project-1-intake-agent
git branch -d project-1-intake-agent  # Delete feature branch
```

**Good for:** Team collaboration, experimental features

### Option 3: Conductor Integration
```bash
# Let Conductor create branches per track
# When you run: /track:new intake-agent
# Conductor can auto-create: feature/intake-agent branch
```

**Good for:** Conductor-managed workflow

## Commit Message Best Practices

### Format
```
<type>: <subject>

<body (optional)>

<footer (optional)>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only
- `refactor:` Code restructuring
- `test:` Adding/updating tests
- `chore:` Maintenance tasks

### Examples
```bash
git commit -m "feat: Add TRACS category mapping to intake agent"

git commit -m "fix: Correct GPS validation logic for edge cases"

git commit -m "docs: Update Project Charter with approved timeline"

git commit -m "refactor: Extract confidence scoring to separate module"
```

## Adding GitHub Remote Later

When ready to push to GitHub:

```bash
# Create repo on GitHub (don't initialize with README)
# Then connect local repo:

git remote add origin https://github.com/techtrend/trailwatch.git
git branch -M main
git push -u origin main
```

**Everything you've committed locally will be pushed.**

## Current Status

```
✅ Repository initialized
✅ Initial commit created (14 files, 4329 lines)
✅ .gitignore configured (protects secrets, API keys)
✅ On branch: main
```

## Benefits You Have Right Now

- ✅ Full version history
- ✅ Ability to undo any change
- ✅ Branch and experiment safely
- ✅ Commit checkpoints during development
- ✅ Compare versions
- ✅ No dependency on network/GitHub

## Quick Reference

```bash
# Daily workflow
git status                         # What's changed?
git add <files>                    # Stage changes
git commit -m "message"            # Save checkpoint
git log --oneline                  # View history

# Branching
git checkout -b feature/name       # Create + switch
git checkout main                  # Back to main
git merge feature/name             # Merge work

# Viewing
git diff                           # Uncommitted changes
git log --graph --all              # Visual history
```

---

**Next Steps:**
1. Work on code as normal
2. Commit frequently (after each logical change)
3. Use branches for experimental features
4. When ready to share with team, add GitHub remote
