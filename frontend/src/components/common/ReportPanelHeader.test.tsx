import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportPanelHeader } from './ReportPanelHeader';

describe('ReportPanelHeader', () => {
    it('renders REPORTS with count in parentheses', () => {
        render(<ReportPanelHeader totalCount={12} />);

        expect(screen.getByText('REPORTS')).toBeInTheDocument();
        expect(screen.getByText('(12)')).toBeInTheDocument();
    });

    it('renders with zero count', () => {
        render(<ReportPanelHeader totalCount={0} />);

        expect(screen.getByText('REPORTS')).toBeInTheDocument();
        expect(screen.getByText('(0)')).toBeInTheDocument();
    });

    it('shows highlighted count when provided', () => {
        render(<ReportPanelHeader totalCount={20} highlightedCount={5} />);

        expect(screen.getByText('REPORTS')).toBeInTheDocument();
        expect(screen.getByText('(5/20)')).toBeInTheDocument();
    });

    it('shows only total when highlighted is zero', () => {
        render(<ReportPanelHeader totalCount={15} highlightedCount={0} />);

        expect(screen.getByText('(15)')).toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<ReportPanelHeader totalCount={10} />);

        expect(screen.getByTestId('report-panel-header')).toBeInTheDocument();
    });

    it('has correct heading role', () => {
        render(<ReportPanelHeader totalCount={10} />);

        expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = render(
            <ReportPanelHeader totalCount={10} className="custom-class" />
        );

        expect(container.firstChild).toHaveClass('custom-class');
    });

    describe('cluster filter mode', () => {
        it('shows CLUSTER REPORTS when clusterFilterId is provided', () => {
            render(<ReportPanelHeader totalCount={4} clusterFilterId="cluster-123" />);

            expect(screen.getByText('CLUSTER REPORTS')).toBeInTheDocument();
            expect(screen.getByText('(4)')).toBeInTheDocument();
            expect(screen.queryByText('REPORTS')).not.toBeInTheDocument();
        });

        it('shows red styling in cluster filter mode', () => {
            const { container } = render(
                <ReportPanelHeader totalCount={4} clusterFilterId="cluster-123" />
            );

            // Check for red border styling
            expect(container.firstChild).toHaveClass('border-red-500/30');
            expect(container.firstChild).toHaveClass('bg-red-500/5');
        });

        it('shows Clear Filter button when onClearClusterFilter is provided', () => {
            const onClear = vi.fn();
            render(
                <ReportPanelHeader
                    totalCount={4}
                    clusterFilterId="cluster-123"
                    onClearClusterFilter={onClear}
                />
            );

            expect(screen.getByTestId('clear-cluster-filter')).toBeInTheDocument();
            expect(screen.getByText('Clear Filter')).toBeInTheDocument();
        });

        it('calls onClearClusterFilter when Clear Filter is clicked', () => {
            const onClear = vi.fn();
            render(
                <ReportPanelHeader
                    totalCount={4}
                    clusterFilterId="cluster-123"
                    onClearClusterFilter={onClear}
                />
            );

            fireEvent.click(screen.getByTestId('clear-cluster-filter'));
            expect(onClear).toHaveBeenCalled();
        });

        it('does not show Clear Filter button without onClearClusterFilter callback', () => {
            render(<ReportPanelHeader totalCount={4} clusterFilterId="cluster-123" />);

            expect(screen.queryByTestId('clear-cluster-filter')).not.toBeInTheDocument();
        });

        it('shows standard view when clusterFilterId is null', () => {
            render(<ReportPanelHeader totalCount={10} clusterFilterId={null} />);

            expect(screen.getByText('REPORTS')).toBeInTheDocument();
            expect(screen.queryByText('CLUSTER REPORTS')).not.toBeInTheDocument();
        });

        it('heading has red text color in cluster mode', () => {
            render(<ReportPanelHeader totalCount={4} clusterFilterId="cluster-123" />);

            const heading = screen.getByRole('heading', { level: 2 });
            expect(heading).toHaveClass('text-red-400');
        });
    });
});
