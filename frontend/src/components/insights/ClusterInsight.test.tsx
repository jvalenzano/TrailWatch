import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClusterInsight } from './ClusterInsight';
import type { ClusterMetadata } from '../../types/spatial';

describe('ClusterInsight', () => {
    const baseMetadata: ClusterMetadata = {
        radius_miles: 1.5,
        time_span_hours: 4,
        report_count: 3,
    };

    it('renders report count and radius', () => {
        render(<ClusterInsight metadata={baseMetadata} reportCount={4} />);

        expect(screen.getByText(/4 reports/)).toBeInTheDocument();
        expect(screen.getByText(/1\.5 mi radius/)).toBeInTheDocument();
    });

    it('renders singular report text', () => {
        render(<ClusterInsight metadata={baseMetadata} reportCount={1} />);

        expect(screen.getByText(/1 report/)).toBeInTheDocument();
        expect(screen.queryByText(/1 reports/)).not.toBeInTheDocument();
    });

    it('renders time span', () => {
        render(<ClusterInsight metadata={baseMetadata} reportCount={3} />);

        expect(screen.getByText('4 hour time span')).toBeInTheDocument();
    });

    it('renders weather correlation when present', () => {
        const metadataWithWeather: ClusterMetadata = {
            ...baseMetadata,
            weather_correlation: '45 mph wind gusts',
        };

        render(<ClusterInsight metadata={metadataWithWeather} reportCount={3} />);

        expect(screen.getByText('45 mph wind gusts')).toBeInTheDocument();
    });

    it('does not render weather section when not present', () => {
        render(<ClusterInsight metadata={baseMetadata} reportCount={3} />);

        // Cloud emoji should not be present
        expect(screen.queryByRole('img', { name: 'cloud' })).not.toBeInTheDocument();
    });

    it('formats radius to one decimal place', () => {
        const metadata: ClusterMetadata = {
            ...baseMetadata,
            radius_miles: 2.567,
        };

        render(<ClusterInsight metadata={metadata} reportCount={3} />);

        expect(screen.getByText(/2\.6 mi radius/)).toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<ClusterInsight metadata={baseMetadata} reportCount={3} />);

        expect(screen.getByTestId('cluster-insight-metadata')).toBeInTheDocument();
    });

    it('renders all three sections with weather', () => {
        const fullMetadata: ClusterMetadata = {
            radius_miles: 2.0,
            time_span_hours: 8,
            report_count: 5,
            weather_correlation: 'Heavy rain',
        };

        render(<ClusterInsight metadata={fullMetadata} reportCount={5} />);

        // Check all sections are present
        expect(screen.getByRole('img', { name: 'chart' })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'clock' })).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'cloud' })).toBeInTheDocument();
    });
});
