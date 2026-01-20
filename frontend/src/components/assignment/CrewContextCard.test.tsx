import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { CrewContextCard } from './CrewContextCard';
import type { CrewContext } from '../../types/assignment';

expect.extend(toHaveNoViolations);

const mockCrewContext: CrewContext = {
    crew_id: 'crew-alpha',
    crew_name: 'Alpha Crew',
    performance: 'excellent',
    last_assignment_date: '2026-01-15T14:30:00Z',
    capacity_percent: 25,
};

describe('CrewContextCard', () => {
    it('renders crew name', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        expect(screen.getByText('Alpha Crew')).toBeInTheDocument();
    });

    it('displays performance badge with correct styling', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        const badge = screen.getByTestId('performance-badge');
        expect(badge).toHaveTextContent('Excellent');
        expect(badge).toHaveClass('text-emerald-400');
    });

    it.each([
        ['excellent', 'Excellent', 'text-emerald-400'],
        ['good', 'Good', 'text-yellow-400'],
        ['fair', 'Fair', 'text-orange-400'],
        ['poor', 'Poor', 'text-red-400'],
    ] as const)('shows %s performance with correct styling', (level, label, colorClass) => {
        const context: CrewContext = { ...mockCrewContext, performance: level };
        render(<CrewContextCard crewContext={context} />);

        const badge = screen.getByTestId('performance-badge');
        expect(badge).toHaveTextContent(label);
        expect(badge).toHaveClass(colorClass);
    });

    it('displays formatted last assignment date', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        const dateElement = screen.getByTestId('last-assignment');
        expect(dateElement).toHaveTextContent('Jan 15, 2026');
    });

    it('displays "None" when no last assignment', () => {
        const context: CrewContext = { ...mockCrewContext, last_assignment_date: null };
        render(<CrewContextCard crewContext={context} />);

        const dateElement = screen.getByTestId('last-assignment');
        expect(dateElement).toHaveTextContent('None');
    });

    it('displays capacity percentage', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        const percentElement = screen.getByTestId('capacity-percent');
        expect(percentElement).toHaveTextContent('25%');
    });

    it('renders capacity bar with correct width', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        const bar = screen.getByTestId('capacity-bar');
        expect(bar).toHaveStyle({ width: '25%' });
    });

    it.each([
        [15, 'bg-emerald-500', 'Highly available'],
        [45, 'bg-yellow-500', 'Moderate workload'],
        [70, 'bg-orange-500', 'Heavy workload'],
        [90, 'bg-red-500', 'Near capacity'],
    ])('shows correct color and message for %i%% capacity', (percent, expectedClass, expectedMessage) => {
        const context: CrewContext = { ...mockCrewContext, capacity_percent: percent };
        render(<CrewContextCard crewContext={context} />);

        const bar = screen.getByTestId('capacity-bar');
        expect(bar).toHaveClass(expectedClass);
        expect(screen.getByText(expectedMessage)).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(<CrewContextCard crewContext={mockCrewContext} isLoading />);

        expect(screen.getByTestId('crew-context-loading')).toBeInTheDocument();
        expect(screen.queryByText('Alpha Crew')).not.toBeInTheDocument();
    });

    it('has accessible progress bar', () => {
        render(<CrewContextCard crewContext={mockCrewContext} />);

        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow', '25');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        expect(progressBar).toHaveAttribute('aria-label', 'Crew capacity: 25%');
    });

    it('has no accessibility violations', async () => {
        const { container } = render(<CrewContextCard crewContext={mockCrewContext} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
