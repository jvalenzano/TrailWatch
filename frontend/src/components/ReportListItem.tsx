

import type { HazardReport } from '../types/report';
import { FeatureGate } from './common/FeatureGate';
import { ConfidenceIndicator } from './extraction/ConfidenceIndicator';
import { AIAttributionBadge } from './extraction/AIAttributionBadge';

interface ReportListItemProps {
  report: HazardReport;
}

export function ReportListItem({ report }: ReportListItemProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold flex justify-between">
        <span className="truncate">{report.description}</span>
        {report.triage_result && (
          <FeatureGate feature="enable_confidence_indicators">
            <ConfidenceIndicator score={report.triage_result.confidence_score} compact />
          </FeatureGate>
        )}
      </h4>
      <p className="text-sm text-gray-400">
        Hazard Type: {report.hazard_type}
        <FeatureGate feature="enable_ai_attribution_badges">
          <AIAttributionBadge field="hazard_type" />
        </FeatureGate>
      </p>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Severity: {report.severity_estimate}</p>
      </div>
    </div>
  );
}
