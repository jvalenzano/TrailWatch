import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
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
});
