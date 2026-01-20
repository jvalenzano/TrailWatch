import { describe, it, expect, beforeEach, vi } from 'vitest';
import { auditLog } from './auditLog';
import { AUDIT_LOG_STORAGE_KEY } from '../types/audit';
import type { AuditLogInput, ClusterDetectedPayload } from '../types/audit';

// Mock sessionStorage
const mockSessionStorage: Record<string, string> = {};
const sessionStorageMock = {
    getItem: vi.fn((key: string) => mockSessionStorage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
    }),
    clear: vi.fn(() => {
        Object.keys(mockSessionStorage).forEach((key) => delete mockSessionStorage[key]);
    }),
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

describe('AuditLogService', () => {
    beforeEach(() => {
        // Clear mocks and storage
        vi.clearAllMocks();
        sessionStorageMock.clear();
        auditLog.clearLogs();
    });

    describe('log', () => {
        it('creates a log entry with auto-generated fields', () => {
            const input: AuditLogInput = {
                actionType: 'cluster_detected',
                source: 'TestComponent',
                description: 'Test cluster detected',
                payload: {
                    clusterId: 'cluster-1',
                    reportIds: ['r1', 'r2'],
                    reportCount: 2,
                } as ClusterDetectedPayload,
                confidence: 0.85,
                activeFeatures: ['spatialInsights'],
            };

            const entry = auditLog.log(input);

            expect(entry.id).toMatch(/^[0-9a-f-]{36}$/); // UUID format
            expect(entry.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/); // ISO format
            expect(entry.sessionId).toBeTruthy();
            expect(entry.actionType).toBe('cluster_detected');
            expect(entry.source).toBe('TestComponent');
            expect(entry.description).toBe('Test cluster detected');
            expect(entry.payload).toEqual({
                clusterId: 'cluster-1',
                reportIds: ['r1', 'r2'],
                reportCount: 2,
            });
            expect(entry.confidence).toBe(0.85);
            expect(entry.activeFeatures).toEqual(['spatialInsights']);
        });

        it('persists logs to sessionStorage', () => {
            auditLog.log({
                actionType: 'reasoning_expanded',
                source: 'ReasoningPanel',
                description: 'User expanded reasoning',
                payload: { reportId: 'r1', expandedVia: 'click' },
            });

            expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
                AUDIT_LOG_STORAGE_KEY,
                expect.any(String)
            );

            const stored = sessionStorageMock.getItem(AUDIT_LOG_STORAGE_KEY);
            const parsed = JSON.parse(stored as string);
            expect(parsed).toHaveLength(1);
            expect(parsed[0].actionType).toBe('reasoning_expanded');
        });

        it('defaults activeFeatures to empty array if not provided', () => {
            const entry = auditLog.log({
                actionType: 'mode_changed',
                source: 'ModeSwitcher',
                description: 'Mode changed to agentic',
                payload: { previousMode: 'traditional', newMode: 'agentic', trigger: 'user' },
            });

            expect(entry.activeFeatures).toEqual([]);
        });
    });

    describe('getSessionLogs', () => {
        it('returns all logs for current session', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test1',
                description: 'First log',
                payload: {},
            });

            auditLog.log({
                actionType: 'duplicate_flagged',
                source: 'Test2',
                description: 'Second log',
                payload: {},
            });

            const logs = auditLog.getSessionLogs();
            expect(logs).toHaveLength(2);
            expect(logs[0].actionType).toBe('cluster_detected');
            expect(logs[1].actionType).toBe('duplicate_flagged');
        });

        it('returns a copy, not the original array', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            const logs1 = auditLog.getSessionLogs();
            const logs2 = auditLog.getSessionLogs();

            expect(logs1).not.toBe(logs2);
            expect(logs1).toEqual(logs2);
        });
    });

    describe('getLogsByType', () => {
        it('filters logs by action type', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test1',
                description: 'Cluster 1',
                payload: {},
            });

            auditLog.log({
                actionType: 'duplicate_flagged',
                source: 'Test2',
                description: 'Duplicate',
                payload: {},
            });

            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test3',
                description: 'Cluster 2',
                payload: {},
            });

            const clusterLogs = auditLog.getLogsByType('cluster_detected');
            expect(clusterLogs).toHaveLength(2);
            expect(clusterLogs.every((l) => l.actionType === 'cluster_detected')).toBe(true);

            const duplicateLogs = auditLog.getLogsByType('duplicate_flagged');
            expect(duplicateLogs).toHaveLength(1);
        });

        it('returns empty array if no matching logs', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            const logs = auditLog.getLogsByType('circuit_breaker_approved');
            expect(logs).toEqual([]);
        });
    });

    describe('getLogsFiltered', () => {
        beforeEach(() => {
            // Create test logs
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'ComponentA',
                description: 'Test 1',
                payload: {},
                outcome: 'success',
            });

            auditLog.log({
                actionType: 'duplicate_flagged',
                source: 'ComponentB',
                description: 'Test 2',
                payload: {},
                outcome: 'failure',
            });

            auditLog.log({
                actionType: 'cluster_detected',
                source: 'ComponentA',
                description: 'Test 3',
                payload: {},
                outcome: 'success',
            });
        });

        it('filters by action type', () => {
            const logs = auditLog.getLogsFiltered({ actionType: 'cluster_detected' });
            expect(logs).toHaveLength(2);
        });

        it('filters by source', () => {
            const logs = auditLog.getLogsFiltered({ source: 'ComponentA' });
            expect(logs).toHaveLength(2);
        });

        it('filters by outcome', () => {
            const logs = auditLog.getLogsFiltered({ outcome: 'success' });
            expect(logs).toHaveLength(2);
        });

        it('combines multiple filters', () => {
            const logs = auditLog.getLogsFiltered({
                actionType: 'cluster_detected',
                source: 'ComponentA',
            });
            expect(logs).toHaveLength(2);
        });

        it('returns empty array when no matches', () => {
            const logs = auditLog.getLogsFiltered({
                actionType: 'circuit_breaker_approved',
            });
            expect(logs).toEqual([]);
        });
    });

    describe('getRecentLogs', () => {
        it('returns the N most recent logs', () => {
            for (let i = 1; i <= 5; i++) {
                auditLog.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: `Log ${i}`,
                    payload: { index: i },
                });
            }

            const recent = auditLog.getRecentLogs(3);
            expect(recent).toHaveLength(3);
            expect((recent[0].payload as { index: number }).index).toBe(3);
            expect((recent[2].payload as { index: number }).index).toBe(5);
        });

        it('returns all logs if count exceeds total', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Only log',
                payload: {},
            });

            const recent = auditLog.getRecentLogs(100);
            expect(recent).toHaveLength(1);
        });
    });

    describe('exportLogs', () => {
        it('exports logs as JSON string', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test log',
                payload: { data: 'value' },
            });

            const exported = auditLog.exportLogs();
            const parsed = JSON.parse(exported);

            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed).toHaveLength(1);
            expect(parsed[0].actionType).toBe('cluster_detected');
        });

        it('formats JSON with indentation', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            const exported = auditLog.exportLogs();
            expect(exported).toContain('\n'); // Has newlines (formatted)
        });
    });

    describe('exportLogsAsBlob', () => {
        it('creates a Blob with correct MIME type', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            const blob = auditLog.exportLogsAsBlob();
            expect(blob).toBeInstanceOf(Blob);
            expect(blob.type).toBe('application/json');
        });
    });

    describe('getLogCount', () => {
        it('returns correct count', () => {
            expect(auditLog.getLogCount()).toBe(0);

            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            expect(auditLog.getLogCount()).toBe(1);

            auditLog.log({
                actionType: 'duplicate_flagged',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            expect(auditLog.getLogCount()).toBe(2);
        });
    });

    describe('clearLogs', () => {
        it('removes all logs', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            expect(auditLog.getLogCount()).toBe(1);

            auditLog.clearLogs();

            expect(auditLog.getLogCount()).toBe(0);
            expect(auditLog.getSessionLogs()).toEqual([]);
        });

        it('persists cleared state to storage', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test',
                description: 'Test',
                payload: {},
            });

            auditLog.clearLogs();

            // Should have called setItem with empty array
            const lastCall = sessionStorageMock.setItem.mock.calls.slice(-1)[0];
            expect(lastCall[0]).toBe(AUDIT_LOG_STORAGE_KEY);
            expect(JSON.parse(lastCall[1])).toEqual([]);
        });
    });

    describe('getSessionId', () => {
        it('returns consistent session ID', () => {
            const id1 = auditLog.getSessionId();
            const id2 = auditLog.getSessionId();

            expect(id1).toBe(id2);
            expect(id1).toMatch(/^[0-9a-f-]{36}$/);
        });
    });

    describe('session persistence', () => {
        it('all logs in session have same sessionId', () => {
            auditLog.log({
                actionType: 'cluster_detected',
                source: 'Test1',
                description: 'First',
                payload: {},
            });

            auditLog.log({
                actionType: 'duplicate_flagged',
                source: 'Test2',
                description: 'Second',
                payload: {},
            });

            const logs = auditLog.getSessionLogs();
            const sessionIds = logs.map((l) => l.sessionId);
            const uniqueIds = [...new Set(sessionIds)];

            expect(uniqueIds).toHaveLength(1);
            expect(uniqueIds[0]).toBe(auditLog.getSessionId());
        });
    });
});
