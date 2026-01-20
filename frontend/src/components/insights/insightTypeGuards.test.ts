import { describe, it, expect } from 'vitest';
import {
    isClusterInsight,
    isDuplicateInsight,
    isBiasInsight,
    isGenericInsight,
} from './insightTypeGuards';
import type { SpatialInsight } from '../../types/spatial';

const baseInsight: Omit<SpatialInsight, 'type' | 'metadata'> = {
    id: 'test-1',
    title: 'Test Insight',
    description: 'Test description',
    location: { type: 'Point', coordinates: [-121.5, 37.8] },
    severity: 'medium',
    report_ids: ['r1', 'r2'],
};

describe('insightTypeGuards', () => {
    describe('isClusterInsight', () => {
        it('returns true for cluster insight with valid metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'cluster',
                metadata: {
                    radius_miles: 1.5,
                    time_span_hours: 4,
                    report_count: 3,
                },
            };
            expect(isClusterInsight(insight)).toBe(true);
        });

        it('returns false for cluster insight without metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'cluster',
            };
            expect(isClusterInsight(insight)).toBe(false);
        });

        it('returns false for non-cluster insight type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'hotspot',
                metadata: {
                    radius_miles: 1.5,
                    time_span_hours: 4,
                    report_count: 3,
                },
            };
            expect(isClusterInsight(insight)).toBe(false);
        });
    });

    describe('isDuplicateInsight', () => {
        it('returns true for duplicate insight with valid metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'duplicate',
                metadata: {
                    similarity_score: 0.94,
                    distance_meters: 15,
                    original_report_id: 'r1',
                    duplicate_report_id: 'r2',
                    shared_features: ['photo', 'hazard_type'],
                },
            };
            expect(isDuplicateInsight(insight)).toBe(true);
        });

        it('returns false for duplicate insight without metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'duplicate',
            };
            expect(isDuplicateInsight(insight)).toBe(false);
        });

        it('returns false for non-duplicate insight type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'cluster',
                metadata: {
                    similarity_score: 0.94,
                    distance_meters: 15,
                    original_report_id: 'r1',
                    duplicate_report_id: 'r2',
                    shared_features: ['photo'],
                },
            };
            expect(isDuplicateInsight(insight)).toBe(false);
        });
    });

    describe('isBiasInsight', () => {
        it('returns true for consistency_check insight with valid metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'consistency_check',
                metadata: {
                    check_type: 'district_bias',
                    affected_districts: ['District 03', 'District 04'],
                    deviation_percentage: 50,
                },
            };
            expect(isBiasInsight(insight)).toBe(true);
        });

        it('returns false for consistency_check insight without metadata', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'consistency_check',
            };
            expect(isBiasInsight(insight)).toBe(false);
        });

        it('returns false for non-consistency_check insight type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'anomaly',
                metadata: {
                    check_type: 'district_bias',
                    deviation_percentage: 50,
                },
            };
            expect(isBiasInsight(insight)).toBe(false);
        });
    });

    describe('isGenericInsight', () => {
        it('returns true for anomaly type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'anomaly',
            };
            expect(isGenericInsight(insight)).toBe(true);
        });

        it('returns true for hotspot type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'hotspot',
            };
            expect(isGenericInsight(insight)).toBe(true);
        });

        it('returns true for trend type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'trend',
            };
            expect(isGenericInsight(insight)).toBe(true);
        });

        it('returns false for cluster type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'cluster',
            };
            expect(isGenericInsight(insight)).toBe(false);
        });

        it('returns false for duplicate type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'duplicate',
            };
            expect(isGenericInsight(insight)).toBe(false);
        });

        it('returns false for consistency_check type', () => {
            const insight: SpatialInsight = {
                ...baseInsight,
                type: 'consistency_check',
            };
            expect(isGenericInsight(insight)).toBe(false);
        });
    });
});
