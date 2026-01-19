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
    showConfidence: boolean;
    /** Show reasoning panel explaining AI decisions */
    showReasoning: boolean;
    /** Show "AI Extracted" badges on data */
    showAIBadges: boolean;
    /** Use map as primary UI element (vs list-first) */
    mapPrimary: boolean;
    /** Enable spatial insights sidebar */
    spatialInsights: boolean;
    /** Enable batch operations */
    batchOperations: boolean;
    /** Enable streaming extraction view */
    streamingExtraction: boolean;
}

export interface UIMode {
    name: UIModeName;
    label: string;
    description: string;
    features: UIFeatures;
}

export const UI_MODES: Record<UIModeName, UIMode> = {
    traditional: {
        name: 'traditional',
        label: 'Traditional',
        description: 'Basic triage workflow without AI visibility',
        features: {
            showConfidence: false,
            showReasoning: false,
            showAIBadges: false,
            mapPrimary: false,
            spatialInsights: false,
            batchOperations: false,
            streamingExtraction: false,
        },
    },
    moderate: {
        name: 'moderate',
        label: 'Moderate',
        description: 'AI transparency layer visible',
        features: {
            showConfidence: true,
            showReasoning: true,
            showAIBadges: true,
            mapPrimary: false,
            spatialInsights: false,
            batchOperations: false,
            streamingExtraction: false,
        },
    },
    agentic: {
        name: 'agentic',
        label: 'Agentic',
        description: 'Full AI capabilities with map-first layout',
        features: {
            showConfidence: true,
            showReasoning: true,
            showAIBadges: true,
            mapPrimary: true,
            spatialInsights: true,
            batchOperations: true,
            streamingExtraction: true,
        },
    },
};

export const DEFAULT_MODE: UIModeName = 'traditional';
