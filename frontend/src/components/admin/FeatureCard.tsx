/**
 * FeatureCard - Card component for displaying feature flag information
 *
 * Displays feature name, status badge, metrics, and action buttons
 * as shown in WF10 wireframe.
 */

import { useId } from 'react';
import { FeatureStatusBadge } from './FeatureStatusBadge';
import type { FeatureFlag, FeatureAction, FeatureStatus } from '../../types/featureFlag';

export interface FeatureCardProps {
    /** Feature flag data */
    feature: FeatureFlag;
    /** Callback when an action button is clicked */
    onAction?: (featureId: string, action: FeatureAction) => void;
    /** Loading state (disables buttons) */
    isLoading?: boolean;
}

/**
 * Action button configuration
 */
const ACTION_CONFIG: Record<
    FeatureAction,
    {
        label: string;
        variant: 'primary' | 'secondary' | 'danger';
    }
> = {
    enable_globally: { label: 'Enable Globally', variant: 'primary' },
    disable_globally: { label: 'Disable Globally', variant: 'secondary' },
    enable_for_all: { label: 'Enable for All', variant: 'primary' },
    disable: { label: 'Disable', variant: 'secondary' },
    promote_to_beta: { label: 'Promote to Beta', variant: 'primary' },
    promote_to_enabled: { label: 'Promote to Enabled', variant: 'primary' },
    demote_to_alpha: { label: 'Demote to Alpha', variant: 'danger' },
    demote_to_disabled: { label: 'Disable', variant: 'danger' },
};

/**
 * Status to color mapping for metric values
 */
const STATUS_COLORS: Record<FeatureStatus, string> = {
    enabled: 'text-emerald-400',
    beta: 'text-yellow-400',
    alpha: 'text-red-400',
    disabled: 'text-gray-400',
};

/**
 * Button variant styles
 */
const BUTTON_VARIANTS: Record<'primary' | 'secondary' | 'danger', string> = {
    primary:
        'bg-gray-700 hover:bg-gray-600 text-white border-gray-600',
    secondary:
        'bg-transparent hover:bg-gray-700 text-gray-300 border-gray-600',
    danger:
        'bg-transparent hover:bg-red-500/10 text-red-400 border-red-500/50',
};

/**
 * Format metric value based on type
 */
function formatMetricValue(feature: FeatureFlag): string {
    const { metric } = feature;

    if (metric.type === 'pilot_users') {
        return `${metric.value} User Pilot`;
    }

    return `${metric.value}%`;
}

/**
 * Loading spinner component
 */
function LoadingSpinner() {
    return (
        <div
            className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg"
            data-testid="feature-card-loading"
        >
            <svg
                className="w-6 h-6 text-gray-400 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                />
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
            </svg>
        </div>
    );
}

/**
 * Feature card component
 */
export function FeatureCard({ feature, onAction, isLoading = false }: FeatureCardProps) {
    const titleId = useId();

    const handleActionClick = (action: FeatureAction) => {
        if (!isLoading && onAction) {
            onAction(feature.id, action);
        }
    };

    return (
        <article
            className="relative bg-gray-800 rounded-lg p-5 border border-gray-700"
            data-testid="feature-card"
            role="article"
            aria-labelledby={titleId}
        >
            {/* Loading overlay */}
            {isLoading && <LoadingSpinner />}

            {/* Header: Feature name */}
            <h3 id={titleId} className="text-lg font-semibold text-white mb-2">
                {feature.name}
            </h3>

            {/* Status badge */}
            <div className="mb-4">
                <FeatureStatusBadge status={feature.status} />
            </div>

            {/* Metric */}
            <div className="mb-4">
                <span className="text-sm text-gray-400">{feature.metric.label}:</span>
                <div
                    className={`text-2xl font-bold ${STATUS_COLORS[feature.status]}`}
                    data-testid="feature-metric-value"
                >
                    {formatMetricValue(feature)}
                </div>
                {feature.metric.period && (
                    <span className="text-xs text-gray-500">{feature.metric.period}</span>
                )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
                {feature.availableActions.map((action) => {
                    const config = ACTION_CONFIG[action];
                    return (
                        <button
                            key={action}
                            type="button"
                            onClick={() => handleActionClick(action)}
                            disabled={isLoading}
                            className={`
                                px-4 py-2 text-sm font-medium rounded-lg border
                                transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                                focus:ring-offset-gray-800 focus:ring-gray-500
                                disabled:opacity-50 disabled:cursor-not-allowed
                                ${BUTTON_VARIANTS[config.variant]}
                            `}
                        >
                            {config.label}
                        </button>
                    );
                })}
            </div>
        </article>
    );
}
