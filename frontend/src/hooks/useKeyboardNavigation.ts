import { useState, useEffect, useCallback } from 'react';

interface UseKeyboardNavigationOptions {
    /** Total number of items to navigate */
    itemCount: number;
    /** Callback when an item is selected (Enter key) */
    onSelect: (index: number) => void;
    /** Callback when Escape is pressed */
    onEscape?: () => void;
    /** Initial focused index (-1 for no focus) */
    initialIndex?: number;
    /** Whether keyboard navigation is enabled */
    enabled?: boolean;
}

interface UseKeyboardNavigationResult {
    /** Currently focused item index (-1 if no focus) */
    focusedIndex: number;
    /** Programmatically set the focused index */
    setFocusedIndex: (index: number) => void;
}

/**
 * Hook for keyboard navigation through a list of items.
 *
 * Key mappings:
 * - ArrowUp/Down: Navigate items (wraps around)
 * - Enter: Select current item
 * - Escape: Deselect and call onEscape
 *
 * @example
 * const { focusedIndex } = useKeyboardNavigation({
 *   itemCount: reports.length,
 *   onSelect: (index) => setSelectedReport(reports[index]),
 *   onEscape: () => setSelectedReport(null),
 * });
 *
 * return (
 *   <ul>
 *     {reports.map((report, index) => (
 *       <li key={report.id} className={focusedIndex === index ? 'focused' : ''}>
 *         {report.title}
 *       </li>
 *     ))}
 *   </ul>
 * );
 */
export function useKeyboardNavigation({
    itemCount,
    onSelect,
    onEscape,
    initialIndex = -1,
    enabled = true,
}: UseKeyboardNavigationOptions): UseKeyboardNavigationResult {
    const [focusedIndex, setFocusedIndex] = useState(initialIndex);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!enabled || itemCount === 0) return;

            switch (event.key) {
                case 'ArrowDown':
                    event.preventDefault();
                    setFocusedIndex((prev) => {
                        if (prev === -1) return 0;
                        return (prev + 1) % itemCount;
                    });
                    break;

                case 'ArrowUp':
                    event.preventDefault();
                    setFocusedIndex((prev) => {
                        if (prev === -1) return itemCount - 1;
                        return (prev - 1 + itemCount) % itemCount;
                    });
                    break;

                case 'Enter':
                    if (focusedIndex >= 0) {
                        event.preventDefault();
                        onSelect(focusedIndex);
                    }
                    break;

                case 'Escape':
                    event.preventDefault();
                    setFocusedIndex(-1);
                    onEscape?.();
                    break;
            }
        },
        [enabled, itemCount, focusedIndex, onSelect, onEscape]
    );

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return {
        focusedIndex,
        setFocusedIndex,
    };
}
