import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FeatureGate } from './FeatureGate';
import { useUIMode } from '../../hooks/useUIMode';
import type { UIMode } from '../../config/ui-modes';

// Mock the hook
vi.mock('../../hooks/useUIMode', () => ({
    useUIMode: vi.fn(),
}));

// Helper to create a partial mock mode
function createMockMode(features: Partial<UIMode['features']>): { mode: UIMode } {
    return {
        mode: {
            name: 'moderate',
            label: 'Moderate',
            description: 'Test mode',
            features: {
                enable_confidence_indicators: false,
                enable_reasoning_panel: false,
                enable_ai_attribution_badges: false,
                mapPrimary: false,
                spatialInsights: false,
                batchOperations: false,
                streamingExtraction: false,
                ...features,
            },
        },
    };
}

describe('FeatureGate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children when feature is enabled', () => {
        vi.mocked(useUIMode).mockReturnValue(createMockMode({ enable_confidence_indicators: true }));

        const { getByText } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(getByText('Enabled Content')).toBeInTheDocument();
    });

    it('renders fallback when feature is disabled', () => {
        vi.mocked(useUIMode).mockReturnValue(createMockMode({ enable_confidence_indicators: false }));

        const { getByText, queryByText } = render(
            <FeatureGate feature="enable_confidence_indicators" fallback={<div>Fallback Content</div>}>
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(queryByText('Enabled Content')).not.toBeInTheDocument();
        expect(getByText('Fallback Content')).toBeInTheDocument();
    });

    it('renders nothing when feature is disabled and no fallback provided', () => {
        vi.mocked(useUIMode).mockReturnValue(createMockMode({ enable_confidence_indicators: false }));

        const { container } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('handles undefined features by failing closed', () => {
        vi.mocked(useUIMode).mockReturnValue(createMockMode({}));

        const { container } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Test</div>
            </FeatureGate>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders children for multiple enabled features', () => {
        vi.mocked(useUIMode).mockReturnValue(createMockMode({
            enable_confidence_indicators: true,
            enable_reasoning_panel: true,
        }));

        const { getByText } = render(
            <>
                <FeatureGate feature="enable_confidence_indicators">
                    <div>Confidence</div>
                </FeatureGate>
                <FeatureGate feature="enable_reasoning_panel">
                    <div>Reasoning</div>
                </FeatureGate>
            </>
        );

        expect(getByText('Confidence')).toBeInTheDocument();
        expect(getByText('Reasoning')).toBeInTheDocument();
    });
});
