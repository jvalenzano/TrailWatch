import React, { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

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
 *
 * Responsive behavior:
 * - wide (≥1280px): Full three-panel layout (25% | 50% | 25%)
 * - desktop (≥1024px): Collapsible sidebar
 * - tablet (≥640px): Stacked vertical layout
 * - mobile (<640px): Single panel with hamburger menu
 */
export function MapFirstLayout({
    sidebarContent,
    mapContent,
    listContent,
}: MapFirstLayoutProps) {
    const { breakpoint } = useBreakpoint();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobilePanel, setMobilePanel] = useState<'map' | 'insights' | 'reports'>('map');

    // Mobile: single panel with tab navigation
    if (breakpoint === 'mobile') {
        return (
            <div className="flex flex-col h-full w-full" data-testid="map-first-layout-mobile">
                {/* Mobile tab bar */}
                <nav className="flex border-b border-gray-700 bg-gray-900" aria-label="Mobile navigation">
                    <button
                        type="button"
                        onClick={() => setMobilePanel('map')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            mobilePanel === 'map'
                                ? 'text-emerald-400 border-b-2 border-emerald-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                        aria-pressed={mobilePanel === 'map'}
                    >
                        Map
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobilePanel('insights')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            mobilePanel === 'insights'
                                ? 'text-emerald-400 border-b-2 border-emerald-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                        aria-pressed={mobilePanel === 'insights'}
                    >
                        Insights
                    </button>
                    <button
                        type="button"
                        onClick={() => setMobilePanel('reports')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            mobilePanel === 'reports'
                                ? 'text-emerald-400 border-b-2 border-emerald-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                        aria-pressed={mobilePanel === 'reports'}
                    >
                        Reports
                    </button>
                </nav>

                {/* Content panel */}
                <div className="flex-1 overflow-hidden">
                    {mobilePanel === 'map' && (
                        <main className="h-full relative" aria-label="Map view">
                            {mapContent}
                        </main>
                    )}
                    {mobilePanel === 'insights' && (
                        <aside className="h-full overflow-y-auto bg-gray-900/50" aria-label="Spatial insights panel">
                            {sidebarContent}
                        </aside>
                    )}
                    {mobilePanel === 'reports' && (
                        <aside className="h-full overflow-y-auto bg-gray-900/50" aria-label="Report list panel">
                            {listContent}
                        </aside>
                    )}
                </div>
            </div>
        );
    }

    // Tablet: stacked vertical layout
    if (breakpoint === 'tablet') {
        return (
            <div className="flex flex-col h-full w-full" data-testid="map-first-layout-tablet">
                {/* Map takes upper half */}
                <main className="h-1/2 relative border-b border-gray-700" aria-label="Map view">
                    {mapContent}
                </main>

                {/* Bottom half splits between insights and reports */}
                <div className="h-1/2 flex">
                    <aside
                        className="w-1/2 overflow-y-auto border-r border-gray-700 bg-gray-900/50"
                        aria-label="Spatial insights panel"
                    >
                        {sidebarContent}
                    </aside>
                    <aside
                        className="w-1/2 overflow-y-auto bg-gray-900/50"
                        aria-label="Report list panel"
                    >
                        {listContent}
                    </aside>
                </div>
            </div>
        );
    }

    // Desktop: collapsible sidebar
    if (breakpoint === 'desktop') {
        return (
            <div className="flex h-full w-full" data-testid="map-first-layout-desktop">
                {/* Collapsible sidebar */}
                <aside
                    className={`overflow-y-auto border-r border-gray-700 bg-gray-900/50 transition-all duration-300 ${
                        sidebarCollapsed ? 'w-0 opacity-0' : 'w-1/4'
                    }`}
                    aria-label="Spatial insights panel"
                    aria-hidden={sidebarCollapsed}
                >
                    {!sidebarCollapsed && sidebarContent}
                </aside>

                {/* Map with collapse toggle */}
                <main
                    className={`relative transition-all duration-300 ${
                        sidebarCollapsed ? 'w-3/4' : 'w-1/2'
                    }`}
                    aria-label="Map view"
                >
                    <button
                        type="button"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="absolute top-2 left-2 z-10 p-2 bg-gray-800/90 border border-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label={sidebarCollapsed ? 'Show insights sidebar' : 'Hide insights sidebar'}
                        aria-expanded={!sidebarCollapsed}
                    >
                        <svg
                            className={`w-4 h-4 text-gray-300 transition-transform ${sidebarCollapsed ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    {mapContent}
                </main>

                {/* Report list */}
                <aside
                    className="w-1/4 overflow-y-auto border-l border-gray-700 bg-gray-900/50"
                    aria-label="Report list panel"
                >
                    {listContent}
                </aside>
            </div>
        );
    }

    // Wide: full three-panel layout (default)
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
