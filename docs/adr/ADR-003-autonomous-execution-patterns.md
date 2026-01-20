# ADR-003: Autonomous Execution Patterns

## Status
Accepted (Updated 2026-01-20)

## Context
Standard AI coding agents often require manual approval for file edits and terminal commands to ensure safety. This "interactive mode" is the default for most AI coding assistants. However, for high-velocity development and long-running track implementation, this manual overhead can become a bottleneck.

Different AI coding tools provide different mechanisms for autonomous execution:
- **Claude Code:** Operates in chat interface; autonomy is granted through explicit instructions
- **Gemini CLI (Historical):** Provided "YOLO mode" (`--yolo` or `Ctrl+Y`) with sandboxing

Total autonomy requires a robust safety boundary to prevent destructive actions on the host system.

## Decision
To achieve autonomous and programmatic execution while maintaining project safety, we adopt the following tool-agnostic pattern:

1.  **Explicit Autonomy Declaration**: When autonomous execution is desired, explicitly state: "Operate with FULL AUTONOMY and programmatically drive this track to completion. Follow the workflow in `conductor/workflow.md`. Only ask for approval if blocked or if quality gates fail after 2 fix attempts."
2.  **Safety Boundaries**: Agents must never:
   - Commit to `main` or `develop` directly
   - Add new dependencies without approval
   - Delete >50 lines of code without confirmation
   - Skip quality gates (tests, coverage, linting)
3.  **Programmatic Prompts**: Prompts for autonomous runs should explicitly mandate autonomy and reference the workflow document to clarify intent.

## Tool-Specific Implementation

### Claude Code
Claude Code operates in a chat interface and doesn't have "YOLO mode" or sandbox flags. Instead:

1. **Explicit Autonomy:** When you want autonomous execution, state: "Execute this track autonomously. Follow the workflow in `conductor/workflow.md`. Only ask for approval if blocked or if quality gates fail."

2. **Safety Boundaries:** Claude Code should:
   - Never commit to `main` or `develop` directly
   - Always run tests before committing
   - Ask before deleting >50 lines of code
   - Ask before adding new dependencies
   - Follow quality gates strictly

3. **Progress Reporting:** Claude Code should provide status updates after each task completion using the format: ✅ Completed | 🔄 Next | ⚠️ Issues

### Historical: Gemini CLI (No Longer Used)
~~Gemini CLI provided "YOLO mode" with sandboxing. A critical bug discovered in January 2026 caused scheduler stalls when YOLO mode was enabled at startup. The workaround was to start in interactive mode and toggle YOLO after context loading.~~

**Note:** This project has migrated from Gemini CLI to Claude Code. This section is preserved for historical context only.

## Consequences

### Positive
*   **High Velocity**: Eliminates the need for manual approval for routine file edits and command executions.
*   **Safety via Boundaries**: Explicit rules prevent destructive actions.
*   **Programmatic Consistency**: Standardizes the prompt patterns for autonomous work.
*   **Tool Agnostic**: Pattern works with any AI coding assistant.

### Negative
*   **Requires Discipline**: Agents must follow safety boundaries strictly.
*   **Silent Errors**: Issues in code generation may persist through multiple steps before a human reviews them (mitigated by quality gates).

## Alternatives Considered
*   **Full Interactive Mode**: Rejected for long implementation tracks due to UX friction.
*   **No Autonomy**: Rejected as it would slow development velocity significantly.

## Compliance
All future implementation plans and developer onboarding must reference this ADR when autonomous execution is intended. Agents must follow the safety boundaries regardless of which tool is used.
