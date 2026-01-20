import { useUIModeContext } from '../contexts/UIModeContext';
import type { UIMode, UIModeName, UIFeatures } from '../config/ui-modes';

/**
 * Hook to read and manage the current UI mode.
 *
 * This hook consumes the UIModeContext and provides access to:
 * - Current mode configuration
 * - Mode switching
 * - Feature flag checking (with override support)
 *
 * Usage:
 * ```tsx
 * const { mode, setMode, isFeatureEnabled } = useUIMode();
 * console.log(mode.features.enable_confidence_indicators);
 * console.log(isFeatureEnabled('enable_confidence_indicators'));
 * ```
 *
 * @throws Error if used outside of UIModeProvider
 */
export function useUIMode(): {
    mode: UIMode;
    modeName: UIModeName;
    setMode: (mode: UIModeName) => void;
    isFeatureEnabled: (feature: keyof UIFeatures) => boolean;
    overrides: Partial<UIFeatures>;
    setOverride: (feature: keyof UIFeatures, value: boolean) => void;
    clearOverrides: () => void;
} {
    const context = useUIModeContext();
    return {
        mode: context.mode,
        modeName: context.modeName,
        setMode: context.setMode,
        isFeatureEnabled: context.isFeatureEnabled,
        overrides: context.overrides,
        setOverride: context.setOverride,
        clearOverrides: context.clearOverrides,
    };
}
