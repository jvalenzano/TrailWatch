import { useState, useCallback, useMemo } from 'react';
import type { HazardReport } from '../types/report';
import type { SpatialInsight } from '../types/spatial';
import syntheticData from '../data/synthetic_day_in_life.json';

/**
 * Scenario types that the mock agent can demonstrate.
 */
export type MockScenarioType = 'cluster' | 'duplicate' | 'high_risk' | 'bias_check' | 'all';

/**
 * Scenario definition for mock agent demonstrations.
 */
export interface MockAgentScenario {
    id: string;
    name: string;
    description: string;
    triggerType: MockScenarioType;
    reportIds: string[];
    insightIds: string[];
}

/**
 * Weather context from synthetic data.
 */
export interface WeatherEvent {
    event_id: string;
    timestamp: string;
    duration_hours: number;
    conditions: string;
    max_wind_speed_mph: number;
    total_precipitation_inches: number;
    affected_trails: string[];
    alerts_issued: string[];
}

/**
 * Result interface for the useMockAgent hook.
 */
export interface UseMockAgentResult {
    /** Available demonstration scenarios */
    scenarios: MockAgentScenario[];
    /** Currently active scenario ID (null = show all) */
    activeScenario: string | null;
    /** Filtered reports based on active scenario */
    reports: HazardReport[];
    /** Filtered insights based on active scenario */
    insights: SpatialInsight[];
    /** All reports (unfiltered) */
    allReports: HazardReport[];
    /** All insights (unfiltered) */
    allInsights: SpatialInsight[];
    /** Weather context for storm event */
    weatherContext: WeatherEvent | null;
    /** Activate a specific scenario */
    triggerScenario: (scenarioId: string) => void;
    /** Reset to show all data */
    reset: () => void;
    /** Check if a specific scenario is active */
    isScenarioActive: (scenarioId: string) => boolean;
    /** Get reports for a specific scenario without activating it */
    getScenarioReports: (scenarioId: string) => HazardReport[];
    /** Get insights for a specific scenario without activating it */
    getScenarioInsights: (scenarioId: string) => SpatialInsight[];
}

/**
 * Pre-defined scenarios for demonstrating agentic UI patterns.
 */
const SCENARIOS: MockAgentScenario[] = [
    {
        id: 'cluster',
        name: 'Storm Damage Cluster',
        description: '4 storm-related reports on North Ridge Trail within 1 mile and 4 hours',
        triggerType: 'cluster',
        reportIds: ['NR-001', 'NR-002', 'NR-003', 'NR-004'],
        insightIds: ['INS-STORM-001'],
    },
    {
        id: 'duplicate',
        name: 'Duplicate Detection',
        description: 'Two reports (BP-003, BP-004) describing the same downed tree',
        triggerType: 'duplicate',
        reportIds: ['BP-003', 'BP-004'],
        insightIds: ['INS-DUP-001'],
    },
    {
        id: 'high_risk',
        name: 'Critical Infrastructure',
        description: 'Collapsed footbridge requiring immediate circuit breaker intervention',
        triggerType: 'high_risk',
        reportIds: ['RV-007'],
        insightIds: ['INS-CRITICAL-001'],
    },
    {
        id: 'bias_check',
        name: 'District Assignment Bias',
        description: 'All obstruction reports routed to District 3, none to District 4',
        triggerType: 'bias_check',
        reportIds: ['RV-001', 'RV-005', 'RV-008', 'RV-010', 'NR-001', 'NR-002', 'NR-003', 'NR-004', 'BP-003', 'BP-004'],
        insightIds: ['INS-BIAS-001'],
    },
];

/**
 * Type guard to validate HazardReport structure.
 */
function isValidHazardReport(report: unknown): report is HazardReport {
    if (typeof report !== 'object' || report === null) return false;
    const r = report as Record<string, unknown>;
    return (
        typeof r.id === 'string' &&
        typeof r.location === 'object' &&
        r.location !== null &&
        typeof (r.location as Record<string, unknown>).latitude === 'number' &&
        typeof (r.location as Record<string, unknown>).longitude === 'number' &&
        typeof r.hazard_type === 'string' &&
        typeof r.description === 'string' &&
        Array.isArray(r.photos) &&
        typeof r.submitted_at === 'string'
    );
}

/**
 * Type guard to validate SpatialInsight structure.
 */
function isValidSpatialInsight(insight: unknown): insight is SpatialInsight {
    if (typeof insight !== 'object' || insight === null) return false;
    const i = insight as Record<string, unknown>;
    return (
        typeof i.id === 'string' &&
        typeof i.type === 'string' &&
        typeof i.title === 'string' &&
        typeof i.description === 'string' &&
        typeof i.location === 'object' &&
        i.location !== null &&
        Array.isArray(i.report_ids)
    );
}

