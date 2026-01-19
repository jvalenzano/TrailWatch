/**
 * Schema validation tests for synthetic data.
 * Ensures all 24 reports conform to the extended HazardReport type.
 */
import syntheticData from './synthetic_day_in_life.json';
import type { HazardReport, TRACSCategoryCode, SeverityCode } from '../types/report';
import type { SpatialInsight, SpatialInsightType } from '../types/spatial';

// Type for synthetic data structure
interface SyntheticDataSchema {
    reports: unknown[];
    insights: unknown[];
    weather_context: {
        event_id: string;
        timestamp: string;
        duration_hours: number;
        conditions: string;
        max_wind_speed_mph: number;
        total_precipitation_inches: number;
        affected_trails: string[];
        alerts_issued: string[];
    };
    metadata: {
        generated_at: string;
        total_reports: number;
        trails: Record<string, { count: number; id: string }>;
        patterns: {
            clusters: number;
            duplicates: number;
            high_risk: number;
            bias_checks: number;
        };
    };
}

const typedData = syntheticData as SyntheticDataSchema;

const validTRACSCodes: TRACSCategoryCode[] = ['CLR', 'DRN', 'GRD', 'STR', 'SGN', 'TRD', 'OTH'];
const validSeverityCodes: SeverityCode[] = ['SEV0', 'SEV1', 'SEV2', 'SEV3'];
const validSeverityEstimates = ['passable', 'difficult', 'impassable', 'dangerous'];
const validReporterTypes = ['anonymous', 'volunteer', 'coordinator'];
const validInsightTypes: SpatialInsightType[] = ['cluster', 'hotspot', 'trend', 'anomaly', 'duplicate', 'consistency_check'];

