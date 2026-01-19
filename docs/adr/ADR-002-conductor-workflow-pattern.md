# ADR-002: Conductor Workflow Pattern (Human-Driven Orchestration)

**Status:** Accepted

**Date:** 2026-01-17

**Decision Makers:** AI Factory Team

**Technical Story:** Discovered during Intake Agent track completion when Conductor failed to autonomously follow Track Creation Protocol

---

## Context

After completing the Intake Agent track (3 phases, 38 tests), we attempted to have Gemini CLI Conductor autonomously select the next track by following a documented "Track Creation Protocol" in `workflow.md`. The protocol required Conductor to:
1. Review GEMINI.md for project phases
2. Check ADRs for dependencies  
3. Consult USER_JOURNEYS.md
4. Propose the next track with justification

**What happened:** Conductor deferred to the user instead of executing the protocol, prompting: "What would you like to work on?"

**Root cause:** Conductor is architecturally designed as a **tactical executor**, not a **strategic planner**. Per Google's design, Conductor operates in "conductor mode" where the human conducts and triggers actions, unlike "orchestrator mode" agents that plan autonomously.

## Decision Drivers

- **Team training:** Need reproducible workflow pattern for team adoption
- **Conductor limitations:** LLMs struggle with complex, long-term strategic planning  
- **Solo developer efficiency:** Minimize ceremony while maintaining context continuity
- **Context engineering:** Conductor only reads `conductor/` directory, not `.agent/rules/`
- **File size limits:** Conductor struggles with files >15KB; positional bias loses mid-file info

## Considered Options

1. **Autonomous Protocol:** Expect Conductor to follow documented strategic protocols
2. **Human-Driven Orchestration:** Human makes strategic decisions, Conductor executes tactics
3. **Full Manual:** Abandon Conductor, use direct Gemini CLI for everything

## Decision Outcome

**Chosen option:** "Human-Driven Orchestration" because it aligns with Conductor's architectural strengths (tactical execution, TDD workflow, checkpointing) while acknowledging its limitations (strategic planning, autonomous protocol execution).

### Positive Consequences

- Clear separation of concerns: strategic AI for planning, Conductor for execution
- Reduced friction: no time wasted waiting for autonomous decisions that won't come
- Better context engineering: NEXT.md as lightweight mission brief
- Team-scalable: pattern works for solo developers and teams

### Negative Consequences

- Requires human judgment for track prioritization
- Strategic planning not automated (must consult with strategic AI or make solo decision)
- Additional artifact (NEXT.md) to maintain

### Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NEXT.md becomes stale | Medium | Low | Update as part of track completion checklist |
| Context overload as project grows | Medium | Medium | Keep NEXT.md under 50 lines; archive completed tracks |
| Team misunderstands Conductor capabilities | High | Medium | This ADR + training documentation |

---

## Implementation

### Artifacts Created

1. **`conductor/NEXT.md`** — Mission brief pattern
   - Current track status
   - Next track decision with rationale
   - Priority queue
   - Future considerations (skills bookmark)

2. **`GEMINI.md` TL;DR section** — Front-loaded critical context
   - First 500 words = always-in-context project summary
   - Addresses "lost in the middle" problem

3. **Simplified `conductor/workflow.md`** — Removed autonomous protocol
   - Track Initiation section acknowledges human-driven decisions
   - Clear command examples for Conductor

### Workflow Pattern

```
┌─────────────────────────────────────────────────────────────┐
│  STRATEGIC LAYER (Human + Strategic AI)                    │
│  Frequency: Every 3-5 tracks (~15 min/week)                │
├─────────────────────────────────────────────────────────────┤
│  1. Review docs/adr/ for dependencies                       │
│  2. Consult strategic AI for priority analysis              │
│  3. Update conductor/NEXT.md with decision                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  TACTICAL LAYER (Conductor)                                 │
│  Frequency: Daily execution                                 │
├─────────────────────────────────────────────────────────────┤
│  1. /conductor:new Track: [explicit assignment from NEXT.md]│
│  2. Conductor reads NEXT.md for context                     │
│  3. Generates spec.md, plan.md                              │
│  4. Executes TDD workflow with checkpoints                  │
└─────────────────────────────────────────────────────────────┘
```

### Solo Decision Rule

**80% of tracks don't need strategic AI consultation:**
- Next track obvious from priority queue
- Pattern matches existing track  
- ADR provides clear guidance

**Consult strategic AI when:**
- Major architectural decision
- Dependency conflicts between ADRs
- Unclear priority or blocked state

---

## Related Decisions

- [ADR-001: Trail Validation Architecture](./ADR-001-trail-validation-architecture.md) — Example of ADR that informs track priority

---

## References

- Perplexity Pro consultation (2026-01-17): Conductor vs Orchestrator architecture patterns
- Addy Osmani: "My LLM coding workflow going into 2026" — Specs before code, GEMINI.md patterns
- Google Developer Blog: "Conductor: Introducing Context-Driven Development"
- Anthropic: "Effective Context Engineering for AI Agents" — Positional bias, front-loading

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-01-17 | AI Factory Team | Initial decision based on Perplexity Pro consultation |
