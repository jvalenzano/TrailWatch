# Tech Stack

## Cloud Provider
- **Platform:** Google Cloud Platform (GCP)

## Compute
- **Serverless Containers:** Cloud Run

## Databases
- **Operational & Spatial:** PostgreSQL 17 (with PostGIS, Vectors, JSONB)
- **Cold Archive:** BigQuery

## AI/ML
- **Local LLMs:** Llama 3, Mistral (via Ollama/vLLM)
- **High-Compliance AI:** Vertex AI (Gemini)

## Mapping & Geospatial
- **Frontend Maps:** MapLibre GL JS
- **Basemaps:** Protomaps
- **3D Visualization:** Contour, Three.js
- **Spatial Logic:** PostGIS

## Storage
- **Object Storage:** Cloud Storage (for photos, exports)

## Authentication
- **Citizen Users:** Firebase Auth or Cloud Identity
- **Internal Users:** IAM

## Languages & Frameworks
- **Backend Language:** Python 3.11+
- **API Framework:** FastAPI
- **Agent Framework:** Google ADK (Agent Development Kit)
- **Frontend Framework:** React 18+ with TypeScript
- **Frontend Mapping Library:** MapLibre GL JS + Protomaps (see ADR-004)
- **Ingestion:** Crawlers for AllTrails/Reddit, Partner APIs (PCTA, ATC), PWA web form (see ADR-005)

## Key Dependencies (Python)
- `fastapi`
- `google-cloud-aiplatform`
- `google-adk`
- `sqlalchemy`
- `geoalchemy2`
- `pydantic`
- `asyncpg`
- `psycopg2-binary`
- `geopandas`
- `fiona`
- `httpx`