---
description: Start a new feature branch from develop
---

1. Check out the development branch.
```bash
git checkout develop
git pull origin develop
```

2. Create a new feature branch.
> **USER INPUT REQUIRED:** What is the name of your feature? (e.g. `dashboard-phase-3-moderate`)
```bash
# REPLACE [FEATURE_NAME] WITH USER INPUT
git checkout -b feature/[FEATURE_NAME]
```

3. Verify you are on the correct branch.
```bash
git branch
```
