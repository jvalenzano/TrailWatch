import { describe, it, expect } from 'vitest';
import {
    calculateBounds,
    calculateBoundsFromReports,
    calculateInsightBounds,
    expandBounds,
    boundsToLngLatBounds,
} from './mapUtils';
import type { HazardReport } from '../types/report';
import type { SpatialInsight, BoundingBox } from '../types/spatial';

describe('calculateBounds', () => {
    it('returns null for empty coordinates array', () => {
        expect(calculateBounds([])).toBeNull();
    });

    it('calculates bounds from single coordinate', () => {
        const coordinates: [number, number][] = [[-121.75, 46.85]];
        const bounds = calculateBounds(coordinates);

        expect(bounds).toEqual({
            north: 46.85,
            south: 46.85,
            east: -121.75,
            west: -121.75,
        });
    });

    it('calculates bounds from multiple coordinates', () => {
        const coordinates: [number, number][] = [
            [-121.75, 46.85],
            [-121.80, 46.90],
            [-121.70, 46.80],
        ];
        const bounds = calculateBounds(coordinates);

        expect(bounds).toEqual({
            north: 46.90,
            south: 46.80,
            east: -121.70,
            west: -121.80,
        });
    });

    it('handles coordinates crossing the antimeridian', () => {
        const coordinates: [number, number][] = [
            [170, 45],
            [-170, 45],
        ];
        const bounds = calculateBounds(coordinates);

        // Note: This basic implementation doesn't handle antimeridian specially
        expect(bounds).toEqual({
            north: 45,
            south: 45,
            east: 170,
            west: -170,
        });
    });
});

describe('calculateBoundsFromReports', () => {
    it('returns null for empty reports array', () => {
        expect(calculateBoundsFromReports([])).toBeNull();
    });

    it('calculates bounds from single report', () => {
        const reports: HazardReport[] = [
            {
                id: 'test-1',
                location: { latitude: 46.85, longitude: -121.75 },
                hazard_type: 'obstruction',
                severity_estimate: 'passable',
                description: 'Test',
                photos: [],
                reporter_type: 'anonymous',
                submitted_at: '2026-01-19T10:00:00Z',
            },
        ];

        const bounds = calculateBoundsFromReports(reports);
        expect(bounds).toEqual({
            north: 46.85,
            south: 46.85,
            east: -121.75,
            west: -121.75,
        });
    });

    it('calculates bounds from multiple reports', () => {
        const reports: HazardReport[] = [
            {
                id: 'test-1',
                location: { latitude: 46.85, longitude: -121.75 },
                hazard_type: 'obstruction',
                severity_estimate: 'passable',
                description: 'Test 1',
                photos: [],
                reporter_type: 'anonymous',
                submitted_at: '2026-01-19T10:00:00Z',
            },
            {
                id: 'test-2',
                location: { latitude: 46.90, longitude: -121.80 },
                hazard_type: 'obstruction',
                severity_estimate: 'passable',
                description: 'Test 2',
                photos: [],
                reporter_type: 'anonymous',
                submitted_at: '2026-01-19T10:30:00Z',
            },
        ];

        const bounds = calculateBoundsFromReports(reports);
        expect(bounds).toEqual({
            north: 46.90,
            south: 46.85,
            east: -121.75,
            west: -121.80,
        });
    });
});

