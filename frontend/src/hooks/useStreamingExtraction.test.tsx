import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useStreamingExtraction } from './useStreamingExtraction';

// Type for custom event handlers
type SSEHandler = (event: MessageEvent) => void;

// Mock EventSource
class MockEventSource {
    static instances: MockEventSource[] = [];
    url: string;
    onopen: (() => void) | null = null;
    onmessage: ((event: MessageEvent) => void) | null = null;
    onerror: ((event: Event) => void) | null = null;
    readyState = 0;
    CONNECTING = 0;
    OPEN = 1;
    CLOSED = 2;

    // Custom SSE event handlers
    private customHandlers: Record<string, SSEHandler> = {};

    constructor(url: string) {
        this.url = url;
        MockEventSource.instances.push(this);
    }

    close() {
        this.readyState = this.CLOSED;
    }

    // Helper to simulate events
    simulateOpen() {
        this.readyState = this.OPEN;
        this.onopen?.();
    }

    simulateError() {
        this.onerror?.(new Event('error'));
    }

    getHandler(eventType: string): SSEHandler | undefined {
        return this.customHandlers[eventType];
    }

    addEventListener(type: string, listener: EventListener) {
        if (type === 'open') {
            this.onopen = listener as () => void;
        } else if (type === 'error') {
            this.onerror = listener as (event: Event) => void;
        } else {
            // SSE custom events
            this.customHandlers[type] = listener as SSEHandler;
        }
    }

    removeEventListener() {
        // No-op for tests
    }
}

// Store original EventSource
const originalEventSource = globalThis.EventSource;

describe('useStreamingExtraction', () => {
    beforeEach(() => {
        MockEventSource.instances = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).EventSource = MockEventSource;
    });

    afterEach(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (globalThis as any).EventSource = originalEventSource;
    });

    describe('initial state', () => {
        it('starts with idle status', () => {
            const { result } = renderHook(() => useStreamingExtraction());

            expect(result.current.state.status).toBe('idle');
            expect(result.current.state.reportId).toBeNull();
            expect(result.current.state.extractedFields).toEqual([]);
            expect(result.current.state.reasoningText).toBe('');
            expect(result.current.state.result).toBeNull();
            expect(result.current.state.error).toBeNull();
        });
    });

    describe('startExtraction', () => {
        it('sets status to connecting when starting', () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            expect(result.current.state.status).toBe('connecting');
            expect(result.current.state.reportId).toBe('report-123');
        });

        it('creates EventSource with correct URL', () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            expect(MockEventSource.instances).toHaveLength(1);
            expect(MockEventSource.instances[0].url).toContain('/api/v1/reports/report-123/extract/stream');
        });
    });

    describe('event handling', () => {
        it('updates status to extracting on extraction_start event', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            // Simulate the event listener being called
            act(() => {
                const handler = eventSource.getHandler('extraction_start');
                if (handler) {
                    handler(new MessageEvent('extraction_start', {
                        data: JSON.stringify({ report_id: 'report-123', status: 'processing' }),
                    }));
                }
            });

            await waitFor(() => {
                expect(result.current.state.status).toBe('extracting');
            });
        });

        it('accumulates extracted fields on field_extracted events', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            // Simulate field extraction event
            act(() => {
                const handler = eventSource.getHandler('field_extracted');
                if (handler) {
                    handler(new MessageEvent('field_extracted', {
                        data: JSON.stringify({
                            field: 'tracs_category',
                            value: 'CLR',
                            display_value: 'Clearing',
                        }),
                    }));
                }
            });

            await waitFor(() => {
                expect(result.current.state.extractedFields).toHaveLength(1);
                expect(result.current.state.extractedFields[0].field).toBe('tracs_category');
            });
        });

        it('accumulates reasoning text on reasoning_chunk events', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            act(() => {
                const handler = eventSource.getHandler('reasoning_chunk');
                if (handler) {
                    handler(new MessageEvent('reasoning_chunk', {
                        data: JSON.stringify({ text: 'First chunk ', is_final: false }),
                    }));
                }
            });

            act(() => {
                const handler = eventSource.getHandler('reasoning_chunk');
                if (handler) {
                    handler(new MessageEvent('reasoning_chunk', {
                        data: JSON.stringify({ text: 'second chunk.', is_final: true }),
                    }));
                }
            });

            await waitFor(() => {
                expect(result.current.state.reasoningText).toBe('First chunk second chunk.');
                expect(result.current.state.reasoningComplete).toBe(true);
            });
        });

        it('sets result and status complete on extraction_complete event', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            act(() => {
                const handler = eventSource.getHandler('extraction_complete');
                if (handler) {
                    handler(new MessageEvent('extraction_complete', {
                        data: JSON.stringify({
                            report_id: 'report-123',
                            extraction: {
                                tracs_category: 'CLR',
                                tracs_category_name: 'Clearing',
                                severity: 'SEV_HIGH',
                                severity_name: 'High',
                                confidence: 0.75,
                                reasoning: 'Full reasoning text.',
                            },
                        }),
                    }));
                }
            });

            await waitFor(() => {
                expect(result.current.state.status).toBe('complete');
                expect(result.current.state.result).not.toBeNull();
                expect(result.current.state.result?.tracs_category).toBe('CLR');
            });
        });

        it('sets error status on error event', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            act(() => {
                eventSource.simulateError();
            });

            await waitFor(() => {
                expect(result.current.state.status).toBe('error');
                expect(result.current.state.error).not.toBeNull();
            });
        });
    });

    describe('cancelExtraction', () => {
        it('closes EventSource and resets state', () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            act(() => {
                result.current.cancelExtraction();
            });

            expect(eventSource.readyState).toBe(eventSource.CLOSED);
            expect(result.current.state.status).toBe('idle');
        });
    });

    describe('reset', () => {
        it('resets state to initial values', async () => {
            const { result } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            // Simulate some events first
            act(() => {
                const handler = eventSource.getHandler('field_extracted');
                if (handler) {
                    handler(new MessageEvent('field_extracted', {
                        data: JSON.stringify({
                            field: 'tracs_category',
                            value: 'CLR',
                            display_value: 'Clearing',
                        }),
                    }));
                }
            });

            await waitFor(() => {
                expect(result.current.state.extractedFields.length).toBeGreaterThan(0);
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.state.status).toBe('idle');
            expect(result.current.state.extractedFields).toEqual([]);
            expect(result.current.state.reasoningText).toBe('');
        });
    });

    describe('cleanup', () => {
        it('closes EventSource on unmount', () => {
            const { result, unmount } = renderHook(() => useStreamingExtraction());

            act(() => {
                result.current.startExtraction('report-123');
            });

            const eventSource = MockEventSource.instances[0];

            unmount();

            expect(eventSource.readyState).toBe(eventSource.CLOSED);
        });
    });
});
