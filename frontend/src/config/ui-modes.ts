/**
 * UI Mode Configuration
 *
 * Defines the three UI modes for progressive disclosure of AI capabilities:
 * - traditional: Basic triage workflow, AI hidden
 * - moderate: AI transparency layer visible (confidence, reasoning)
 * - agentic: Full AI capabilities, map-first layout, spatial insights
 */

export type UIModeName = 'traditional' | 'moderate' | 'agentic';

export interface UIFeatures {
    /** Show AI confidence indicators on reports */
    enable_confidence_indicators: boolean;
    /** Show reasoning panel explaining AI decisions */
    enable_reasoning_panel: boolean;
    /** Show AI attribution badges on data */
    enable_ai_attribution_badges: boolean;
    /** Use map as primary UI element (vs list-first) */
    mapPrimary: boolean;
    /** Enable spatial insights sidebar */
    spatialInsights: boolean;
    /** Enable batch operations */
    batchOperations: boolean;
    /** Enable streaming extraction view */
    streamingExtraction: boolean;
    /** Enable user feedback on AI decisions */
    enable_feedback: boolean;
    /** Enable audit logging of AI actions */
    enable_audit_logging: boolean;
    /** Enable audit log viewer panel */
    enable_audit_viewer: boolean;
}

export interface UIMode {
    name: UIModeName;
    label: string;
    description: string;
    features: UIFeatures;
    _metadata?: {
        created: string;
        owner: string;
        sunsetDate: string;
        purpose: string;
    };
}

const PHASE_3_METADATA = {
    created: '2026-01-18',
    owner: 'jvalenzano',
    sunsetDate: '2026-04-18',
    purpose: 'Phase 3 AI transparency rollout',
};

export const UI_MODES: Record<UIModeName, UIMode> = {
    traditional: {
        name: 'traditional',
        label: 'Traditional',
        description: 'Basic triage workflow without AI visibility',
        features: {
            enable_confidence_indicators: false,
            enable_reasoning_panel: false,
            enable_ai_attribution_badges: false,
            mapPrimary: false,
            spatialInsights: false,
            batchOperations: false,
            streamingExtraction: false,
            enable_feedback: false,
            enable_audit_logging: false,
            enable_audit_viewer: false,
        },
    },
    moderate: {
        name: 'moderate',
        label: 'Moderate',
        description: 'AI transparency layer visible',
        features: {
            enable_confidence_indicators: true,
            enable_reasoning_panel: true,
            enable_ai_attribution_badges: true,
            mapPrimary: false,
            spatialInsights: false,
            batchOperations: false,
            streamingExtraction: false,
            enable_feedback: true,
            enable_audit_logging: true,
            enable_audit_viewer: true,
        },
        _metadata: PHASE_3_METADATA,
    },
    agentic: {
        name: 'agentic',
        label: 'Agentic',
        description: 'Full AI capabilities with map-first layout',
        features: {
            enable_confidence_indicators: true,
            enable_reasoning_panel: true,
            enable_ai_attribution_badges: true,
            mapPrimary: true,
            spatialInsights: true,
            batchOperations: true,
            streamingExtraction: true,
            enable_feedback: true,
            enable_audit_logging: true,
            enable_audit_viewer: true,
        },
        _metadata: PHASE_3_METADATA,
    },
};

export const DEFAULT_MODE: UIModeName = 'traditional';
