import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ModeSwitcher } from './ModeSwitcher';
import { useUIMode } from '../../hooks/useUIMode';
import type { UIModeName } from '../../config/ui-modes';

expect.extend(toHaveNoViolations);

// Mock the hook
vi.mock('../../hooks/useUIMode', () => ({
    useUIMode: vi.fn(),
}));


function createMockMode(modeName: UIModeName) {
    return {
        mode: {
            name: modeName,
            label: modeName.charAt(0).toUpperCase() + modeName.slice(1),
            description: `${modeName} mode`,
            features: {
                enable_confidence_indicators: modeName !== 'traditional',
                enable_reasoning_panel: modeName !== 'traditional',
                enable_ai_attribution_badges: modeName !== 'traditional',
                mapPrimary: modeName === 'agentic',
                spatialInsights: modeName === 'agentic',
                batchOperations: modeName === 'agentic',
                streamingExtraction: modeName === 'agentic',
            },
        },
        modeName,
        setMode: vi.fn(),
    };
}

describe('ModeSwitcher', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Enable dev mode by default for tests
        vi.stubEnv('DEV', true);
    });

    afterEach(() => {
        vi.unstubAllEnvs();
    });

    describe('rendering', () => {
        it('renders floating button in bottom-right corner', () => {
            vi.mocked(useUIMode).mockReturnValue(createMockMode('traditional'));

            render(<ModeSwitcher />);

            const button = screen.getByRole('button', { name: /switch ui mode/i });
            expect(button).toBeInTheDocument();
            expect(button).toHaveClass('fixed', 'bottom-4', 'right-4', 'z-50');
        });

        it('displays current mode name', () => {
            vi.mocked(useUIMode).mockReturnValue(createMockMode('moderate'));

            render(<ModeSwitcher />);

            expect(screen.getByText('moderate')).toBeInTheDocument();
        });
    });

    describe('mode cycling', () => {
        it('cycles from traditional to moderate on click', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('traditional'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            const button = screen.getByRole('button', { name: /switch ui mode/i });
            fireEvent.click(button);

            expect(mockSetMode).toHaveBeenCalledWith('moderate');
        });

        it('cycles from moderate to agentic on click', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('moderate'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            const button = screen.getByRole('button', { name: /switch ui mode/i });
            fireEvent.click(button);

            expect(mockSetMode).toHaveBeenCalledWith('agentic');
        });

        it('cycles from agentic back to traditional on click', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('agentic'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            const button = screen.getByRole('button', { name: /switch ui mode/i });
            fireEvent.click(button);

            expect(mockSetMode).toHaveBeenCalledWith('traditional');
        });
    });

    describe('keyboard shortcut', () => {
        it('cycles mode on Ctrl+M keydown', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('traditional'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            fireEvent.keyDown(document, { key: 'm', ctrlKey: true });

            expect(mockSetMode).toHaveBeenCalledWith('moderate');
        });

        it('cycles mode on Meta+M (Mac) keydown', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('traditional'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            fireEvent.keyDown(document, { key: 'm', metaKey: true });

            expect(mockSetMode).toHaveBeenCalledWith('moderate');
        });

        it('does not cycle mode on plain M key', () => {
            const mockSetMode = vi.fn();
            vi.mocked(useUIMode).mockReturnValue({
                ...createMockMode('traditional'),
                setMode: mockSetMode,
            });

            render(<ModeSwitcher />);

            fireEvent.keyDown(document, { key: 'm' });

            expect(mockSetMode).not.toHaveBeenCalled();
        });
    });

    describe('dev-only behavior', () => {
        it('renders nothing in production mode', () => {
            vi.stubEnv('DEV', false);
            vi.mocked(useUIMode).mockReturnValue(createMockMode('traditional'));

            const { container } = render(<ModeSwitcher />);

            expect(container).toBeEmptyDOMElement();
        });

        it('renders in development mode', () => {
            vi.stubEnv('DEV', true);
            vi.mocked(useUIMode).mockReturnValue(createMockMode('traditional'));

            render(<ModeSwitcher />);

            expect(screen.getByRole('button')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('has proper aria-label', () => {
            vi.mocked(useUIMode).mockReturnValue(createMockMode('traditional'));

            render(<ModeSwitcher />);

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Switch UI mode (Ctrl+M)');
        });

        it('passes axe accessibility audit', async () => {
            vi.mocked(useUIMode).mockReturnValue(createMockMode('traditional'));

            const { container } = render(<ModeSwitcher />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
