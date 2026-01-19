/**
 * Types for streaming extraction events and state.
 */

/** Event type names for SSE extraction stream */
export type ExtractionEventType =
    | 'extraction_start'
    | 'field_extracted'
    | 'reasoning_chunk'
    | 'extraction_complete'
    | 'error';

/** Base structure for all extraction events */
interface BaseExtractionEvent {
    event: ExtractionEventType;
}

/** Event emitted when extraction starts */
export interface ExtractionStartEvent extends BaseExtractionEvent {
    event: 'extraction_start';
    data: {
        report_id: string;
        status: 'processing';
    };
}

/** Event emitted when a field is extracted */
export interface FieldExtractedEvent extends BaseExtractionEvent {
    event: 'field_extracted';
    data: {
        field: 'tracs_category' | 'severity' | 'confidence';
        value: string | number;
        display_value: string;
    };
}

/** Event emitted for reasoning text chunks (typewriter effect) */
export interface ReasoningChunkEvent extends BaseExtractionEvent {
    event: 'reasoning_chunk';
    data: {
        text: string;
        is_final: boolean;
    };
}

/** Complete extraction result */
export interface ExtractionResult {
    tracs_category: string;
    tracs_category_name: string;
    severity: string;
    severity_name: string;
    confidence: number;
    reasoning: string;
}

/** Event emitted when extraction completes */
export interface ExtractionCompleteEvent extends BaseExtractionEvent {
    event: 'extraction_complete';
    data: {
        report_id: string;
        extraction: ExtractionResult;
    };
}

/** Event emitted on error */
export interface ExtractionErrorEvent extends BaseExtractionEvent {
    event: 'error';
    data: {
        message: string;
        code?: string;
    };
}

/** Union type for all extraction events */
export type ExtractionEvent =
    | ExtractionStartEvent
    | FieldExtractedEvent
    | ReasoningChunkEvent
    | ExtractionCompleteEvent
    | ExtractionErrorEvent;

/** Status of the streaming extraction process */
export type StreamingExtractionStatus =
    | 'idle'
    | 'connecting'
    | 'extracting'
    | 'complete'
    | 'error';

/** Extracted field state during streaming */
export interface ExtractedField {
    field: string;
    value: string | number;
    displayValue: string;
    extractedAt: Date;
}

/** State for the streaming extraction hook */
export interface StreamingExtractionState {
    /** Current status of the extraction */
    status: StreamingExtractionStatus;
    /** Report ID being extracted */
    reportId: string | null;
    /** Fields extracted so far */
    extractedFields: ExtractedField[];
    /** Accumulated reasoning text (for typewriter effect) */
    reasoningText: string;
    /** Whether reasoning is complete */
    reasoningComplete: boolean;
    /** Final extraction result (when complete) */
    result: ExtractionResult | null;
    /** Error message if status is 'error' */
    error: string | null;
    /** Progress percentage (0-100) */
    progress: number;
}

/** Initial state for streaming extraction */
export const INITIAL_STREAMING_STATE: StreamingExtractionState = {
    status: 'idle',
    reportId: null,
    extractedFields: [],
    reasoningText: '',
    reasoningComplete: false,
    result: null,
    error: null,
    progress: 0,
};
