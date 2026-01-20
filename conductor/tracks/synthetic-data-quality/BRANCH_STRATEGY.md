# Branch Strategy: Synthetic Data Quality Track

**Date:** 2026-01-20  
**Status:** Approved

---

## Branch Naming

**Feature Branch:** `feature/synthetic-data-quality`

This follows the project's Git Flow convention:
- Branch from: `develop`
- Merge to: `develop` (then to `main` after validation)
- Naming pattern: `feature/<descriptive-name>`

---

## Branch Lifecycle

### 1. Creation

```bash
# Ensure develop is up to date
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/synthetic-data-quality

# Push to remote (for backup and collaboration)
git push -u origin feature/synthetic-data-quality
```

### 2. Development

Work on the feature branch following the phased plan:
- Commit after each task completion
- Use conventional commit messages: `feat(data): Add low-confidence reports`
- Keep commits focused and atomic
- Push regularly to remote

### 3. Integration Testing

Before merging to develop:
```bash
# Ensure all tests pass
npm test

# Ensure TypeScript compiles
npm run build

# Ensure no linter errors
npm run lint

# Review changes
git diff develop...feature/synthetic-data-quality
```

### 4. Merge to Develop

```bash
# Switch to develop
git checkout develop
git pull origin develop

# Merge feature branch (create merge commit)
git merge feature/synthetic-data-quality --no-ff -m "Merge feature/synthetic-data-quality: Synthetic data quality enhancements"

# Push to remote
git push origin develop
```

### 5. Cleanup

```bash
# Delete local branch
git branch -d feature/synthetic-data-quality

# Delete remote branch (if pushed)
git push origin --delete feature/synthetic-data-quality
```

---

## Commit Strategy

### Commit Message Format

Follow conventional commits:
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

- `feat(data):` - New reports or data features
- `fix(data):` - Data corrections or bug fixes
- `refactor(data):` - Data structure improvements
- `docs(data):` - Documentation updates
- `test(data):` - Test additions or updates

### Examples

```bash
feat(data): Add low-confidence reports (0.35-0.55 range)
fix(data): Correct GPS coordinates for RV-008
refactor(data): Add submitted_via metadata field
docs(data): Update visual assets manifest
test(data): Add edge case tests for GPS validation
```

---

## Merge Strategy

### When to Merge

Merge to `develop` when:
- ✅ Phase is complete
- ✅ All tests passing
- ✅ TypeScript compilation successful
- ✅ Audit checklist items verified
- ✅ Documentation updated

### Merge Approach

**Use `--no-ff`** to create merge commits:
- Preserves branch history
- Makes it clear when features were integrated
- Easier to revert if needed

### After Merge

1. Update `conductor/tracks.md` with completion status
2. Update `conductor/NEXT.md` if this was the active track
3. Tag release if merging to `main`

---

## Conflict Resolution

### If Conflicts Occur

1. **Don't panic** - Conflicts are normal
2. **Understand the conflict** - Read both versions
3. **Resolve carefully** - Keep both changes if possible
4. **Test after resolution** - Ensure nothing broke
5. **Commit resolution** - Use clear message

### Common Conflict Areas

- **Type definitions** - If types were updated in develop
- **Test files** - If tests were added in develop
- **Asset manifests** - If assets were added in develop

---

## Branch Protection

### Rules

- ✅ **Never commit directly to `main`**
- ✅ **Never commit directly to `develop`** (use feature branches)
- ✅ **Always test before merging**
- ✅ **Always update documentation**

### Pre-Merge Checklist

- [ ] Branch is up-to-date with develop
- [ ] All tests passing
- [ ] TypeScript compilation successful
- [ ] No linter errors
- [ ] Documentation updated
- [ ] Audit checklist reviewed

---

## Collaboration

### If Multiple People Work on This

1. **Coordinate phases** - Don't work on same phase
2. **Communicate changes** - Use commit messages and PR descriptions
3. **Pull regularly** - Keep feature branch synced with develop
4. **Resolve conflicts early** - Don't let them accumulate

### Code Review

If using pull requests:
- Request review before merging
- Address feedback before merging
- Keep PRs focused and reviewable

---

## Emergency Procedures

### If Something Breaks

1. **Don't merge broken code** - Fix first
2. **Revert if needed** - `git revert <commit-hash>`
3. **Create hotfix branch** - If urgent: `hotfix/data-quality-fix`
4. **Document the issue** - Update plan.md with what happened

### If Branch Gets Messy

1. **Create backup** - `git branch feature/synthetic-data-quality-backup`
2. **Reset if needed** - `git reset --hard <good-commit>`
3. **Cherry-pick good commits** - `git cherry-pick <commit-hash>`

---

## Best Practices

### Do's

✅ Commit often (after each task)  
✅ Write clear commit messages  
✅ Test before committing  
✅ Keep branch focused  
✅ Update documentation  
✅ Sync with develop regularly  

### Don'ts

❌ Commit broken code  
❌ Mix unrelated changes  
❌ Skip tests  
❌ Force push to shared branches  
❌ Merge without review  
❌ Delete branches before merge  

---

## Summary

- **Branch:** `feature/synthetic-data-quality`
- **From:** `develop`
- **To:** `develop` → `main`
- **Strategy:** Phased commits, merge after phases
- **Protection:** Tests required, documentation required

Follow this strategy, and you'll have a clean, traceable history that makes collaboration easy and rollbacks safe.
