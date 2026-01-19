---
description: Merge current feature branch into develop
---

1. Verify status and push changes.
```bash
git status
git push origin HEAD
```

2. Switch to develop.
```bash
git checkout develop
git pull origin develop
```

3. Merge the feature branch.
> **USER INPUT REQUIRED:** What is the feature branch name you are merging?
```bash
# REPLACE [FEATURE_NAME] WITH USER INPUT
git merge feature/[FEATURE_NAME] --no-ff
```

4. Delete the local feature branch (optional but recommended).
```bash
# REPLACE [FEATURE_NAME] WITH USER INPUT
git branch -d feature/[FEATURE_NAME]
```

5. Push develop.
```bash
git push origin develop
```
