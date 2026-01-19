# ADR-003: Autonomous Execution Patterns (Gemini CLI YOLO + Sandbox)

## Status
Proposed (2026-01-18)

## Context
Standard AI coding agents often require manual approval for file edits and terminal commands to ensure safety. This "interactive mode" is the default for both Claude Code and Gemini CLI. However, for high-velocity development and long-running Conductor implementation tracks, this manual overhead can become a bottleneck.

Claude Code provides a `--dangerously-skip-permissions` flag to enable autonomous execution. Gemini CLI provides a functionally equivalent "YOLO mode" (`--yolo` or `Ctrl+Y`).

A critical challenge discovered in January 2026 is that the Gemini CLI's YOLO mode can trigger a scheduler stall during project indexing if enabled at startup. Additionally, total autonomy requires a robust safety boundary to prevent destructive actions on the host system.

## Decision
To achieve autonomous and programmatic execution while maintaining project safety, we adopt the following pattern:

1.  **Mandatory Sandboxing**: All autonomous/YOLO sessions MUST use the Gemini CLI sandbox (`--sandbox` or `GEMINI_SANDBOX=true`). On macOS, this leverages the native Seatbelt sandbox.
2.  **Delayed YOLO Activation**: To mitigate the startup indexing bug, developers should start the CLI in standard interactive mode (with `--sandbox`) and toggle YOLO mode via `Ctrl+Y` only after the agent has acknowledged the initial prompt or finished reading context.
3.  **Programmatic Prompts**: Prompts for autonomous runs should explicitly mandate autonomy (e.g., "Operate with FULL AUTONOMY and programmatically drive this track to completion") to clarify intent to the model.

## Consequences

### Positive
*   **High Velocity**: Eliminates the need for manual "Allow" clicks for dozens of file edits and command executions.
*   **Safety via Isolation**: The sandbox restricts the agent's write access to the project directory, protecting the underlying OS.
*   **Programmatic Consistency**: Standardizes the prompt patterns for autonomous work.

### Negative
*   **Bug Sensitivity**: Requires developers to be aware of the "startup stall" and uses a manual toggle (`Ctrl+Y`) as a workaround.
*   **Silent Errors**: Issues in code generation may persist through multiple steps before a human reviews them.

## Alternatives Considered
*   **Full Interactive Mode**: Rejected for long implementation tracks due to UX friction.
*   **CLI-Level Flag (`--yolo`) at Startup**: Use with caution; only recommended once the scheduler bug is patched in the Gemini CLI.

## Compliance
All future implementation plans and developer onboarding must reference this ADR when autonomous execution is intended.
