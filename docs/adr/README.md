# Architecture Decision Records

This directory contains Architecture Decision Records (ADRs) for TrailWatch.

## What is an ADR?

An ADR is a document that captures an important architectural decision made along with its context and consequences. ADRs help future team members understand why decisions were made.

## Conventions

### Numbering

- ADRs are numbered sequentially: ADR-001, ADR-002, etc.
- ADR-000-template.md is the template (not a real decision)
- Numbers are never reused, even if an ADR is deprecated

### File Naming

```
ADR-[NUMBER]-[short-kebab-case-title].md
```

Examples:
- `ADR-001-use-postgresql-for-reports.md`
- `ADR-004-trail-validation-architecture.md`

### Status Lifecycle

1. **Proposed**: Decision is under discussion
2. **Accepted**: Decision has been approved and should be followed
3. **Deprecated**: Decision is no longer relevant (but kept for history)
4. **Superseded by ADR-XXX**: Replaced by a newer decision

### When to Write an ADR

Write an ADR when:
- Choosing between significant technical alternatives
- Making decisions that are hard or expensive to reverse
- Decisions that affect multiple team members or systems
- You find yourself explaining the same decision repeatedly

Don't write an ADR for:
- Trivial decisions (variable naming, minor refactors)
- Decisions that are easily reversible
- Standard practices already documented elsewhere

## Index

| ADR | Title | Status | Date |
|-----|-------|--------|------|
| [ADR-001](./ADR-001-trail-validation-architecture.md) | Trail Validation Architecture | Proposed | 2026-01-17 |

---

## References

- [Michael Nygard's original ADR article](https://cognitect.com/blog/2011/11/15/documenting-architecture-decisions)
- [ADR GitHub organization](https://adr.github.io/)
