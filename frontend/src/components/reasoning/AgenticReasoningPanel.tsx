/**
 * AgenticReasoningPanel - Step-by-step visualization of AI reasoning chain.
 * Shows Vision -> Spatial -> Policy analysis stages with expandable details.
 */
import { useState, useId } from 'react';
import type { TriageResult, ReasoningStep, ConfidenceFactors } from '../../types/report';
import { ReasoningStepItem } from './ReasoningStepItem';

export interface AgenticReasoningPanelProps {
    triageResult: TriageResult;
    /** If true, panel starts expanded */
    defaultOpen?: boolean;
}

/**
 * Generates reasoning steps from triage result when explicit steps not provided.
 * Parses the reasoning text and confidence factors to create step-by-step chain.
 */
function generateReasoningSteps(triageResult: TriageResult): ReasoningStep[] {
    const { reasoning, confidence_factors } = triageResult;
    const factors = confidence_factors;

    // Vision Analysis step
    const visionStep: ReasoningStep = {
        type: 'vision',
        label: 'Vision Analysis',
        status: factors.has_photo ? 'complete' : 'skipped',
        summary: factors.has_photo
            ? factors.photo_matches_hazard
                ? 'Photo analyzed - hazard confirmed'
                : 'Photo analyzed - hazard type uncertain'
            : 'No photo provided for analysis',
        details: buildVisionDetails(factors, reasoning),
        confidence: factors.has_photo && factors.photo_matches_hazard ? 0.9 : factors.has_photo ? 0.6 : undefined,
    };

    // Spatial Validation step
    const spatialStep: ReasoningStep = {
        type: 'spatial',
        label: 'Spatial Validation',
        status: 'complete',
        summary: factors.gps_accurate
            ? 'GPS coordinates validated against trail network'
            : 'GPS accuracy below threshold - location approximate',
        details: buildSpatialDetails(factors, reasoning),
        confidence: factors.gps_accurate ? 0.85 : 0.5,
    };

    // Policy Check step
    const policyStep: ReasoningStep = {
        type: 'policy',
        label: 'Policy Check',
        status: 'complete',
        summary: `Classified as ${triageResult.tracs_category_name} - ${triageResult.severity_name}`,
        details: buildPolicyDetails(triageResult, factors),
        confidence: triageResult.confidence_score,
    };

    return [visionStep, spatialStep, policyStep];
}

function buildVisionDetails(factors: ConfidenceFactors, reasoning: string): string[] {
    const details: string[] = [];

    if (factors.has_photo) {
        details.push(factors.photo_matches_hazard
            ? 'Image content matches reported hazard type'
            : 'Image content unclear or partially matches');

        // Extract photo-related info from reasoning
        const photoMatch = reasoning.match(/[Pp]hoto[^.]*\./);
        if (photoMatch) {
            details.push(photoMatch[0].trim());
        }
    } else {
        details.push('No visual evidence available');
        details.push('Classification based on description only');
    }

    return details;
}

function buildSpatialDetails(factors: ConfidenceFactors, reasoning: string): string[] {
    const details: string[] = [];

    details.push(factors.gps_accurate
        ? 'Coordinates align with known trail segment'
        : 'GPS accuracy: moderate confidence');

    // Extract location-related info from reasoning
    const locationMatch = reasoning.match(/[Ll]ocation[^.]*\.|[Gg]PS[^.]*\.|coordinates[^.]*\./i);
    if (locationMatch) {
        details.push(locationMatch[0].trim());
    }

    if (factors.corroborating_reports > 0) {
        details.push(`${factors.corroborating_reports} corroborating report(s) in area`);
    }

    return details;
}

function buildPolicyDetails(triageResult: TriageResult, factors: ConfidenceFactors): string[] {
    const details: string[] = [];

    details.push(`Category: ${triageResult.tracs_category} - ${triageResult.tracs_category_name}`);
    details.push(`Severity: ${triageResult.severity} - ${triageResult.severity_name}`);

    if (factors.reporter_trusted) {
        details.push('Reporter: Verified volunteer/coordinator');
    }

    if (factors.weather_context) {
        details.push(`Weather factor: ${factors.weather_context}`);
    }

    details.push(`Action: ${triageResult.recommended_action}`);

    return details;
}

export function AgenticReasoningPanel({
    triageResult,
    defaultOpen = false,
}: AgenticReasoningPanelProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const panelId = useId();

    // Use explicit steps if provided, otherwise generate from triage result
    const steps = triageResult.reasoning_steps ?? generateReasoningSteps(triageResult);

    const completedSteps = steps.filter((s) => s.status === 'complete').length;
    const totalSteps = steps.length;

    return (
        <div
            className="border border-gray-700 rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm"
            data-testid="agentic-reasoning-panel"
        >
            {/* Header */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-700/30 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-inset"
                aria-expanded={isOpen}
                aria-controls={panelId}
                data-testid="agentic-reasoning-toggle"
            >
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg
                            className="w-4 h-4 text-emerald-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-white">
                            AI Reasoning Chain
                        </h3>
                        <p className="text-xs text-gray-400">
                            {completedSteps}/{totalSteps} steps completed
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {/* Overall confidence */}
                    <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                            triageResult.confidence_score >= 0.8
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : triageResult.confidence_score >= 0.6
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                        }`}
                    >
                        {Math.round(triageResult.confidence_score * 100)}% confidence
                    </span>

                    {/* Chevron */}
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                            isOpen ? 'rotate-180' : ''
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
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </button>

            {/* Content */}
            {isOpen && (
                <div
                    id={panelId}
                    className="px-4 pb-4"
                    data-testid="agentic-reasoning-content"
                >
                    {/* Step-by-step timeline */}
                    <div className="space-y-0">
                        {steps.map((step, idx) => (
                            <ReasoningStepItem
                                key={step.type}
                                step={step}
                                isLast={idx === steps.length - 1}
                            />
                        ))}
                    </div>

                    {/* Original reasoning prose (collapsed by default) */}
                    <details className="mt-4">
                        <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                            View raw reasoning text
                        </summary>
                        <p className="mt-2 text-xs text-gray-500 bg-gray-900/50 p-3 rounded border border-gray-700">
                            {triageResult.reasoning}
                        </p>
                    </details>
                </div>
            )}
        </div>
    );
}
