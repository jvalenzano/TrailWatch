# Challenge Prompt: "Defend Your Architecture Against $0 Budget"

**To:** External AI Architect
**From:** TrailWatch Technical Review Board (Red Team)

Your initial "Day 1" recommendations are robust but expensive. You leaned heavily into Google's proprietary ecosystem (Vertex AI, Google Maps 3D Tiles). We are a government project with a fixed budget. We need to explore **Open Source** and **Free** alternatives.

**The Challenge:**
Critique your own plan. For every proprietary "Black Box" service you recommended, propose the **Open Source / Free API equivalent** and analyze the trade-off.

## 1. Geospatial: The "Google Tax"
You recommended **Google Photorealistic 3D Tiles**. These cost money per tile load and lock us into Google's terms.
*   **Challenge:** How would you build the "Wow" classification map using **OpenStreetMap (OSM)** data?
*   **Tools:** Could we use **MapLibre GL** or **Deck.gl** with free/cheap vector tiles (e.g., Protomaps)?
*   **Data:** Can we replace Google Places API calls (for trailheads) with **OpenStreetMap tags** accessed via Overpass API or a hosted instance?

## 2. AI: Total Dependency
You recommended **Vertex AI Eval Pipeline** and Gemini.
*   **Challenge:** If we needed to run the "Intake Agent" on a local server in a Ranger District office (no internet), could we?
*   **Tools:** Compare Gemini Flash vs. a specialized **Llama 3 (8B)** or **Mistral** fine-tuned on TRACS data.
*   **Evals:** Can we use **MLflow** or **Arize Phoenix** (open source) instead of Vertex Evaluation Service?

## 3. Data: The BigQuery Trap
You recommended **BigQuery** for raw JSON.
*   **Challenge:** BigQuery gets expensive with storage. Why not just use **PostgreSQL 17** with `jsonb` for *everything* (Analytical + Operational) until we hit 1TB of data?
*   **Vector Search:** Instead of Vertex Vector Search, why not standard **pgvector** in our existing Postgres DB?

## 4. MCP & Agentic Patterns
*   **Challenge:** How would you implement the "Intake Agent" using the **Model Context Protocol (MCP)** to gateway these open-source tools (e.g., an "OSM Lookup Tool" via Overpass)?

**Deliverable:**
A "Cost-Optimized / Open-Source Alternative" table contrasting your original plan with a "FOSS-First" approach.
