import type { HazardReport } from '../types/report';
import type { StreamingExtractionState } from '../types/extraction';
import { ReportActions } from './ReportActions';
import { CrewSelector } from './CrewSelector';
import { ExtractionDisplay } from './extraction/ExtractionDisplay';
import { StreamingExtractionView } from './extraction/StreamingExtractionView';
import { AIAttributionBadge } from './extraction/AIAttributionBadge';
import { FeatureGate } from './common/FeatureGate';
import { ConfidenceBadge } from './common/ConfidenceBadge';
import { ReasoningPanel, type ReasoningStep } from './agentic/ReasoningPanel';
import { ExternalIntelligence } from './ExternalIntelligence';

/**
 * WF3: Numbered section header component for report detail view.
 * Implements "1. PHOTO SECTION", "2. AI CLASSIFICATION", etc.
 */
interface SectionHeaderProps {
    number: number;
    title: string;
    className?: string;
}

function SectionHeader({ number, title, className = '' }: SectionHeaderProps) {
    return (
        <h4
            className={`text-lg font-bold text-gray-300 uppercase tracking-wide border-b border-gray-700 pb-2 mb-3 ${className}`}
            data-testid={`section-header-${number}`}
        >
            {number}. {title}
        </h4>
    );
}

/**
 * WF3: Format classification timestamp for display.
 * Shows when the AI classified the report (e.g., "8:16 AM").
 */
function formatClassificationTime(timestamp?: string): string | null {
    if (!timestamp) return null;
    try {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    } catch {
        return null;
    }
}

/**
 * WF3: Generate assignment reasoning text based on report data.
 * Shows reasoning like "Based on 4 similar reports in District 7".
 */
function getAssignmentReasoning(report: HazardReport): string | null {
    const similarReportsCount = report.triage_result?.similar_reports?.length ?? 0;
    const districtId = report.assignment?.district_id;

    if (similarReportsCount > 0 && districtId) {
        return `Based on ${similarReportsCount} similar report${similarReportsCount > 1 ? 's' : ''} in District ${districtId}`;
    }
    if (similarReportsCount > 0) {
        return `Based on ${similarReportsCount} similar report${similarReportsCount > 1 ? 's' : ''} in the area`;
    }
    if (districtId) {
        return `Assigned to District ${districtId}`;
    }
    return null;
}

/**
 * Convert triage_result confidence factors to ReasoningStep format.
 */
function buildReasoningSteps(report: HazardReport): ReasoningStep[] {
    const factors = report.triage_result?.confidence_factors;
    if (!factors) return [];

    const steps: ReasoningStep[] = [];

    // Visual Analysis step
    if (factors.has_photo !== undefined) {
        steps.push({
            step: 'Visual Analysis',
            status: factors.has_photo && factors.photo_matches_hazard ? 'success' : factors.has_photo ? 'warning' : 'info',
            detail: factors.has_photo
                ? factors.photo_matches_hazard
                    ? 'Photo provided and matches hazard description'
                    : 'Photo provided but does not clearly show hazard'
                : 'No photo provided for visual verification',
        });
    }

    // Location Validation step
    if (factors.gps_accurate !== undefined) {
        steps.push({
            step: 'Location Validation',
            status: factors.gps_accurate ? 'success' : 'warning',
            detail: factors.gps_accurate
                ? 'GPS coordinates validated against trail geometry'
                : 'GPS accuracy is low or location is off-trail',
        });
    }

    // Description Analysis step
    if (factors.description_specific !== undefined) {
        steps.push({
            step: 'Description Analysis',
            status: factors.description_specific ? 'success' : 'warning',
            detail: factors.description_specific
                ? 'Description provides specific, actionable details'
                : 'Description is vague or lacks specific details',
        });
    }

    // Reporter Trust step
    if (factors.reporter_trusted !== undefined) {
        steps.push({
            step: 'Reporter Verification',
            status: factors.reporter_trusted ? 'success' : 'info',
            detail: factors.reporter_trusted
                ? `Trusted reporter (${report.reporter_type})`
                : 'Anonymous or unverified reporter',
        });
    }

    // Corroboration step (if there are corroborating reports)
    if (factors.corroborating_reports !== undefined && factors.corroborating_reports > 0) {
        steps.push({
            step: 'Cross-Reference Check',
            status: 'success',
            detail: `${factors.corroborating_reports} similar report(s) corroborate this hazard`,
        });
    }

    // External Intelligence step (if there are external sources)
    if (report.external_intelligence && report.external_intelligence.length > 0) {
        steps.push({
            step: 'External Intelligence',
            status: 'success',
            detail: `${report.external_intelligence.length} external source(s) corroborate this hazard (social media, blogs, forums)`,
        });
    }

    return steps;
}

interface ReportDetailProps {
    report: HazardReport;
    onAssignCrew: (reportId: string, crewId?: string) => void;
    onExtract: (reportId: string) => void;
    onMarkResolved: (reportId: string) => void;
    /** Optional streaming extraction state (for agentic mode) */
    extractionState?: StreamingExtractionState;
    /** Callback to start streaming extraction */
    onStartStreamingExtraction?: (reportId: string) => void;
    /** Callback to cancel streaming extraction */
    onCancelStreamingExtraction?: () => void;
    /** Callback to reset streaming extraction */
    onResetStreamingExtraction?: () => void;
}

