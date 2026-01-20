/**
 * useFeedback Hook
 *
 * Manages feedback state persistence in sessionStorage.
 * Tracks which items have received feedback to prevent duplicate submissions.
 */

import { useState, useCallback, useEffect } from 'react';
import type { FeedbackState } from '../types/feedback';
import { FEEDBACK_STORAGE_KEY } from '../types/feedback';

/**
 * Map of targetId -> FeedbackState
 */
type FeedbackStateMap = Record<string, FeedbackState>;

/**
 * Load feedback state from sessionStorage.
 */
function loadFeedbackState(): FeedbackStateMap {
    if (typeof window === 'undefined') return {};

    try {
        const stored = sessionStorage.getItem(FEEDBACK_STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored) as FeedbackStateMap;
        }
    } catch (error) {
        console.warn('[useFeedback] Failed to load state:', error);
    }
    return {};
}

/**
 * Save feedback state to sessionStorage.
 */
function saveFeedbackState(state: FeedbackStateMap): void {
    if (typeof window === 'undefined') return;

    try {
        sessionStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
        console.warn('[useFeedback] Failed to save state:', error);
    }
}

/**
 * Return type for useFeedback hook.
 */
export interface UseFeedbackReturn {
    /** Get feedback state for a specific target */
    getFeedbackState: (targetId: string) => FeedbackState | undefined;
    /** Set feedback state for a specific target */
    setFeedbackState: (targetId: string, state: FeedbackState) => void;
    /** Check if feedback was submitted for a target */
    hasFeedback: (targetId: string) => boolean;
    /** Clear feedback state for a target */
    clearFeedback: (targetId: string) => void;
    /** Clear all feedback state */
    clearAllFeedback: () => void;
    /** Get count of submitted feedback */
    getFeedbackCount: () => number;
    /** Get all feedback states */
    getAllFeedback: () => FeedbackStateMap;
}

/**
 * Hook for managing feedback state with sessionStorage persistence.
 *
 * @example
 * ```tsx
 * function MyComponent({ reportId }: Props) {
 *     const { getFeedbackState, setFeedbackState, hasFeedback } = useFeedback();
 *
 *     if (hasFeedback(reportId)) {
 *         return <span>Thanks for your feedback!</span>;
 *     }
 *
 *     return (
 *         <button onClick={() => setFeedbackState(reportId, {
 *             submitted: true,
 *             rating: 'positive',
 *             submittedAt: new Date().toISOString(),
 *         })}>
 *             Submit Feedback
 *         </button>
 *     );
 * }
 * ```
 */
export function useFeedback(): UseFeedbackReturn {
    const [stateMap, setStateMap] = useState<FeedbackStateMap>(() => loadFeedbackState());

    // Sync state to sessionStorage when it changes
    useEffect(() => {
        saveFeedbackState(stateMap);
    }, [stateMap]);

    // Get feedback state for a target
    const getFeedbackState = useCallback(
        (targetId: string): FeedbackState | undefined => {
            return stateMap[targetId];
        },
        [stateMap]
    );

    // Set feedback state for a target
    const setFeedbackState = useCallback((targetId: string, state: FeedbackState) => {
        setStateMap((prev) => ({
            ...prev,
            [targetId]: state,
        }));
    }, []);

    // Check if feedback was submitted
    const hasFeedback = useCallback(
        (targetId: string): boolean => {
            return stateMap[targetId]?.submitted ?? false;
        },
        [stateMap]
    );

    // Clear feedback for a specific target
    const clearFeedback = useCallback((targetId: string) => {
        setStateMap((prev) => {
            const next = { ...prev };
            delete next[targetId];
            return next;
        });
    }, []);

    // Clear all feedback
    const clearAllFeedback = useCallback(() => {
        setStateMap({});
    }, []);

    // Get count of submitted feedback
    const getFeedbackCount = useCallback((): number => {
        return Object.values(stateMap).filter((s) => s.submitted).length;
    }, [stateMap]);

    // Get all feedback states
    const getAllFeedback = useCallback((): FeedbackStateMap => {
        return { ...stateMap };
    }, [stateMap]);

    return {
        getFeedbackState,
        setFeedbackState,
        hasFeedback,
        clearFeedback,
        clearAllFeedback,
        getFeedbackCount,
        getAllFeedback,
    };
}
