import { type ReactNode } from 'react';
import { useUIModeContextSafe } from '../../contexts/UIModeContext';
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
 * Uses `isFeatureEnabled()` from context which respects runtime overrides.
 * Fails closed (returns fallback) if context is unavailable.
 *
 * Usage:
 * ```tsx
 * <FeatureGate feature="enable_confidence_indicators">
 *   <ConfidenceIndicator score={0.87} />
 * </FeatureGate>
 * ```
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
    const context = useUIModeContextSafe();

    // Fail closed if context unavailable
    if (!context) {
        console.warn('[FeatureGate] No UIModeContext found, failing closed');
        return <>{fallback}</>;
    }

    const isEnabled = context.isFeatureEnabled(feature);

    return <>{isEnabled ? children : fallback}</>;
}
