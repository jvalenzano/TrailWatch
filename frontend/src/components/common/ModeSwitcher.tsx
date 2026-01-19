import { useEffect, useCallback } from 'react';
import { useUIMode } from '../../hooks/useUIMode';
import type { UIModeName } from '../../config/ui-modes';

const MODE_CYCLE: UIModeName[] = ['traditional', 'moderate', 'agentic'];

/**
 * Floating button for switching UI modes during development.
 * Only renders when import.meta.env.DEV is true.
 * Supports Ctrl+M / Cmd+M keyboard shortcut.
 *
 * Cycles: traditional → moderate → agentic → traditional
 */
export function ModeSwitcher() {
    const { modeName, setMode } = useUIMode();

    const cycleMode = useCallback(() => {
        const currentIndex = MODE_CYCLE.indexOf(modeName);
        const nextIndex = (currentIndex + 1) % MODE_CYCLE.length;
        setMode(MODE_CYCLE[nextIndex]);
    }, [modeName, setMode]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Ctrl+M or Cmd+M (Mac)
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'm') {
                event.preventDefault();
                cycleMode();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [cycleMode]);

    // Only render in development mode
    if (!import.meta.env.DEV) {
        return null;
    }

    return (
        <button
            type="button"
            onClick={cycleMode}
            aria-label="Switch UI mode (Ctrl+M)"
            data-testid="mode-switcher"
            className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2 text-xs font-medium text-gray-300 bg-gray-800 border border-gray-600 rounded-lg shadow-lg hover:bg-gray-700 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all"
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
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
            <span className="text-emerald-400">{modeName}</span>
        </button>
    );
}
