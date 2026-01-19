
import type { HazardReport } from '../types/report';
import { ReportListItem } from './ReportListItem';

interface ReportListProps {
  reports: HazardReport[];
  onSelectReport: (reportId: string) => void;
  selectedReportId?: string | null;
}

export function ReportList({ reports, onSelectReport, selectedReportId }: ReportListProps) {
  if (reports.length === 0) {
    return <div className="p-4 text-gray-400 text-center">No reports found.</div>;
  }

  return (
    <div className="space-y-4 p-4">
      {reports.map((report) => (
        <div
          key={report.id}
          onClick={() => onSelectReport(report.id)}
          className={`cursor-pointer transition-colors duration-200 border rounded-lg ${selectedReportId === report.id
            ? 'border-emerald-500 bg-gray-800'
            : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
            }`}
        >
          <ReportListItem report={report} />
        </div>
      ))}
    </div>
  );
}
