# TrailWatch Agentic UI: Wireframe Catalog
**Status:** Approved for Development | **Spec:** [UI_SPECIFICATION.md](UI_SPECIFICATION.md)
**Date:** January 19, 2026

This catalog indexes the 10 core wireframes defining the TrailWatch Agentic UI.

## Phase 1: Core Dashboard & Baseline
| Wireframe | Description | File |
| :--- | :--- | :--- |
| **WF1: Spatial Baseline** | Standard dashboard state showing 3-panel layout, colored markers, and pattern insights list (no widgets). | ![WF1](wireframes/wf1_dashboard_baseline_v2.png) |
| **WF2: Cluster Alert** | Major "Pattern A" alert showing agentic cluster detection with red pulsing radius and context-aware assignment panel. | ![WF2](wireframes/wf2_dashboard_alert_v2.png) |
| **WF3: Report Detail** | High-confidence report view with realistic photo, AI classification (0.89), and reasoned assignment suggestion. | ![WF3](wireframes/wf3_report_detail_high_conf_v2.png) |

## Phase 2: Deep Dives (Trust & Workflow)
| Wireframe | Description | File |
| :--- | :--- | :--- |
| **WF4: Reasoning Expanded** | The "Trust" view showing the 4-step logic chain (Vision -> GPS -> Size -> Class) transparently. | ![WF4](wireframes/wf4_report_detail_reasoning.png) |
| **WF5: Duplicate Detection** | Side-by-side comparison card with similarity score (94%) and visual evidence verification. | ![WF5](wireframes/wf5_duplicate_detection.png) |
| **WF6: Batch Assignment** | Modal workflow for assigning multiple reports to a crew with route optimization metrics. | ![WF6](wireframes/wf6_batch_assignment.png) |

## Phase 3: Safety & Governance
| Wireframe | Description | File |
| :--- | :--- | :--- |
| **WF7: High-Risk Decision** | "Circuit Breaker" pattern with mandatory checklist and justification for critical hazards. | ![WF7](wireframes/wf7_high_risk_decision.png) |
| **WF8: Consistency Check** | "Pattern B" bias detection showing assignment anomalies without accusation. | ![WF8](wireframes/wf8_consistency_check.png) |
| **WF9: Offline Mode** | Tablet view showing stale data warnings, cached badges, and sync queue workflow. | ![WF9](wireframes/wf9_offline_mode.png) |
| **WF10: Feature Admin** | Governance panel for enabling/disabling agentic features based on Ranger trust metrics. | ![WF10](wireframes/wf10_feature_flag_admin.png) |

## Implementation Notes
- **Theme:** Dark Mode (Gray #1a1a1a backgrounds) only.
- **Typography:** Inter (Google Fonts).
- **Map Library:** MapLibre GL with custom dark style.
- **Icons:** Lucide React or similar clean outline set.
