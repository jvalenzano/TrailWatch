/**
 * Tests for DistributionBarChart component.
 * Displays expected vs actual distribution as horizontal bar chart.
 */
import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DistributionBarChart } from './DistributionBarChart';

expect.extend(toHaveNoViolations);

describe('DistributionBarChart', () => {
    const defaultProps = {
        expected: { 'District 01': 30, 'District 02': 40, 'District 03': 30 },
        actual: { 'District 01': 50, 'District 02': 25, 'District 03': 25 },
    };

    describe('rendering', () => {
        it('renders chart container with correct test id', () => {
            render(<DistributionBarChart {...defaultProps} />);

            expect(screen.getByTestId('distribution-bar-chart')).toBeInTheDocument();
        });

        it('renders all district labels', () => {
            render(<DistributionBarChart {...defaultProps} />);

            expect(screen.getByText('District 01')).toBeInTheDocument();
            expect(screen.getByText('District 02')).toBeInTheDocument();
            expect(screen.getByText('District 03')).toBeInTheDocument();
        });

        it('renders expected and actual bars for each district', () => {
            render(<DistributionBarChart {...defaultProps} />);

            // Each district should have 2 bars (expected and actual)
            const chart = screen.getByTestId('distribution-bar-chart');
            const barGroups = within(chart).getAllByTestId(/^bar-group-/);
            expect(barGroups).toHaveLength(3);
        });

        it('renders legend with expected and actual labels', () => {
            render(<DistributionBarChart {...defaultProps} />);

            expect(screen.getByText('Expected')).toBeInTheDocument();
            expect(screen.getByText('Actual')).toBeInTheDocument();
        });

        it('renders percentage values on bars', () => {
            render(<DistributionBarChart {...defaultProps} />);

            // Check expected values - 30% appears twice (District 01 expected and District 03 expected)
            expect(screen.getAllByText('30%')).toHaveLength(2);
            expect(screen.getByText('40%')).toBeInTheDocument();

            // Check actual values (50% appears in bar label and also in X-axis)
            expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
            // 25% appears twice (District 02 actual and District 03 actual)
            expect(screen.getAllByText('25%')).toHaveLength(2);
        });
    });

    describe('bar widths', () => {
        it('sets bar width based on percentage value', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const expectedBar = screen.getByTestId('expected-bar-District 01');
            const actualBar = screen.getByTestId('actual-bar-District 01');

            // Expected: 30%, Actual: 50%
            expect(expectedBar).toHaveStyle({ width: '30%' });
            expect(actualBar).toHaveStyle({ width: '50%' });
        });

        it('handles zero values correctly', () => {
            const propsWithZero = {
                expected: { 'District 01': 100, 'District 02': 0 },
                actual: { 'District 01': 80, 'District 02': 20 },
            };

            render(<DistributionBarChart {...propsWithZero} />);

            const zeroBar = screen.getByTestId('expected-bar-District 02');
            expect(zeroBar).toHaveStyle({ width: '0%' });
        });

        it('handles 100% values correctly', () => {
            const propsWithMax = {
                expected: { 'District 01': 100 },
                actual: { 'District 01': 75 },
            };

            render(<DistributionBarChart {...propsWithMax} />);

            const maxBar = screen.getByTestId('expected-bar-District 01');
            expect(maxBar).toHaveStyle({ width: '100%' });
        });
    });

    describe('color coding', () => {
        it('applies blue color to expected bars', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const expectedBar = screen.getByTestId('expected-bar-District 01');
            expect(expectedBar).toHaveClass('bg-blue-500');
        });

        it('applies green color to actual bars when close to expected', () => {
            const closeProps = {
                expected: { 'District 01': 30 },
                actual: { 'District 01': 32 },
            };

            render(<DistributionBarChart {...closeProps} />);

            const actualBar = screen.getByTestId('actual-bar-District 01');
            expect(actualBar).toHaveClass('bg-green-500');
        });

        it('applies yellow color to actual bars when moderately different', () => {
            const moderateProps = {
                expected: { 'District 01': 30 },
                actual: { 'District 01': 45 },
            };

            render(<DistributionBarChart {...moderateProps} />);

            const actualBar = screen.getByTestId('actual-bar-District 01');
            expect(actualBar).toHaveClass('bg-yellow-500');
        });

        it('applies red color to actual bars when significantly different', () => {
            const highDeviationProps = {
                expected: { 'District 01': 30 },
                actual: { 'District 01': 60 },
            };

            render(<DistributionBarChart {...highDeviationProps} />);

            const actualBar = screen.getByTestId('actual-bar-District 01');
            expect(actualBar).toHaveClass('bg-red-500');
        });
    });

    describe('axis labels', () => {
        it('renders Y-axis with district names', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const chart = screen.getByTestId('distribution-bar-chart');
            expect(within(chart).getByText('District 01')).toBeInTheDocument();
            expect(within(chart).getByText('District 02')).toBeInTheDocument();
        });

        it('renders X-axis percentage markers', () => {
            render(<DistributionBarChart {...defaultProps} />);

            // X-axis markers
            expect(screen.getByText('0%')).toBeInTheDocument();
            // 50% might appear both as actual value and axis marker
            expect(screen.getAllByText('50%').length).toBeGreaterThanOrEqual(1);
            expect(screen.getByText('100%')).toBeInTheDocument();
        });
    });

    describe('responsive sizing', () => {
        it('renders with full width by default', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const chart = screen.getByTestId('distribution-bar-chart');
            expect(chart).toHaveClass('w-full');
        });

        it('accepts custom className for sizing', () => {
            render(
                <DistributionBarChart
                    {...defaultProps}
                    className="max-w-md"
                />
            );

            const chart = screen.getByTestId('distribution-bar-chart');
            expect(chart).toHaveClass('max-w-md');
        });
    });

    describe('empty state', () => {
        it('renders empty state message when no data', () => {
            render(<DistributionBarChart expected={{}} actual={{}} />);

            expect(screen.getByText('No distribution data available')).toBeInTheDocument();
        });
    });

    describe('title', () => {
        it('renders title when provided', () => {
            render(
                <DistributionBarChart
                    {...defaultProps}
                    title="Report Distribution by District"
                />
            );

            expect(screen.getByText('Report Distribution by District')).toBeInTheDocument();
        });

        it('does not render title when not provided', () => {
            render(<DistributionBarChart {...defaultProps} />);

            expect(screen.queryByRole('heading')).not.toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('has no accessibility violations', async () => {
            const { container } = render(<DistributionBarChart {...defaultProps} />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('provides accessible labels for bars', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const expectedBar = screen.getByTestId('expected-bar-District 01');
            expect(expectedBar).toHaveAttribute('aria-label', 'Expected: 30%');

            const actualBar = screen.getByTestId('actual-bar-District 01');
            expect(actualBar).toHaveAttribute('aria-label', 'Actual: 50%');
        });

        it('provides accessible role for chart', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const chart = screen.getByTestId('distribution-bar-chart');
            expect(chart).toHaveAttribute('role', 'img');
        });

        it('provides aria-describedby for chart description', () => {
            render(<DistributionBarChart {...defaultProps} />);

            const chart = screen.getByTestId('distribution-bar-chart');
            expect(chart).toHaveAttribute('aria-describedby');

            const descId = chart.getAttribute('aria-describedby');
            const description = document.getElementById(descId!);
            expect(description).toHaveTextContent('Distribution comparison');
        });
    });
});
