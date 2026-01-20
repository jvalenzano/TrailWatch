import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { CachedBadge } from './CachedBadge';

expect.extend(toHaveNoViolations);

describe('CachedBadge', () => {
    describe('rendering', () => {
        it('should render the badge', () => {
            render(<CachedBadge />);

            expect(screen.getByTestId('cached-badge')).toBeInTheDocument();
        });

        it('should display "[CACHED]" text', () => {
            render(<CachedBadge />);

            expect(screen.getByText('[CACHED]')).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have yellow/amber background', () => {
            render(<CachedBadge />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('bg-amber-100');
        });

        it('should have amber text color', () => {
            render(<CachedBadge />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('text-amber-800');
        });

        it('should be inline and compact', () => {
            render(<CachedBadge />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('inline-flex');
        });
    });

    describe('sizes', () => {
        it('should render default (sm) size', () => {
            render(<CachedBadge />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('text-xs');
        });

        it('should render medium size when specified', () => {
            render(<CachedBadge size="md" />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('text-sm');
        });

        it('should render large size when specified', () => {
            render(<CachedBadge size="lg" />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('text-base');
        });
    });

    describe('accessibility', () => {
        it('should have aria-label describing cached data', () => {
            render(<CachedBadge />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveAttribute('aria-label', 'Data loaded from cache');
        });

        it('should have role status', () => {
            render(<CachedBadge />);

            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should have no accessibility violations', async () => {
            const { container } = render(<CachedBadge />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('custom className', () => {
        it('should accept additional className', () => {
            render(<CachedBadge className="ml-2" />);

            const badge = screen.getByTestId('cached-badge');
            expect(badge).toHaveClass('ml-2');
        });
    });
});
