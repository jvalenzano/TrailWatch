
import type { HazardReport } from '../types/report';
import { ReportListItem } from './ReportListItem';

interface ReportListProps {
  reports: HazardReport[];
  onSelectReport: (reportId: string) => void;
  selectedReportId?: string | null;
  /** Report IDs to highlight (e.g., from spatial insight selection) */
  highlightedReportIds?: string[];
}

export function ReportList({
  reports,
  onSelectReport,
  selectedReportId,
  highlightedReportIds = [],
}: ReportListProps) {
  if (reports.length === 0) {
    return <div className="p-4 text-gray-400 text-center">No reports found.</div>;
  }

  const isHighlighted = (reportId: string) => highlightedReportIds.includes(reportId);

  return (
    <div className="space-y-4 p-4">
      {reports.map((report) => {
        const highlighted = isHighlighted(report.id);
        const selected = selectedReportId === report.id;

        return (
          <div
            key={report.id}
            onClick={() => onSelectReport(report.id)}
            className={`
              cursor-pointer transition-all duration-200 border rounded-lg
              ${selected
                ? 'border-emerald-500 bg-gray-800 ring-1 ring-emerald-500/50'
                : highlighted
                  ? 'border-l-4 border-l-emerald-500 border-t border-r border-b border-gray-600 bg-emerald-500/5'
                  : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
              }
            `}
            data-testid={`report-item-${report.id}`}
            data-highlighted={highlighted}
          >
            <ReportListItem report={report} />
          </div>
        );
      })}
    </div>
  );
}
