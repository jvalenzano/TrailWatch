/**
 * Audit Log Service
 *
 * Tracks AI actions with a standardized JSON schema for compliance and debugging.
 * Uses in-memory buffer with sessionStorage persistence.
 */

import type {
    AuditLogEntry,
    AuditLogInput,
    AuditLogFilter,
    AuditActionType,
} from '../types/audit';
import { AUDIT_LOG_STORAGE_KEY, MAX_AUDIT_LOGS } from '../types/audit';

/**
 * Generate a UUID v4.
 */
function generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}

/**
 * Get or create session ID.
 */
function getSessionId(): string {
    const key = 'trailwatch_session_id';
    let sessionId = sessionStorage.getItem(key);
    if (!sessionId) {
        sessionId = generateId();
        sessionStorage.setItem(key, sessionId);
    }
    return sessionId;
}

/**
 * AuditLogService class - singleton pattern.
 */
class AuditLogServiceImpl {
    private logs: AuditLogEntry[] = [];
    private sessionId: string;
    private initialized = false;

    constructor() {
        this.sessionId = '';
    }

    /**
     * Initialize the service (lazy initialization for SSR safety).
     */
    private initialize(): void {
        if (this.initialized) return;

        // Only initialize in browser environment
        if (typeof window === 'undefined') return;

        this.sessionId = getSessionId();
        this.loadFromStorage();
        this.initialized = true;
    }

    /**
     * Load logs from sessionStorage.
     */
    private loadFromStorage(): void {
        try {
            const stored = sessionStorage.getItem(AUDIT_LOG_STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored) as AuditLogEntry[];
                // Filter to current session only
                this.logs = parsed.filter((log) => log.sessionId === this.sessionId);
            }
        } catch (error) {
            console.warn('[AuditLog] Failed to load from storage:', error);
            this.logs = [];
        }
    }

    /**
     * Save logs to sessionStorage.
     */
    private saveToStorage(): void {
        try {
            // Trim to max size
            const logsToStore = this.logs.slice(-MAX_AUDIT_LOGS);
            sessionStorage.setItem(AUDIT_LOG_STORAGE_KEY, JSON.stringify(logsToStore));
        } catch (error) {
            console.warn('[AuditLog] Failed to save to storage:', error);
        }
    }

    /**
     * Log an AI action.
     */
    log(input: AuditLogInput): AuditLogEntry {
        this.initialize();

        const entry: AuditLogEntry = {
            id: generateId(),
            timestamp: new Date().toISOString(),
            sessionId: this.sessionId,
            actionType: input.actionType,
            source: input.source,
            description: input.description,
            payload: input.payload,
            confidence: input.confidence,
            activeFeatures: input.activeFeatures ?? [],
            outcome: input.outcome,
        };

        this.logs.push(entry);

        // Trim in-memory buffer
        if (this.logs.length > MAX_AUDIT_LOGS) {
            this.logs = this.logs.slice(-MAX_AUDIT_LOGS);
        }

        this.saveToStorage();

        // Debug logging in development
        if (import.meta.env.DEV) {
            console.debug('[AuditLog]', entry.actionType, entry.description, entry.payload);
        }

        return entry;
    }

    /**
     * Get all logs for current session.
     */
    getSessionLogs(): AuditLogEntry[] {
        this.initialize();
        return [...this.logs];
    }

    /**
     * Get logs filtered by action type.
     */
    getLogsByType(actionType: AuditActionType): AuditLogEntry[] {
        this.initialize();
        return this.logs.filter((log) => log.actionType === actionType);
    }

    /**
     * Get logs matching filter criteria.
     */
    getLogsFiltered(filter: AuditLogFilter): AuditLogEntry[] {
        this.initialize();

        return this.logs.filter((log) => {
            if (filter.actionType && log.actionType !== filter.actionType) {
                return false;
            }
            if (filter.source && log.source !== filter.source) {
                return false;
            }
            if (filter.outcome && log.outcome !== filter.outcome) {
                return false;
            }
            if (filter.startTime && log.timestamp < filter.startTime) {
                return false;
            }
            if (filter.endTime && log.timestamp > filter.endTime) {
                return false;
            }
            return true;
        });
    }

    /**
     * Get the most recent N logs.
     */
    getRecentLogs(count: number): AuditLogEntry[] {
        this.initialize();
        return this.logs.slice(-count);
    }

    /**
     * Export all logs as JSON string.
     */
    exportLogs(): string {
        this.initialize();
        return JSON.stringify(this.logs, null, 2);
    }

    /**
     * Export logs as downloadable blob.
     */
    exportLogsAsBlob(): Blob {
        const json = this.exportLogs();
        return new Blob([json], { type: 'application/json' });
    }

    /**
     * Get log count.
     */
    getLogCount(): number {
        this.initialize();
        return this.logs.length;
    }

    /**
     * Clear all logs for current session.
     */
    clearLogs(): void {
        this.initialize();
        this.logs = [];
        this.saveToStorage();
    }

    /**
     * Get current session ID.
     */
    getSessionId(): string {
        this.initialize();
        return this.sessionId;
    }
}

// Singleton instance
const auditLogService = new AuditLogServiceImpl();

// Export singleton methods
export const auditLog = {
    /**
     * Log an AI action.
     */
    log: (input: AuditLogInput): AuditLogEntry => auditLogService.log(input),

    /**
     * Get all logs for current session.
     */
    getSessionLogs: (): AuditLogEntry[] => auditLogService.getSessionLogs(),

    /**
     * Get logs filtered by action type.
     */
    getLogsByType: (actionType: AuditActionType): AuditLogEntry[] =>
        auditLogService.getLogsByType(actionType),

    /**
     * Get logs matching filter criteria.
     */
    getLogsFiltered: (filter: AuditLogFilter): AuditLogEntry[] =>
        auditLogService.getLogsFiltered(filter),

    /**
     * Get the most recent N logs.
     */
    getRecentLogs: (count: number): AuditLogEntry[] =>
        auditLogService.getRecentLogs(count),

    /**
     * Export all logs as JSON string.
     */
    exportLogs: (): string => auditLogService.exportLogs(),

    /**
     * Export logs as downloadable blob.
     */
    exportLogsAsBlob: (): Blob => auditLogService.exportLogsAsBlob(),

    /**
     * Get log count.
     */
    getLogCount: (): number => auditLogService.getLogCount(),

    /**
     * Clear all logs for current session.
     */
    clearLogs: (): void => auditLogService.clearLogs(),

    /**
     * Get current session ID.
     */
    getSessionId: (): string => auditLogService.getSessionId(),
};

// Also export the type for the service
export type AuditLogService = typeof auditLog;
