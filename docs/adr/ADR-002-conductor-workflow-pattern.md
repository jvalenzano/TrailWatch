# ADR-002: Track-Based Workflow Pattern (Human-Driven Orchestration)

**Status:** Accepted  
**Updated:** 2026-01-20 (Terminology clarification)

**Date:** 2026-01-17

**Decision Makers:** AI Factory Team

**Technical Story:** Discovered during Intake Agent track completion when Gemini CLI Conductor failed to autonomously follow Track Creation Protocol. This led to the decision to separate strategic planning (human) from tactical execution (agent), establishing what is now called the "Track-Based Workflow Pattern."

---

## Context

After completing the Intake Agent track (3 phases, 38 tests), we attempted to have Gemini CLI Conductor autonomously select the next track by following a documented "Track Creation Protocol" in `workflow.md`. The protocol required the agent to:
1. Review project documentation for phases
2. Check ADRs for dependencies  
3. Consult USER_JOURNEYS.md
4. Propose the next track with justification

**What happened:** The agent deferred to the user instead of executing the protocol, prompting: "What would you like to work on?"

**Root cause:** AI coding agents (including Gemini CLI Conductor and Claude Code) are architecturally designed as **tactical executors**, not **strategic planners**. They excel at implementing code when given clear assignments, but struggle with complex, long-term strategic planning decisions.

## Decision Drivers

- **Team training:** Need reproducible workflow pattern for team adoption
- **Agent limitations:** AI coding agents struggle with complex, long-term strategic planning  
- **Solo developer efficiency:** Minimize ceremony while maintaining context continuity
- **Context engineering:** Agents work best with focused, lightweight context (NEXT.md pattern)
- **Tool agnostic:** Pattern should work regardless of which AI coding tool is used

## Considered Options

1. **Autonomous Protocol:** Expect Conductor to follow documented strategic protocols
2. **Human-Driven Orchestration:** Human makes strategic decisions, Conductor executes tactics
3. **Full Manual:** Abandon Conductor, use direct Gemini CLI for everything

## Decision Outcome

**Chosen option:** "Human-Driven Orchestration" because it aligns with AI coding agents' architectural strengths (tactical execution, TDD workflow, checkpointing) while acknowledging their limitations (strategic planning, autonomous protocol execution). This pattern is now called the **Track-Based Workflow Pattern**.

### Positive Consequences

- Clear separation of concerns: human for strategic planning, AI agent for tactical execution
- Reduced friction: no time wasted waiting for autonomous decisions that won't come
- Better context engineering: NEXT.md as lightweight mission brief
- Team-scalable: pattern works for solo developers and teams
- Tool-agnostic: works with Claude Code, Gemini CLI, or any AI coding assistant

### Negative Consequences

- Requires human judgment for track prioritization
- Strategic planning not automated (must consult with strategic AI or make solo decision)
- Additional artifact (NEXT.md) to maintain
- Terminology confusion: "Conductor" was used for both tool and pattern (now clarified as "Track-Based Workflow Pattern")

### Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| NEXT.md becomes stale | Medium | Low | Update as part of track completion checklist |
| Context overload as project grows | Medium | Medium | Keep NEXT.md under 50 lines; archive completed tracks |
| Team misunderstands agent capabilities | High | Medium | This ADR + training documentation + QUICK_START.md |
| Terminology confusion | Medium | Low | Glossary.md + updated documentation |

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
│  TACTICAL LAYER (Claude Code / AI Agent)                   │
│  Frequency: Daily execution                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Create new track: [explicit assignment from NEXT.md]    │
│  2. Agent reads NEXT.md for context                         │
│  3. Generates spec.md, plan.md                             │
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
| 2026-01-20 | Claude Code | Updated terminology: "Conductor Pattern" → "Track-Based Workflow Pattern". Clarified tool-agnostic nature. Added references to new documentation (QUICK_START.md, GLOSSARY.md). |
