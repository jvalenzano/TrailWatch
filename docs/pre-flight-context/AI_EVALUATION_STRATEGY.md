# AI Trust & Evaluation Strategy ("The Brain")

**Version:** 1.0  
**Date:** January 16, 2026  
**Status:** DRAFT  

## 1. The Core Challenge
The US Forest Service (USFS) cannot rely on a "black box." To replace or augment manual ranger inspections, TrailWatch must prove **quantifiable accuracy** (e.g., "95% precision on safety hazards"). We are not just building an AI features; we are building an **Evaluation Machine**.

## 2. The "Golden Dataset" (Ground Truth)
We cannot evaluate without truth. We must curate a dataset of **100-200 representative reports** that have been manually verified by a human expert.

### Dataset Composition
| Category | Qty | Purpose |
| :--- | :--- | :--- |
| **Clear Positives** | 50 | High-quality photos + clear text (e.g., massive log across trail). Tests baseline competency. |
| **Edge Cases** | 50 | Poor lighting, blurry photos, ambiguous text (e.g., "trail is kinda bad"). Tests robustness. |
| **Negatives / Noise** | 30 | Selfies, landscapes, pictures of squirrels. Tests rejection capability. |
| **Adversarial** | 20 | "There is a fire" (when there isn't), fake reports. Tests safety filters. |

### Schema for Golden Data
```json
{
  "report_id": "gold_001",
  "input": {
    "image_uri": "gs://...",
    "text": "Big tree blocking path",
    "gps": "..."
  },
  "ground_truth": {
    "is_valid_hazard": true,
    "tracs_category": "CLEARING",
    "severity": "SEV3 (Impassable)",
    "reasoning": "Standard blowdown event"
  }
}
```

## 3. Automated Evaluation Pipeline ("AI-as-Judge")
We will use a **Model-Based Evaluation** pattern.
*   **Student Model:** The fast, cheaper model running in production (e.g., Gemini Flash).
*   **Teacher/Judge Model:** The smartest, most reasoning-heavy model available (e.g., Gemini Ultra or 1.5 Pro).

### The Pipeline
1.  **Run Batch:** Run the "Student" against the Golden Dataset.
2.  **Compare:** Compare Student output vs. Ground Truth.
3.  **Judge:** If output differs, the "Judge" model analyzes *why*.
    *   *Did the Student miss a detail?*
    *   *Is the Ground Truth ambiguous?*
4.  **Score:** Calculate Precision, Recall, and F1 Score for each TRACS category.

## 4. Confidence Thresholds & Routing
We do not treat all AI outputs equally. We route based on **Confidence Scores**.

| Confidence | Score Range | Action |
| :--- | :--- | :--- |
| **High (Auto-Pilot)** | > 0.85 | **Direct to Ranger Dashboard.** Tagged as "AI Verified." |
| **Medium (Review)** | 0.50 - 0.85 | **Route to Coordinator.** "AI thinks this is a Blowdown, please confirm." |
| **Low (Unsure)** | < 0.50 | **Flag for Triage.** "Unclear report." (or Auto-reject if < 0.20). |

## 5. Continuous Improvement (Data Flywheel)
1.  **Launch:** Start with initial Golden Dataset.
2.  **Operate:** Every time a human Ranger *corrects* the AI (e.g., changes "Drainage" to "Tread"), that report is **automatically added** to the Golden Dataset.
3.  **Retrain/Refine:** The Eval Pipeline runs nightly. If accuracy drops, we know immediately.

## 6. Implementation Plan
*   [ ] **Step 1:** Create `data/golden_dataset` folder.
*   [ ] **Step 2:** Write `scripts/generate_synthetic_gold.py` (use Gemini to hallucinate test cases first!).
*   [ ] **Step 3:** Build `eval_pipeline.py` using Vertex AI Evaluation API.
