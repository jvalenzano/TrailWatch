import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SpatialInsightsSidebar } from './SpatialInsightsSidebar';
import { useSpatialInsights } from '../../hooks/useSpatialInsights';
import type { SpatialInsight } from '../../types/spatial';

expect.extend(toHaveNoViolations);

// Mock the useSpatialInsights hook
vi.mock('../../hooks/useSpatialInsights');
const mockUseSpatialInsights = vi.mocked(useSpatialInsights);

// Mock the InsightCard to simplify testing
vi.mock('../insights/InsightCard', () => ({
    InsightCard: ({ insight, isSelected, onSelect }: {
        insight: SpatialInsight;
        isSelected: boolean;
        onSelect: () => void;
    }) => (
        <button
            type="button"
            data-testid={`insight-card-${insight.id}`}
            data-selected={isSelected}
            onClick={onSelect}
        >
            {insight.title}
        </button>
    ),
}));

// Create a wrapper with QueryClient for tests
function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

const mockInsights: SpatialInsight[] = [
    {
        id: 'ins-cluster-001',
        type: 'cluster',
        title: 'Hazard Cluster Detected',
        description: '4 obstructions on Wonderland Trail',
        location: { type: 'Point', coordinates: [-121.760, 46.852] },
        severity: 'high',
        report_ids: ['TR-001', 'TR-002', 'TR-003', 'TR-004'],
        metadata: {
            radius_miles: 0.8,
            time_span_hours: 4,
            weather_correlation: 'Storm winds 35 mph',
            report_count: 4,
        },
    },
    {
        id: 'ins-bias-001',
        type: 'consistency_check',
        title: 'Assignment Bias Detected',
        description: 'District 3 overloaded',
        location: { type: 'Point', coordinates: [-121.720, 46.880] },
        severity: 'medium',
        report_ids: ['TR-005', 'TR-006'],
        metadata: {
            check_type: 'district_bias',
            affected_districts: ['District 3', 'District 4'],
            deviation_percentage: 35,
        },
    },
];

describe('SpatialInsightsSidebar', () => {
    beforeEach(() => {
        mockUseSpatialInsights.mockReturnValue({
            data: mockInsights,
            isLoading: false,
            error: null,
            isError: false,
        } as ReturnType<typeof useSpatialInsights>);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render the sidebar container', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByTestId('spatial-insights-sidebar')).toBeInTheDocument();
        });

        it('should render the header with title', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByRole('heading', { name: /spatial insights/i })).toBeInTheDocument();
        });

        it('should render all insights from the hook', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByTestId('insight-card-ins-cluster-001')).toBeInTheDocument();
            expect(screen.getByTestId('insight-card-ins-bias-001')).toBeInTheDocument();
        });

        it('should render insight titles', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByText('Hazard Cluster Detected')).toBeInTheDocument();
            expect(screen.getByText('Assignment Bias Detected')).toBeInTheDocument();
        });
    });

    describe('loading state', () => {
        it('should show loading skeleton when loading', () => {
            mockUseSpatialInsights.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
                isError: false,
            } as ReturnType<typeof useSpatialInsights>);

            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByTestId('insights-loading')).toBeInTheDocument();
        });
    });

    describe('empty state', () => {
        it('should show empty state when no insights', () => {
            mockUseSpatialInsights.mockReturnValue({
                data: [],
                isLoading: false,
                error: null,
                isError: false,
            } as ReturnType<typeof useSpatialInsights>);

            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByTestId('insights-empty')).toBeInTheDocument();
            expect(screen.getByText(/no insights/i)).toBeInTheDocument();
        });
    });

    describe('error state', () => {
        it('should show error message when fetch fails', () => {
            mockUseSpatialInsights.mockReturnValue({
                data: undefined,
                isLoading: false,
                error: new Error('Failed to fetch'),
                isError: true,
            } as ReturnType<typeof useSpatialInsights>);

            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByTestId('insights-error')).toBeInTheDocument();
        });
    });

    describe('selection', () => {
        it('should track selected insight', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            const clusterCard = screen.getByTestId('insight-card-ins-cluster-001');
            fireEvent.click(clusterCard);

            expect(clusterCard).toHaveAttribute('data-selected', 'true');
        });

        it('should call onInsightSelect callback when provided', () => {
            const onInsightSelect = vi.fn();
            render(
                <SpatialInsightsSidebar onInsightSelect={onInsightSelect} />,
                { wrapper: createWrapper() }
            );

            const clusterCard = screen.getByTestId('insight-card-ins-cluster-001');
            fireEvent.click(clusterCard);

            expect(onInsightSelect).toHaveBeenCalledWith(mockInsights[0]);
        });

        it('should deselect when clicking selected insight again', () => {
            const onInsightSelect = vi.fn();
            render(
                <SpatialInsightsSidebar onInsightSelect={onInsightSelect} />,
                { wrapper: createWrapper() }
            );

            const clusterCard = screen.getByTestId('insight-card-ins-cluster-001');

            // Select
            fireEvent.click(clusterCard);
            expect(clusterCard).toHaveAttribute('data-selected', 'true');

            // Deselect
            fireEvent.click(clusterCard);
            expect(clusterCard).toHaveAttribute('data-selected', 'false');
            expect(onInsightSelect).toHaveBeenLastCalledWith(null);
        });
    });

    describe('accessibility', () => {
        it('should have proper aria labels', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            expect(screen.getByRole('region', { name: /spatial insights/i })).toBeInTheDocument();
        });

        it('should have no axe violations', async () => {
            const { container } = render(
                <SpatialInsightsSidebar />,
                { wrapper: createWrapper() }
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('styling', () => {
        it('should have dark mode styling', () => {
            render(<SpatialInsightsSidebar />, { wrapper: createWrapper() });

            const sidebar = screen.getByTestId('spatial-insights-sidebar');
            expect(sidebar).toHaveClass('bg-gray-900/50');
        });
    });
});