export function ReportDetail({
    report,
    onAssignCrew,
    onExtract,
    onMarkResolved,
    extractionState,
    onStartStreamingExtraction,
    onCancelStreamingExtraction,
    onResetStreamingExtraction,
}: ReportDetailProps) {
    // Determine if we should show streaming view
    const showStreamingView = extractionState && extractionState.status !== 'idle';
    // WF3: Classification timestamp
    const classificationTime = formatClassificationTime(report.triaged_at);
    // WF3: Assignment reasoning
    const assignmentReasoning = getAssignmentReasoning(report);

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-6 h-full overflow-y-auto">
            {/* Header with title and severity */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-bold text-emerald-400">Report #{report.id}</h3>
                    {/* Confidence Badge - shown in moderate and agentic modes */}
                    <FeatureGate feature="enable_confidence_indicators">
                        {report.triage_result && (
                            <ConfidenceBadge
                                confidence={report.triage_result.confidence_score}
                                size="sm"
                                showLabel={false}
                            />
                        )}
                    </FeatureGate>
                </div>
                <span className={`px-2 py-1 rounded text-sm font-bold ${report.severity_estimate === 'dangerous' ? 'bg-red-900 text-red-100' : 'bg-gray-700 text-gray-200'
                    }`}>
                    {report.severity_estimate.toUpperCase()}
                </span>
            </div>

            {/* Basic info */}
            <div className="space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-gray-400">Trail:</span> {report.trail_name || 'Unknown Trail'}</p>
                <p className="text-gray-400 text-sm">
                    Submitted: {new Date(report.submitted_at).toLocaleString()}
                </p>
            </div>

            {/* WF3 Section 1: PHOTO SECTION */}
            {report.photos && report.photos.length > 0 && (
                <div>
                    <SectionHeader number={1} title="PHOTO SECTION" />
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {report.photos.map((photo, idx) => (
                            <img key={idx} src={photo} alt="Hazard" className="h-32 rounded border border-gray-600" />
                        ))}
                    </div>
                </div>
            )}

            {/* WF3 Section 2: AI CLASSIFICATION */}
            <div>
                <SectionHeader number={2} title="AI CLASSIFICATION" />
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4">
                        <p className="text-gray-300">
                            <span className="font-semibold text-gray-400">Hazard:</span> {report.hazard_type}
                            <FeatureGate feature="enable_ai_attribution_badges">
                                <AIAttributionBadge field="hazard_type" />
                            </FeatureGate>
                        </p>
                        <p className="text-gray-300">
                            <span className="font-semibold text-gray-400">Reporter:</span> {report.reporter_type}
                            <FeatureGate feature="enable_ai_attribution_badges">
                                <AIAttributionBadge field="reporter_type" />
                            </FeatureGate>
                        </p>
                    </div>

                    <div className="bg-gray-900 p-3 rounded border border-gray-700">
                        <p className="text-gray-300 italic">&quot;{report.description}&quot;</p>
                    </div>

                    {/* WF3: Classification timestamp */}
                    {classificationTime && (
                        <p className="text-gray-400 text-sm" data-testid="classification-timestamp">
                            Classified: {classificationTime}
                        </p>
                    )}

                    {/* AI Reasoning Panel - shown in moderate and agentic modes */}
                    <FeatureGate feature="enable_reasoning_panel">
                        {report.triage_result && (
                            <div className="mt-4">
                                <ReasoningPanel
                                    steps={buildReasoningSteps(report)}
                                    overallConfidence={report.triage_result.confidence_score}
                                />
                                {/* AI Reasoning Summary */}
                                {report.triage_result.reasoning && (
                                    <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
                                        <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                                            AI Summary
                                        </p>
                                        <p className="text-sm text-gray-300">
                                            {report.triage_result.reasoning}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </FeatureGate>

                    {/* Streaming Extraction View (Agentic mode) */}
                    <FeatureGate feature="streamingExtraction">
                        {showStreamingView && extractionState && onCancelStreamingExtraction && onResetStreamingExtraction ? (
                            <StreamingExtractionView
                                state={extractionState}
                                onCancel={onCancelStreamingExtraction}
                                onReset={onResetStreamingExtraction}
                            />
                        ) : onStartStreamingExtraction ? (
                            <button
                                type="button"
                                onClick={() => onStartStreamingExtraction(report.id)}
                                className="px-4 py-2 text-sm font-medium text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                data-testid="start-streaming-extraction"
                            >
                                Start AI Extraction
                            </button>
                        ) : null}
                    </FeatureGate>

                    {/* Static Extraction Display (fallback for non-streaming modes) */}
                    <FeatureGate feature="streamingExtraction" fallback={<ExtractionDisplay report={report} />}>
                        {/* If streaming is enabled but not active, show static display as fallback */}
                        {!showStreamingView && extractionState?.status === 'idle' && (
                            <ExtractionDisplay report={report} />
                        )}
                    </FeatureGate>
                </div>
            </div>

            {/* External Intelligence (if available) */}
            {report.external_intelligence && report.external_intelligence.length > 0 && (
                <ExternalIntelligence sources={report.external_intelligence} />
            )}

            {/* WF3 Section 3: ASSIGNMENT */}
            <div>
                <SectionHeader number={3} title="ASSIGNMENT" />
                <div className="space-y-3">
                    {/* WF3: Assignment reasoning */}
                    {assignmentReasoning && (
                        <p className="text-gray-400 text-sm italic" data-testid="assignment-reasoning">
                            {assignmentReasoning}
                        </p>
                    )}
                    <CrewSelector
                        onSelect={(crewId) => onAssignCrew(report.id, crewId)}
                    />
                </div>
            </div>

            {/* WF3 Section 4: ACTIONS */}
            <div>
                <SectionHeader number={4} title="ACTIONS" />
                <ReportActions
                    reportId={report.id}
                    onAssignCrew={onAssignCrew}
                    onExtract={onExtract}
                    onMarkResolved={onMarkResolved}
                />
            </div>
        </div>
    );
}
