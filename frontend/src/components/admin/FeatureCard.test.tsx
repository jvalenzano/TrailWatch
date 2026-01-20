import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { FeatureCard } from './FeatureCard';
import type { FeatureFlag } from '../../types/featureFlag';

expect.extend(toHaveNoViolations);

const mockEnabledFeature: FeatureFlag = {
    id: 'structured-ai-reasoning',
    name: 'Structured AI Reasoning',
    status: 'enabled',
    metric: {
        type: 'adoption_rate',
        value: 87,
        label: 'Adoption Rate',
        period: 'Last 30 days',
    },
    availableActions: ['disable_globally'],
};

const mockBetaFeature: FeatureFlag = {
    id: 'spatial-cluster-alerts',
    name: 'Spatial Cluster Alerts',
    status: 'beta',
    metric: {
        type: 'acceptance_rate',
        value: 68,
        label: 'Acceptance Rate',
        period: 'Last 30 days',
    },
    availableActions: ['enable_for_all', 'disable'],
};

const mockAlphaFeature: FeatureFlag = {
    id: 'assignment-consistency',
    name: 'Assignment Consistency',
    status: 'alpha',
    metric: {
        type: 'pilot_users',
        value: 5,
        label: 'Active Pilot Users',
    },
    availableActions: ['promote_to_beta'],
};

const mockDisabledFeature: FeatureFlag = {
    id: 'disabled-feature',
    name: 'Disabled Feature',
    status: 'disabled',
    metric: {
        type: 'adoption_rate',
        value: 0,
        label: 'Adoption Rate',
    },
    availableActions: ['enable_globally'],
};

describe('FeatureCard', () => {
    describe('rendering', () => {
        it('should render feature name', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            expect(screen.getByText('Structured AI Reasoning')).toBeInTheDocument();
        });

        it('should render status badge', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            expect(screen.getByText('Enabled')).toBeInTheDocument();
        });

        it('should render metric label and value', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            expect(screen.getByText('Adoption Rate:')).toBeInTheDocument();
            expect(screen.getByText('87%')).toBeInTheDocument();
        });

        it('should render metric period when provided', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            expect(screen.getByText('Last 30 days')).toBeInTheDocument();
        });

        it('should not render period when not provided', () => {
            render(<FeatureCard feature={mockAlphaFeature} />);
            expect(screen.queryByText('Last 30 days')).not.toBeInTheDocument();
        });

        it('should render pilot users without percentage', () => {
            render(<FeatureCard feature={mockAlphaFeature} />);
            expect(screen.getByText('Active Pilot Users:')).toBeInTheDocument();
            expect(screen.getByText('5 User Pilot')).toBeInTheDocument();
        });
    });

    describe('action buttons', () => {
        it('should render Disable Globally button for enabled features', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            expect(screen.getByRole('button', { name: /disable globally/i })).toBeInTheDocument();
        });

        it('should render Enable for All and Disable buttons for beta features', () => {
            render(<FeatureCard feature={mockBetaFeature} />);
            expect(screen.getByRole('button', { name: /enable for all/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /disable/i })).toBeInTheDocument();
        });

        it('should render Promote to Beta button for alpha features', () => {
            render(<FeatureCard feature={mockAlphaFeature} />);
            expect(screen.getByRole('button', { name: /promote to beta/i })).toBeInTheDocument();
        });

        it('should call onAction when button is clicked', () => {
            const onAction = vi.fn();
            render(<FeatureCard feature={mockEnabledFeature} onAction={onAction} />);

            fireEvent.click(screen.getByRole('button', { name: /disable globally/i }));
            expect(onAction).toHaveBeenCalledWith('structured-ai-reasoning', 'disable_globally');
        });

        it('should call onAction with correct action for beta feature', () => {
            const onAction = vi.fn();
            render(<FeatureCard feature={mockBetaFeature} onAction={onAction} />);

            fireEvent.click(screen.getByRole('button', { name: /enable for all/i }));
            expect(onAction).toHaveBeenCalledWith('spatial-cluster-alerts', 'enable_for_all');
        });
    });

    describe('styling', () => {
        it('should have dark card styling', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            const card = screen.getByTestId('feature-card');
            expect(card).toHaveClass('bg-gray-800');
        });

        it('should have rounded corners', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            const card = screen.getByTestId('feature-card');
            expect(card).toHaveClass('rounded-lg');
        });

        it('should color metric value based on status', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            const metricValue = screen.getByTestId('feature-metric-value');
            expect(metricValue).toHaveClass('text-emerald-400');
        });

        it('should color metric value yellow for beta', () => {
            render(<FeatureCard feature={mockBetaFeature} />);
            const metricValue = screen.getByTestId('feature-metric-value');
            expect(metricValue).toHaveClass('text-yellow-400');
        });

        it('should color metric value red for alpha', () => {
            render(<FeatureCard feature={mockAlphaFeature} />);
            const metricValue = screen.getByTestId('feature-metric-value');
            expect(metricValue).toHaveClass('text-red-400');
        });
    });

    describe('loading state', () => {
        it('should disable buttons when loading', () => {
            render(<FeatureCard feature={mockEnabledFeature} isLoading />);
            const button = screen.getByRole('button', { name: /disable globally/i });
            expect(button).toBeDisabled();
        });

        it('should show loading indicator when loading', () => {
            render(<FeatureCard feature={mockEnabledFeature} isLoading />);
            expect(screen.getByTestId('feature-card-loading')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have no accessibility violations for enabled feature', async () => {
            const { container } = render(<FeatureCard feature={mockEnabledFeature} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for beta feature', async () => {
            const { container } = render(<FeatureCard feature={mockBetaFeature} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for alpha feature', async () => {
            const { container } = render(<FeatureCard feature={mockAlphaFeature} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations for disabled feature', async () => {
            const { container } = render(<FeatureCard feature={mockDisabledFeature} />);
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have accessible card role', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            const card = screen.getByTestId('feature-card');
            expect(card).toHaveAttribute('role', 'article');
        });

        it('should have accessible name via aria-labelledby', () => {
            render(<FeatureCard feature={mockEnabledFeature} />);
            const card = screen.getByTestId('feature-card');
            expect(card).toHaveAttribute('aria-labelledby');
        });
    });
});