describe('calculateInsightBounds', () => {
    const mockReports: HazardReport[] = [
        {
            id: 'NR-001',
            location: { latitude: 46.85, longitude: -121.75 },
            hazard_type: 'obstruction',
            severity_estimate: 'passable',
            description: 'Test 1',
            photos: [],
            reporter_type: 'anonymous',
            submitted_at: '2026-01-19T10:00:00Z',
        },
        {
            id: 'NR-002',
            location: { latitude: 46.90, longitude: -121.80 },
            hazard_type: 'obstruction',
            severity_estimate: 'passable',
            description: 'Test 2',
            photos: [],
            reporter_type: 'anonymous',
            submitted_at: '2026-01-19T10:30:00Z',
        },
        {
            id: 'NR-003',
            location: { latitude: 46.87, longitude: -121.78 },
            hazard_type: 'obstruction',
            severity_estimate: 'passable',
            description: 'Test 3',
            photos: [],
            reporter_type: 'anonymous',
            submitted_at: '2026-01-19T11:00:00Z',
        },
    ];

    it('calculates bounds from insight report_ids', () => {
        const insight: SpatialInsight = {
            id: 'INS-001',
            type: 'cluster',
            title: 'Test Cluster',
            description: 'Test cluster description',
            location: { type: 'Point', coordinates: [-121.77, 46.87] },
            severity: 'high',
            report_ids: ['NR-001', 'NR-002', 'NR-003'],
        };

        const bounds = calculateInsightBounds(insight, mockReports);

        expect(bounds).toEqual({
            north: 46.90,
            south: 46.85,
            east: -121.75,
            west: -121.80,
        });
    });

    it('returns padded bounds for single report', () => {
        const insight: SpatialInsight = {
            id: 'INS-002',
            type: 'anomaly',
            title: 'Single Report',
            description: 'Single report insight',
            location: { type: 'Point', coordinates: [-121.75, 46.85] },
            severity: 'medium',
            report_ids: ['NR-001'],
        };

        const bounds = calculateInsightBounds(insight, mockReports);

        // Should have padding around the single point
        expect(bounds).not.toBeNull();
        expect(bounds!.north).toBeGreaterThan(46.85);
        expect(bounds!.south).toBeLessThan(46.85);
        expect(bounds!.east).toBeGreaterThan(-121.75);
        expect(bounds!.west).toBeLessThan(-121.75);
    });

    it('returns padded bounds for no matching reports', () => {
        const insight: SpatialInsight = {
            id: 'INS-003',
            type: 'hotspot',
            title: 'No Reports',
            description: 'Insight with no matching reports',
            location: { type: 'Point', coordinates: [-122.0, 47.0] },
            severity: 'low',
            report_ids: ['nonexistent-id'],
        };

        const bounds = calculateInsightBounds(insight, mockReports);

        // Should use padding around insight center
        expect(bounds).not.toBeNull();
        expect(bounds!.north).toBeCloseTo(47.01, 2);
        expect(bounds!.south).toBeCloseTo(46.99, 2);
    });
});

describe('expandBounds', () => {
    const baseBounds: BoundingBox = {
        north: 46.90,
        south: 46.80,
        east: -121.70,
        west: -121.80,
    };

    it('expands bounds by default 10%', () => {
        const expanded = expandBounds(baseBounds);

        // Lat range: 0.1, Lng range: 0.1
        // 10% padding = 0.01 for each dimension
        expect(expanded.north).toBeCloseTo(46.91, 5);
        expect(expanded.south).toBeCloseTo(46.79, 5);
        expect(expanded.east).toBeCloseTo(-121.69, 5);
        expect(expanded.west).toBeCloseTo(-121.81, 5);
    });

    it('expands bounds by specified percentage', () => {
        const expanded = expandBounds(baseBounds, 0.2); // 20%

        expect(expanded.north).toBeCloseTo(46.92, 5);
        expect(expanded.south).toBeCloseTo(46.78, 5);
        expect(expanded.east).toBeCloseTo(-121.68, 5);
        expect(expanded.west).toBeCloseTo(-121.82, 5);
    });

    it('handles zero expansion', () => {
        const expanded = expandBounds(baseBounds, 0);

        expect(expanded).toEqual(baseBounds);
    });
});

describe('boundsToLngLatBounds', () => {
    it('converts BoundingBox to MapLibre format', () => {
        const bounds: BoundingBox = {
            north: 46.90,
            south: 46.80,
            east: -121.70,
            west: -121.80,
        };

        const result = boundsToLngLatBounds(bounds);

        expect(result).toEqual([
            [-121.80, 46.80], // SW corner [lng, lat]
            [-121.70, 46.90], // NE corner [lng, lat]
        ]);
    });

    it('handles point-like bounds', () => {
        const bounds: BoundingBox = {
            north: 46.85,
            south: 46.85,
            east: -121.75,
            west: -121.75,
        };

        const result = boundsToLngLatBounds(bounds);

        expect(result).toEqual([
            [-121.75, 46.85],
            [-121.75, 46.85],
        ]);
    });
});
