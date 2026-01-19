import { useState, useCallback, useRef, useEffect } from 'react';
import type {
    StreamingExtractionState,
    ExtractedField,
    ExtractionResult,
} from '../types/extraction';
import { INITIAL_STREAMING_STATE } from '../types/extraction';

interface UseStreamingExtractionResult {
    /** Current streaming extraction state */
    state: StreamingExtractionState;
    /** Start extraction for a report */
    startExtraction: (reportId: string) => void;
    /** Cancel the current extraction */
    cancelExtraction: () => void;
    /** Reset state to initial values */
    reset: () => void;
}

const API_BASE_URL = import.meta.env.VITE_API_URL ?? '';

/**
 * Hook for streaming extraction events via Server-Sent Events.
 *
 * Connects to the SSE extraction endpoint and processes events:
 * - extraction_start: Marks extraction as started
 * - field_extracted: Accumulates extracted fields
 * - reasoning_chunk: Accumulates reasoning text (typewriter effect)
 * - extraction_complete: Sets final result
 * - error: Handles errors
 *
 * @example
 * const { state, startExtraction, cancelExtraction, reset } = useStreamingExtraction();
 *
 * // Start extraction
 * startExtraction('report-123');
 *
 * // Access state
 * if (state.status === 'extracting') {
 *   console.log('Progress:', state.progress);
 *   console.log('Fields:', state.extractedFields);
 *   console.log('Reasoning:', state.reasoningText);
 * }
 *
 * // Cancel if needed
 * cancelExtraction();
 */
export function useStreamingExtraction(): UseStreamingExtractionResult {
    const [state, setState] = useState<StreamingExtractionState>(INITIAL_STREAMING_STATE);
    const eventSourceRef = useRef<EventSource | null>(null);

    const cleanup = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return cleanup;
    }, [cleanup]);

    const startExtraction = useCallback((reportId: string) => {
        // Clean up any existing connection
        cleanup();

        // Set connecting state
        setState({
            ...INITIAL_STREAMING_STATE,
            status: 'connecting',
            reportId,
        });

        const url = `${API_BASE_URL}/api/v1/reports/${reportId}/extract/stream`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        // Handle connection open
        eventSource.addEventListener('open', () => {
            setState((prev) => ({
                ...prev,
                status: 'extracting',
            }));
        });

        // Handle extraction_start event
        eventSource.addEventListener('extraction_start', (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            setState((prev) => ({
                ...prev,
                status: 'extracting',
                reportId: data.report_id,
                progress: 10,
            }));
        });

        // Handle field_extracted event
        eventSource.addEventListener('field_extracted', (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            const field: ExtractedField = {
                field: data.field,
                value: data.value,
                displayValue: data.display_value,
                extractedAt: new Date(),
            };

            setState((prev) => {
                const newFields = [...prev.extractedFields, field];
                // Calculate progress based on fields (3 expected)
                const fieldProgress = Math.min(30 + newFields.length * 20, 90);
                return {
                    ...prev,
                    extractedFields: newFields,
                    progress: fieldProgress,
                };
            });
        });

        // Handle reasoning_chunk event
        eventSource.addEventListener('reasoning_chunk', (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            setState((prev) => ({
                ...prev,
                reasoningText: prev.reasoningText + data.text,
                reasoningComplete: data.is_final,
                progress: data.is_final ? 95 : prev.progress,
            }));
        });

        // Handle extraction_complete event
        eventSource.addEventListener('extraction_complete', (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            const result: ExtractionResult = {
                tracs_category: data.extraction.tracs_category,
                tracs_category_name: data.extraction.tracs_category_name,
                severity: data.extraction.severity,
                severity_name: data.extraction.severity_name,
                confidence: data.extraction.confidence,
                reasoning: data.extraction.reasoning,
            };

            setState((prev) => ({
                ...prev,
                status: 'complete',
                result,
                progress: 100,
            }));

            // Close the connection
            eventSource.close();
        });

        // Handle error event
        eventSource.addEventListener('error', () => {
            setState((prev) => ({
                ...prev,
                status: 'error',
                error: 'Connection error. Please try again.',
            }));
            eventSource.close();
        });
    }, [cleanup]);

    const cancelExtraction = useCallback(() => {
        cleanup();
        setState(INITIAL_STREAMING_STATE);
    }, [cleanup]);

    const reset = useCallback(() => {
        cleanup();
        setState(INITIAL_STREAMING_STATE);
    }, [cleanup]);

    return {
        state,
        startExtraction,
        cancelExtraction,
        reset,
    };
}
