import React from 'react';

interface MapFirstLayoutProps {
    /** Left sidebar content (25%) - typically spatial insights */
    sidebarContent: React.ReactNode;
    /** Center content (50%) - the map */
    mapContent: React.ReactNode;
    /** Right panel content (25%) - typically report list */
    listContent: React.ReactNode;
}

/**
 * Three-panel layout for Agentic mode: sidebar/map/list
 * Layout distribution: 25% | 50% | 25%
 */
export function MapFirstLayout({
    sidebarContent,
    mapContent,
    listContent,
}: MapFirstLayoutProps) {
    return (
        <div
            className="flex h-full w-full"
            data-testid="map-first-layout"
        >
            {/* Left sidebar - Spatial Insights (25%) */}
            <aside
                className="w-1/4 overflow-y-auto border-r border-gray-700 bg-gray-900/50"
                aria-label="Spatial insights panel"
            >
                {sidebarContent}
            </aside>

            {/* Center - Map (50%) */}
            <main
                className="w-1/2 relative"
                aria-label="Map view"
            >
                {mapContent}
            </main>

            {/* Right panel - Report List (25%) */}
            <aside
                className="w-1/4 overflow-y-auto border-l border-gray-700 bg-gray-900/50"
                aria-label="Report list panel"
            >
                {listContent}
            </aside>
        </div>
    );
}
