import { useSearchParams } from 'react-router-dom';
import { UI_MODES, DEFAULT_MODE, type UIMode, type UIModeName } from '../config/ui-modes';

/**
 * Hook to read and manage the current UI mode from URL parameters.
 *
 * Usage:
 * ```tsx
 * const { mode, setMode } = useUIMode();
 * console.log(mode.features.showConfidence);
 * ```
 */
export function useUIMode() {
    const [searchParams, setSearchParams] = useSearchParams();

    const modeParam = searchParams.get('mode') as UIModeName | null;
    const modeName: UIModeName =
        modeParam && modeParam in UI_MODES ? modeParam : DEFAULT_MODE;
    const mode: UIMode = UI_MODES[modeName];

    const setMode = (newMode: UIModeName) => {
        setSearchParams((prev) => {
            prev.set('mode', newMode);
            return prev;
        });
    };

    return { mode, modeName, setMode };
}
