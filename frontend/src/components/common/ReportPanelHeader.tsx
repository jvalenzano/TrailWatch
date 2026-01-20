/**
 * ReportPanelHeader - Header for the report panel showing "REPORTS (N)" format.
 * Optionally shows highlighted/total format when reports are highlighted.
 */
export interface ReportPanelHeaderProps {
    /** Total number of reports */
    totalCount: number;
    /** Number of highlighted reports (from insight selection) */
    highlightedCount?: number;
    /** Additional className for the container */
    className?: string;
}

export function ReportPanelHeader({
    totalCount,
    highlightedCount = 0,
    className = '',
}: ReportPanelHeaderProps) {
    const showHighlighted = highlightedCount > 0;

    return (
        <div
            className={`p-4 border-b border-gray-700/50 shrink-0 ${className}`}
            data-testid="report-panel-header"
        >
            <h2 className="text-lg font-semibold text-white flex items-baseline gap-2">
                <span>REPORTS</span>
                <span className="text-gray-400 font-normal">
                    {showHighlighted
                        ? `(${highlightedCount}/${totalCount})`
                        : `(${totalCount})`}
                </span>
            </h2>
        </div>
    );
}
