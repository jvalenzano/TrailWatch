import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { RouteSummary } from './RouteSummary';
import type { RouteSummary as RouteSummaryType } from '../../types/assignment';

expect.extend(toHaveNoViolations);

const mockRouteSummary: RouteSummaryType = {
    total_distance_miles: 15.7,
    estimated_travel_hours: 2.5,
    estimated_work_hours: 4.25,
};

describe('RouteSummary', () => {
    it('renders route summary', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} />);

        expect(screen.getByTestId('route-summary')).toBeInTheDocument();
        expect(screen.getByText('Route Optimization')).toBeInTheDocument();
    });

    it('displays distance with one decimal place', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} />);

        const distance = screen.getByTestId('route-distance');
        expect(distance).toHaveTextContent('15.7');
    });

    it('displays travel time formatted', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} />);

        const travelTime = screen.getByTestId('route-travel-time');
        expect(travelTime).toHaveTextContent('2 hr 30 min');
    });

    it('displays work time formatted', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} />);

        const workTime = screen.getByTestId('route-work-time');
        expect(workTime).toHaveTextContent('4 hr 15 min');
    });

    it('displays total time', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} />);

        const total = screen.getByTestId('route-total');
        // 2.5 + 4.25 = 6.75 hours = 6 hr 45 min
        expect(total).toHaveTextContent('6 hr 45 min');
    });

    it('formats hours correctly for whole hours', () => {
        const summary: RouteSummaryType = {
            total_distance_miles: 10,
            estimated_travel_hours: 2,
            estimated_work_hours: 3,
        };
        render(<RouteSummary routeSummary={summary} />);

        expect(screen.getByTestId('route-travel-time')).toHaveTextContent('2 hr');
        expect(screen.getByTestId('route-work-time')).toHaveTextContent('3 hr');
    });

    it('formats time correctly for under 1 hour', () => {
        const summary: RouteSummaryType = {
            total_distance_miles: 5,
            estimated_travel_hours: 0.5,
            estimated_work_hours: 0.75,
        };
        render(<RouteSummary routeSummary={summary} />);

        expect(screen.getByTestId('route-travel-time')).toHaveTextContent('30 min');
        expect(screen.getByTestId('route-work-time')).toHaveTextContent('45 min');
    });

    it('shows loading state', () => {
        render(<RouteSummary routeSummary={mockRouteSummary} isLoading />);

        expect(screen.getByTestId('route-summary-loading')).toBeInTheDocument();
        expect(screen.queryByTestId('route-summary')).not.toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
        const { container } = render(<RouteSummary routeSummary={mockRouteSummary} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('handles zero values', () => {
        const summary: RouteSummaryType = {
            total_distance_miles: 0,
            estimated_travel_hours: 0,
            estimated_work_hours: 0,
        };
        render(<RouteSummary routeSummary={summary} />);

        expect(screen.getByTestId('route-distance')).toHaveTextContent('0.0');
        expect(screen.getByTestId('route-travel-time')).toHaveTextContent('0 min');
        expect(screen.getByTestId('route-work-time')).toHaveTextContent('0 min');
    });
});
