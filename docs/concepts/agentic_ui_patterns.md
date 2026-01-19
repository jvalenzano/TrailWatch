# Agentic UI Patterns & Architecture

**Concept Owner:** Jason Valenzano  
**Last Updated:** January 19, 2026

This document defines the core **"Agentic UI"** patterns used in TrailWatch. These patterns prioritize **proactive insights** and **transparent reasoning** over simple data display.

---

## The Philosophy
**1. Agentic ≠ Conversational:** We do not build chat bots. We build proactive dashboard cards.
**2. Transparency > Accuracy:** Every suggestion must show *why* it was made (the reasoning chain).
**3. Safety Circuit-Breakers:** High-risk actions (closures) must *never* be automated. They require friction.

---

## The 3-Panel Architecture
The Ranger Dashboard in **Agentic Mode** follows a strict 20/60/20 layout:

### 1. Left Panel: Spatial Insights (20%)
*   **Purpose:** The "Agent's Voice."
*   **Content:** Proactive cards (alerts, clusters, bias checks).
*   **Behavior:** Dynamic ordering based on priority. Dismissible.

### 2. Center Panel: Map (60%)
*   **Purpose:** The "Shared Context."
*   **Content:** MapLibre GL visualization.
*   **Behavior:** Agents highlight/pulse markers to draw attention to insights.

### 3. Right Panel: Action & Rationale (20%)
*   **Purpose:** The "Human Review."
*   **Content:** Structured reasoning logs, audit trails, and final approval buttons.
*   **Behavior:** Shows "Show Your Work" logic steps (Vision -> GPS -> Policy).

---

## Core Agentic Patterns

### Pattern A: Cluster Detection (The Proactive Nudge)
**Goal:** Surface invisible spatial trends.
*   **Trigger:** 3+ reports within X miles and Y hours.
*   **UI:** "Spatial Alert" card in Left Panel.
*   **Action:** Suggest "Combine Reports" or "Issue Area Notice."

### Pattern B: Consistency Check (The Bias Blindspot)
**Goal:** Detect unconscious human bias in assignment.
*   **Trigger:** Assignment ratio (Dist 3 vs Dist 4) deviates >2σ from norm.
*   **UI:** Non-accusatory "Consistency Check" card showing data viz.
*   **Action:** "View Coverage," "Acknowledge," or "Dismiss."

### Pattern C: Expertise Validation (The Tutor)
**Goal:** Help junior rangers learn from senior decisions.
*   **Trigger:** Ambiguous classification (confidence < 0.7).
*   **UI:** "Senior Ranger Logic" card: "Traditionally, Ranger Martinez classifies this as..."
*   **Action:** "Accept Precedent" or "Override & Record Reason."

### Pattern D: Duplicate Detection (The Efficiency Guard)
**Goal:** Prevent redundant work orders.
*   **Trigger:** Similarity score > 90% (Image + Text + GPS).
*   **UI:** Side-by-side comparison card.
*   **Action:** "Mark as Duplicate" or "Keep Separate."

---

## Safety Circuit-Breakers
**Definition:** Deliberate UI friction for high-stakes decisions.

**Example: Trail Closure**
1.  **Trigger:** Severity = Critical (TRACS 327 Bridge Failure).
2.  **UI:** "Approve" button **DISABLED**.
3.  **Mechanism:** Ranger must check 4 confirmation boxes and type a justification.
4.  **Result:** "Approve" button becomes enabled. 
