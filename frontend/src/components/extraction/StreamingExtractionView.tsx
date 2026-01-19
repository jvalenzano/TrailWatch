import type { StreamingExtractionState } from '../../types/extraction';

interface StreamingExtractionViewProps {
    /** Current streaming extraction state */
    state: StreamingExtractionState;
    /** Callback to cancel extraction */
    onCancel: () => void;
    /** Callback to reset/retry extraction */
    onReset: () => void;
}

const FIELD_LABELS: Record<string, string> = {
    tracs_category: 'Category',
    severity: 'Severity',
    confidence: 'Confidence',
};

/**
 * Component for displaying streaming extraction progress and results.
 *
 * Shows:
 * - Progress stepper with extracted fields
 * - Typewriter-style reasoning text
 * - Completion/error states
 */
export function StreamingExtractionView({
    state,
    onCancel,
    onReset,
}: StreamingExtractionViewProps) {
    const { status, progress, extractedFields, reasoningText, reasoningComplete, result, error } = state;

    // Connecting state
    if (status === 'connecting') {
        return (
            <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50" data-testid="extraction-connecting">
                <div className="flex items-center gap-3">
                    <div
                        role="status"
                        aria-label="Connecting"
                        className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"
                    />
                    <span className="text-gray-300">Connecting to extraction service...</span>
                </div>
            </div>
        );
    }

    // Error state
    if (status === 'error') {
        return (
            <div className="p-4 rounded-lg border border-red-500/50 bg-red-500/10" data-testid="extraction-error">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="text-red-300 font-medium">Extraction Failed</p>
                        <p className="text-red-400/80 text-sm mt-1">{error}</p>
                        <button
                            type="button"
                            onClick={onReset}
                            className="mt-3 px-3 py-1.5 text-sm font-medium text-red-300 border border-red-500/50 rounded-lg hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Complete state
    if (status === 'complete' && result) {
        return (
            <div className="p-4 rounded-lg border border-emerald-500/50 bg-emerald-500/10" data-testid="extraction-complete">
                <div className="flex items-start gap-3">
                    <svg
                        className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="flex-1">
                        <p className="text-emerald-300 font-medium mb-3">Extraction Complete</p>

                        {/* Result summary */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Category</span>
                                <p className="text-gray-200 font-medium">{result.tracs_category_name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Severity</span>
                                <p className="text-gray-200 font-medium">{result.severity_name}</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Confidence</span>
                                <p className="text-gray-200 font-medium">{Math.round(result.confidence * 100)}%</p>
                            </div>
                        </div>

                        {/* Reasoning */}
                        <div className="p-3 rounded bg-gray-800/50 border border-gray-700">
                            <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">AI Reasoning</span>
                            <p className="text-gray-300 text-sm">{result.reasoning}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Extracting state (default)
    return (
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800/50" data-testid="extraction-progress">
            {/* Progress bar */}
            <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Extracting information...</span>
                    <span>{progress}%</span>
                </div>
                <div
                    role="progressbar"
                    aria-valuenow={progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Extraction progress"
                    className="h-2 bg-gray-700 rounded-full overflow-hidden"
                >
                    <div
                        className="h-full bg-emerald-500 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Extracted fields */}
            {extractedFields.length > 0 && (
                <div className="mb-4 space-y-2">
                    {extractedFields.map((field) => (
                        <div
                            key={field.field}
                            className="flex items-center gap-2 text-sm animate-fadeIn"
                        >
                            <svg
                                className="w-4 h-4 text-emerald-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-gray-400">{FIELD_LABELS[field.field] ?? field.field}:</span>
                            <span className="text-gray-200 font-medium">{field.displayValue}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Reasoning text (typewriter effect) */}
            {reasoningText && (
                <div className="p-3 rounded bg-gray-900/50 border border-gray-700 mb-4">
                    <span className="text-xs text-gray-500 uppercase tracking-wider block mb-1">
                        AI Reasoning
                    </span>
                    <p className="text-gray-300 text-sm">
                        {reasoningText}
                        {!reasoningComplete && (
                            <span className="inline-block w-2 h-4 bg-emerald-400 animate-pulse ml-0.5" />
                        )}
                    </p>
                </div>
            )}

            {/* Cancel button */}
            <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 text-sm font-medium text-gray-400 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
                Cancel
            </button>
        </div>
    );
}
