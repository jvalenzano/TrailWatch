/**
 * ReportChecklist - Compact list of selected reports with expand/collapse
 *
 * Shows a summary of selected reports for batch assignment.
 * Supports removing reports from selection.
 */

import { useState } from 'react';
import type { HazardReport } from '../../types/report';

export interface ReportChecklistProps {
    /** List of selected reports */
    reports: HazardReport[];
    /** Callback to deselect a report */
    onDeselectReport?: (reportId: string) => void;
    /** Maximum reports to show before collapsing */
    maxVisible?: number;
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
}

/**
 * Report checklist with expand/collapse
 */
export function ReportChecklist({
    reports,
    onDeselectReport,
    maxVisible = 3,
}: ReportChecklistProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const hasMoreReports = reports.length > maxVisible;
    const visibleReports = isExpanded ? reports : reports.slice(0, maxVisible);
    const hiddenCount = reports.length - maxVisible;

    if (reports.length === 0) {
        return (
            <div
                className="p-4 text-center text-gray-500 bg-gray-800/30 border border-gray-700 border-dashed rounded-lg"
                data-testid="report-checklist-empty"
            >
                No reports selected
            </div>
        );
    }

    return (
        <div
            className="border border-gray-700 rounded-lg overflow-hidden"
            data-testid="report-checklist"
        >
            {/* Header */}
            <div className="px-4 py-2 bg-gray-800/50 border-b border-gray-700 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-300">
                    Selected Reports ({reports.length})
                </span>
                {hasMoreReports && (
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 focus:outline-none focus:underline"
                        aria-expanded={isExpanded}
                        aria-controls="report-checklist-items"
                        data-testid="report-checklist-toggle"
                    >
                        {isExpanded ? 'Show less' : `Show all ${reports.length}`}
                    </button>
                )}
            </div>

            {/* Report list */}
            <ul
                id="report-checklist-items"
                className="divide-y divide-gray-700/50"
                role="list"
            >
                {visibleReports.map((report) => (
                    <li
                        key={report.id}
                        className="px-4 py-2 flex items-center justify-between gap-3 hover:bg-gray-800/30"
                        data-testid={`report-checklist-item-${report.id}`}
                    >
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                {/* Severity indicator */}
                                <span
                                    className={`w-2 h-2 rounded-full shrink-0 ${
                                        report.severity_estimate === 'dangerous'
                                            ? 'bg-red-500'
                                            : report.severity_estimate === 'impassable'
                                              ? 'bg-orange-500'
                                              : report.severity_estimate === 'difficult'
                                                ? 'bg-yellow-500'
                                                : 'bg-green-500'
                                    }`}
                                    role="img"
                                    aria-label={`Severity: ${report.severity_estimate}`}
                                />
                                <span className="text-sm text-white truncate">
                                    {truncateText(report.description, 40)}
                                </span>
                            </div>
                            <div className="text-xs text-gray-500 mt-0.5">
                                {report.trail_name ?? 'Unknown trail'} • {report.hazard_type}
                            </div>
                        </div>

                        {/* Remove button */}
                        {onDeselectReport && (
                            <button
                                type="button"
                                onClick={() => onDeselectReport(report.id)}
                                className="shrink-0 p-1 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                                aria-label={`Remove ${truncateText(report.description, 20)} from selection`}
                                data-testid={`report-checklist-remove-${report.id}`}
                            >
                                <svg
                                    className="w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            {/* Collapsed indicator */}
            {!isExpanded && hasMoreReports && (
                <div className="px-4 py-2 text-xs text-gray-500 bg-gray-800/30 text-center">
                    +{hiddenCount} more report{hiddenCount > 1 ? 's' : ''}
                </div>
            )}
        </div>
    );
}
