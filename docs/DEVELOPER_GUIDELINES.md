# Developer Guidelines: Local vs. Cloud

Welcome to the TrailWatch project! This guide helps you navigate the "dual-mode" development cycle where we build features locally but design them for Google Cloud Platform (GCP).

## Philosophy: Local-First, Cloud-Native

We strive for a **"Local-First"** environment (Docker, local LLMs) that mirrors **"Cloud-Native"** behavior (Cloud Run, Vertex AI) as closely as possible.

### 1. Secrets Management
*   **Local**: Use a `.env` file (see `.env.example`).
*   **Cloud**: Production secrets are managed in **GCP Secret Manager**.
*   **Bridge**: Your code should use `pydantic-settings` or `os.getenv` to read configuration. Never hardcode keys.

### 2. Database (PostGIS)
*   **Local**: We use a **Dockerized PostgreSQL 17 + PostGIS** container.
*   **Cloud**: We use **Google Cloud SQL for PostgreSQL**.
*   **Consistency**: Always ensure your local PostGIS extensions and tuning (like `work_mem`) match the production spec in `docs/adr/ADR-001-trail-validation-architecture.md`.

### 3. AI & LLMs
*   **Local**: Developers often use **Ollama** or **vLLM** for rapid iteration without cost.
*   **Cloud**: Production utilizes **Vertex AI (Gemini)** for scale and compliance.
*   **Bridge**: Use the **Google ADK (Agent Development Kit)** to abstract the model provider, allowing you to swap between local and cloud models.

### 4. Service Discovery
*   **Local**: Services talk to each other via localhost ports or Docker network names (e.g., `http://localhost:8080`).
*   **Cloud**: Services use internal VPC URLs or Cloud Run service URLs.
*   **Bridge**: Use environment variables for base URLs (e.g., `TRAIL_VALIDATION_URL`).

### 5. Observability
*   **Local**: Logs go to standard output (stdout) for easy viewing in your terminal.
*   **Cloud**: Logs are captured by **Cloud Logging (Stackdriver)**.
*   **Consistency**: Use structured logging (JSON) locally. This makes them searchable and filterable in the cloud without changing any code.

### 6. Gemini CLI Environment
*   **Stability**: Always enable the sandbox via CLI flag (`--sandbox`) or environment variable (`GEMINI_SANDBOX=true`) to isolate file operations and prevent environment-related stalls.
*   **Known Bug**: Avoid using YOLO mode (`--yolo` or `Ctrl+Y`) for long-running Conductor implementation tracks (e.g., `/conductor:implement`). There is a known scheduler bug (Jan 2026) that causes stalls in this mode.
*   **Recovery**: If the CLI freezes, use `kill -9` to terminate the process and restart without YOLO mode.
*   **Authentication Errors**: If you encounter a `invalid_rapt` error, run `gcloud auth login` followed by `gcloud auth application-default login` to refresh credentials.
*   **Autonomous Workflow Example**: When starting an implementation track, use a prompt that mandates autonomy to prevent unnecessary pauses (see [ADR-003](file:///Users/jvalenzano/Documents/10-TrailWatch/docs/adr/ADR-003-autonomous-execution-patterns.md)):
    ```text
    /conductor:implement <track_id>
    Operate with FULL AUTONOMY and programmatically drive this track to completion. 
    Review ADRs and specs before writing code. Go.
    ```

    ```

    ```

### 7. Git Standard
*   **Protocol**: We follow a strict 3-branch model (`main`, `develop`, `feature/*`).
*   **Reference**: Read the full guide at [docs/onboarding/GIT_FLOW.md](onboarding/GIT_FLOW.md).
*   **Rule**: Always create a `feature/` branch for your work. Never commit to `main`.

---

## Troubleshooting & Common Issues

For guidance on complex failure modes unique to our stack (Vite + ESM + React), refer to the following guides:

*   **[Silent Module Evaluation Failures](file:///Users/jvalenzano/Documents/10-TrailWatch/docs/troubleshooting/silent-module-failures.md)**: What to do when the screen goes blank with zero console errors.

---

## Getting Started: The "Pre-Flight" Check
Before committing code that interacts with cloud services, ask yourself:
1. "Does this rely on a local path that won't exist in a container?"
2. "Am I using a client library that requires a specific Service Account?"
3. "Have I documented the required environment variables in `.env.example`?"

Reference: [ADR-001 (Trail Validation Architecture)](file:///Users/jvalenzano/Documents/10-TrailWatch/docs/adr/ADR-001-trail-validation-architecture.md)
