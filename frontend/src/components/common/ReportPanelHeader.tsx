/**
 * ReportPanelHeader - Header for the report panel showing "REPORTS (N)" format.
 * Optionally shows highlighted/total format when reports are highlighted.
 * Supports cluster filter mode for WF2 cluster alert views.
 */
export interface ReportPanelHeaderProps {
    /** Total number of reports */
    totalCount: number;
    /** Number of highlighted reports (from insight selection) */
    highlightedCount?: number;
    /** Cluster ID for filtered view (changes header to "CLUSTER REPORTS") */
    clusterFilterId?: string | null;
    /** Callback to clear cluster filter */
    onClearClusterFilter?: () => void;
    /** Additional className for the container */
    className?: string;
}

export function ReportPanelHeader({
    totalCount,
    highlightedCount = 0,
    clusterFilterId,
    onClearClusterFilter,
    className = '',
}: ReportPanelHeaderProps) {
    const showHighlighted = highlightedCount > 0;
    const isClusterFiltered = !!clusterFilterId;

    // Cluster filtered mode
    if (isClusterFiltered) {
        return (
            <div
                className={`p-4 border-b border-red-500/30 bg-red-500/5 shrink-0 ${className}`}
                data-testid="report-panel-header"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-red-400 flex items-baseline gap-2">
                        <span>CLUSTER REPORTS</span>
                        <span className="text-red-300/70 font-normal">({totalCount})</span>
                    </h2>
                    {onClearClusterFilter && (
                        <button
                            type="button"
                            onClick={onClearClusterFilter}
                            className="text-xs text-gray-400 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700"
                            data-testid="clear-cluster-filter"
                        >
                            Clear Filter
                        </button>
                    )}
                </div>
            </div>
        );
    }

    // Standard mode
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
