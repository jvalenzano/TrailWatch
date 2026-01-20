import { render, screen } from '@testing-library/react';
import { ConfidenceBadge } from './ConfidenceBadge';

describe('ConfidenceBadge', () => {
    describe('rendering', () => {
        it('should render the badge', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            expect(screen.getByTestId('confidence-badge')).toBeInTheDocument();
        });

        it('should display confidence as percentage', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            expect(screen.getByText('89%')).toBeInTheDocument();
        });

        it('should round to nearest integer', () => {
            render(<ConfidenceBadge confidence={0.876} />);

            expect(screen.getByText('88%')).toBeInTheDocument();
        });
    });

    describe('color coding', () => {
        it('should display green for high confidence (>80%)', () => {
            render(<ConfidenceBadge confidence={0.85} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-emerald-500');
        });

        it('should display green at exactly 80%', () => {
            render(<ConfidenceBadge confidence={0.80} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-emerald-500');
        });

        it('should display amber for moderate confidence (50-79%)', () => {
            render(<ConfidenceBadge confidence={0.65} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-amber-500');
        });

        it('should display amber at exactly 50%', () => {
            render(<ConfidenceBadge confidence={0.50} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-amber-500');
        });

        it('should display red for low confidence (<50%)', () => {
            render(<ConfidenceBadge confidence={0.35} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-red-500');
        });

        it('should display red at 0%', () => {
            render(<ConfidenceBadge confidence={0} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('bg-red-500');
        });
    });

    describe('sizes', () => {
        it('should render default size', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('text-sm');
        });

        it('should render large size when specified', () => {
            render(<ConfidenceBadge confidence={0.89} size="lg" />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('text-lg');
        });

        it('should render small size when specified', () => {
            render(<ConfidenceBadge confidence={0.89} size="sm" />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveClass('text-xs');
        });
    });

    describe('label', () => {
        it('should show "Confidence" label by default', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            expect(screen.getByText('Confidence')).toBeInTheDocument();
        });

        it('should hide label when showLabel is false', () => {
            render(<ConfidenceBadge confidence={0.89} showLabel={false} />);

            expect(screen.queryByText('Confidence')).not.toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have accessible aria-label', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            const badge = screen.getByTestId('confidence-badge');
            expect(badge).toHaveAttribute('aria-label', '89% confidence');
        });

        it('should have role status', () => {
            render(<ConfidenceBadge confidence={0.89} />);

            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });
});
