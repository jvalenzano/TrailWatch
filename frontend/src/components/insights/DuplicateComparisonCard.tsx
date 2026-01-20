/**
 * DuplicateComparisonCard - Full comparison view for potential duplicate reports.
 * Displays side-by-side comparison with photos, GPS, descriptions, and status badges.
 * Follows WF5 wireframe specifications.
 */

export interface DuplicateReportData {
    /** Report ID */
    id: string;
    /** Report description */
    description: string;
    /** Photo URL (optional) */
    photoUrl?: string;
    /** GPS coordinates */
    coordinates: {
        latitude: number;
        longitude: number;
    };
    /** Report status */
    status: 'new' | 'assigned' | 'in_progress' | 'resolved';
    /** Report timestamp */
    timestamp: Date;
}

export interface DuplicateComparisonCardProps {
    /** First report (original) */
    reportA: DuplicateReportData;
    /** Second report (potential duplicate) */
    reportB: DuplicateReportData;
    /** Similarity score (0-1) */
    similarityScore: number;
    /** Distance between reports in meters */
    distanceMeters: number;
    /** Callback when "Mark as Duplicate" is clicked */
    onMarkDuplicate?: (reportAId: string, reportBId: string) => void;
    /** Callback when "Keep Separate" is clicked */
    onKeepSeparate?: (reportAId: string, reportBId: string) => void;
    /** Callback when "View Both on Map" is clicked */
    onViewOnMap?: (reportAId: string, reportBId: string) => void;
}

/**
 * Warning icon SVG
 */
function WarningIcon() {
    return (
        <svg
            className="w-5 h-5 text-yellow-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
            data-testid="duplicate-warning-icon"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
        </svg>
    );
}

/**
 * Arrow icon for distance visualization
 */
function DistanceArrowIcon() {
    return (
        <svg
            className="w-8 h-4 text-yellow-400"
            viewBox="0 0 32 16"
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
        >
            <path
                d="M4 8h20M24 8l-4-4M24 8l-4 4"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/**
 * Status badge colors
 */
const statusStyles: Record<DuplicateReportData['status'], { bg: string; text: string }> = {
    new: { bg: 'bg-blue-500/20 border-blue-500/30', text: 'text-blue-400' },
    assigned: { bg: 'bg-orange-500/20 border-orange-500/30', text: 'text-orange-400' },
    in_progress: { bg: 'bg-yellow-500/20 border-yellow-500/30', text: 'text-yellow-400' },
    resolved: { bg: 'bg-green-500/20 border-green-500/30', text: 'text-green-400' },
};

const statusLabels: Record<DuplicateReportData['status'], string> = {
    new: 'NEW',
    assigned: 'ASSIGNED',
    in_progress: 'IN PROGRESS',
    resolved: 'RESOLVED',
};

/**
 * Format GPS coordinates for display
 */
function formatCoordinates(lat: number, lng: number): { lat: string; lng: string } {
    return {
        lat: lat.toFixed(4),
        lng: lng.toFixed(4),
    };
}

/**
 * Format distance for display
 */
function formatDistance(meters: number): string {
    if (meters >= 1000) {
        return `${(meters / 1000).toFixed(1)} km`;
    }
    return `${Math.round(meters)} meters`;
}

/**
 * Truncate description for preview
 */
function truncateDescription(description: string, maxLength: number = 80): string {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength).trim() + '...';
}

/**
 * Report preview card within the comparison
 */
function ReportPreview({ report, label }: { report: DuplicateReportData; label: string }) {
    const coords = formatCoordinates(report.coordinates.latitude, report.coordinates.longitude);
    const style = statusStyles[report.status];

    return (
        <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">{label}</div>

            {/* Photo thumbnail */}
            <div className="aspect-video bg-gray-700 rounded-lg overflow-hidden mb-2">
                {report.photoUrl ? (
                    <img
                        src={report.photoUrl}
                        alt={`Photo for report ${report.id}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div
                        className="w-full h-full flex items-center justify-center text-gray-500"
                        data-testid={`photo-placeholder-${report.id}`}
                    >
                        <svg
                            className="w-8 h-8"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Status badge */}
            <div className="mb-2">
                <span className={`px-2 py-0.5 text-xs font-medium rounded border ${style.bg} ${style.text}`}>
                    {statusLabels[report.status]}
                </span>
            </div>

            {/* GPS coordinates */}
            <div className="text-xs text-gray-400 font-mono mb-2">
                <div>{coords.lat}°N</div>
                <div>{coords.lng}°W</div>
            </div>

            {/* Description preview */}
            <p className="text-xs text-gray-300 line-clamp-2">
                {truncateDescription(report.description)}
            </p>
        </div>
    );
}

export function DuplicateComparisonCard({
    reportA,
    reportB,
    similarityScore,
    distanceMeters,
    onMarkDuplicate,
    onKeepSeparate,
    onViewOnMap,
}: DuplicateComparisonCardProps) {
    const similarityPercent = Math.round(similarityScore * 100);
    const hasActions = onMarkDuplicate || onKeepSeparate || onViewOnMap;

    return (
        <div
            className="p-4 rounded-lg border-2 border-yellow-500 bg-yellow-500/10"
            data-testid="duplicate-comparison-card"
            aria-live="polite"
            role="alert"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-yellow-500/30">
                <WarningIcon />
                <span className="font-bold text-yellow-400 text-sm uppercase tracking-wide">
                    POSSIBLE DUPLICATE
                </span>
            </div>

            {/* Similarity score prominence */}
            <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-yellow-500/20 rounded-lg">
                <span className="text-2xl font-bold text-yellow-300">{similarityPercent}%</span>
                <span className="text-sm text-yellow-400">similar</span>
            </div>

            {/* Side-by-side comparison */}
            <div className="flex gap-4 mb-4">
                <ReportPreview report={reportA} label="Report A (Original)" />
                <ReportPreview report={reportB} label="Report B (Duplicate?)" />
            </div>

            {/* Distance visualization */}
            <div className="flex items-center justify-center gap-2 mb-4 py-2 bg-gray-800/50 rounded-lg">
                <span className="text-gray-400 text-xs">Distance:</span>
                <DistanceArrowIcon />
                <span className="font-semibold text-yellow-400">{formatDistance(distanceMeters)}</span>
            </div>

            {/* Action buttons */}
            {hasActions && (
                <div className="flex flex-wrap gap-2 pt-3 border-t border-yellow-500/30">
                    {onMarkDuplicate && (
                        <button
                            type="button"
                            onClick={() => onMarkDuplicate(reportA.id, reportB.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors"
                        >
                            Mark as Duplicate
                        </button>
                    )}
                    {onKeepSeparate && (
                        <button
                            type="button"
                            onClick={() => onKeepSeparate(reportA.id, reportB.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                        >
                            Keep Separate
                        </button>
                    )}
                    {onViewOnMap && (
                        <button
                            type="button"
                            onClick={() => onViewOnMap(reportA.id, reportB.id)}
                            className="px-3 py-1.5 text-xs font-medium rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                        >
                            View Both on Map
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
