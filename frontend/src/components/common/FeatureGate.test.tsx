import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeatureGate } from './FeatureGate';
import { UIModeProvider } from '../../contexts/UIModeContext';
import type { UIFeatures } from '../../config/ui-modes';

// Helper to render with provider
function renderWithProvider(
    ui: React.ReactElement,
    options: {
        mode?: string;
        initialOverrides?: Partial<UIFeatures>;
    } = {}
) {
    const { mode = 'traditional', initialOverrides } = options;
    return render(
        <MemoryRouter initialEntries={[`/?mode=${mode}`]}>
            <UIModeProvider initialOverrides={initialOverrides}>
                {ui}
            </UIModeProvider>
        </MemoryRouter>
    );
}

describe('FeatureGate', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders children when feature is enabled', () => {
        const { getByText } = renderWithProvider(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>,
            { mode: 'agentic' } // agentic mode has confidence enabled
        );

        expect(getByText('Enabled Content')).toBeInTheDocument();
    });

    it('renders fallback when feature is disabled', () => {
        const { getByText, queryByText } = renderWithProvider(
            <FeatureGate feature="enable_confidence_indicators" fallback={<div>Fallback Content</div>}>
                <div>Enabled Content</div>
            </FeatureGate>,
            { mode: 'traditional' } // traditional mode has confidence disabled
        );

        expect(queryByText('Enabled Content')).not.toBeInTheDocument();
        expect(getByText('Fallback Content')).toBeInTheDocument();
    });

    it('renders nothing when feature is disabled and no fallback provided', () => {
        const { container } = renderWithProvider(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled Content</div>
            </FeatureGate>,
            { mode: 'traditional' }
        );

        expect(container.textContent).toBe('');
    });

    it('respects feature overrides', () => {
        // Traditional mode has confidence disabled, but we override it to true
        const { getByText } = renderWithProvider(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Enabled via Override</div>
            </FeatureGate>,
            {
                mode: 'traditional',
                initialOverrides: { enable_confidence_indicators: true },
            }
        );

        expect(getByText('Enabled via Override')).toBeInTheDocument();
    });

    it('override can disable feature that mode enables', () => {
        // Agentic mode has confidence enabled, but we override it to false
        const { container } = renderWithProvider(
            <FeatureGate feature="enable_confidence_indicators">
                <div>Should Not Render</div>
            </FeatureGate>,
            {
                mode: 'agentic',
                initialOverrides: { enable_confidence_indicators: false },
            }
        );

        expect(container.textContent).toBe('');
    });

    it('renders children for multiple enabled features', () => {
        const { getByText } = renderWithProvider(
            <>
                <FeatureGate feature="enable_confidence_indicators">
                    <div>Confidence</div>
                </FeatureGate>
                <FeatureGate feature="enable_reasoning_panel">
                    <div>Reasoning</div>
                </FeatureGate>
            </>,
            { mode: 'agentic' }
        );

        expect(getByText('Confidence')).toBeInTheDocument();
        expect(getByText('Reasoning')).toBeInTheDocument();
    });

    it('fails closed when no provider is present', () => {
        // Suppress console.warn for this test
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const { container } = render(
            <MemoryRouter>
                <FeatureGate feature="enable_confidence_indicators">
                    <div>Should Not Render</div>
                </FeatureGate>
            </MemoryRouter>
        );

        expect(container.textContent).toBe('');
        expect(consoleSpy).toHaveBeenCalledWith(
            '[FeatureGate] No UIModeContext found, failing closed'
        );

        consoleSpy.mockRestore();
    });

    it('renders fallback when no provider and fallback is provided', () => {
        // Suppress console.warn for this test
        const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

        const { getByText } = render(
            <MemoryRouter>
                <FeatureGate
                    feature="enable_confidence_indicators"
                    fallback={<div>Fallback</div>}
                >
                    <div>Should Not Render</div>
                </FeatureGate>
            </MemoryRouter>
        );

        expect(getByText('Fallback')).toBeInTheDocument();
        consoleSpy.mockRestore();
    });
});
