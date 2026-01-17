# Open Source vs. Commercial Architecture Analysis
**"Red Team" Review of TrailWatch Stack**

**Date:** January 16, 2026

To ensure we aren't over-engineering with expensive proprietary tools, I analyzed Open Source (FOSS) alternatives for every major component of the TrailWatch platform.

## 1. Maps & Geospatial (The Biggest Cost Diver)

| Component | **Recommended (GCP)** | **FOSS Alternative** | **Trade-off Analysis** |
| :--- | :--- | :--- | :--- |
| **Base Map** | Google Maps JS API | **MapLibre GL JS** + **OpenStreetMap (OSM)** | **Winner: FOSS.** OSM is free. Google Maps is expensive ($7/1000 loads). MapLibre is industry standard. |
| **3D Vis** | Photorealistic 3D Tiles | **CesiumJS** + **OSM Buildings** | **Winner: GCP (Sort of).** Google's 3D photorealism is unmatched for "Wow" factor. OSM 3D is "blocky." |
| **Geocoding** | Google Places API | **Pelias** or **Nominatim** | **Winner: FOSS.** For trails, OSM data is often *better* than Google Places. We can self-host Pelias. |
| **Routing** | Google Routes API | **Valhalla** (hosted on GKE) | **Winner: FOSS (for trails).** Google Routes focuses on cars. Valhalla has excellent hiking profiles. |

**Strategy:** Use **MapLibre + OSM** for the main map (saving 90% of budget). Only use Google 3D Tiles for the specific "Flyover" view in the Ranger Dashboard.

## 2. AI Intelligence (The Compliance Diver)

| Component | **Recommended (Vertex)** | **FOSS Alternative** | **Trade-off Analysis** |
| :--- | :--- | :--- | :--- |
| **LLM** | Gemini 1.5 Pro | **Llama 3 (70B)** on GKE | **Winner: GCP.** Self-hosting Llama means *we* are responsible for FedRAMP Security controls (patching, etc.). Vertex inherits FedRAMP authorization. |
| **Vision** | Gemini Pro Vision | **LLaVA-Next** | **Winner: GCP.** Multimodal open source models lag slightly behind Gemini/GPT-4V in zero-shot reasoning. |
| **RAG** | Vertex Vector Search | **pgvector** (Postgres) | **Winner: FOSS.** `pgvector` is perfectly adequate for <10M vectors and costs nothing extra. |

**Strategy:** Stick with **Vertex AI** for the *Model* (Compliance/Quality) but use **pgvector** for the *Store* (Cost).

## 3. Data & Storage (The Scale Diver)

| Component | **Recommended (BigQuery)** | **FOSS Alternative** | **Trade-off Analysis** |
| :--- | :--- | :--- | :--- |
| **Analytics** | BigQuery | **DuckDB** / **ClickHouse** | **Winner: GCP.** For a small team, managing a ClickHouse cluster is overhead. BigQuery is serverless. |
| **Operational** | Cloud SQL (Postgres) | **Postgres 17** (Self-hosted) | **Winner: GCP.** Managed Cloud SQL handles backups/HA. Don't self-host databases in gov. |

**Strategy:** Stick with **Cloud SQL** (Managed Postgres) but use `jsonb` columns for heavily unstructured data instead of paying for a separate BigQuery pipeline immediately.

---

## 4. The "Hybrid" Compromise (Recommended)

Does "Open Source" mean "Self-Hosted"? No. We can use FOSS *protocols* and *data* on managed infra.

### The "FOSS-First" Architecture:
1.  **Frontend:** **MapLibre GL** (FOSS) rendering **Protomaps** (Source-Available) hosted on **Cloud Storage**. Cost: Negligible.
2.  **Data:** **OpenStreetMap** (via Overpass) for trail registry lookup. Cost: Free.
3.  **Search:** **pgvector** on Cloud SQL. Cost: Included.
4.  **AI:** **Vertex AI (Gemini)**. Cost: Pay-per-use (but cheaper because we filter with FOSS tools first).

This approach satisfies the "Wow" factor (using Google 3D only where needed) while respecting the budget (using OSM for the 99% use case).
