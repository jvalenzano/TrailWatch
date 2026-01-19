# Mentorship Workflow Pattern: Human-Driven, AI-Guided

This document outlines the interaction pattern used during the TrailWatch project development. It serves as a reference for the current developers and a handoff guide for future contributors.

## The Core Philosophy: "Antigravity Conducts, Human Supervises"
 
The primary goal of this workspace is to facilitate **accelerated development** while maintaining high standards. The Human Developer supervises the AI Agent (Antigravity), who acts as the primary coder and process conductor.

### 1. Mentorship Roles
- **Human (The Supervisor/Architect):** Reviews artifacts (plans, code), validates verification results (browser, tests), and provides high-level strategic direction (ADRs, Product Goals).
- **AI (Antigravity - The Conductor & Coder):**  Acts as the "Conductor" agent. Autonomously updates `plan.md`, implements code, runs tests, performs browser verification, and manages the project lifecycle. Provides mentorship on best practices and architecture.

### 2. Interaction Loop
1.  **Context & Planning:** Antigravity analyzes context and proposes a plan update or task execution.
2.  **Execution:** Antigravity writes code, runs commands, and fixes errors autonomously.
3.  **Verification:** Antigravity uses tools (browser, terminals) to self-verify work.
4.  **Review:** The Human reviews the work (via "notify_user" or inspecting the app) and provides feedback or approval to proceed.

### 3. Workflow Principles
- **Autonomous Execution:** Antigravity is empowered to write code and run verification tools without constant micromanagement, stopping only for critical design decisions or phase completion.
- **Traceability:** Antigravity maintains `plan.md` and `task.md` scrupulously to ensure the Human can always see the state of the project.
- **Muscle Memory (Optional):** The Human may choose to run commands manually for learning, but Antigravity defaults to execution for speed.

---

### 4. Frontend Ownership & Orchestration
- **Architect (The Supervisor):** Jason. Defines the User Journey and Visual Aesthetic goals.
- **Conductor (The Builder):** Antigravity. Implements the React/Vite/MapLibre code, manages state, and ensures the build passes.
- **Shared Responsibility:** Both parties verify the final UI UX.

*Updated: January 18, 2026 (Antigravity Handmax)*
