import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useAuditLog } from './useAuditLog';
import { UIModeProvider } from '../contexts/UIModeContext';
import { auditLog } from '../services/auditLog';
import type { ReactNode } from 'react';

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

// Wrapper with context
function createWrapper(mode: string = 'traditional') {
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <MemoryRouter initialEntries={[`/?mode=${mode}`]}>
                <UIModeProvider>{children}</UIModeProvider>
            </MemoryRouter>
        );
    };
}

describe('useAuditLog', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorageMock.clear();
        auditLog.clearLogs();
    });

    describe('log', () => {
        it('creates a log entry with auto-filled activeFeatures', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper('agentic'),
            });

            let entry;
            act(() => {
                entry = result.current.log({
                    actionType: 'cluster_detected',
                    source: 'TestComponent',
                    description: 'Test cluster',
                    payload: { clusterId: 'c1', reportIds: ['r1'], reportCount: 1 },
                });
            });

            // Agentic mode has several features enabled
            expect(entry!.activeFeatures).toContain('enable_confidence_indicators');
            expect(entry!.activeFeatures).toContain('spatialInsights');
            expect(entry!.activeFeatures).toContain('mapPrimary');
        });

        it('has empty activeFeatures in traditional mode', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper('traditional'),
            });

            let entry;
            act(() => {
                entry = result.current.log({
                    actionType: 'cluster_detected',
                    source: 'TestComponent',
                    description: 'Test',
                    payload: {},
                });
            });

            // Traditional mode has no features enabled
            expect(entry!.activeFeatures).toEqual([]);
        });

        it('includes moderate mode features', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper('moderate'),
            });

            let entry;
            act(() => {
                entry = result.current.log({
                    actionType: 'reasoning_expanded',
                    source: 'ReasoningPanel',
                    description: 'Panel expanded',
                    payload: { reportId: 'r1', expandedVia: 'click' },
                });
            });

            // Moderate mode has confidence/reasoning features
            expect(entry!.activeFeatures).toContain('enable_confidence_indicators');
            expect(entry!.activeFeatures).toContain('enable_reasoning_panel');
            // But not map-first features
            expect(entry!.activeFeatures).not.toContain('mapPrimary');
        });
    });

    describe('getLogs', () => {
        it('returns all session logs', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test1',
                    description: 'First',
                    payload: {},
                });
                result.current.log({
                    actionType: 'duplicate_flagged',
                    source: 'Test2',
                    description: 'Second',
                    payload: {},
                });
            });

            const logs = result.current.getLogs();
            expect(logs).toHaveLength(2);
        });
    });

    describe('getLogsByType', () => {
        it('filters logs by action type', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: 'Cluster',
                    payload: {},
                });
                result.current.log({
                    actionType: 'duplicate_flagged',
                    source: 'Test',
                    description: 'Duplicate',
                    payload: {},
                });
            });

            const clusterLogs = result.current.getLogsByType('cluster_detected');
            expect(clusterLogs).toHaveLength(1);
            expect(clusterLogs[0].actionType).toBe('cluster_detected');
        });
    });

    describe('getLogsFiltered', () => {
        it('applies filter criteria', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'ComponentA',
                    description: 'Test',
                    payload: {},
                    outcome: 'success',
                });
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'ComponentB',
                    description: 'Test',
                    payload: {},
                    outcome: 'failure',
                });
            });

            const filtered = result.current.getLogsFiltered({
                source: 'ComponentA',
            });
            expect(filtered).toHaveLength(1);
        });
    });

    describe('getRecentLogs', () => {
        it('returns N most recent logs', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                for (let i = 1; i <= 5; i++) {
                    result.current.log({
                        actionType: 'cluster_detected',
                        source: 'Test',
                        description: `Log ${i}`,
                        payload: { index: i },
                    });
                }
            });

            const recent = result.current.getRecentLogs(2);
            expect(recent).toHaveLength(2);
        });
    });

    describe('exportLogs', () => {
        it('exports as JSON string', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: 'Test',
                    payload: {},
                });
            });

            const exported = result.current.exportLogs();
            const parsed = JSON.parse(exported);
            expect(Array.isArray(parsed)).toBe(true);
            expect(parsed[0].actionType).toBe('cluster_detected');
        });
    });

    describe('getLogCount', () => {
        it('returns correct count', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            expect(result.current.getLogCount()).toBe(0);

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: 'Test',
                    payload: {},
                });
            });

            expect(result.current.getLogCount()).toBe(1);
        });
    });

    describe('clearLogs', () => {
        it('clears all logs', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: 'Test',
                    payload: {},
                });
            });

            expect(result.current.getLogCount()).toBe(1);

            act(() => {
                result.current.clearLogs();
            });

            expect(result.current.getLogCount()).toBe(0);
        });
    });

    describe('sessionId', () => {
        it('provides session ID', () => {
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: createWrapper(),
            });

            expect(result.current.sessionId).toMatch(/^[0-9a-f-]{36}$/);
        });
    });

    describe('without provider', () => {
        it('still works but with empty activeFeatures', () => {
            // Render without UIModeProvider
            const { result } = renderHook(() => useAuditLog(), {
                wrapper: ({ children }: { children: ReactNode }) => (
                    <MemoryRouter>{children}</MemoryRouter>
                ),
            });

            let entry;
            act(() => {
                entry = result.current.log({
                    actionType: 'cluster_detected',
                    source: 'Test',
                    description: 'Test',
                    payload: {},
                });
            });

            expect(entry!.activeFeatures).toEqual([]);
        });
    });
});
