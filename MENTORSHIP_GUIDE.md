# Mentorship Workflow Pattern: Human-Driven, AI-Guided

This document outlines the interaction pattern used during the TrailWatch project development. It serves as a reference for the current developers and a handoff guide for future contributors.

## The Core Philosophy: "The Human Drives, the AI Navigates"

The primary goal of this workspace is to facilitate a **teachable exercise**. The Human Developer is learning the platform, the Google CLI, and the Conductor framework.

### 1. Mentorship Roles
- **Human (The Driver):** Owns the terminal and the editor. Manages the execution of commands, commits code, and makes final design decisions.
- **AI (The Mentor):** An expert in the **Gemini CLI** and **Conductor Framework**. Researches documentation, explains Conductor concepts (Tracks, Plans, Context), provides step-by-step guidance, and performs "pre-flight" research to ensure the Driver has the right context.

### 2. Interaction Loop
1.  **Context Preparation:** AI researches existing specs, codebases, and runbooks.
2.  **Guidance:** AI provides the specific commands or logic required for the next step.
3.  **Manual Execution:** The Human runs the command in their own terminal to build muscle memory and understanding.
4.  **Reflection & Mentorship:** If errors occur or concepts are unclear, the Human asks "Why?" or shares a screenshot, and the AI explains the underlying mechanics.

### 3. Workflow Principles
- **No Invisible Magic:** The AI avoides running complex commands automatically unless requested for automation.
- **Muscle Memory:** Commands are typed/pasted by the human to ensure they understand the toolchain (e.g., `gemini /conductor:...`).
- **Audit Trail:** Every major logical step is committed by the Human to maintain a clear Git history of the learning journey.

---

### 4. Frontend Ownership & Orchestration
- **Owner (The Driver):** Jason. All frontend orchestration and execution for Phase 2-5 will be handled by Jason.
- **Mentor (The Navigator):** Anti-Gravity. Provides technical guidance, code research, and architectural advice for React, Vite, and MapLibre GL JS implementations.

*Updated: January 18, 2026*