describe('Synthetic Data Schema Validation', () => {
    describe('metadata', () => {
        it('should have correct total report count', () => {
            expect(typedData.metadata.total_reports).toBe(24);
            expect(typedData.reports).toHaveLength(24);
        });

        it('should have valid trail counts', () => {
            expect(typedData.metadata.trails.river_valley.count).toBe(12);
            expect(typedData.metadata.trails.north_ridge.count).toBe(8);
            expect(typedData.metadata.trails.beaver_pond.count).toBe(4);
        });

        it('should have valid pattern counts', () => {
            expect(typedData.metadata.patterns.clusters).toBe(1);
            expect(typedData.metadata.patterns.duplicates).toBe(1);
            expect(typedData.metadata.patterns.high_risk).toBe(1);
            expect(typedData.metadata.patterns.bias_checks).toBe(1);
        });
    });

    describe('weather_context', () => {
        it('should have valid storm event data', () => {
            const weather = typedData.weather_context;
            expect(weather.event_id).toBe('WX-2026-01-19-STORM');
            expect(weather.max_wind_speed_mph).toBe(45);
            expect(weather.total_precipitation_inches).toBe(3.5);
            expect(weather.affected_trails).toContain('trail-north-ridge');
        });
    });

    describe('reports', () => {
        it('should have all required HazardReport fields', () => {
            typedData.reports.forEach((report: unknown) => {
                const r = report as HazardReport;
                expect(r.id).toBeDefined();
                expect(r.location).toBeDefined();
                expect(typeof r.location.latitude).toBe('number');
                expect(typeof r.location.longitude).toBe('number');
                expect(r.hazard_type).toBeDefined();
                expect(r.description).toBeDefined();
                expect(Array.isArray(r.photos)).toBe(true);
                expect(r.submitted_at).toBeDefined();

                // Validate enum values
                expect(validSeverityEstimates).toContain(r.severity_estimate);
                expect(validReporterTypes).toContain(r.reporter_type);
            });
        });

        it('should have valid triage results where present', () => {
            const reportsWithTriage = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.triage_result !== undefined;
            });

            expect(reportsWithTriage.length).toBeGreaterThan(0);

            reportsWithTriage.forEach((report: unknown) => {
                const r = report as HazardReport;
                const triage = r.triage_result!;

                expect(validTRACSCodes).toContain(triage.tracs_category);
                expect(validSeverityCodes).toContain(triage.severity);
                expect(typeof triage.confidence_score).toBe('number');
                expect(triage.confidence_score).toBeGreaterThanOrEqual(0);
                expect(triage.confidence_score).toBeLessThanOrEqual(1);
                expect(triage.reasoning).toBeDefined();
                expect(triage.confidence_factors).toBeDefined();
            });
        });

        it('should have valid assignment data where present', () => {
            const reportsWithAssignment = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.assignment !== undefined;
            });

            expect(reportsWithAssignment.length).toBeGreaterThan(0);

            reportsWithAssignment.forEach((report: unknown) => {
                const r = report as HazardReport;
                const assignment = r.assignment!;

                expect(assignment.district_id).toBeDefined();
                expect(['pending_review', 'assigned', 'in_progress', 'resolved']).toContain(assignment.status);
                if (assignment.priority) {
                    expect(['low', 'medium', 'high', 'urgent']).toContain(assignment.priority);
                }
            });
        });

        it('should have valid pattern detection for cluster reports', () => {
            const clusterReports = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.pattern_detection?.is_cluster_member === true;
            });

            expect(clusterReports).toHaveLength(4);

            clusterReports.forEach((report: unknown) => {
                const r = report as HazardReport;
                expect(r.pattern_detection?.cluster_id).toBe('CLU-2026-01-19-STORM');
                expect(r.pattern_detection?.cluster_reason).toBeDefined();
            });
        });

        it('should have valid pattern detection for duplicate report', () => {
            const duplicateReports = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.pattern_detection?.is_duplicate === true;
            });

            expect(duplicateReports).toHaveLength(1);

            const duplicate = duplicateReports[0] as HazardReport;
            expect(duplicate.pattern_detection?.duplicate_of).toBe('BP-003');
            expect(duplicate.pattern_detection?.similarity_score).toBe(0.94);
        });

        it('should have exactly one safety alert (high-risk) report', () => {
            const safetyAlerts = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.safety_alert === true;
            });

            expect(safetyAlerts).toHaveLength(1);
            expect((safetyAlerts[0] as HazardReport).id).toBe('RV-007');
        });

        it('should have valid location coordinates', () => {
            typedData.reports.forEach((report: unknown) => {
                const r = report as HazardReport;
                // Pacific Northwest region check
                expect(r.location.latitude).toBeGreaterThan(46);
                expect(r.location.latitude).toBeLessThan(47);
                expect(r.location.longitude).toBeGreaterThan(-122);
                expect(r.location.longitude).toBeLessThan(-121);
            });
        });
    });

    describe('insights', () => {
        it('should have valid insight types', () => {
            typedData.insights.forEach((insight: unknown) => {
                const i = insight as SpatialInsight;
                expect(validInsightTypes).toContain(i.type);
            });
        });

        it('should have cluster insight with correct metadata', () => {
            const clusterInsight = typedData.insights.find((i: unknown) => {
                const insight = i as SpatialInsight;
                return insight.type === 'cluster';
            }) as SpatialInsight;

            expect(clusterInsight).toBeDefined();
            expect(clusterInsight.report_ids).toHaveLength(4);
            expect(clusterInsight.metadata).toBeDefined();
        });

        it('should have duplicate insight with similarity score', () => {
            const duplicateInsight = typedData.insights.find((i: unknown) => {
                const insight = i as SpatialInsight;
                return insight.type === 'duplicate';
            }) as SpatialInsight;

            expect(duplicateInsight).toBeDefined();
            expect(duplicateInsight.report_ids).toHaveLength(2);
            const metadata = duplicateInsight.metadata as { similarity_score: number };
            expect(metadata.similarity_score).toBe(0.94);
        });

        it('should have consistency check insight for bias', () => {
            const biasInsight = typedData.insights.find((i: unknown) => {
                const insight = i as SpatialInsight;
                return insight.type === 'consistency_check';
            }) as SpatialInsight;

            expect(biasInsight).toBeDefined();
            const metadata = biasInsight.metadata as { check_type: string };
            expect(metadata.check_type).toBe('district_bias');
        });

        it('should have valid GeoJSON point locations', () => {
            typedData.insights.forEach((insight: unknown) => {
                const i = insight as SpatialInsight;
                expect(i.location.type).toBe('Point');
                expect(i.location.coordinates).toHaveLength(2);
                expect(typeof i.location.coordinates[0]).toBe('number'); // longitude
                expect(typeof i.location.coordinates[1]).toBe('number'); // latitude
            });
        });

        it('should reference valid report IDs', () => {
            const allReportIds = typedData.reports.map((r: unknown) => (r as HazardReport).id);

            typedData.insights.forEach((insight: unknown) => {
                const i = insight as SpatialInsight;
                i.report_ids.forEach((reportId) => {
                    expect(allReportIds).toContain(reportId);
                });
            });
        });
    });

    describe('trail distribution', () => {
        it('should have 12 River Valley Trail reports', () => {
            const riverValley = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.trail_name === 'River Valley Trail';
            });
            expect(riverValley).toHaveLength(12);
        });

        it('should have 8 North Ridge Trail reports', () => {
            const northRidge = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.trail_name === 'North Ridge Trail';
            });
            expect(northRidge).toHaveLength(8);
        });

        it('should have 4 Beaver Pond Loop reports', () => {
            const beaverPond = typedData.reports.filter((r: unknown) => {
                const report = r as HazardReport;
                return report.trail_name === 'Beaver Pond Loop';
            });
            expect(beaverPond).toHaveLength(4);
        });
    });

    describe('report ID patterns', () => {
        it('should use correct ID prefixes for each trail', () => {
            typedData.reports.forEach((report: unknown) => {
                const r = report as HazardReport;
                if (r.trail_name === 'River Valley Trail') {
                    expect(r.id.startsWith('RV-')).toBe(true);
                } else if (r.trail_name === 'North Ridge Trail') {
                    expect(r.id.startsWith('NR-')).toBe(true);
                } else if (r.trail_name === 'Beaver Pond Loop') {
                    expect(r.id.startsWith('BP-')).toBe(true);
                }
            });
        });

        it('should have unique report IDs', () => {
            const ids = typedData.reports.map((r: unknown) => (r as HazardReport).id);
            const uniqueIds = new Set(ids);
            expect(uniqueIds.size).toBe(ids.length);
        });
    });
});
