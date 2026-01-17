# FOSS-First Architecture Decision Record
**Expert Response to Challenge Prompt**

**Date:** January 16, 2026
**Status:** APPROVED STRATEGY

## Cost-Optimized / Open-Source Alternative Table

### 1. Geospatial / Mapping (“Google Tax”)

| Concern | Original Plan (Proprietary) | FOSS‑First Alternative | Trade-offs |
| --- | --- | --- | --- |
| Basemap & 3D “wow” | Google Maps JS SDK + Photorealistic 3D Tiles; great out-of-the-box UX but pay‑per‑tile and platform lock‑in. | **MapLibre GL JS** as rendering engine, with **Protomaps** / **OpenFreeMap** / self‑hosted PMTiles as the vector basemap built from OSM. [protomaps](https://protomaps.com/about) | MapLibre is BSD‑licensed and supports fully offline .pmtiles; Protomaps provides free OSM-derived basemap tilesets and can be self‑hosted or even shipped as a single file. [protomaps](https://protomaps.com/about) You lose Google’s photorealistic 3D imagery but gain cost control and offline capability. |
| Offline basemap | Cached Google tiles (limited offline, license‑constrained). | Pre‑downloadable **PMTiles** (vector tiles in a single file) rendered via MapLibre; users can download regional tile bundles for offline hiking. [docs.protomaps](https://docs.protomaps.com/pmtiles/maplibre) | PMTiles works well even on low‑resource systems and can be hosted cheaply or bundled with the app. [docs.protomaps](https://docs.protomaps.com/pmtiles/maplibre) Engineering work is needed to manage tile bundle versions and downloads. |
| 3D visualization | Google Photorealistic 3D as terrain + buildings. | “Perceived 3D”: MapLibre with hillshading, contours and elevation tint, or **deck.gl** on top of terrain tiles; optionally integrate open DSM/DTM datasets (e.g., USGS elevation) and extruded layers. [mapsplatform.google](https://mapsplatform.google.com/resources/blog/high-performance-data-visualizations-google-maps-platform-and-deckgl/) | You get pseudo‑3D via hillshades and extruded vector layers rather than cinematic photogrammetry. This is usually sufficient for “wow” dashboards, and performance is better on mid‑range phones. |
| Trail network & trailheads | Google Maps Places API (trailheads, POIs) plus Roads API style snapping. | **OpenStreetMap** as authoritative geometry; trailheads via `highway=trailhead` nodes; hiking routes via `route=hiking` / `route=foot`; accessed through **Overpass API** or a self‑hosted Overpass instance. [wiki.openstreetmap](https://wiki.openstreetmap.org/wiki/Tag:highway=trailhead) | OSM explicitly models trailheads and hiking routes through tags such as `highway=trailhead`, plus relation-based routes. [wiki.openstreetmap](https://wiki.openstreetmap.org/wiki/Tag:highway=trailhead) You must filter for data quality and possibly overlay official USFS trail data. Overpass is free but rate‑limited; a self‑hosted instance adds ops cost. |
| Geocoding & POI search | Google Geocoding / Places. | **Nominatim** (OSM geocoder) self‑hosted or via community providers; OSM tags for POIs via Overpass queries. | Nominatim is slower and less “forgiving” than Google’s geocoder but fully open; you need to manage capacity and caching. There is no SLA unless you pay a third‑party host. |
| Map styling & theming | Google Maps styling JSON. | MapLibre GL style JSON plus Protomaps/OpenMapTiles style bundles; custom hiking‑oriented style (trail difficulty, closures, USFS symbology).  [protomaps](https://protomaps.com/about) | Styling power is similar to Mapbox; you gain full control at the cost of initial style design. Protomaps provides default styles you can extend. [protomaps](https://protomaps.com/about) |

**Net:** The FOSS stack (MapLibre + OSM + Protomaps/PMTiles + Overpass/Nominatim) removes Google tile and Places charges and improves offline behavior at the cost of: (a) up‑front engineering to host tiles/Overpass and design styles, and (b) losing photorealistic 3D imagery in favor of high‑quality vector “2.5D”.

***

### 2. AI / Models & Evaluation (“Total Dependency”)

| Concern | Original Plan (Proprietary) | FOSS‑First Alternative | Trade-offs |
| --- | --- | --- | --- |
| Core multimodal “Intake Agent” | Gemini Flash/Pro via Vertex AI (remote inference). | Local or self‑hosted **Llama 3 8B Instruct** or **Mistral**-family models (e.g., 8B) for text; for vision, an open VLM or separate vision model + text LLM pipeline; fine‑tuned on TRACS examples. [documentation.triplo](https://documentation.triplo.ai/faq/local-models-and-its-strengths) | 8B models can be served on a single GPU or high‑end CPU box in a Ranger District; Llama 3 8B is designed for instruction-following with good quality per parameter. [documentation.triplo](https://documentation.triplo.ai/faq/local-models-and-its-strengths) You lose some frontier‑level performance vs Gemini Pro but gain offline capability and cost predictability. Vision side requires more assembly work (image encoder + LLM). |
| Offline inference in district office | Not feasible without network (Vertex is cloud-only). | Deploy local inference server (e.g., vLLM, text‑generation‑inference) on a workstation or small server at the Ranger District; ship model weights via controlled process. | Air‑gapped or low‑connectivity operation becomes viable. You must manage updates, hardware health, and monitoring; memory footprint and quantization strategies matter for 8B models. |
| Evaluation & experiment tracking | Vertex AI Experiments + Vertex Evaluations. | **MLflow** for experiment tracking & model registry; **Arize Phoenix OSS** for LLM tracing and LLM-as-judge evaluation workflows. [arize](https://arize.com/phoenix-oss/) | MLflow provides experiment logging, artifacts, and model registry without license fees. [slashdot](https://slashdot.org/software/comparison/Arize-Phoenix-vs-MLflow/) Phoenix OSS is purpose‑built for LLM observability and can orchestrate “LLM-as-Judge” with detailed traces and quality metrics. [arize](https://arize.com/phoenix-oss/) You must host and integrate these services yourself (e.g., Docker/Kubernetes). |
| LLM‑as‑Judge | Gemini Pro as judge, centrally hosted. | Use a stronger open model (e.g., Llama 3 70B hosted centrally, or Mistral “Small 24B” style models) as the judge, or even the same 8B with conservative thresholds; evaluations orchestrated via Phoenix. [arize](https://arize.com/phoenix-oss/) | Larger open models require beefier central hardware but avoid per‑call charges. Evaluation prompts and rubrics are still versioned and auditable; quality may be slightly below top proprietary models, so compensating via stricter HITL is prudent. |
| Safety filters & red‑teaming | Reliance on Google safety filters. | Custom safety classifiers (lightweight text classifiers; image NSFW filters) plus rules and human review; policy enforcement tracked via Phoenix traces and logs. [arize](https://arize.com/phoenix-oss/) | More engineering and policy design work, but full transparency and control. You can start with simple rules and iterate. |

**Net:** A Llama/Mistral‑based stack plus MLflow + Phoenix gives you offline execution, transparent evals, and no per‑token cloud lock‑in. The cost is: infra to host models/eval tools, more work to get VLM performance near Gemini, and some loss in “raw IQ” that you mitigate with narrow tasks, TRACS-specific fine‑tuning, and strict HITL.

***

### 3. Data & Analytics (“BigQuery Trap”)

| Concern | Original Plan (Proprietary) | FOSS‑First Alternative | Trade-offs |
| --- | --- | --- | --- |
| Data warehouse for raw JSON | BigQuery with JSON columns for raw payloads & logs. | Single **PostgreSQL 17** cluster with partitioned tables and `jsonb` columns for raw payloads and logs (operational + analytical in same system up to ~1 TB); use table partitioning, indexes, and materialized views for reporting. [domo](https://www.domo.com/learn/article/postgresql-for-data-analysis-a-complete-guide) | Postgres 17 handles large `jsonb` volumes reasonably well, but JSON parsing/storage overhead is non‑trivial, and large JSONB inserts can be slower than scalar columns. [reddit](https://www.reddit.com/r/PostgreSQL/comments/1p7713y/postgresql_jsonb_insert_performance_75_of_time/) Up to a few hundred GB–1 TB, a well‑tuned Postgres can serve both OLTP and moderate analytics; beyond that, you may need a warehouse. You save BigQuery storage/query costs early on. |
| Raw event retention | BigQuery as cheap long‑term store. | `jsonb` “raw_events” tables in Postgres; cold data archived to compressed JSON in object storage (e.g., S3‑compatible) plus external query engine later if needed. | Cheaper than BigQuery at small scale; you maintain your own retention/archival jobs. If analytics needs explode, you can later introduce a data warehouse (e.g., ClickHouse, DuckDB on files, or even BigQuery) with a controlled migration. |
| Vector search | Vertex AI Vector Search. | **pgvector** extension on the existing Postgres DB for embeddings (reports, trail segments, historical hazards). [github](https://github.com/pgvector/pgvector) | pgvector provides in‑DB vector similarity search with ANN indexes and hybrid queries; recent versions support millions of vectors with good performance. [github](https://github.com/pgvector/pgvector) You avoid a separate vector DB and any Vertex fees. For very large vector collections, you may need careful index tuning and potentially a dedicated Postgres instance. |
| Analytics tooling | BigQuery console and integration ecosystem. | Standard SQL analytics on Postgres + BI tools that speak Postgres (Metabase, Superset, etc.). | Works well until data and query complexity grow. You may need to offload heavy historical analytics to an OLAP tool later (ClickHouse, DuckDB, or an introduced warehouse), but this can be deferred until usage is proven. |

**Net:** For a Phase 1 citizen science platform, “Postgres‑for‑everything” (with jsonb, pgvector, and partitioning) is a perfectly reasonable, cost‑optimized stance. The main risk is performance/operational complexity beyond ~1 TB and high concurrent analytics; that is a scaling problem you can tackle once you have real traffic and budget.

***

### 4. MCP & Agentic Patterns (Open-Source Tooling)

| Concern | Original Plan (Proprietary) | FOSS‑First Alternative (MCP-based) | Trade-offs |
| --- | --- | --- | --- |
| Tool orchestration for “Intake Agent” | Ad hoc API calls from Gemini / Vertex agent flows to Google services (Maps, Places, etc.). | **Model Context Protocol (MCP)** server that exposes open tools: OSM lookup, Overpass queries, Postgres access, map‑matching service, and TRACS taxonomy mapping as standardized tools. | MCP provides a standard “tool API” layer: your agent (Llama/Mistral) sees tools, not vendors. You can swap model providers and keep tools constant; you must implement/host MCP servers and tool adapters. |
| OSM / trailhead lookup | Google Places API for trailhead search. | MCP tool `osm_trailheads` that: given a bounding box or name, queries Overpass API (`highway=trailhead`, `route=hiking`, etc.) and returns structured trailhead and route data. [wiki.openstreetmap](https://wiki.openstreetmap.org/wiki/Tag:highway=trailhead) | Overpass is free but rate‑limited; for reliability you’ll likely deploy a self-hosted Overpass and cache responses. This MCP tool is straightforward: wrapper around HTTP queries + JSON normalization. |
| Map-matching / snap-to-trail | Google Roads-like snapping or Maps SDK logic. | MCP tool `snap_to_trail` that calls your PostGIS backend implementing the topology-aware map-matching described earlier (sequence of GPS points → trail segment + chainage). | You own the map-matching algorithm and can evolve it; agent just calls a deterministic tool. This is better for auditability but needs strong backend geospatial engineering. |
| TRACS taxonomy mapping | LLM prompt inside Gemini pipeline. | MCP tool `tracs_mapper` that uses your local/fine‑tuned Llama/Mistral model or even a simple classifier to map natural language to TRACS enums and return explanations. | Centralizes mapping logic and makes it model‑agnostic; an upstream model can ask the tool rather than embed TRACS knowledge in weights. You must maintain the mapping dataset and classifier. |
| Evals & traces | Vertex Pipelines & Metrics. | MCP‑aware logging to **Arize Phoenix OSS**: all tool calls, prompts, and responses become “traces” with evaluation hooks. [arize](https://arize.com/phoenix-oss/) | Phoenix is explicitly designed for tracing LLM workflows and supports LLM-as-Judge style evals with open models. [arize](https://arize.com/phoenix-oss/) You host it and integrate MCP telemetry; in exchange, you get a vendor-neutral observability layer. |

**How the MCP-based Intake Agent would look (conceptually)**

- **Model:** Local/single‑tenant Llama 3 8B (or larger central model for judge).  
- **MCP tools:**
  - `osm_trailheads` (Overpass).
  - `snap_to_trail` (PostGIS-backed service).
  - `tracs_mapper` (TRACS classifier).
  - `db_write_report` (Postgres insert via safe RPC).
  - `media_store` (upload image to object storage, return URI).  
- **Flow:**
  1. User submits text + photos offline; local app stores in SQLite.
  2. On sync, backend Intake Agent (LLM) gets structured payload; uses tools via MCP:
     - Calls `snap_to_trail` with GPS history.
     - Calls `tracs_mapper` with text + image tags.
     - Writes candidate TRACS hazard rows via `db_write_report`.
  3. Phoenix logs the full trace, including tool inputs/outputs and judge scores, for later evaluation. [arize](https://arize.com/phoenix-oss/)

This keeps the agent layer thin, testable, and portable: you can swap Llama → Mistral or even a future compliant SaaS model without rewriting all integration logic.

***

### Strategic Recommendation

For a USFS budget‑constrained project, the following stance is defensible:

- **Mapping:** Default to a pure OSM/MapLibre/Protomaps stack with offline PMTiles; reserve any Google Maps/3D spend for a later “Phase 2 Ranger Dashboard” if justified. [protomaps](https://protomaps.com/about)
- **AI:** Standardize on open models (Llama/Mistral) for both Intake Agent and Judge, with MLflow + Phoenix providing evaluation and observability; keep hardware modest by starting with 8B variants and aggressive HITL. [documentation.triplo](https://documentation.triplo.ai/faq/local-models-and-its-strengths)
- **Data:** Run entirely on Postgres 17 (`jsonb`, PostGIS, pgvector) until clear, measured pressure justifies a warehouse; design schemas so a later move to BigQuery or ClickHouse is mechanical, not architectural. [reddit](https://www.reddit.com/r/PostgreSQL/comments/1p7713y/postgresql_jsonb_insert_performance_75_of_time/)
- **Agents:** Use MCP as the abstraction layer over all tools (OSM, Postgres, map-matching, storage) so no single model vendor becomes a hard dependency. [arize](https://arize.com/phoenix-oss/)
