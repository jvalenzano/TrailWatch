# AI & Agent Architecture Brief ("The Brain")

**Version:** 1.0  
**Date:** January 16, 2026  
**Status:** APPROVED STRATEGY

## 1. Core Philosophy: "Intelligent Edge & Open Standards"
We will decentralize AI to run closer to the data (offline capable) and use the **Model Context Protocol (MCP)** to prevent vendor lock-in.

## 2. Model Strategy

### 2.1 The "Intake Agent"
**Role:** Process raw reports, extract structure, map to TRACS.
*   **Primary Model:** **Llama 3 (8B) Instruct** or **Mistral**.
*   **Deployment:**
    *   *Cloud:* Hosted on GKE (or cheap GPU instance) for online syncing.
    *   *Edge:* Capable of running locally on Ranger workstations via Ollama/vLLM for offline processing.
*   **Input:** Text + Image (via separate Vision encoder or simple Multimodal model like LLaVA if quality permits).

### 2.2 The "Judge" (Evaluation)
**Role:** Grade the Intake Agent's work.
*   **Model:** **Llama 3 (70B)** or Mistral Large (Hosted Central API or Self-Hosted).
*   **Tool:** **Arize Phoenix OSS** (Self-hosted).
*   **Why:** Provides full observability traces without per-token "Eval Service" fees.

## 3. Agent Orchestration: Model Context Protocol (MCP)

Instead of hardcoding "Google Maps API calls" into the agent, we build standard **MCP Tools**.

### 3.1 The Toolset
1.  **`mcp_trail_lookup`**: Wraps **Overpass API** queries.
    *   *Agent asks:* "Find trailheads near (lat, lon)" -> *Tool queries OSM*.
2.  **`mcp_snap_engine`**: Wraps our **PostGIS** logic.
    *   *Agent asks:* "Snap this GPS trace" -> *Tool runs PostGIS/Map-Match*.
3.  **`mcp_tracs_classifier`**: Wraps the **Llama/Mistral** classification step.
    *   *Agent asks:* "Classify 'big wet mud hole'" -> *Tool returns TRACS: DRN*.

### 3.2 The Flow
1.  **Sync:** Mobile app uploads raw report.
2.  **Orchestrator:** Passes report to Intake Agent (Llama 8B).
3.  **Agent:** Calls `mcp_snap_engine` to fix location.
4.  **Agent:** Calls `mcp_tracs_classifier` to get categorical tags.
5.  **Agent:** Calls `mcp_db_writer` to save to Postgres.
6.  **Log:** Trace sent to Phoenix for nightly "Judge" review.

## 4. Implementation Checklist
*   [ ] Deploy **Ollama/vLLM** container on Cloud Run/GKE.
*   [ ] Write **MCP Servers** (Python/TypeScript) for PostGIS and Overpass.
*   [ ] Set up **Arize Phoenix** for observability.
