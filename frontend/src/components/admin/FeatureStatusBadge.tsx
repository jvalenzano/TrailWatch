/**
 * FeatureStatusBadge - Displays feature flag status with color-coded styling
 *
 * Status colors match WF10 wireframe specification:
 * - Enabled: Green (emerald) with checkmark icon
 * - Beta: Amber/Yellow with "A" icon
 * - Alpha: Red with "A" icon
 * - Disabled: Gray with slash icon
 */

import type { FeatureStatus } from '../../types/featureFlag';

export interface FeatureStatusBadgeProps {
    /** Current feature status */
    status: FeatureStatus;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Status configuration for styling and display
 */
const STATUS_CONFIG: Record<
    FeatureStatus,
    {
        label: string;
        textColor: string;
        bgColor: string;
        borderColor: string;
    }
> = {
    enabled: {
        label: 'Enabled',
        textColor: 'text-emerald-400',
        bgColor: 'bg-emerald-500/20',
        borderColor: 'border-emerald-500/30',
    },
    beta: {
        label: 'Beta',
        textColor: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
    },
    alpha: {
        label: 'Alpha',
        textColor: 'text-red-400',
        bgColor: 'bg-red-500/20',
        borderColor: 'border-red-500/30',
    },
    disabled: {
        label: 'Disabled',
        textColor: 'text-gray-400',
        bgColor: 'bg-gray-500/20',
        borderColor: 'border-gray-500/30',
    },
};

/**
 * Size configuration for badge
 */
const SIZE_CONFIG: Record<'sm' | 'md' | 'lg', { text: string; icon: string; padding: string }> = {
    sm: { text: 'text-xs', icon: 'w-3.5 h-3.5', padding: 'px-2 py-0.5' },
    md: { text: 'text-sm', icon: 'w-4 h-4', padding: 'px-2.5 py-1' },
    lg: { text: 'text-base', icon: 'w-5 h-5', padding: 'px-3 py-1.5' },
};

/**
 * Checkmark icon for Enabled status
 */
function CheckmarkIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            aria-hidden="true"
            data-testid="status-icon-enabled"
        >
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4" />
        </svg>
    );
}

/**
 * "A" icon for Beta/Alpha status (in a circle as shown in wireframe)
 */
function AlphaIcon({ className, testId }: { className?: string; testId: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            data-testid={testId}
        >
            <circle cx="12" cy="12" r="10" opacity="0.2" />
            <text
                x="12"
                y="16"
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="currentColor"
            >
                A
            </text>
        </svg>
    );
}

/**
 * Disabled/slash icon
 */
function DisabledIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            data-testid="status-icon-disabled"
        >
            <circle cx="12" cy="12" r="10" opacity="0.2" fill="currentColor" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-12.728 12.728" />
        </svg>
    );
}

/**
 * Get the appropriate icon component for a status
 */
function StatusIcon({ status, className }: { status: FeatureStatus; className?: string }) {
    switch (status) {
        case 'enabled':
            return <CheckmarkIcon className={className} />;
        case 'beta':
            return <AlphaIcon className={className} testId="status-icon-beta" />;
        case 'alpha':
            return <AlphaIcon className={className} testId="status-icon-alpha" />;
        case 'disabled':
            return <DisabledIcon className={className} />;
    }
}

/**
 * Feature status badge component
 */
export function FeatureStatusBadge({ status, size = 'md' }: FeatureStatusBadgeProps) {
    const config = STATUS_CONFIG[status];
    const sizeConfig = SIZE_CONFIG[size];

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 font-medium rounded-full
                ${config.textColor}
                ${sizeConfig.text}
                ${sizeConfig.padding}
            `}
            data-testid="feature-status-badge"
            aria-label={`Feature status: ${config.label}`}
            role="status"
        >
            <StatusIcon status={status} className={sizeConfig.icon} />
            <span>{config.label}</span>
        </span>
    );
}
