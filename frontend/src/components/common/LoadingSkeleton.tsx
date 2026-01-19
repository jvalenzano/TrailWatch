interface LoadingSkeletonProps {
    /** Skeleton variant type */
    variant: 'report-list' | 'map-overlay';
    /** Number of skeleton cards to render (report-list only) */
    count?: number;
}

function ReportListSkeleton({ count = 3 }: { count: number }) {
    return (
        <div className="space-y-3 p-4">
            {Array.from({ length: count }, (_, i) => (
                <div
                    key={i}
                    data-testid={`skeleton-card-${i}`}
                    className="animate-pulse p-4 rounded-lg border border-gray-700 bg-gray-800/50"
                >
                    <div className="flex items-center justify-between mb-3">
                        <div className="h-4 w-24 bg-gray-700 rounded" />
                        <div className="h-4 w-16 bg-gray-700 rounded" />
                    </div>
                    <div className="h-4 w-3/4 bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-full bg-gray-700 rounded mb-2" />
                    <div className="h-3 w-5/6 bg-gray-700 rounded" />
                </div>
            ))}
        </div>
    );
}

function MapOverlaySkeleton() {
    return (
        <div
            data-testid="map-loading-overlay"
            className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10"
        >
            <div
                data-testid="loading-spinner"
                className="w-12 h-12 border-4 border-gray-600 border-t-emerald-500 rounded-full animate-spin"
                aria-hidden="true"
            />
        </div>
    );
}

/**
 * Loading skeleton component with variants for different UI contexts.
 *
 * @example
 * // Report list loading state
 * <LoadingSkeleton variant="report-list" count={5} />
 *
 * // Map loading overlay
 * <LoadingSkeleton variant="map-overlay" />
 */
export function LoadingSkeleton({ variant, count = 3 }: LoadingSkeletonProps) {
    return (
        <div
            role="status"
            aria-busy="true"
            aria-label="Loading content"
        >
            {variant === 'report-list' && <ReportListSkeleton count={count} />}
            {variant === 'map-overlay' && <MapOverlaySkeleton />}
        </div>
    );
}
