/**
 * useAuditLog Hook
 *
 * React hook for logging AI actions from components.
 * Provides convenient access to the AuditLogService with
 * automatic feature flag context from UIModeContext.
 */

import { useCallback, useMemo } from 'react';
import { auditLog } from '../services/auditLog';
import { useUIModeContextSafe } from './useUIMode';
import type {
    AuditLogEntry,
    AuditLogInput,
    AuditActionType,
    AuditLogFilter,
    AuditPayload,
    AuditOutcome,
} from '../types/audit';

/**
 * Simplified log input for components (auto-fills activeFeatures).
 */
export interface UseAuditLogInput {
    actionType: AuditActionType;
    source: string;
    description: string;
    payload: AuditPayload;
    confidence?: number;
    outcome?: AuditOutcome;
}

/**
 * Return type for useAuditLog hook.
 */
export interface UseAuditLogReturn {
    /** Log an AI action with automatic feature flag context */
    log: (input: UseAuditLogInput) => AuditLogEntry;
    /** Get all logs for current session */
    getLogs: () => AuditLogEntry[];
    /** Get logs by action type */
    getLogsByType: (actionType: AuditActionType) => AuditLogEntry[];
    /** Get logs matching filter */
    getLogsFiltered: (filter: AuditLogFilter) => AuditLogEntry[];
    /** Get recent N logs */
    getRecentLogs: (count: number) => AuditLogEntry[];
    /** Export logs as JSON */
    exportLogs: () => string;
    /** Get log count */
    getLogCount: () => number;
    /** Clear all logs */
    clearLogs: () => void;
    /** Current session ID */
    sessionId: string;
}

/**
 * Hook for logging AI actions from React components.
 *
 * Automatically includes active feature flags from the current UI mode context.
 *
 * @example
 * ```tsx
 * function ClusterInsightCard({ cluster }: Props) {
 *     const { log } = useAuditLog();
 *
 *     useEffect(() => {
 *         log({
 *             actionType: 'cluster_detected',
 *             source: 'ClusterInsightCard',
 *             description: `Detected cluster with ${cluster.reports.length} reports`,
 *             payload: {
 *                 clusterId: cluster.id,
 *                 reportIds: cluster.reports.map(r => r.id),
 *                 reportCount: cluster.reports.length,
 *             },
 *             confidence: cluster.confidence,
 *         });
 *     }, [cluster.id]);
 *
 *     return <div>...</div>;
 * }
 * ```
 */
export function useAuditLog(): UseAuditLogReturn {
    const context = useUIModeContextSafe();

    // Get active features from context
    const activeFeatures = useMemo(() => {
        if (!context) return [];

        const features = context.mode.features;
        return Object.entries(features)
            .filter(([, enabled]) => enabled)
            .map(([feature]) => feature);
    }, [context]);

    // Log function that auto-fills activeFeatures
    const log = useCallback(
        (input: UseAuditLogInput): AuditLogEntry => {
            const fullInput: AuditLogInput = {
                ...input,
                activeFeatures,
            };
            return auditLog.log(fullInput);
        },
        [activeFeatures]
    );

    // Memoized return object
    return useMemo(
        () => ({
            log,
            getLogs: auditLog.getSessionLogs,
            getLogsByType: auditLog.getLogsByType,
            getLogsFiltered: auditLog.getLogsFiltered,
            getRecentLogs: auditLog.getRecentLogs,
            exportLogs: auditLog.exportLogs,
            getLogCount: auditLog.getLogCount,
            clearLogs: auditLog.clearLogs,
            sessionId: auditLog.getSessionId(),
        }),
        [log]
    );
}

/**
 * Standalone log function for use outside React components.
 *
 * Note: This won't have automatic feature flag context.
 * Prefer useAuditLog hook in React components.
 */
export function logAuditEvent(input: AuditLogInput): AuditLogEntry {
    return auditLog.log(input);
}
