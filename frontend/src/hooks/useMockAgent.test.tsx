import { renderHook, act } from '@testing-library/react';
import {
    useMockAgent,
    getClusterReports,
    getDuplicateReports,
    getHighRiskReports,
    getReportsByDistrict,
    getReportsByTrail,
} from './useMockAgent';

describe('useMockAgent', () => {
    describe('initial state', () => {
        it('should return all 24 reports when no scenario is active', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(result.current.activeScenario).toBeNull();
            expect(result.current.allReports).toHaveLength(24);
            expect(result.current.reports).toHaveLength(24);
        });

        it('should return all insights when no scenario is active', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(result.current.allInsights.length).toBeGreaterThan(0);
            expect(result.current.insights).toEqual(result.current.allInsights);
        });

        it('should provide all available scenarios', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(result.current.scenarios).toHaveLength(4);
            expect(result.current.scenarios.map((s) => s.id)).toEqual([
                'cluster',
                'duplicate',
                'high_risk',
                'bias_check',
            ]);
        });

        it('should provide weather context', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(result.current.weatherContext).not.toBeNull();
            expect(result.current.weatherContext?.max_wind_speed_mph).toBe(45);
        });
    });

    describe('triggerScenario', () => {
        it('should filter to cluster reports when cluster scenario is triggered', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('cluster');
            });

            expect(result.current.activeScenario).toBe('cluster');
            expect(result.current.reports).toHaveLength(4);
            expect(result.current.reports.every((r) => r.id.startsWith('NR-'))).toBe(true);
        });

        it('should filter to duplicate reports when duplicate scenario is triggered', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('duplicate');
            });

            expect(result.current.activeScenario).toBe('duplicate');
            expect(result.current.reports).toHaveLength(2);
            expect(result.current.reports.map((r) => r.id).sort()).toEqual(['BP-003', 'BP-004']);
        });

        it('should filter to high-risk reports when high_risk scenario is triggered', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('high_risk');
            });

            expect(result.current.activeScenario).toBe('high_risk');
            expect(result.current.reports).toHaveLength(1);
            expect(result.current.reports[0].id).toBe('RV-007');
            expect(result.current.reports[0].safety_alert).toBe(true);
        });

        it('should filter to bias check reports when bias_check scenario is triggered', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('bias_check');
            });

            expect(result.current.activeScenario).toBe('bias_check');
            expect(result.current.reports).toHaveLength(10);
        });

        it('should filter insights based on scenario', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('cluster');
            });

            expect(result.current.insights).toHaveLength(1);
            expect(result.current.insights[0].type).toBe('cluster');
        });

        it('should not change state for invalid scenario', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('invalid_scenario');
            });

            expect(result.current.activeScenario).toBeNull();
            expect(result.current.reports).toHaveLength(24);
        });
    });

    describe('reset', () => {
        it('should restore all reports after reset', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('cluster');
            });

            expect(result.current.reports).toHaveLength(4);

            act(() => {
                result.current.reset();
            });

            expect(result.current.activeScenario).toBeNull();
            expect(result.current.reports).toHaveLength(24);
        });
    });

    describe('isScenarioActive', () => {
        it('should return true for active scenario', () => {
            const { result } = renderHook(() => useMockAgent());

            act(() => {
                result.current.triggerScenario('cluster');
            });

            expect(result.current.isScenarioActive('cluster')).toBe(true);
            expect(result.current.isScenarioActive('duplicate')).toBe(false);
        });

        it('should return false when no scenario is active', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(result.current.isScenarioActive('cluster')).toBe(false);
        });
    });

    describe('getScenarioReports', () => {
        it('should return scenario reports without activating it', () => {
            const { result } = renderHook(() => useMockAgent());

            const clusterReports = result.current.getScenarioReports('cluster');

            expect(clusterReports).toHaveLength(4);
            expect(result.current.activeScenario).toBeNull(); // Scenario not activated
            expect(result.current.reports).toHaveLength(24); // Main reports unchanged
        });

        it('should return all reports for invalid scenario', () => {
            const { result } = renderHook(() => useMockAgent());

            const reports = result.current.getScenarioReports('invalid');

            expect(reports).toHaveLength(24);
        });
    });

    describe('getScenarioInsights', () => {
        it('should return scenario insights without activating it', () => {
            const { result } = renderHook(() => useMockAgent());

            const clusterInsights = result.current.getScenarioInsights('cluster');

            expect(clusterInsights).toHaveLength(1);
            expect(result.current.activeScenario).toBeNull();
        });
    });
});

describe('utility functions', () => {
    describe('getClusterReports', () => {
        it('should return reports with is_cluster_member flag', () => {
            const { result } = renderHook(() => useMockAgent());
            const clusterReports = getClusterReports(result.current.allReports);

            expect(clusterReports.length).toBeGreaterThan(0);
            expect(clusterReports.every((r) => r.pattern_detection?.is_cluster_member)).toBe(true);
        });
    });

    describe('getDuplicateReports', () => {
        it('should return reports with is_duplicate flag', () => {
            const { result } = renderHook(() => useMockAgent());
            const duplicates = getDuplicateReports(result.current.allReports);

            expect(duplicates).toHaveLength(1);
            expect(duplicates[0].pattern_detection?.is_duplicate).toBe(true);
        });
    });

    describe('getHighRiskReports', () => {
        it('should return reports with safety_alert flag', () => {
            const { result } = renderHook(() => useMockAgent());
            const highRisk = getHighRiskReports(result.current.allReports);

            expect(highRisk).toHaveLength(1);
            expect(highRisk[0].safety_alert).toBe(true);
            expect(highRisk[0].id).toBe('RV-007');
        });
    });

    describe('getReportsByDistrict', () => {
        it('should filter reports by district ID', () => {
            const { result } = renderHook(() => useMockAgent());
            const district3Reports = getReportsByDistrict(result.current.allReports, '03');
            const district4Reports = getReportsByDistrict(result.current.allReports, '04');

            expect(district3Reports.length).toBeGreaterThan(0);
            expect(district4Reports.length).toBeGreaterThan(0);
            expect(district3Reports.every((r) => r.assignment?.district_id === '03')).toBe(true);
        });
    });

    describe('getReportsByTrail', () => {
        it('should filter reports by trail name', () => {
            const { result } = renderHook(() => useMockAgent());
            const riverValleyReports = getReportsByTrail(result.current.allReports, 'River Valley Trail');

            expect(riverValleyReports).toHaveLength(12);
            expect(riverValleyReports.every((r) => r.trail_name === 'River Valley Trail')).toBe(true);
        });

        it('should return correct counts for each trail', () => {
            const { result } = renderHook(() => useMockAgent());

            expect(getReportsByTrail(result.current.allReports, 'River Valley Trail')).toHaveLength(12);
            expect(getReportsByTrail(result.current.allReports, 'North Ridge Trail')).toHaveLength(8);
            expect(getReportsByTrail(result.current.allReports, 'Beaver Pond Loop')).toHaveLength(4);
        });
    });
});
