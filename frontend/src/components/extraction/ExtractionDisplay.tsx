import { FeatureGate } from '../common/FeatureGate';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { ReasoningPanel } from './ReasoningPanel';
import { trackEvent, ANALYTICS_EVENTS } from '../../utils/analytics';
import { useUIMode } from '../../hooks/useUIMode';
import type { HazardReport } from '../../types/report';

interface ExtractionDisplayProps {
    report: HazardReport;
}

export const ExtractionDisplay: React.FC<ExtractionDisplayProps> = ({ report }) => {
    const { mode } = useUIMode();

    // Check if any AI transparency features are enabled
    const hasAnyAIFeatures =
        mode.features.enable_confidence_indicators ||
        mode.features.enable_reasoning_panel ||
        mode.features.enable_ai_attribution_badges;

    // Don't render anything if no AI features are enabled or no triage results
    if (!hasAnyAIFeatures || !report.triage_result) return null;

    const handleReasoningExpand = () => {
        trackEvent(ANALYTICS_EVENTS.REASONING_PANEL_EXPANDED, {
            reportId: report.id,
            confidence_score: report.triage_result?.confidence_score,
        });
    };

    return (
        <div
            className="mt-6 pt-6 border-t border-gray-700"
            data-testid="extraction-display"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    AI Transparency Layer
                </h3>

                <FeatureGate feature="enable_confidence_indicators">
                    <ConfidenceIndicator score={report.triage_result.confidence_score} />
                </FeatureGate>
            </div>

            <FeatureGate feature="enable_reasoning_panel">
                <div onMouseEnter={handleReasoningExpand}>
                    <ReasoningPanel triageResult={report.triage_result} />
                </div>
            </FeatureGate>
        </div>
    );
};
