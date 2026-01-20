import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DuplicateInsight } from './DuplicateInsight';
import type { DuplicateMetadata } from '../../types/spatial';

describe('DuplicateInsight', () => {
    const baseMetadata: DuplicateMetadata = {
        similarity_score: 0.94,
        distance_meters: 15,
        original_report_id: 'r1',
        duplicate_report_id: 'r2',
        shared_features: ['photo', 'hazard_type'],
    };

    it('renders similarity percentage', () => {
        render(<DuplicateInsight metadata={baseMetadata} />);

        expect(screen.getByText('94% similar')).toBeInTheDocument();
    });

    it('renders distance in meters for short distances', () => {
        render(<DuplicateInsight metadata={baseMetadata} />);

        expect(screen.getByText('15m apart')).toBeInTheDocument();
    });

    it('renders distance in kilometers for long distances', () => {
        const farMetadata: DuplicateMetadata = {
            ...baseMetadata,
            distance_meters: 2500,
        };

        render(<DuplicateInsight metadata={farMetadata} />);

        expect(screen.getByText('2.5km apart')).toBeInTheDocument();
    });

    it('renders shared features with labels', () => {
        render(<DuplicateInsight metadata={baseMetadata} />);

        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('Hazard Type')).toBeInTheDocument();
    });

    it('renders unlabeled features as-is', () => {
        const metadata: DuplicateMetadata = {
            ...baseMetadata,
            shared_features: ['custom_field'],
        };

        render(<DuplicateInsight metadata={metadata} />);

        expect(screen.getByText('custom_field')).toBeInTheDocument();
    });

    it('does not render shared features section when empty', () => {
        const metadata: DuplicateMetadata = {
            ...baseMetadata,
            shared_features: [],
        };

        render(<DuplicateInsight metadata={metadata} />);

        expect(screen.queryByText('Shared:')).not.toBeInTheDocument();
    });

    it('rounds similarity percentage correctly', () => {
        const metadata: DuplicateMetadata = {
            ...baseMetadata,
            similarity_score: 0.876,
        };

        render(<DuplicateInsight metadata={metadata} />);

        expect(screen.getByText('88% similar')).toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<DuplicateInsight metadata={baseMetadata} />);

        expect(screen.getByTestId('duplicate-insight-metadata')).toBeInTheDocument();
    });

    it('renders all standard feature labels', () => {
        const metadata: DuplicateMetadata = {
            ...baseMetadata,
            shared_features: [
                'photo',
                'hazard_type',
                'location',
                'description',
                'trail_name',
                'timestamp',
            ],
        };

        render(<DuplicateInsight metadata={metadata} />);

        expect(screen.getByText('Photo')).toBeInTheDocument();
        expect(screen.getByText('Hazard Type')).toBeInTheDocument();
        expect(screen.getByText('Location')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
        expect(screen.getByText('Trail Name')).toBeInTheDocument();
        expect(screen.getByText('Timestamp')).toBeInTheDocument();
    });
});