/**
 * Hook for accessing and filtering synthetic data for agentic UI demonstrations.
 *
 * Provides scenario-based filtering to demonstrate:
 * - Cluster detection (storm damage pattern)
 * - Duplicate detection (same hazard reported twice)
 * - High-risk circuit breaker (collapsed bridge)
 * - Bias checking (district assignment imbalance)
 *
 * @example
 * const {
 *   scenarios,
 *   activeScenario,
 *   reports,
 *   insights,
 *   triggerScenario,
 *   reset
 * } = useMockAgent();
 *
 * // Activate cluster scenario
 * triggerScenario('cluster');
 *
 * // Show only cluster-related reports and insights
 * console.log(reports.length); // 4 storm-related reports
 *
 * // Reset to show all data
 * reset();
 */
export function useMockAgent(): UseMockAgentResult {
    const [activeScenario, setActiveScenario] = useState<string | null>(null);

    // Parse and validate synthetic data
    const allReports = useMemo<HazardReport[]>(() => {
        const rawReports = (syntheticData as { reports: unknown[] }).reports;
        return rawReports.filter(isValidHazardReport);
    }, []);

    const allInsights = useMemo<SpatialInsight[]>(() => {
        const rawInsights = (syntheticData as { insights: unknown[] }).insights;
        return rawInsights.filter(isValidSpatialInsight);
    }, []);

    const weatherContext = useMemo<WeatherEvent | null>(() => {
        const weather = (syntheticData as { weather_context?: WeatherEvent }).weather_context;
        return weather ?? null;
    }, []);

    // Get scenario by ID
    const getScenario = useCallback((scenarioId: string): MockAgentScenario | undefined => {
        return SCENARIOS.find((s) => s.id === scenarioId);
    }, []);

    // Get reports for a specific scenario
    const getScenarioReports = useCallback(
        (scenarioId: string): HazardReport[] => {
            const scenario = getScenario(scenarioId);
            if (!scenario) return allReports;
            return allReports.filter((r) => scenario.reportIds.includes(r.id));
        },
        [allReports, getScenario]
    );

    // Get insights for a specific scenario
    const getScenarioInsights = useCallback(
        (scenarioId: string): SpatialInsight[] => {
            const scenario = getScenario(scenarioId);
            if (!scenario) return allInsights;
            return allInsights.filter((i) => scenario.insightIds.includes(i.id));
        },
        [allInsights, getScenario]
    );

    // Filtered reports based on active scenario
    const reports = useMemo<HazardReport[]>(() => {
        if (!activeScenario) return allReports;
        return getScenarioReports(activeScenario);
    }, [activeScenario, allReports, getScenarioReports]);

    // Filtered insights based on active scenario
    const insights = useMemo<SpatialInsight[]>(() => {
        if (!activeScenario) return allInsights;
        return getScenarioInsights(activeScenario);
    }, [activeScenario, allInsights, getScenarioInsights]);

    // Trigger a specific scenario
    const triggerScenario = useCallback((scenarioId: string) => {
        const scenario = SCENARIOS.find((s) => s.id === scenarioId);
        if (scenario) {
            setActiveScenario(scenarioId);
        }
    }, []);

    // Reset to show all data
    const reset = useCallback(() => {
        setActiveScenario(null);
    }, []);

    // Check if a scenario is active
    const isScenarioActive = useCallback(
        (scenarioId: string): boolean => {
            return activeScenario === scenarioId;
        },
        [activeScenario]
    );

    return {
        scenarios: SCENARIOS,
        activeScenario,
        reports,
        insights,
        allReports,
        allInsights,
        weatherContext,
        triggerScenario,
        reset,
        isScenarioActive,
        getScenarioReports,
        getScenarioInsights,
    };
}

/**
 * Utility function to get cluster reports.
 */
export function getClusterReports(reports: HazardReport[]): HazardReport[] {
    return reports.filter((r) => r.pattern_detection?.is_cluster_member === true);
}

/**
 * Utility function to get duplicate reports.
 */
export function getDuplicateReports(reports: HazardReport[]): HazardReport[] {
    return reports.filter((r) => r.pattern_detection?.is_duplicate === true);
}

/**
 * Utility function to get high-risk reports (safety alerts).
 */
export function getHighRiskReports(reports: HazardReport[]): HazardReport[] {
    return reports.filter((r) => r.safety_alert === true);
}

/**
 * Utility function to get reports by district.
 */
export function getReportsByDistrict(
    reports: HazardReport[],
    districtId: string
): HazardReport[] {
    return reports.filter((r) => r.assignment?.district_id === districtId);
}

/**
 * Utility function to get reports by trail.
 */
export function getReportsByTrail(
    reports: HazardReport[],
    trailName: string
): HazardReport[] {
    return reports.filter((r) => r.trail_name === trailName);
}
