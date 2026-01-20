import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GenericInsight } from './GenericInsight';

describe('GenericInsight', () => {
    it('renders nothing when metadata is undefined', () => {
        const { container } = render(
            <GenericInsight type="anomaly" metadata={undefined} />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when metadata is empty object', () => {
        const { container } = render(<GenericInsight type="hotspot" metadata={{}} />);

        expect(container).toBeEmptyDOMElement();
    });

    it('renders nothing when metadata has no known fields', () => {
        const { container } = render(
            <GenericInsight
                type="trend"
                metadata={{ unknown_field: 'value', another_unknown: 123 }}
            />
        );

        expect(container).toBeEmptyDOMElement();
    });

    it('renders alert_type field', () => {
        render(
            <GenericInsight type="anomaly" metadata={{ alert_type: 'Critical' }} />
        );

        expect(screen.getByText('Alert Type:')).toBeInTheDocument();
        expect(screen.getByText('Critical')).toBeInTheDocument();
    });

    it('renders response_time_target_hours with formatting', () => {
        render(
            <GenericInsight
                type="hotspot"
                metadata={{ response_time_target_hours: 24 }}
            />
        );

        expect(screen.getByText('Response Target:')).toBeInTheDocument();
        expect(screen.getByText('24 hours')).toBeInTheDocument();
    });

    it('renders recurrence_years with singular formatting', () => {
        render(
            <GenericInsight type="trend" metadata={{ recurrence_years: 1 }} />
        );

        expect(screen.getByText('Recurrence:')).toBeInTheDocument();
        expect(screen.getByText('1 year')).toBeInTheDocument();
    });

    it('renders recurrence_years with plural formatting', () => {
        render(
            <GenericInsight type="trend" metadata={{ recurrence_years: 3 }} />
        );

        expect(screen.getByText('3 years')).toBeInTheDocument();
    });

    it('renders recommended_solution field', () => {
        render(
            <GenericInsight
                type="anomaly"
                metadata={{ recommended_solution: 'Clear drainage system' }}
            />
        );

        expect(screen.getByText('Recommendation:')).toBeInTheDocument();
        expect(screen.getByText('Clear drainage system')).toBeInTheDocument();
    });

    it('renders trend_direction field', () => {
        render(
            <GenericInsight type="trend" metadata={{ trend_direction: 'increasing' }} />
        );

        expect(screen.getByText('Direction:')).toBeInTheDocument();
        expect(screen.getByText('increasing')).toBeInTheDocument();
    });

    it('renders confidence_score as percentage', () => {
        render(
            <GenericInsight type="anomaly" metadata={{ confidence_score: 0.85 }} />
        );

        expect(screen.getByText('Confidence:')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('renders affected_area_sq_miles with formatting', () => {
        render(
            <GenericInsight
                type="hotspot"
                metadata={{ affected_area_sq_miles: 12.5 }}
            />
        );

        expect(screen.getByText('Area:')).toBeInTheDocument();
        expect(screen.getByText('12.5 sq mi')).toBeInTheDocument();
    });

    it('renders multiple fields', () => {
        render(
            <GenericInsight
                type="hotspot"
                metadata={{
                    alert_type: 'Warning',
                    response_time_target_hours: 48,
                    confidence_score: 0.92,
                }}
            />
        );

        expect(screen.getByText('Alert Type:')).toBeInTheDocument();
        expect(screen.getByText('Warning')).toBeInTheDocument();
        expect(screen.getByText('Response Target:')).toBeInTheDocument();
        expect(screen.getByText('48 hours')).toBeInTheDocument();
        expect(screen.getByText('Confidence:')).toBeInTheDocument();
        expect(screen.getByText('92%')).toBeInTheDocument();
    });

    it('ignores null values', () => {
        render(
            <GenericInsight
                type="anomaly"
                metadata={{
                    alert_type: null,
                    response_time_target_hours: 24,
                }}
            />
        );

        expect(screen.queryByText('Alert Type:')).not.toBeInTheDocument();
        expect(screen.getByText('Response Target:')).toBeInTheDocument();
    });

    it('has correct test id with type', () => {
        render(
            <GenericInsight type="anomaly" metadata={{ alert_type: 'Test' }} />
        );

        expect(
            screen.getByTestId('generic-insight-metadata-anomaly')
        ).toBeInTheDocument();
    });

    it('renders different test ids for different types', () => {
        const { rerender } = render(
            <GenericInsight type="hotspot" metadata={{ alert_type: 'Test' }} />
        );

        expect(
            screen.getByTestId('generic-insight-metadata-hotspot')
        ).toBeInTheDocument();

        rerender(
            <GenericInsight type="trend" metadata={{ alert_type: 'Test' }} />
        );

        expect(
            screen.getByTestId('generic-insight-metadata-trend')
        ).toBeInTheDocument();
    });
});
