/**
 * Feedback Types
 *
 * Types for user feedback on AI decisions (RLHF data collection).
 */

/**
 * Rating for AI output - positive or negative.
 */
export type FeedbackRating = 'positive' | 'negative';

/**
 * Types of AI outputs that can receive feedback.
 */
export type FeedbackTargetType =
    | 'cluster'
    | 'duplicate'
    | 'confidence'
    | 'classification'
    | 'extraction'
    | 'severity';

/**
 * Payload for submitted feedback.
 */
export interface FeedbackPayload {
    /** Unique ID of the item being rated */
    targetId: string;
    /** Type of AI output being rated */
    targetType: FeedbackTargetType;
    /** User's rating */
    rating: FeedbackRating;
    /** Optional correction text (usually for negative feedback) */
    correctionText?: string;
    /** What the user believes the correct answer should be */
    userCorrection?: string;
    /** ISO 8601 timestamp */
    timestamp: string;
}

/**
 * Props for FeedbackComponent.
 */
export interface FeedbackComponentProps {
    /** Unique ID of the item being rated */
    targetId: string;
    /** Type of AI output being rated */
    targetType: FeedbackTargetType;
    /** What the AI predicted/decided (shown in feedback form) */
    aiOutput: string;
    /** Callback when feedback is submitted */
    onSubmit?: (feedback: FeedbackPayload) => void;
    /** Compact mode for inline use */
    compact?: boolean;
    /** Disable feedback (e.g., already submitted) */
    disabled?: boolean;
    /** Custom class name */
    className?: string;
}

/**
 * Props for FeedbackForm (expanded correction form).
 */
export interface FeedbackFormProps {
    /** What the AI predicted/decided */
    aiOutput: string;
    /** Callback when form is submitted */
    onSubmit: (correctionText: string, userCorrection?: string) => void;
    /** Callback when form is cancelled */
    onCancel: () => void;
    /** Whether submission is in progress */
    isSubmitting?: boolean;
}

/**
 * State for feedback on a specific target.
 */
export interface FeedbackState {
    /** Whether feedback has been submitted */
    submitted: boolean;
    /** The rating given (if submitted) */
    rating?: FeedbackRating;
    /** Timestamp of submission */
    submittedAt?: string;
}

/**
 * Storage key for feedback state in sessionStorage.
 */
export const FEEDBACK_STORAGE_KEY = 'trailwatch_feedback_state';
