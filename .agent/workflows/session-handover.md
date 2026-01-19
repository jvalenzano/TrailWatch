---
description: Generates a situationally-aware warm-up prompt for resuming work in a new session.
---
To provide a smooth session resumption, follow these steps to gather state and generate the handoff rapport:

1.  **Identify Active Branch**: Run `git branch --show-current`.
2.  **Locate Active Track**: Read `conductor/tracks.md` and check the `conductor/tracks/` directory for the most recent track folder.
3.  **Check Implementation Progress**: Read the `plan.md` within the active track folder. Look for:
    -   The currently active task marked with `[~]`.
    -   The first uncompleted task marked with `[ ]`.
4.  **Research Mentorship Principles**: Read [MENTORSHIP_GUIDE.md](file:///Users/jvalenzano/Documents/10-TrailWatch/MENTORSHIP_GUIDE.md) to ensure the AI-Guided, Human-Driven boundary is respected.
5.  **Confirm Tech Stack & Standards**: Read `conductor/tech-stack.md` and `conductor/workflow.md` briefly to ensure current implementation constraints (e.g., Vite vs CRA, PostGIS versions) are included.
6.  **Generate Handoff Report**: Format the output using the following template:

```markdown
### 🎯 Session Context: [Track Name] Implementation

**Current Project:** TrailWatch
**Environment:** 
- **Branch:** `[branch-name]`
- **Track:** `[track-id]`
- **Stack:** [Key techs from tech-stack.md]
- **Mentorship Model:** Active (See [MENTORSHIP_GUIDE.md](file:///Users/jvalenzano/Documents/10-TrailWatch/MENTORSHIP_GUIDE.md))

**Where we left off:** 
[Brief 1-2 sentence summary of completed work and the specific Phase/Task reached.]

**Our Standards:**
- **TDD:** Red -> Green -> Refactor.
- **Git:** Use verified syntax (e.g., `* /conductor:checkpoint "[Message]"`).
- **Tooling:** [Vite/TypeScript/etc.]
- **Guardrails:** Antigravity Conducts, Human Supervises. Autonomous execution enabled.

**Immediate Objective:** 
[Precisely what tool call or command should be run next.]
```

