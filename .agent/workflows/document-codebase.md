---
description: Add inline comments to code files explaining purpose and context for junior developers
---

# Documentation Sweep Workflow

Scan specified files or directories and add helpful inline comments that explain:
- **What** the code/config does
- **Why** TrailWatch needs it
- **Context** a junior developer would need to understand it

## Scope

This workflow applies to:
- `requirements.txt` and `pyproject.toml` (dependency explanations)
- Configuration files (`.env.example`, `settings.py`, YAML configs)
- Complex modules where business logic isn't obvious
- Database models and migrations
- API route handlers
- Agent tool definitions

## Comment Style by File Type

### Python Dependencies (requirements.txt)
```
package>=1.0.0             # Brief explanation of what it does and why we need it
```
Keep comments aligned for readability. Group related packages with blank lines.

### Python Code
Use inline comments sparingly. Prefer:
1. Clear naming that makes comments unnecessary
2. Google-style docstrings for functions/classes
3. Inline comments only for non-obvious "why" explanations

```python
# Good: explains WHY, not what
confidence *= 0.8  # Penalize anonymous reporters per ADR-001

# Bad: restates the code
confidence *= 0.8  # Multiply confidence by 0.8
```

### Configuration Files
```yaml
# Environment: What this configures
# Values: Valid options or format
# Default: What happens if omitted
DATABASE_URL=postgresql://...
```

### SQL/Migrations
```sql
-- Why this constraint exists (business rule)
-- What breaks if removed
ALTER TABLE reports ADD CONSTRAINT ...
```

## Execution Steps

1. **Identify target files:** Accept file path or directory from user
2. **Read existing content:** Preserve all existing code and comments
3. **Analyze each element:** For each package/function/config:
   - Is its purpose obvious from naming alone?
   - Would a junior dev understand why it's here?
   - Is there TrailWatch-specific context needed?
4. **Add comments where needed:** Follow style guidelines above
5. **Preserve alignment:** Keep comment columns aligned within sections
6. **Verify no breakage:** Run linter/tests if applicable

## Quality Criteria

Comments should be:
- **Accurate:** Don't guess. If unsure, mark with `# TODO: verify purpose`
- **Concise:** One line preferred, two max
- **Contextual:** Reference TrailWatch concepts, ADRs, or GEMINI.md where relevant
- **Non-redundant:** Don't comment obvious things

## Do Not

- Add comments to every line (comment density should be ~20-30% of lines max)
- Explain language syntax (`# This is a for loop`)
- Add TODO comments without actionable context
- Break existing formatting or alignment
- Remove existing comments unless clearly wrong

## Example Invocation

```
/workflow:document-codebase Target: requirements.txt
Add inline comments explaining each dependency's purpose in TrailWatch.
```

```
/workflow:document-codebase Target: src/trailwatch/agents/
Add docstrings and inline comments to agent modules, focusing on
ADK patterns and TRACS mapping logic.
```
