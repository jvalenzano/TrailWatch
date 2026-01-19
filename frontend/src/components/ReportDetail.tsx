import type { HazardReport } from '../types/report';
import type { StreamingExtractionState } from '../types/extraction';
import { ReportActions } from './ReportActions';
import { CrewSelector } from './CrewSelector';
import { ExtractionDisplay } from './extraction/ExtractionDisplay';
import { StreamingExtractionView } from './extraction/StreamingExtractionView';
import { AIAttributionBadge } from './extraction/AIAttributionBadge';
import { FeatureGate } from './common/FeatureGate';

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

    return (
        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4 h-full overflow-y-auto">
            <div className="flex justify-between items-start">
                <h3 className="text-2xl font-bold text-emerald-400">Report Details</h3>
                <span className={`px-2 py-1 rounded text-sm font-bold ${report.severity_estimate === 'dangerous' ? 'bg-red-900 text-red-100' : 'bg-gray-700 text-gray-200'
                    }`}>
                    {report.severity_estimate.toUpperCase()}
                </span>
            </div>

            <div className="space-y-2">
                <p className="text-gray-300"><span className="font-semibold text-gray-400">ID:</span> {report.id}</p>
                <p className="text-gray-300"><span className="font-semibold text-gray-400">Trail:</span> {report.trail_name || 'Unknown Trail'}</p>

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

                <div className="bg-gray-900 p-3 rounded border border-gray-700 mt-2">
                    <p className="text-gray-300 italic">"{report.description}"</p>
                </div>

                <p className="text-gray-400 text-sm">
                    Submitted: {new Date(report.submitted_at).toLocaleString()}
                </p>

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

      {report.photos && report.photos.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold text-gray-400 mb-2">Photos</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {report.photos.map((photo, idx) => (
              <img key={idx} src={photo} alt="Hazard" className="h-32 rounded border border-gray-600" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 border-t border-gray-700 pt-4">
        <h4 className="text-xl font-semibold mb-3 text-emerald-500">Actions</h4>
        <ReportActions
          reportId={report.id}
          onAssignCrew={onAssignCrew}
          onExtract={onExtract}
          onMarkResolved={onMarkResolved}
        />

        <div className="mt-4">
          <CrewSelector
            onSelect={(crewId) => onAssignCrew(report.id, crewId)}
          />
        </div>
      </div>
    </div>
  );
}
