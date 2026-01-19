import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { FeatureGate } from './FeatureGate';
import { useUIMode } from '../../hooks/useUIMode';

// Mock the hook
vi.mock('../../hooks/useUIMode', () => ({
    useUIMode: vi.fn(),
}));

describe('FeatureGate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children when feature is enabled', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: { enable_confidence_indicators: true }
            }
        } as any);

        const { getByText } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(getByText('Enabled Content')).toBeInTheDocument();
    });

    it('renders fallback when feature is disabled', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: { enable_confidence_indicators: false }
            }
        } as any);

        const { getByText, queryByText } = render(
            <FeatureGate feature="enable_confidence_indicators" fallback={<div>Fallback Content</div>}>
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(queryByText('Enabled Content')).not.toBeInTheDocument();
        expect(getByText('Fallback Content')).toBeInTheDocument();
    });

    it('renders nothing when feature is disabled and no fallback provided', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: { enable_confidence_indicators: false }
            }
        } as any);

        const { container } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('handles undefined features by failing closed', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: {} // Missing feature
            }
        } as any);

        const { container } = render(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Test</div>
            </FeatureGate>
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders fallback and logs error when useUIMode throws', () => {
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
        vi.mocked(useUIMode).mockImplementation(() => {
            throw new Error('Router error');
        });

        const { getByText } = render(
            <FeatureGate feature="enable_confidence_indicators" fallback={<div>Error Fallback</div>}>
                <div>Test</div>
            </FeatureGate>
        );

        expect(getByText('Error Fallback')).toBeInTheDocument();
        expect(consoleSpy).toHaveBeenCalledWith('[FeatureGate] Failed to resolve mode:', expect.any(Error));
        consoleSpy.mockRestore();
    });
});
