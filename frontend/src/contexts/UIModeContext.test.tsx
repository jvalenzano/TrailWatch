import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import {
    UIModeProvider,
} from './UIModeContext';
import {
    useUIModeContext,
    useUIModeContextSafe,
} from '../hooks/useUIMode';

// Test component that consumes the context
function TestConsumer() {
    const { mode, modeName, isFeatureEnabled, overrides } = useUIModeContext();
    return (
        <div>
            <span data-testid="mode-name">{modeName}</span>
            <span data-testid="mode-label">{mode.label}</span>
            <span data-testid="confidence-enabled">
                {isFeatureEnabled('enable_confidence_indicators').toString()}
            </span>
            <span data-testid="overrides">{JSON.stringify(overrides)}</span>
        </div>
    );
}

// Test component that uses setMode
function TestModeChanger() {
    const { modeName, setMode } = useUIModeContext();
    return (
        <div>
            <span data-testid="current-mode">{modeName}</span>
            <button onClick={() => setMode('agentic')}>Switch to Agentic</button>
            <button onClick={() => setMode('traditional')}>Switch to Traditional</button>
        </div>
    );
}

// Test component that uses overrides
function TestOverrideController() {
    const { isFeatureEnabled, setOverride, clearOverrides, overrides } = useUIModeContext();
    return (
        <div>
            <span data-testid="confidence-enabled">
                {isFeatureEnabled('enable_confidence_indicators').toString()}
            </span>
            <span data-testid="overrides">{JSON.stringify(overrides)}</span>
            <button onClick={() => setOverride('enable_confidence_indicators', true)}>
                Enable Confidence
            </button>
            <button onClick={() => setOverride('enable_confidence_indicators', false)}>
                Disable Confidence
            </button>
            <button onClick={() => clearOverrides()}>Clear Overrides</button>
        </div>
    );
}

// Test component for safe context hook
function TestSafeConsumer() {
    const context = useUIModeContextSafe();
    return (
        <div data-testid="safe-context">
            {context ? context.modeName : 'no-context'}
        </div>
    );
}

// Helper to render with router
function renderWithRouter(ui: React.ReactElement, initialEntries: string[] = ['/']) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            {ui}
        </MemoryRouter>
    );
}

describe('UIModeContext', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('initial mode from URL', () => {
        it('defaults to traditional mode when no URL param', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>
            );

            expect(screen.getByTestId('mode-name')).toHaveTextContent('traditional');
            expect(screen.getByTestId('mode-label')).toHaveTextContent('Traditional');
        });

        it('reads agentic mode from URL param', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=agentic']
            );

            expect(screen.getByTestId('mode-name')).toHaveTextContent('agentic');
            expect(screen.getByTestId('mode-label')).toHaveTextContent('Agentic');
        });

        it('reads moderate mode from URL param', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=moderate']
            );

            expect(screen.getByTestId('mode-name')).toHaveTextContent('moderate');
        });

        it('falls back to traditional for invalid mode param', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=invalid']
            );

            expect(screen.getByTestId('mode-name')).toHaveTextContent('traditional');
        });
    });

    describe('setMode', () => {
        it('changes mode when setMode is called', async () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestModeChanger />
                </UIModeProvider>,
                ['/?mode=traditional']
            );

            expect(screen.getByTestId('current-mode')).toHaveTextContent('traditional');

            await act(async () => {
                screen.getByText('Switch to Agentic').click();
            });

            expect(screen.getByTestId('current-mode')).toHaveTextContent('agentic');
        });
    });

    describe('isFeatureEnabled', () => {
        it('returns false for disabled features in traditional mode', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=traditional']
            );

            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('false');
        });

        it('returns true for enabled features in agentic mode', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=agentic']
            );

            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('true');
        });
    });

    describe('overrides', () => {
        it('starts with empty overrides', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestConsumer />
                </UIModeProvider>
            );

            expect(screen.getByTestId('overrides')).toHaveTextContent('{}');
        });

        it('accepts initial overrides via prop', () => {
            renderWithRouter(
                <UIModeProvider initialOverrides={{ enable_confidence_indicators: true }}>
                    <TestConsumer />
                </UIModeProvider>,
                ['/?mode=traditional']
            );

            // Traditional mode has confidence disabled, but override enables it
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('true');
        });

        it('setOverride adds an override', async () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestOverrideController />
                </UIModeProvider>,
                ['/?mode=traditional']
            );

            // Initially disabled (traditional mode)
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('false');

            await act(async () => {
                screen.getByText('Enable Confidence').click();
            });

            // Now enabled via override
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('true');
            expect(screen.getByTestId('overrides')).toHaveTextContent(
                '{"enable_confidence_indicators":true}'
            );
        });

        it('overrides take precedence over mode defaults', async () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestOverrideController />
                </UIModeProvider>,
                ['/?mode=agentic']
            );

            // Initially enabled (agentic mode)
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('true');

            await act(async () => {
                screen.getByText('Disable Confidence').click();
            });

            // Now disabled via override (overrides agentic default)
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('false');
        });

        it('clearOverrides removes all overrides', async () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestOverrideController />
                </UIModeProvider>,
                ['/?mode=traditional']
            );

            // Add an override
            await act(async () => {
                screen.getByText('Enable Confidence').click();
            });
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('true');

            // Clear overrides
            await act(async () => {
                screen.getByText('Clear Overrides').click();
            });

            // Back to mode default
            expect(screen.getByTestId('confidence-enabled')).toHaveTextContent('false');
            expect(screen.getByTestId('overrides')).toHaveTextContent('{}');
        });
    });

    describe('useUIModeContext', () => {
        it('throws when used outside provider', () => {
            // Suppress console.error for this test
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

            expect(() => {
                renderWithRouter(<TestConsumer />);
            }).toThrow('useUIModeContext must be used within a UIModeProvider');

            consoleSpy.mockRestore();
        });
    });

    describe('useUIModeContextSafe', () => {
        it('returns null when used outside provider', () => {
            renderWithRouter(<TestSafeConsumer />);

            expect(screen.getByTestId('safe-context')).toHaveTextContent('no-context');
        });

        it('returns context when used inside provider', () => {
            renderWithRouter(
                <UIModeProvider>
                    <TestSafeConsumer />
                </UIModeProvider>
            );

            expect(screen.getByTestId('safe-context')).toHaveTextContent('traditional');
        });
    });
});
