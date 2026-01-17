# Project Context Handover ("The Constitution")

**To:** Conductor Agents / Engineering Team
**From:** Architecture Review Board (Planning Phase)
**Date:** January 16, 2026

## 🛑 STOP & READ
This project has pivoted from a pure Google Cloud stack to a **FOSS-First Hybrid Strategy**. Do not rely on old assumptions about using Google Maps API or BigQuery for everything.

## Core Decisions
1.  **Geospatial:** We use **MapLibre GL + Protomaps** (PMTiles). We do *not* use Google Maps JavaScript API for the main map.
    *   *Definitive Spec:* [`docs/GEOSPATIAL_ARCHITECTURE_BRIEF.md`](./GEOSPATIAL_ARCHITECTURE_BRIEF.md)
    *   *3D Engine:* We adapted [`sk-ruban/contour`](https://github.com/sk-ruban/contour) (Three.js + AWS Tiles).

2.  **AI Intelligence:** We use **Llama 3 / Mistral** via **MCP (Model Context Protocol)**. We do *not* hardcode Vertex AI calls for basic tasks.
    *   *Definitive Spec:* [`docs/AI_ARCHITECTURE_BRIEF.md`](./AI_ARCHITECTURE_BRIEF.md)
    *   *Orchestration:* Agents call Tools (e.g., `mcp_snap_engine`), not APIs.

3.  **Data:** We use **PostgreSQL 17** (Cloud SQL) for *everything* (Operational + Vector + Raw JSON). We do *not* use BigQuery for the MVP.
    *   *Definitive Spec:* [`docs/DATA_STRATEGY_BRIEF.md`](./DATA_STRATEGY_BRIEF.md)

## Repo Structure
*   `GEMINI.md`: Main Technical Requirement Spec (Updated).
*   `docs/`: Contains the definitive Architecture Briefs above.
*   `docs/archive/legacy_research/`: Old research (ignore if contradicting Briefs).

## Immediate Next Steps (Execution)
1.  Initialize the standard `01-new-project-setup` workflow.
2.  Scaffold the MCP Server for the Intake Agent.
3.  Deploy the PostGIS schema.
