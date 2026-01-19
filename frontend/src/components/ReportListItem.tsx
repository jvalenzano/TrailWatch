

import type { HazardReport } from '../types/report';

interface ReportListItemProps {
  report: HazardReport;
}

export function ReportListItem({ report }: ReportListItemProps) {
  return (
    <div className="border p-4 rounded-lg shadow-sm">
      <h4 className="text-lg font-semibold">{report.description}</h4>
      <p className="text-sm text-gray-400">Hazard Type: {report.hazard_type}</p>
      <p className="text-sm text-gray-400">Severity: {report.severity_estimate}</p>
    </div>
  );
}
