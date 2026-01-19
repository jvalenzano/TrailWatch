import { type ReactNode } from 'react';
import { useUIMode } from '../../hooks/useUIMode';
import type { UIFeatures } from '../../config/ui-modes';

interface FeatureGateProps {
    /** Feature flag key from UIFeatures */
    feature: keyof UIFeatures;
    /** Content to render when feature is enabled */
    children: ReactNode;
    /** Optional fallback when feature is disabled */
    fallback?: ReactNode;
}

/**
 * Conditionally renders children based on current UI mode's feature flags.
 *
 * Usage:
 * ```tsx
 * <FeatureGate feature="enable_confidence_indicators">
 *   <ConfidenceIndicator score={0.87} />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
    try {
        const { mode } = useUIMode();
        const isEnabled = mode.features[feature] ?? false; // Fail closed if undefined

        return <>{isEnabled ? children : fallback}</>;
    } catch (error) {
        // Fail-safe: Log error and render fallback (graceful degradation)
        console.error('[FeatureGate] Failed to resolve mode:', error);
        return <>{fallback}</>;
    }
}
