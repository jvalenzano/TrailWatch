import { ReactNode } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface MapFirstLayoutProps {
    /** Left sidebar content (20%) - typically insights */
    insightPanel: ReactNode;
    /** Center map content (60%) */
    mapPanel: ReactNode;
    /** Right sidebar content (20%) - typically reports */
    reportPanel: ReactNode;
}

/**
 * Map-first three-panel layout for Agentic mode.
 *
 * Responsive behavior:
 * - Desktop/Wide (≥1024px): Horizontal 20/60/20 split
 * - Tablet/Mobile (<1024px): Vertical stack (Map → Insights → Reports)
 *
 * This is a stateless presentation component - all state management
 * should be handled by parent components.
 */
export function MapFirstLayout({
    insightPanel,
    mapPanel,
    reportPanel,
}: MapFirstLayoutProps) {
    const { isAtLeast } = useBreakpoint();

    const isDesktopOrWide = isAtLeast('desktop');

    // Desktop/Wide: horizontal 20/60/20 layout
    if (isDesktopOrWide) {
        return (
            <div
                className="flex h-full w-full"
                data-testid="map-first-layout"
            >
                <aside
                    className="w-1/5 overflow-y-auto border-r border-gray-700 bg-gray-900/50"
                    data-testid="insight-panel"
                    aria-label="Insights panel"
                >
                    {insightPanel}
                </aside>
                <main
                    className="w-3/5 relative"
                    data-testid="map-panel"
                    aria-label="Map panel"
                >
                    {mapPanel}
                </main>
                <aside
                    className="w-1/5 overflow-y-auto border-l border-gray-700 bg-gray-900/50"
                    data-testid="report-panel"
                    aria-label="Reports panel"
                >
                    {reportPanel}
                </aside>
            </div>
        );
    }

    // Tablet/Mobile: vertical stack (Map → Insights → Reports)
    return (
        <div
            className="flex flex-col h-full w-full"
            data-testid="map-first-layout"
        >
            <main
                className="flex-1 relative min-h-[300px]"
                data-testid="map-panel"
                aria-label="Map panel"
            >
                {mapPanel}
            </main>
            <aside
                className="overflow-y-auto border-t border-gray-700 bg-gray-900/50"
                data-testid="insight-panel"
                aria-label="Insights panel"
            >
                {insightPanel}
            </aside>
            <aside
                className="overflow-y-auto border-t border-gray-700 bg-gray-900/50"
                data-testid="report-panel"
                aria-label="Reports panel"
            >
                {reportPanel}
            </aside>
        </div>
    );
}
