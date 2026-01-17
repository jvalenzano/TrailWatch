# Data Governance & Schema Strategy Brief ("The Foundation")

**Version:** 1.0  
**Date:** January 16, 2026  
**Status:** DRAFT  

## 1. The Core Challenge
We must bridge the gap between **Messy Citizen Data** (unstructured, colloquial) and **Strict Federal Data** (TRACS, PII-regulated). If our schema is wrong, the AI will have nothing to latch onto.

## 2. Information Architecture (ERD Strategy)

### 2.1 Unified Store (PostgreSQL 17)
**Purpose:** Single source of truth for Operations, Analytics, and AI Vectors.
**Why:** A well-tuned Postgres instance can handle 1TB+ and eliminates the need for separate BigQuery pipelines in Phase 1.

*   **Table: `reports` (Operational)**
    *   Standard columns (`id`, `status`, `gps`).
    *   Column `payload` (`JSONB`): Stores the raw submission for historical replay.
*   **Extension: `pgvector`**
    *   Used for RAG and Similarity Search (e.g., "Find other reports with similar semantic descriptions").
    *   Replaces expensive Vertex Vector Search.

### 2.2 Cold Storage (Archive)
*   **Strategy:** Old raw JSON payloads are archived to S3-compatible storage (Cloud Storage) if DB size exceeds 500GB.
*   **Analytics:** Can be queried via DuckDB or ClickHouse *if* scale demands it later. BigQuery is reserved as a "Phase 2" option.

## 3. The "Rosetta Stone": Natural Language to TRACS
We will not ask hikers to select "Drainage: Pooling." We ask them: "What's wrong?" and map it covertly.

| Citizen Says | AI Internals (Embeddings) | TRACS Code |
| :--- | :--- | :--- |
| "Big puddle" | `water_accumulation`, `standing_water` | **DRN (Drainage)** |
| "Tree fell down" | `blowdown`, `vegetation_blocking` | **CLR (Clearing)** |
| "Bridge broken" | `structural_failure`, `crossing` | **STR (Structures)** |

**Governance Rule:** The AI *suggests* the mapping. If Confidence < 90%, a Human Ranger must *confirm* it.

## 4. Privacy & PII Handling
*   **Rule 1:** We never store `user_email` in the Operational Database.
*   **Rule 2:** We generate a `reporter_reliability_score`.
    *   How? Using a **Cryptographic Hash** (e.g., `SHA256(email + SECRET_SALT)`).
    *   We know that `User A` reported 5 accurate landmarks, so their 6th report is trusted. We just don't know *who* `User A` is.

## 5. Next Steps
*   [ ] Write SQL Migration 001 (`init_schema.sql`).
*   [ ] Define the `TRACS_ENUMS` python file (Single Source of Truth).
