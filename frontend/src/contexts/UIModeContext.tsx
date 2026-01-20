import {
    createContext,
    useState,
    useCallback,
    useMemo,
    type ReactNode,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    UI_MODES,
    DEFAULT_MODE,
    type UIMode,
    type UIModeName,
    type UIFeatures,
} from '../config/ui-modes';

/**
 * Context value shape for UI mode management.
 */
export interface UIModeContextValue {
    /** Current active mode configuration */
    mode: UIMode;
    /** Current mode name */
    modeName: UIModeName;
    /** Change the active mode */
    setMode: (mode: UIModeName) => void;
    /** Runtime feature overrides (for testing/admin) */
    overrides: Partial<UIFeatures>;
    /** Set a feature override */
    setOverride: (feature: keyof UIFeatures, value: boolean) => void;
    /** Clear all overrides */
    clearOverrides: () => void;
    /** Check if a feature is enabled (mode + overrides) */
    isFeatureEnabled: (feature: keyof UIFeatures) => boolean;
}

const UIModeContext = createContext<UIModeContextValue | null>(null);

interface UIModeProviderProps {
    children: ReactNode;
    /** Initial overrides for testing */
    initialOverrides?: Partial<UIFeatures>;
}

/**
 * Provider component that manages UI mode state and feature flags.
 *
 * Reads initial mode from URL params (?mode=agentic) and persists changes back.
 * Supports runtime feature overrides for testing and admin purposes.
 */
export function UIModeProvider({ children, initialOverrides = {} }: UIModeProviderProps) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [overrides, setOverrides] = useState<Partial<UIFeatures>>(initialOverrides);

    // Determine current mode from URL params
    const modeParam = searchParams.get('mode') as UIModeName | null;
    const modeName: UIModeName =
        modeParam && modeParam in UI_MODES ? modeParam : DEFAULT_MODE;
    const mode: UIMode = UI_MODES[modeName];

    // Update mode in URL params
    const setMode = useCallback(
        (newMode: UIModeName) => {
            setSearchParams((prev) => {
                prev.set('mode', newMode);
                return prev;
            });
        },
        [setSearchParams]
    );

    // Set a single feature override
    const setOverride = useCallback((feature: keyof UIFeatures, value: boolean) => {
        setOverrides((prev) => ({
            ...prev,
            [feature]: value,
        }));
    }, []);

    // Clear all overrides
    const clearOverrides = useCallback(() => {
        setOverrides({});
    }, []);

    // Check if feature is enabled (overrides take precedence)
    const isFeatureEnabled = useCallback(
        (feature: keyof UIFeatures): boolean => {
            // Check override first
            if (feature in overrides) {
                return overrides[feature] ?? false;
            }
            // Fall back to mode default
            return mode.features[feature] ?? false;
        },
        [mode.features, overrides]
    );

    const value = useMemo<UIModeContextValue>(
        () => ({
            mode,
            modeName,
            setMode,
            overrides,
            setOverride,
            clearOverrides,
            isFeatureEnabled,
        }),
        [mode, modeName, setMode, overrides, setOverride, clearOverrides, isFeatureEnabled]
    );

    return <UIModeContext.Provider value={value}>{children}</UIModeContext.Provider>;
}



export { UIModeContext };
