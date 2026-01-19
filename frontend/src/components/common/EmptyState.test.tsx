import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { EmptyState } from './EmptyState';

expect.extend(toHaveNoViolations);

describe('EmptyState', () => {
    describe('variants', () => {
        it('renders no-reports variant with default text', () => {
            render(<EmptyState variant="no-reports" />);

            expect(screen.getByText('No reports found')).toBeInTheDocument();
            expect(screen.getByText('Try adjusting your filters')).toBeInTheDocument();
        });

        it('renders no-insights variant with default text', () => {
            render(<EmptyState variant="no-insights" />);

            expect(screen.getByText('No spatial insights available')).toBeInTheDocument();
        });

        it('renders no-crews variant with default text', () => {
            render(<EmptyState variant="no-crews" />);

            expect(screen.getByText('No crews available')).toBeInTheDocument();
        });
    });

    describe('custom text', () => {
        it('allows custom title', () => {
            render(<EmptyState variant="no-reports" title="Custom Title" />);

            expect(screen.getByText('Custom Title')).toBeInTheDocument();
        });

        it('allows custom description', () => {
            render(<EmptyState variant="no-reports" description="Custom description text" />);

            expect(screen.getByText('Custom description text')).toBeInTheDocument();
        });
    });

    describe('action button', () => {
        it('renders action button when provided', () => {
            const onAction = vi.fn();
            render(
                <EmptyState
                    variant="no-reports"
                    actionLabel="Clear Filters"
                    onAction={onAction}
                />
            );

            const button = screen.getByRole('button', { name: 'Clear Filters' });
            expect(button).toBeInTheDocument();
        });

        it('calls onAction when button is clicked', () => {
            const onAction = vi.fn();
            render(
                <EmptyState
                    variant="no-reports"
                    actionLabel="Clear Filters"
                    onAction={onAction}
                />
            );

            const button = screen.getByRole('button', { name: 'Clear Filters' });
            fireEvent.click(button);

            expect(onAction).toHaveBeenCalledTimes(1);
        });

        it('does not render button when only actionLabel is provided without onAction', () => {
            render(<EmptyState variant="no-reports" actionLabel="Clear Filters" />);

            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('has proper aria labels', () => {
            render(<EmptyState variant="no-reports" />);

            const container = screen.getByRole('region');
            expect(container).toHaveAttribute('aria-label', 'Empty state');
        });

        it('passes axe accessibility audit', async () => {
            const { container } = render(<EmptyState variant="no-reports" />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
