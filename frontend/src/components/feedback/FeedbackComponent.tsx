import { useState, useCallback } from 'react';
import { FeedbackForm } from './FeedbackForm';
import { useAuditLog } from '../../hooks/useAuditLog';
import { useFeedback } from '../../hooks/useFeedback';
import type { FeedbackComponentProps, FeedbackPayload, FeedbackRating } from '../../types/feedback';

/**
 * Thumbs up SVG icon.
 */
function ThumbsUpIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M7 10v12" />
            <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
        </svg>
    );
}

/**
 * Thumbs down SVG icon.
 */
function ThumbsDownIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <path d="M17 14V2" />
            <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z" />
        </svg>
    );
}

/**
 * Check icon for success state.
 */
function CheckIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            aria-hidden="true"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

/**
 * Feedback component with thumbs up/down for AI predictions.
 *
 * - Thumbs up: Immediate log + success indicator
 * - Thumbs down: Opens correction form
 */
export function FeedbackComponent({
    targetId,
    targetType,
    aiOutput,
    onSubmit,
    compact = false,
    disabled = false,
    className = '',
}: FeedbackComponentProps) {
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { log } = useAuditLog();
    const { getFeedbackState, setFeedbackState } = useFeedback();

    const feedbackState = getFeedbackState(targetId);
    const hasSubmitted = feedbackState?.submitted ?? false;

    // Submit feedback (called for both positive and after form submission)
    const submitFeedback = useCallback(
        (rating: FeedbackRating, correctionText?: string) => {
            setIsSubmitting(true);

            const payload: FeedbackPayload = {
                targetId,
                targetType,
                rating,
                correctionText,
                timestamp: new Date().toISOString(),
            };

            // Log to audit service
            log({
                actionType: 'feedback_submitted',
                source: 'FeedbackComponent',
                description: `User submitted ${rating} feedback for ${targetType}`,
                payload: {
                    targetId,
                    targetType,
                    rating,
                    correctionText,
                },
                outcome: 'success',
            });

            // Save feedback state
            setFeedbackState(targetId, {
                submitted: true,
                rating,
                submittedAt: payload.timestamp,
            });

            // Notify parent
            onSubmit?.(payload);

            setIsSubmitting(false);
            setShowForm(false);
        },
        [targetId, targetType, log, setFeedbackState, onSubmit]
    );

    // Handle thumbs up click
    const handlePositive = useCallback(() => {
        if (disabled || hasSubmitted) return;
        submitFeedback('positive');
    }, [disabled, hasSubmitted, submitFeedback]);

    // Handle thumbs down click
    const handleNegative = useCallback(() => {
        if (disabled || hasSubmitted) return;
        setShowForm(true);
    }, [disabled, hasSubmitted]);

    // Handle form submission
    const handleFormSubmit = useCallback(
        (correctionText: string) => {
            submitFeedback('negative', correctionText);
        },
        [submitFeedback]
    );

    // Handle form cancel
    const handleFormCancel = useCallback(() => {
        setShowForm(false);
    }, []);

    // Success state after submission
    if (hasSubmitted) {
        return (
            <div
                className={`flex items-center gap-1 ${className}`}
                data-testid="feedback-submitted"
            >
                <CheckIcon className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-500">
                    {feedbackState?.rating === 'positive' ? 'Thanks!' : 'Feedback sent'}
                </span>
            </div>
        );
    }

    return (
        <div className={className} data-testid="feedback-component">
            <div className={`flex items-center ${compact ? 'gap-1' : 'gap-2'}`}>
                {!compact && (
                    <span className="text-xs text-gray-400 mr-1">Was this helpful?</span>
                )}

                <button
                    type="button"
                    onClick={handlePositive}
                    disabled={disabled || isSubmitting}
                    className={`p-1.5 rounded-md transition-colors
                               ${compact ? 'hover:bg-gray-700' : 'hover:bg-green-900/30'}
                               disabled:opacity-50 disabled:cursor-not-allowed
                               focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 focus:ring-offset-gray-800`}
                    aria-label="Mark AI prediction as correct"
                    data-testid="feedback-positive"
                >
                    <ThumbsUpIcon
                        className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 hover:text-green-500`}
                    />
                </button>

                <button
                    type="button"
                    onClick={handleNegative}
                    disabled={disabled || isSubmitting}
                    className={`p-1.5 rounded-md transition-colors
                               ${compact ? 'hover:bg-gray-700' : 'hover:bg-red-900/30'}
                               disabled:opacity-50 disabled:cursor-not-allowed
                               focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 focus:ring-offset-gray-800`}
                    aria-label="Mark AI prediction as incorrect"
                    aria-expanded={showForm}
                    data-testid="feedback-negative"
                >
                    <ThumbsDownIcon
                        className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} text-gray-400 hover:text-red-500`}
                    />
                </button>
            </div>

            {showForm && (
                <FeedbackForm
                    aiOutput={aiOutput}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                    isSubmitting={isSubmitting}
                />
            )}
        </div>
    );
}
