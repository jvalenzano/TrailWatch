import { useState, useRef, useEffect, useCallback } from 'react';
import type { FeedbackFormProps } from '../../types/feedback';

/**
 * Expanded feedback form for correction details.
 *
 * Shows when user clicks thumbs down - allows them to explain
 * what should have been the correct result.
 */
export function FeedbackForm({
    aiOutput,
    onSubmit,
    onCancel,
    isSubmitting = false,
}: FeedbackFormProps) {
    const [correctionText, setCorrectionText] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Focus textarea on mount
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                onCancel();
            }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                if (correctionText.trim()) {
                    onSubmit(correctionText.trim());
                }
            }
        },
        [correctionText, onCancel, onSubmit]
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (correctionText.trim()) {
            onSubmit(correctionText.trim());
        }
    };

    return (
        <div
            className="mt-3 p-4 bg-gray-800 rounded-lg border border-gray-700"
            role="region"
            aria-label="Feedback correction form"
        >
            <h4 className="text-sm font-medium text-gray-200 mb-2">
                Help us improve
            </h4>

            <p className="text-xs text-gray-400 mb-3">
                AI predicted: <span className="text-gray-300">{aiOutput}</span>
            </p>

            <form onSubmit={handleSubmit}>
                <label htmlFor="correction-text" className="block text-sm text-gray-300 mb-1">
                    What should the result have been?
                </label>
                <textarea
                    ref={textareaRef}
                    id="correction-text"
                    value={correctionText}
                    onChange={(e) => setCorrectionText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe the correct answer or what went wrong..."
                    className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-md
                               text-gray-200 placeholder-gray-500 text-sm
                               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                               resize-none"
                    rows={3}
                    disabled={isSubmitting}
                    aria-describedby="correction-hint"
                />
                <p id="correction-hint" className="text-xs text-gray-500 mt-1">
                    Press Ctrl+Enter to submit, Escape to cancel
                </p>

                <div className="flex justify-end gap-2 mt-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200
                                   transition-colors disabled:opacity-50"
                        aria-label="Cancel feedback"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!correctionText.trim() || isSubmitting}
                        className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-md
                                   hover:bg-indigo-500 transition-colors
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        aria-label="Submit feedback"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
}
