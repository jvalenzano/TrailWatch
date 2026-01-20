# Repository Hygiene Sweep

## Context

You are performing a methodical cleanup of the TrailWatch repository. The codebase has accumulated sediment: orphaned files, inconsistent naming, duplicate documentation, and incomplete structures. Your goal is to restore clarity and consistency so both humans and AI agents can navigate efficiently.

## Principles

1. **Archive, never delete.** Move obsolete content to `archive/` directories. Preserve git history.
2. **When uncertain, ask.** Flag ambiguous cases for human review rather than guessing.
3. **Document your changes.** Create a cleanup log as you work.
4. **Work systematically.** Complete one area before moving to the next.
5. **Preserve functionality.** If something might be in use, verify before archiving.

## Process

### Phase 1: Analysis (Read-Only)

Before changing anything, produce a report covering:

**1. Orphaned Files**
- Files not referenced by any other file
- Markdown docs not linked from any index or README
- Code files not imported anywhere

**2. Duplicate Content**
- Documents covering the same topic (compare by content, not just name)
- Multiple versions of the same spec or plan
- Redundant configuration files

**3. Naming Inconsistencies**
- Mixed conventions (hyphens vs underscores, dates in names vs not)
- Unclear or overly generic names
- Inconsistent casing

**4. Incomplete Structures**
- Directories missing expected files (index.md, metadata.json for tracks)
- Stub files with only TODOs or placeholders
- Empty directories

**5. Stale Content**
- Documents referencing completed work as "upcoming"
- Outdated status indicators
- References to renamed or moved files

Present this analysis and wait for approval before proceeding.

### Phase 2: Consolidation

For each category of issues:

**Tracks Directory (`conductor/tracks/`)**
- Ensure every track has: index.md, metadata.json, spec.md or plan.md
- Archive tracks not listed in the tracking system
- Standardize folder names to `kebab-case` (no dates in folder names)
- Update all cross-references after renames

**Documentation (`docs/`)**
- Identify documents covering the same topic
- Propose merges (e.g., "Combine ui-strategy-v1.md and ui-strategy-v2.md into ui-strategy.md")
- Archive superseded versions

**Research and Reference**
- Move one-off research that informed past decisions to `archive/research/`
- Keep only actively-referenced research in main directories

**Configuration and Scripts**
- Identify unused config files
- Archive deprecated scripts

### Phase 3: Structural Improvements

**Create Single Sources of Truth**
- If status is tracked in multiple places, consolidate to one authoritative file
- Create index files for directories that lack them

**Standardize Metadata**
- Ensure consistent schema across all metadata.json files
- Add missing fields, remove deprecated fields

**Update References**
- Fix all broken internal links
- Update references to renamed files
- Ensure README files accurately reflect directory contents

### Phase 4: Verification

After all changes:
- Confirm no broken links remain
- Verify build still works (if applicable)
- Ensure all active tracks are properly indexed
- Run any existing tests

## Archive Structure
```
archive/
├── tracks/           # Obsolete or merged tracks
├── docs/             # Superseded documentation
├── research/         # Historical research, no longer active reference
└── cleanup-log.md    # Record of what was archived and why
```

## Output Format

For each file you propose to archive or modify, report:
```
FILE: path/to/file.md
ACTION: archive | merge | rename | update
REASON: [one sentence explanation]
DESTINATION: [new path, if moving]
REFERENCES TO UPDATE: [list of files that reference this one]
```

## What NOT to Touch

- `.git/` directory
- `node_modules/` or other dependency directories
- Files with recent commits (last 48 hours) unless clearly orphaned
- Anything in `src/` without explicit confirmation
- Environment files (`.env*`)

## Start Here

Begin with Phase 1 analysis of the `conductor/` directory, then `docs/`, then the repository root. Present findings for each area before moving to the next.
