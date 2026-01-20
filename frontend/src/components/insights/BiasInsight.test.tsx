import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BiasInsight } from './BiasInsight';
import type { ConsistencyCheckMetadata } from '../../types/spatial';

describe('BiasInsight', () => {
    const baseMetadata: ConsistencyCheckMetadata = {
        check_type: 'district_bias',
        affected_districts: ['District 03', 'District 04'],
        deviation_percentage: 50,
    };

    it('renders check type label', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('District Bias')).toBeInTheDocument();
    });

    it('renders deviation percentage', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('50% deviation')).toBeInTheDocument();
        expect(screen.getByText('from expected')).toBeInTheDocument();
    });

    it('renders affected districts', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByText('Affected:')).toBeInTheDocument();
        expect(screen.getByText('District 03')).toBeInTheDocument();
        expect(screen.getByText('District 04')).toBeInTheDocument();
    });

    it('applies red color for high deviation', () => {
        const highDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 50,
        };

        render(<BiasInsight metadata={highDeviation} />);

        const deviationText = screen.getByText('50% deviation');
        expect(deviationText).toHaveClass('text-red-400');
    });

    it('applies yellow color for medium deviation', () => {
        const mediumDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 20,
        };

        render(<BiasInsight metadata={mediumDeviation} />);

        const deviationText = screen.getByText('20% deviation');
        expect(deviationText).toHaveClass('text-yellow-400');
    });

    it('applies green color for low deviation', () => {
        const lowDeviation: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 10,
        };

        render(<BiasInsight metadata={lowDeviation} />);

        const deviationText = screen.getByText('10% deviation');
        expect(deviationText).toHaveClass('text-green-400');
    });

    it('renders temporal_anomaly check type', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'temporal_anomaly',
            deviation_percentage: 25,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('Temporal Anomaly')).toBeInTheDocument();
    });

    it('renders geographic_gap check type', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'geographic_gap',
            deviation_percentage: 15,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('Geographic Gap')).toBeInTheDocument();
    });

    it('does not render deviation when undefined', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'district_bias',
            affected_districts: ['District 01'],
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText(/deviation/)).not.toBeInTheDocument();
    });

    it('does not render affected districts when undefined', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'temporal_anomaly',
            deviation_percentage: 30,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText('Affected:')).not.toBeInTheDocument();
    });

    it('does not render affected districts when empty array', () => {
        const metadata: ConsistencyCheckMetadata = {
            check_type: 'district_bias',
            affected_districts: [],
            deviation_percentage: 25,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.queryByText('Affected:')).not.toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<BiasInsight metadata={baseMetadata} />);

        expect(screen.getByTestId('bias-insight-metadata')).toBeInTheDocument();
    });

    it('rounds deviation percentage', () => {
        const metadata: ConsistencyCheckMetadata = {
            ...baseMetadata,
            deviation_percentage: 33.7,
        };

        render(<BiasInsight metadata={metadata} />);

        expect(screen.getByText('34% deviation')).toBeInTheDocument();
    });
});
