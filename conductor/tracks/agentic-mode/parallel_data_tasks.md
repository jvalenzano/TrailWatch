# Parallel Work: Synthetic Data Curation

**Context:** We are offloading the creation of the "Golden Dataset" to parallel agents to unblock the main development track.
**Goal:** Generate realistic assets (Photos, Social Media) and the JSON data structure.

---

## Agent 1: "The Visual Artist" (Asset Generation)

**Objective:** Populate `frontend/public/assets` with realistic synthetic imagery.

**Copy/Paste this Prompt:**
```text
You are the **Visual Asset Specialist** for TrailWatch.
Your goal is to generate the "Truth Source" images for our Agentic Mode demo.

**Context:**
We need realistic "citizen science" style photos of trail hazards.
Reference: `docs/UI/_!_SYNTHETIC_DATA_PLAN.md` (Section 2: Synthetic Content Sourcing)

**Instructions:**
1.  **Setup:** Ensure directory `frontend/public/assets/photos` exists.
2.  **Generate Core Hazard Images** (Use `generate_image` tool):
    -   `tree_obstruction_standard.jpg`: A large Douglas Fir fallen across a hiking trail. Smartphone quality, slightly blurry is okay.
    -   `tree_obstruction_ancient.jpg`: A mossy log blocking a path in a dense rainforest (Pacific Northwest style).
    -   `erosion_washout.jpg`: A trail section washed away by mud, exposing roots.
    -   `bridge_collapse_critical.jpg`: A small wooden footbridge snapped in half over a creek. High drama/danger.
3.  **Generate "Duplicate Detection" Pair:**
    -   `duplicate_source_A.jpg`: A fallen birch tree blocking a gravel path, taken from eye level.
    -   `duplicate_source_B.jpg`: The *exact same* fallen birch tree, but taken from a slightly lower angle and 5 steps closer. (Use `generate_image` with the first image as input if possible, or perform a very similar generation).
4.  **Generate "External Intelligence" Mocks:**
    -   Create directory `frontend/public/assets/social`.
    -   `social_tweet_storm.png`: A mock screenshot of a Tweet saying "Wind is CRAZY at Mirror Lake right now! Trees snapping!" with a timestamp.
    -   `social_blog_header.png`: A mock header of a hiking forum post titled "Trip Report: North Ridge is impassable".

**Deliverable:**
-   A populated `frontend/public/assets` directory.
-   A Markdown list of the files you created.
```

---

## Agent 2: "The Archivist" (Data Assembly)

**Objective:** Create the structured JSON that powers the Agentic UI.

**Copy/Paste this Prompt:**
```text
You are the **Data Architect** for TrailWatch.
Your goal is to build the "Golden Dataset" JSON file.

**Context:**
We need a static JSON file that perfectly matches our Wireframe requirements.
Reference: `docs/UI/_!_SYNTHETIC_DATA_PLAN.md` (Section 3 & 4).

**Instructions:**
1.  **Read:** `docs/UI/_!_SYNTHETIC_DATA_PLAN.md`.
2.  **Create File:** `frontend/src/mocks/golden_dataset.json`.
3.  **Execution:**
    -   Construct the JSON object containing **24 Reports**.
    -   **Crucial:** You MUST map the `photo_url` fields to the actual filenames defined in "Patient 0's" plan (e.g., `/assets/photos/tree_obstruction_standard.jpg`).
    -   **Implement Pattern A (Cluster):** Create 4 reports with timestamps within 4 hours, lat/lng within 1 mile, all "TRACS 245".
    -   **Implement Pattern B (Consistency):** Create 10 reports assigned to District 3, 0 to District 4.
    -   **Implement Duplicate Pair:** Two reports referencing the duplicate photos, with `similarity_score: 0.94`.
4.  **Create Type Definition:**
    -   Create `frontend/src/types/generated_report.ts` that matches this JSON schema.

**Deliverable:**
-   `frontend/src/mocks/golden_dataset.json` (The Truth).
-   `frontend/src/types/generated_report.ts`.
```
