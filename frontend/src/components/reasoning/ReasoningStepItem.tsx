/**
 * ReasoningStepItem - Displays a single step in the reasoning chain.
 * Shows icon, status indicator, summary, and expandable details.
 */
import { useState } from 'react';
import type { ReasoningStep, ReasoningStepType, ReasoningStepStatus } from '../../types/report';

export interface ReasoningStepItemProps {
    step: ReasoningStep;
    isLast?: boolean;
}

const stepIcons: Record<ReasoningStepType, string> = {
    vision: '\uD83D\uDC41\uFE0F', // eye
    spatial: '\uD83D\uDDFA\uFE0F', // world map
    policy: '\uD83D\uDCCB', // clipboard
};

const stepLabels: Record<ReasoningStepType, string> = {
    vision: 'Vision Analysis',
    spatial: 'Spatial Validation',
    policy: 'Policy Check',
};

const statusColors: Record<ReasoningStepStatus, string> = {
    pending: 'bg-gray-500',
    processing: 'bg-blue-500 animate-pulse',
    complete: 'bg-emerald-500',
    skipped: 'bg-gray-400',
};

const statusBorderColors: Record<ReasoningStepStatus, string> = {
    pending: 'border-gray-500/30',
    processing: 'border-blue-500/30',
    complete: 'border-emerald-500/30',
    skipped: 'border-gray-400/30',
};

export function ReasoningStepItem({ step, isLast = false }: ReasoningStepItemProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasDetails = step.details && step.details.length > 0;

    return (
        <div className="relative" data-testid={`reasoning-step-${step.type}`}>
            {/* Connector line */}
            {!isLast && (
                <div
                    className={`absolute left-4 top-10 w-0.5 h-full -ml-px ${
                        step.status === 'complete' ? 'bg-emerald-500/50' : 'bg-gray-600/50'
                    }`}
                    aria-hidden="true"
                />
            )}

            <div className="relative flex gap-3">
                {/* Status indicator */}
                <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${statusColors[step.status]}`}
                    aria-label={`${step.label}: ${step.status}`}
                >
                    <span className="text-sm" role="img" aria-hidden="true">
                        {stepIcons[step.type]}
                    </span>
                </div>

                {/* Content */}
                <div
                    className={`flex-1 pb-4 ${
                        isLast ? '' : 'border-b border-gray-700/50'
                    }`}
                >
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white">
                            {stepLabels[step.type]}
                        </h4>
                        {step.confidence !== undefined && (
                            <span
                                className={`text-xs px-2 py-0.5 rounded ${
                                    step.confidence >= 0.8
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : step.confidence >= 0.6
                                        ? 'bg-yellow-500/20 text-yellow-400'
                                        : 'bg-red-500/20 text-red-400'
                                }`}
                            >
                                {Math.round(step.confidence * 100)}%
                            </span>
                        )}
                    </div>

                    <p className="text-xs text-gray-400 mb-2">{step.summary}</p>

                    {/* Expandable details */}
                    {hasDetails && (
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                aria-expanded={isExpanded}
                            >
                                <svg
                                    className={`w-3 h-3 transition-transform ${
                                        isExpanded ? 'rotate-90' : ''
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 5l7 7-7 7"
                                    />
                                </svg>
                                {isExpanded ? 'Hide details' : 'Show details'}
                            </button>

                            {isExpanded && (
                                <ul
                                    className={`mt-2 space-y-1 pl-3 border-l-2 ${statusBorderColors[step.status]}`}
                                    data-testid={`reasoning-step-${step.type}-details`}
                                >
                                    {step.details?.map((detail, idx) => (
                                        <li
                                            key={idx}
                                            className="text-xs text-gray-500"
                                        >
                                            {detail}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
