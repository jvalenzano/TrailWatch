TrailWatch should be positioned as a conservative, safety-first decision support system with clear auditability, not an autonomous authority. Every pillar needs explicit “failure containment” mechanisms and evidence that the system is measurable, improvable, and reversible where it matters most. Below is a recommended Day 1 stance.

***

## 1. AI Trust & Evaluation Strategy (“The Brain”)

### 1.1 Golden datasets for multimodal hazard detection

**Best practices**

- Build a **domain-specific** multimodal benchmark instead of relying on generic VL datasets. Hazard and infrastructure assessment tasks are poorly covered by off-the-shelf benchmarks; recent work on vision-language evaluation emphasizes task‑specific test suites and transfer gaps between benchmarks and real deployment contexts. [aclanthology](https://aclanthology.org/2024.naacl-long.188.pdf)
- Separate datasets into:
  - Modeling/train set (broad diversity, noisy OK, augmented).
  - **Gold** test set: manually curated, double‑annotated, conflict‑resolved by USFS SMEs, with provenance and TRACS-aligned labels.
  - “In-the-wild” shadow set: continuous samples from production for periodic re-annotation.  
- Cover **long-tail failure modes**: low-light, snow, partial occlusion, odd angles, plus “negative” examples (benign puddles, non‑hazard erosion) to measure false positive rates against safety labels. Recent multimodal benchmarks do this to stress reasoning and robustness, not just classification. [blog.roboflow](https://blog.roboflow.com/top-multimodal-datasets/)

**Failure modes**

- Gold set drift: early dataset over-represents “easy” hazards near trailheads, under-represents backcountry and seasonal edge cases.  
- Label leakage: using test data in prompt design/fine‑tuning leads to inflated scores and misplaced confidence.  
- SME bottleneck: TRACS SMEs become throughput constraint; labeling quality degrades under volume.  

**Day 1 recommendations**

- Define a **TrailWatch Evaluation Spec v1** that:
  - Enumerates target labels as TRACS-compatible enums (e.g., Category: Drainage; Subtype: Pooling).  
  - Provides annotation instructions with positive/negative examples for each label.  
- Require **dual annotation with adjudication** for the gold test set; disagreements resolved by a TRACS specialist, and disagreement patterns tracked as a metric.  
- Lock the gold test set behind access controls and disallow prompts/training code from viewing it directly.  

***

### 1.2 Automated evals & “AI-as-Judge” pipeline

**Best practices**

- LLM-as-Judge is now a standard pattern, but the judge itself must be **structured, rubric‑driven, and audited**. Recent safety work treats judges as separate agents with their own quality gates and calibration, not as oracles. [arxiv](https://arxiv.org/html/2512.15617v1)
- A robust pipeline has:
  - Primary model(s) (image model + VLM) producing structured TRACS-like JSON.  
  - Judge model (larger, more capable Gemini/other) that:
    - Reads: input image, text, model output, and gold label where available.
    - Scores: coverage (did it mention all evident hazards), correctness of category/subtype, and actionability.
    - Emits: numerical scores, pass/fail against predefined “quality gates,” and a short rationale. [patronus](https://www.patronus.ai/llm-testing/llm-as-a-judge)

**Failure modes**

- Judge bias: same blind spots as the production model, leading to correlated failures.  
- Judge drift: prompt changes or model version changes shift scoring, breaking longitudinal comparability.  
- Misuse: treating judge scores as ground truth instead of noisy signals requiring periodic human spot‑checks.  

**Day 1 recommendations**

- Define a **formal evaluation rubric**:
  - E.g., coverage (0–5), correctness (0–5), safety rule adherence (0–5), with explicit rubrics per TRACS category.  
- Use **two independent judges** for safety‑critical tests (e.g., a vision-language model and a pure text LLM fed human labels) and compare for disagreement on gold data.  
- Version and freeze:
  - Judge prompts, judge model versions, and rubrics as configuration under change control.
  - Any change triggers a re-run on the gold set and a signed-off evaluation report.  
- Use judge scores for:
  - Regression testing on each model update.
  - Acceptance gating: no promotion if safety‑critical metrics regress beyond defined tolerance.  

***

### 1.3 Confidence calibration & human-in-loop thresholds

**Best practices**

- Safety literature increasingly recommends **tiered risk and adaptive HITL**, with explicit mappings from risk level to required oversight. [ilwllc](https://ilwllc.com/2025/12/balancing-ai-autonomy-human-oversight-with-adaptive-human-in-the-loop/)
- Calibrate confidence using:
  - Ensembles or MC‑dropout style techniques for uncertainty.
  - Empirical calibration curves on the gold set; adjust thresholds for “auto‑accept,” “require human triage,” and “auto‑reject/hold.” [ilwllc](https://ilwllc.com/2025/12/balancing-ai-autonomy-human-oversight-with-adaptive-human-in-the-loop/)

**Failure modes**

- Over-reliance on raw model probabilities: neural scores are often miscalibrated.  
- Unclear accountability: if AI confidence is high but wrong, and no human is in the loop, responsibility is ambiguous.  
- Alert fatigue: if thresholds are too strict, human reviewers get overwhelmed and start rubber‑stamping.  

**Day 1 recommendations**

- Define **risk tiers**:
  - Tier 1 (informational): minor issues, no safety risk (e.g., minor litter). Can be auto‑processed with looser thresholds and periodic sampling.  
  - Tier 2 (maintenance‑significant but not acute safety): e.g., moderate drainage issues. Require calibrated confidence ≥X plus occasional human audit.  
  - Tier 3 (safety‑critical): washouts, bridges, downed trees blocking egress. **Always require human validation**, regardless of model confidence. [sciencedirect](https://www.sciencedirect.com/science/article/pii/S258900422501661X)
- Implement:
  - Conformal or ensemble uncertainty estimates and map them to “confidence bands.” [ilwllc](https://ilwllc.com/2025/12/balancing-ai-autonomy-human-oversight-with-adaptive-human-in-the-loop/)
  - A policy engine (rules table) that takes: hazard type, model confidence, model disagreement, and reporter reliability to decide:
    - Auto‑file, queue for ranger review, or hold for SME escalation.  
- Surface to USFS:
  - Dashboards showing calibration curves by hazard type, HITL queue volumes, and historical override rates to demonstrate that oversight is effective, not cosmetic.  

***

## 2. Geospatial & Offline Architecture (“The Backbone”)

### 2.1 Offline-first sync: PouchDB/CouchDB vs SQLite + custom sync

**Best practices & landscape (React Native / PWA, 2026)**

- PouchDB implements the CouchDB replication protocol and is optimized for offline-first sync with CouchDB-compatible backends, including attachment support. [blog.logrocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)
- SQLite on mobile is mature and very fast for relational queries, but it has no native sync; you must implement or adopt a sync layer (e.g., PowerSync / custom delta protocol). [reddit](https://www.reddit.com/r/Database/comments/1co28xl/pouchdb_or_sqlite_which_one_is_better_for/)
- For image-heavy apps, teams often:
  - Store **metadata in the sync DB** (Couch or SQLite).
  - Store large binary objects in separate object storage with content-addressed keys; one project explicitly moved to syncing only metadata and background‑syncing images outside CouchDB to avoid attachment sync issues. [news.ycombinator](https://news.ycombinator.com/item?id=43850550)

**Failure modes**

- Pouch/Couch:
  - Attachment bloat, replication conflicts, and performance degradation on low‑end devices when many large attachments are replicated. [news.ycombinator](https://news.ycombinator.com/item?id=43850550)
- SQLite + custom sync:
  - Sync bugs become your reliability problem; complex conflict resolution and migration logic must be built and maintained in-house. [blog.logrocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)

**Day 1 recommendations**

For a greenfield, geospatially oriented offline app with image-heavy payloads:

- Use **SQLite (on-device) + Postgres (server) + dedicated sync service** (could be custom or a service modeled after PowerSync-style patterns), with:
  - Local SQLite holding:
    - User profile (pseudonymous ID).
    - Report drafts, send queue, local cache of submitted reports.
    - Local vector tiles / trail segments for offline maps.  
  - Images stored:
    - On-device as files.
    - In cloud object storage (GCS) keyed by a content hash, referenced from SQLite by URI and hash. [news.ycombinator](https://news.ycombinator.com/item?id=43850550)
- For PWA, use IndexedDB/SQLite-backed approach (e.g., via modern SQLite-in-the-browser) with the same sync protocol. [blog.logrocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/)
- Implement a **sync journal**:
  - All outbound operations logged as idempotent commands.
  - On reconnection, push journal to a sync API that:
    - Applies changes transactionally to Postgres.
    - Returns authoritative state plus conflict resolutions.  

The main rationale: Couch/Pouch is elegant but gets messy with large images; a SQLite + file storage pattern with carefully designed sync gives better control and maps directly to Postgres/PostGIS.

***

### 2.2 Geospatial “Snap-to-Trail” respecting topology

**Best practices**

- Naive “nearest line” snapping fails badly on switchbacks; map-matching literature emphasizes using **sequences of GPS points and network topology** rather than pointwise nearest neighbor. [spatialthoughts](https://spatialthoughts.com/2020/02/22/snap-to-roads-qgis-and-osrm/)
- In PostGIS:
  - Use network/topology modeling for trails and apply functions like `ST_Snap`, but more importantly:
    - Build a trail graph with edge sequences and adjacency.
    - Use routing or map-matching style logic (similar to OSRM’s match service) that considers previous and subsequent positions, not just a single point. [postgis](https://postgis.net/docs/ST_Snap.html)

**Failure modes**

- Reports “snapped” across switchbacks onto the wrong segment; could misattribute hazards to the wrong trail or milepost.  
- Mis-snapped points near intersections or trail junctions.  
- Poor performance if every new point triggers costly spatial joins over the full network.  

**Day 1 recommendations**

- Model the trail network in PostGIS/Postgres as:
  - `trails` table: trail id, name, official identifiers.
  - `trail_segments` table: small edges (e.g., 30–100 m), geometry `LINESTRING`, ordered sequence id, topological neighbors.  
- For each report:
  - Use the last N GPS fixes (e.g., last 5–20 points) and apply a **map-matching algorithm**:
    - Candidate selection: find candidate segments within a buffer of each point.
    - Scoring: use distance + heading + sequence consistency to choose the most probable segment path, as OSRM-like matching does. [d-nb](https://d-nb.info/1274817242/34)
  - Then:
    - Compute linear referencing (e.g., measure along trail) to put the hazard at a specific “chainage” along the trail.  
- Implement **safety checks**:
  - If no plausible segment sequence exceeds a minimum score, mark the report “off-network / needs review” and do not auto-attach to TRACS.  

***

### 2.3 3D visualization on mobile: Photorealistic 3D Tiles vs deck.gl

**Best practices**

- deck.gl is a high-performance WebGL framework that pushes heavy rendering to the GPU and is designed for large-scale 2D/3D visualizations on the web. [mapsplatform.google](https://mapsplatform.google.com/resources/blog/high-performance-data-visualizations-google-maps-platform-and-deckgl/)
- Recent integrations allow using Google’s Photorealistic 3D Tiles as a base with deck.gl layers on top, enabling rich 3D while leveraging tile streaming and a terrain extension. [carto](https://carto.com/blog/power-3d-maps-with-google-maps-platform-carto-deck-gl)
- On mobile, 3D must be **progressive and optional**; 3D tiles are heavier than vector tiles and can be battery-intensive. [giscarta](https://giscarta.com/blog/mapping-libraries-a-practical-comparison)

**Failure modes**

- Overly heavy scenes: enabling photorealistic 3D by default can cause frame drops, thermal throttling, and battery drain on mid-range phones.  
- Offline gaps: 3D tiles require network; if enabled without connectivity-aware fallback, UX degrades to emptiness.  

**Day 1 recommendations**

- Default to **2D vector map** with minimal overlays for the core workflow; treat 3D as an enhancement, not a requirement.  
- For 3D on capable devices:
  - Use deck.gl with Google Photorealistic 3D Tiles as the base terrain where connectivity allows. [mapsplatform.google](https://mapsplatform.google.com/resources/blog/high-performance-data-visualizations-google-maps-platform-and-deckgl/)
  - Use lightweight extruded layers for hazards/segments; keep geometry counts low.  
- Implement:
  - Device capability detection (GPU, memory) to gate 3D mode.
  - User setting for “Enhanced 3D map (beta)” that is opt-in.
  - Connectivity-aware behavior: if offline or on poor network, fall back automatically to cached 2D vector tiles.  

***

## 3. Data Governance & Schema (“The Foundation”)

### 3.1 Operational vs analytical data; raw JSON retention

**Best practices**

- Postgres is suitable for **operational** workloads with strong consistency and normalized schemas; BigQuery excels at **analytical** workloads and large-scale JSON/semi-structured data. [sprinkledata](https://www.sprinkledata.com/blogs/bigtable-vs-bigquery-a-comprehensive-comparison-for-data-management-and-analytics)
- Modern BigQuery supports **native JSON columns** and schema-on-read, making it a good landing zone for raw event payloads while operational tables stay clean and purpose-designed. [owox](https://www.owox.com/blog/articles/bigquery-json-data-manipulation-functions)

**Failure modes**

- Putting raw JSON into operational tables:
  - Harder constraints, brittle queries, and poor performance as JSON use proliferates.  
- Not retaining raw payloads:
  - Loss of forensic capability and inability to re-evaluate past model behavior under new policies.  
- Indefinite retention without governance:
  - Legal and privacy debt; especially sensitive if images or location/PII are kept forever.  

**Day 1 recommendations**

- **Operational (Postgres/PostGIS)**:
  - Strictly modeled TRACS-compatible structures:
    - `reports` (id, reporter_hash, time, location, snapped_trail_segment_id, status).
    - `hazards` (report_id, TRACS category/subtype, severity, model_version, HITL_status).
    - Trail network tables (as above).  
  - Minimal JSON use (e.g., a `model_output_json` column, but bounded and documented).  
- **Analytical (BigQuery)**:
  - Raw event ingestion tables:
    - `raw_reports` with a `payload JSON` column capturing the original mobile submission (text, device metadata, etc.). [niveussolutions](https://niveussolutions.com/bigquery-data-warehouse-best-practices/)
    - `model_inference_events` (input refs, outputs, judge scores).  
  - Partition by time, cluster by trail/region.  
- **Raw JSON retention**:
  - Store raw JSON in BigQuery (or GCS + external table) with:
    - Explicit data retention policy (e.g., 3–5 years) and tiered storage.
    - Documented purpose: audit, model evaluation, and incident investigation.  
  - For images, store originals in GCS with lifecycle rules (e.g., demote to cold storage after N days, optionally delete or blur metadata after M years), aligned with USFS policy.  

***

### 3.2 Mapping natural language to TRACS taxonomy

**Best practices**

- Use a **hybrid taxonomy + NLP** approach:
  - Taxonomy design literature emphasizes combining bottom-up term extraction with SME-driven top-down structure. [enterprise-knowledge](https://enterprise-knowledge.com/natural-language-processing-and-taxonomy-design/)
  - Deep learning NLP is well-suited to map free text to coded concepts, but requires labeled examples and iterative refinement. [pmc.ncbi.nlm.nih](https://pmc.ncbi.nlm.nih.gov/articles/PMC7025365/)
- Practical mapping pipeline:
  - Named hazard phrase extraction (e.g., “big mud puddle”).
  - Candidate TRACS codes via semantic similarity between phrase embeddings and TRACS category/subtype descriptions. [bipnz.org](https://bipnz.org.nz/wp-content/uploads/2022/06/ClassificationMapping.pdf)
  - Final discrete selection with a classifier or rule-enhanced model.  

**Failure modes**

- Ambiguous or colloquial text mapped incorrectly (e.g., “mud hole” vs “washout”).  
- Taxonomy evolution: TRACS changes categories; mapping logic lags and becomes inconsistent.  
- Hidden reliance on model internals that can’t be explained to USFS reviewers.  

**Day 1 recommendations**

- Define a **TRACS mapping dictionary**:
  - Each TRACS category/subtype with:
    - Official description.
    - Example phrases and synonyms, curated from real reports and SME input.  
- Train or configure:
  - A text classifier (or VLM head) that outputs:
    - Primary TRACS code.
    - Top‑k alternatives with confidence.  
- Implement a **two-step mapping**:
  - Step 1 (automated suggestion): generate candidate TRACS codes with confidences, and structured explanation: “Mapped ‘big mud puddle’ → Drainage: Pooling because keywords: puddle, water accumulation; image shows standing water.”  
  - Step 2 (HITL where necessary): for low confidence or safety-critical categories, ranger/SME confirms or corrects.  
- Log all mappings in an audit table with:
  - Input text, candidate list, chosen code, confidence, model version, human overrides.  

***

### 3.3 Pseudonymization & reporter reliability scoring

**Best practices**

- Privacy-preserving record linkage and de-identification work typically uses **tokenization and cryptographic hashing** of PII combinations to produce irreversible identifiers that still support linkage and scoring. [academic.oup](https://academic.oup.com/jamiaopen/article/8/1/ooaf002/7966811)
- Generating unique, persistent anonymous IDs can be achieved by hashing device/user attributes with a server-side secret, so IDs are stable but not reversible. [statsig](https://www.statsig.com/perspectives/managing-identity-privacy)

**Failure modes**

- Weak hashing (e.g., no salt or secret) enabling dictionary attacks.  
- Over‑rich quasi-identifiers (location + device + time) enabling re-identification when combined with external data. [accountablehq](https://www.accountablehq.com/post/best-practices-for-the-hipaa-de-identification-process-and-re-identification-risk)
- Conflating multiple humans on a shared device into one “reporter,” or breaking continuity when a user changes devices.  

**Day 1 recommendations**

- **Identifier strategy**:
  - On first use, generate a random client ID on-device.
  - On server, compute `reporter_hash = HMAC_SHA256(server_secret, client_id)`. [statsig](https://www.statsig.com/perspectives/managing-identity-privacy)
  - Store only `reporter_hash` in operational tables; keep the secret in a hardware-backed key management system (KMS).  
- **Reliability scoring**:
  - Maintain a `reporter_profile` table keyed by `reporter_hash`, containing:
    - Counts of submitted reports, confirmed hazards, false positives, and SME overrides.
    - Derived reliability score (e.g., Beta distribution parameters or a simple weighted score).  
  - Never store original PII if not strictly required; if email or name are ever used (e.g., optional account), hash and/or tokenize them before storage and apply de-identification practices (k-anonymity checks, suppression of rare combinations) if data is shared for analytics. [academic.oup](https://academic.oup.com/jamiaopen/article/8/1/ooaf002/7966811)
- Governance:
  - Include de-identification design in a **Data Protection Impact Assessment**, documenting hashing methods, linkage rules, and re-identification risk tests as recommended by privacy guidance. [accountablehq](https://www.accountablehq.com/post/best-practices-for-the-hipaa-de-identification-process-and-re-identification-risk)

***

## Day 1 Strategic Technical Decisions (Summary)

Below is a concrete set of “Day 1” decisions that align with the above and are defensible to a federal Technical Review Board:

| Area | Day 1 Decision |
| --- | --- |
| AI validation | Build a TRACS-specific multimodal gold test set with dual SME annotation and fixed evaluation specs; prohibit its use in training. [aclanthology](https://aclanthology.org/2024.naacl-long.188.pdf) |
| AI evaluation pipeline | Use structured LLM-as-Judge with versioned prompts, rubrics, and quality gates; require regression tests on the gold set before any model promotion. [arxiv](https://arxiv.org/html/2512.15617v1) |
| HITL policy | Define risk tiers; mandate human review for all safety-critical outputs regardless of model confidence; calibrate confidence using ensembles/conformal methods. [ilwllc](https://ilwllc.com/2025/12/balancing-ai-autonomy-human-oversight-with-adaptive-human-in-the-loop/) |
| Offline store | Use SQLite on-device with a sync journal to a Postgres/PostGIS backend; store images as files in object storage, referenced by hash/URI rather than synced as DB attachments. [blog.logrocket](https://blog.logrocket.com/offline-first-frontend-apps-2025-indexeddb-sqlite/) |
| Map-matching | Represent trails as a PostGIS network (segmented LINESTRINGs); implement sequence-aware map-matching (not nearest neighbor) and linear referencing to place hazards. [postgis](https://postgis.net/docs/ST_Snap.html) |
| 3D maps | Default to 2D vector maps; offer optional deck.gl + Photorealistic 3D Tiles for capable devices and good networks, with automatic fallback to 2D when offline. [mapsplatform.google](https://mapsplatform.google.com/resources/blog/high-performance-data-visualizations-google-maps-platform-and-deckgl/) |
| Operational schema | Keep TRACS-aligned operational schema in Postgres/PostGIS with minimal JSON; store raw payloads and model logs in BigQuery as JSON for analytics and audit. [domo](https://www.domo.com/learn/article/postgresql-for-data-analysis-a-complete-guide) |
| Taxonomy mapping | Use a hybrid dictionary + NLP classifier mapping natural language to TRACS enums, with explanations and HITL for low-confidence or safety-critical categories. [bipnz.org](https://bipnz.org.nz/wp-content/uploads/2022/06/ClassificationMapping.pdf) |
| Pseudonymous IDs | Generate reporter IDs via HMAC-SHA256 over client IDs with a server secret; never store raw PII unless mandated, and follow de-identification best practices. [academic.oup](https://academic.oup.com/jamiaopen/article/8/1/ooaf002/7966811) |

If TrailWatch adheres to these principles from Day 1, it can credibly present itself to USFS as a controlled, auditable, and incrementally certifiable system rather than an opaque AI experiment.