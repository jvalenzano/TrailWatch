/**
 * Utility functions for reasoning components.
 */
import type { HazardReport } from '../../types/report';

/**
 * Determines if a report is high-risk requiring circuit breaker confirmation.
 */
export function isHighRiskReport(report: HazardReport): boolean {
    return (
        report.safety_alert === true ||
        report.triage_result?.severity === 'SEV3' ||
        report.severity_estimate === 'dangerous'
    );
}
