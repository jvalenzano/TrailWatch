
import { useCallback } from 'react';
import type { HazardReport } from '../types/report';
import { ReportListItem } from './ReportListItem';

interface ReportListProps {
  reports: HazardReport[];
  onSelectReport: (reportId: string) => void;
  selectedReportId?: string | null;
  /** Report IDs to highlight (e.g., from spatial insight selection) */
  highlightedReportIds?: string[];
  /** Enable multi-select mode with checkboxes */
  multiSelectEnabled?: boolean;
  /** Currently selected report IDs for batch operations */
  selectedForBatch?: string[];
  /** Callback when batch selection changes */
  onBatchSelectionChange?: (reportId: string, selected: boolean) => void;
  /** Callback to open batch assignment modal */
  onOpenBatchAssignment?: () => void;
  /** Callback to extract info from selected reports */
  onExtractInfo?: (reportIds: string[]) => void;
}

export function ReportList({
  reports,
  onSelectReport,
  selectedReportId,
  highlightedReportIds = [],
  multiSelectEnabled = false,
  selectedForBatch = [],
  onBatchSelectionChange,
  onOpenBatchAssignment,
  onExtractInfo,
}: ReportListProps) {
  const isHighlighted = (reportId: string) => highlightedReportIds.includes(reportId);
  const isSelectedForBatch = (reportId: string) => selectedForBatch.includes(reportId);

  const handleCheckboxChange = useCallback(
    (reportId: string, checked: boolean) => {
      onBatchSelectionChange?.(reportId, checked);
    },
    [onBatchSelectionChange]
  );

  const handleItemClick = useCallback(
    (e: React.MouseEvent, reportId: string) => {
      // If clicking the checkbox area, don't trigger row selection
      const target = e.target as HTMLElement;
      if (target.closest('[data-checkbox-area]')) {
        return;
      }
      onSelectReport(reportId);
    },
    [onSelectReport]
  );

  if (reports.length === 0) {
    return <div className="p-4 text-gray-400 text-center">No reports found.</div>;
  }

  const batchSelectionCount = selectedForBatch.length;

  return (
    <div className="flex flex-col h-full">
      {/* Report list */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {reports.map((report) => {
          const highlighted = isHighlighted(report.id);
          const selected = selectedReportId === report.id;
          const batchSelected = isSelectedForBatch(report.id);

          return (
            <div
              key={report.id}
              onClick={(e) => handleItemClick(e, report.id)}
              className={`
                cursor-pointer transition-all duration-200 border rounded-lg flex
                ${selected
                  ? 'border-emerald-500 bg-gray-800 ring-1 ring-emerald-500/50'
                  : highlighted
                    ? 'border-l-4 border-l-emerald-500 border-t border-r border-b border-gray-600 bg-emerald-500/5'
                    : batchSelected
                      ? 'border-blue-500/50 bg-blue-500/5'
                      : 'border-gray-700 hover:border-gray-500 hover:bg-gray-800/50'
                }
              `}
              data-testid={`report-item-${report.id}`}
              data-highlighted={highlighted}
              data-batch-selected={batchSelected}
            >
              {/* Checkbox for multi-select */}
              {multiSelectEnabled && (
                <div
                  className="flex items-center pl-3 shrink-0"
                  data-checkbox-area="true"
                >
                  <label className="relative flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={batchSelected}
                      onChange={(e) => handleCheckboxChange(report.id, e.target.checked)}
                      className="sr-only peer"
                      aria-label={`Select ${report.description.slice(0, 30)} for batch assignment`}
                      data-testid={`report-checkbox-${report.id}`}
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-colors ${
                        batchSelected
                          ? 'bg-blue-500 border-blue-500'
                          : 'border-gray-500 hover:border-gray-400'
                      }`}
                    >
                      {batchSelected && (
                        <svg
                          className="w-full h-full text-white"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                  </label>
                </div>
              )}

              {/* Report content */}
              <div className="flex-1 min-w-0">
                <ReportListItem report={report} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Batch selection footer */}
      {multiSelectEnabled && batchSelectionCount > 0 && (
        <div
          className="shrink-0 px-4 py-3 border-t border-gray-700 bg-gray-900/95 backdrop-blur-sm flex items-center justify-between"
          data-testid="batch-selection-footer"
        >
          <span className="text-sm text-gray-300">
            <span className="font-medium text-white">{batchSelectionCount}</span>
            {' '}report{batchSelectionCount !== 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onExtractInfo?.(selectedForBatch)}
              className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              data-testid="batch-extract-button"
            >
              Extract Info
            </button>
            <button
              type="button"
              onClick={onOpenBatchAssignment}
              className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              data-testid="batch-assign-button"
            >
              Assign Crew
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
