import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FeatureStatusBadge } from './FeatureStatusBadge';
import type { FeatureStatus } from '../../types/featureFlag';

expect.extend(toHaveNoViolations);

describe('FeatureStatusBadge', () => {
    describe('rendering', () => {
        it('should render Enabled status with correct text', () => {
            render(<FeatureStatusBadge status="enabled" />);
            expect(screen.getByText('Enabled')).toBeInTheDocument();
        });

        it('should render Beta status with correct text', () => {
            render(<FeatureStatusBadge status="beta" />);
            expect(screen.getByText('Beta')).toBeInTheDocument();
        });

        it('should render Alpha status with correct text', () => {
            render(<FeatureStatusBadge status="alpha" />);
            expect(screen.getByText('Alpha')).toBeInTheDocument();
        });

        it('should render Disabled status with correct text', () => {
            render(<FeatureStatusBadge status="disabled" />);
            expect(screen.getByText('Disabled')).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have green styling for Enabled status', () => {
            render(<FeatureStatusBadge status="enabled" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-emerald-400');
        });

        it('should have amber/yellow styling for Beta status', () => {
            render(<FeatureStatusBadge status="beta" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-yellow-400');
        });

        it('should have red styling for Alpha status', () => {
            render(<FeatureStatusBadge status="alpha" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-red-400');
        });

        it('should have gray styling for Disabled status', () => {
            render(<FeatureStatusBadge status="disabled" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-gray-400');
        });
    });

    describe('icons', () => {
        it('should show checkmark icon for Enabled status', () => {
            render(<FeatureStatusBadge status="enabled" />);
            const icon = screen.getByTestId('status-icon-enabled');
            expect(icon).toBeInTheDocument();
        });

        it('should show A icon for Beta status', () => {
            render(<FeatureStatusBadge status="beta" />);
            const icon = screen.getByTestId('status-icon-beta');
            expect(icon).toBeInTheDocument();
        });

        it('should show A icon for Alpha status', () => {
            render(<FeatureStatusBadge status="alpha" />);
            const icon = screen.getByTestId('status-icon-alpha');
            expect(icon).toBeInTheDocument();
        });

        it('should show disabled icon for Disabled status', () => {
            render(<FeatureStatusBadge status="disabled" />);
            const icon = screen.getByTestId('status-icon-disabled');
            expect(icon).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have accessible label', () => {
            render(<FeatureStatusBadge status="enabled" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveAttribute('aria-label', 'Feature status: Enabled');
        });

        it('should have no accessibility violations for Enabled', async () => {
            const { container } = render(<FeatureStatusBadge status="enabled" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for Beta', async () => {
            const { container } = render(<FeatureStatusBadge status="beta" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for Alpha', async () => {
            const { container } = render(<FeatureStatusBadge status="alpha" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for Disabled', async () => {
            const { container } = render(<FeatureStatusBadge status="disabled" />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('size variants', () => {
        it('should render default size (md)', () => {
            render(<FeatureStatusBadge status="enabled" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-sm');
        });

        it('should render small size when specified', () => {
            render(<FeatureStatusBadge status="enabled" size="sm" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-xs');
        });

        it('should render large size when specified', () => {
            render(<FeatureStatusBadge status="enabled" size="lg" />);
            const badge = screen.getByTestId('feature-status-badge');
            expect(badge).toHaveClass('text-base');
        });
    });
});
