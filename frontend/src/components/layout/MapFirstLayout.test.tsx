import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { MapFirstLayout } from './MapFirstLayout';
import { useBreakpoint } from '../../hooks/useBreakpoint';

expect.extend(toHaveNoViolations);

// Mock the useBreakpoint hook
vi.mock('../../hooks/useBreakpoint');
const mockUseBreakpoint = vi.mocked(useBreakpoint);

// Default desktop mock
const defaultBreakpoint = {
    breakpoint: 'desktop' as const,
    isWide: false,
    isDesktop: true,
    isTablet: false,
    isMobile: false,
    isAtLeast: vi.fn((bp) => bp === 'desktop' || bp === 'tablet' || bp === 'mobile'),
    width: 1024,
};

describe('MapFirstLayout', () => {
    beforeEach(() => {
        mockUseBreakpoint.mockReturnValue(defaultBreakpoint);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render all three panels with their content', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insight Content</div>}
                    mapPanel={<div>Map Content</div>}
                    reportPanel={<div>Report Content</div>}
                />
            );

            expect(screen.getByText('Insight Content')).toBeInTheDocument();
            expect(screen.getByText('Map Content')).toBeInTheDocument();
            expect(screen.getByText('Report Content')).toBeInTheDocument();
        });

        it('should render the layout container with correct test id', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            expect(screen.getByTestId('map-first-layout')).toBeInTheDocument();
        });

        it('should render all panels with correct test ids', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            expect(screen.getByTestId('insight-panel')).toBeInTheDocument();
            expect(screen.getByTestId('map-panel')).toBeInTheDocument();
            expect(screen.getByTestId('report-panel')).toBeInTheDocument();
        });
    });

    describe('desktop layout (20/60/20)', () => {
        beforeEach(() => {
            mockUseBreakpoint.mockReturnValue({
                ...defaultBreakpoint,
                breakpoint: 'desktop',
                isDesktop: true,
                isAtLeast: vi.fn((bp) => bp === 'desktop' || bp === 'tablet' || bp === 'mobile'),
            });
        });

        it('should apply horizontal flex layout', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            expect(container).toHaveClass('flex');
            expect(container).not.toHaveClass('flex-col');
        });

        it('should apply w-1/5 to insight panel (left sidebar)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const insightPanel = screen.getByTestId('insight-panel');
            expect(insightPanel).toHaveClass('w-1/5');
        });

        it('should apply w-3/5 to map panel (center)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const mapPanel = screen.getByTestId('map-panel');
            expect(mapPanel).toHaveClass('w-3/5');
        });

        it('should apply w-1/5 to report panel (right sidebar)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const reportPanel = screen.getByTestId('report-panel');
            expect(reportPanel).toHaveClass('w-1/5');
        });
    });

    describe('wide layout (20/60/20)', () => {
        beforeEach(() => {
            mockUseBreakpoint.mockReturnValue({
                ...defaultBreakpoint,
                breakpoint: 'wide',
                isWide: true,
                isDesktop: false,
                isAtLeast: vi.fn(() => true),
                width: 1280,
            });
        });

        it('should apply horizontal flex layout on wide screens', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            expect(container).toHaveClass('flex');
            expect(container).not.toHaveClass('flex-col');
        });

        it('should maintain 20/60/20 ratios on wide screens', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            expect(screen.getByTestId('insight-panel')).toHaveClass('w-1/5');
            expect(screen.getByTestId('map-panel')).toHaveClass('w-3/5');
            expect(screen.getByTestId('report-panel')).toHaveClass('w-1/5');
        });
    });

    describe('tablet layout (vertical stack)', () => {
        beforeEach(() => {
            mockUseBreakpoint.mockReturnValue({
                ...defaultBreakpoint,
                breakpoint: 'tablet',
                isDesktop: false,
                isTablet: true,
                isAtLeast: vi.fn((bp) => bp === 'tablet' || bp === 'mobile'),
                width: 768,
            });
        });

        it('should apply vertical flex-col layout on tablet', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            expect(container).toHaveClass('flex-col');
        });

        it('should stack panels vertically: Map first, then Insights, then Reports', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            const children = Array.from(container.children);

            // Map should come first in vertical stack
            expect(children[0]).toHaveAttribute('data-testid', 'map-panel');
            expect(children[1]).toHaveAttribute('data-testid', 'insight-panel');
            expect(children[2]).toHaveAttribute('data-testid', 'report-panel');
        });
    });

    describe('mobile layout (vertical stack)', () => {
        beforeEach(() => {
            mockUseBreakpoint.mockReturnValue({
                ...defaultBreakpoint,
                breakpoint: 'mobile',
                isDesktop: false,
                isMobile: true,
                isAtLeast: vi.fn((bp) => bp === 'mobile'),
                width: 375,
            });
        });

        it('should apply vertical flex-col layout on mobile', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            expect(container).toHaveClass('flex-col');
        });

        it('should stack panels vertically: Map first, then Insights, then Reports', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const container = screen.getByTestId('map-first-layout');
            const children = Array.from(container.children);

            expect(children[0]).toHaveAttribute('data-testid', 'map-panel');
            expect(children[1]).toHaveAttribute('data-testid', 'insight-panel');
            expect(children[2]).toHaveAttribute('data-testid', 'report-panel');
        });
    });

    describe('semantic HTML', () => {
        it('should use aside element for insight panel (left sidebar)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const insightPanel = screen.getByTestId('insight-panel');
            expect(insightPanel.tagName).toBe('ASIDE');
        });

        it('should use main element for map panel (center)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const mapPanel = screen.getByTestId('map-panel');
            expect(mapPanel.tagName).toBe('MAIN');
        });

        it('should use aside element for report panel (right sidebar)', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const reportPanel = screen.getByTestId('report-panel');
            expect(reportPanel.tagName).toBe('ASIDE');
        });
    });

    describe('accessibility', () => {
        it('should have aria-label on insight panel', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const insightPanel = screen.getByTestId('insight-panel');
            expect(insightPanel).toHaveAttribute('aria-label', 'Insights panel');
        });

        it('should have aria-label on map panel', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const mapPanel = screen.getByTestId('map-panel');
            expect(mapPanel).toHaveAttribute('aria-label', 'Map panel');
        });

        it('should have aria-label on report panel', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const reportPanel = screen.getByTestId('report-panel');
            expect(reportPanel).toHaveAttribute('aria-label', 'Reports panel');
        });

        it('should have no axe accessibility violations', async () => {
            const { container } = render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('dark mode styling', () => {
        it('should apply dark background to sidebars', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const insightPanel = screen.getByTestId('insight-panel');
            const reportPanel = screen.getByTestId('report-panel');

            expect(insightPanel).toHaveClass('bg-gray-900/50');
            expect(reportPanel).toHaveClass('bg-gray-900/50');
        });

        it('should apply border styling to sidebars', () => {
            render(
                <MapFirstLayout
                    insightPanel={<div>Insights</div>}
                    mapPanel={<div>Map</div>}
                    reportPanel={<div>Reports</div>}
                />
            );

            const insightPanel = screen.getByTestId('insight-panel');
            const reportPanel = screen.getByTestId('report-panel');

            expect(insightPanel).toHaveClass('border-gray-700');
            expect(reportPanel).toHaveClass('border-gray-700');
        });
    });
});
