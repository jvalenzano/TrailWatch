import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoadingSkeleton } from './LoadingSkeleton';

expect.extend(toHaveNoViolations);

describe('LoadingSkeleton', () => {
    describe('variant: report-list', () => {
        it('renders default 3 skeleton cards for report-list variant', () => {
            render(<LoadingSkeleton variant="report-list" />);

            const skeletons = screen.getAllByTestId(/skeleton-card-/);
            expect(skeletons).toHaveLength(3);
        });

        it('renders custom count of skeleton cards', () => {
            render(<LoadingSkeleton variant="report-list" count={5} />);

            const skeletons = screen.getAllByTestId(/skeleton-card-/);
            expect(skeletons).toHaveLength(5);
        });

        it('has animate-pulse class for shimmer effect', () => {
            render(<LoadingSkeleton variant="report-list" />);

            const skeletons = screen.getAllByTestId(/skeleton-card-/);
            skeletons.forEach((skeleton) => {
                expect(skeleton).toHaveClass('animate-pulse');
            });
        });
    });

    describe('variant: map-overlay', () => {
        it('renders a gray overlay with centered spinner', () => {
            render(<LoadingSkeleton variant="map-overlay" />);

            const overlay = screen.getByTestId('map-loading-overlay');
            expect(overlay).toBeInTheDocument();
            expect(overlay).toHaveClass('bg-gray-900/50');

            const spinner = screen.getByTestId('loading-spinner');
            expect(spinner).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('has aria-busy attribute', () => {
            render(<LoadingSkeleton variant="report-list" />);

            const container = screen.getByRole('status');
            expect(container).toHaveAttribute('aria-busy', 'true');
        });

        it('has aria-label for screen readers', () => {
            render(<LoadingSkeleton variant="report-list" />);

            const container = screen.getByRole('status');
            expect(container).toHaveAttribute('aria-label', 'Loading content');
        });

        it('passes axe accessibility audit', async () => {
            const { container } = render(<LoadingSkeleton variant="report-list" />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
