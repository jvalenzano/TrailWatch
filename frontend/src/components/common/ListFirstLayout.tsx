import React, { useState } from 'react';
import { useBreakpoint } from '../../hooks/useBreakpoint';

interface ListFirstLayoutProps {
    listContent: React.ReactNode;
    mapContent: React.ReactNode;
}

/**
 * Two-panel layout for Traditional/Moderate modes: list/map
 *
 * Responsive behavior:
 * - wide/desktop (≥1024px): Side-by-side layout (60% list | 40% map)
 * - tablet (≥640px): Stacked vertical layout
 * - mobile (<640px): Single panel with tab navigation
 */
export function ListFirstLayout({ listContent, mapContent }: ListFirstLayoutProps) {
    const { breakpoint } = useBreakpoint();
    const [mobilePanel, setMobilePanel] = useState<'list' | 'map'>('list');

    // Mobile: single panel with tab navigation
    if (breakpoint === 'mobile') {
        return (
            <div className="flex flex-col h-full" data-testid="list-first-layout-mobile">
                {/* Mobile tab bar */}
                <nav className="flex border-b border-gray-700 bg-gray-900" aria-label="Mobile navigation">
                    <button
                        type="button"
                        onClick={() => setMobilePanel('list')}
                        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                            mobilePanel === 'list'
                                ? 'text-emerald-400 border-b-2 border-emerald-400'
                                : 'text-gray-400 hover:text-gray-200'
                        }`}
                        aria-pressed={mobilePanel === 'list'}
                    >
                        Reports
                    </button>
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
                </nav>

                {/* Content panel */}
                <div className="flex-1 overflow-hidden">
                    {mobilePanel === 'list' && (
                        <div className="h-full p-4 overflow-y-auto" data-testid="list-panel">
                            {listContent}
                        </div>
                    )}
                    {mobilePanel === 'map' && (
                        <div className="h-full p-4" data-testid="map-panel">
                            {mapContent}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Tablet: stacked vertical layout
    if (breakpoint === 'tablet') {
        return (
            <div className="flex flex-col h-full" data-testid="list-first-layout-tablet">
                <div className="h-1/2 p-4 overflow-y-auto border-b border-gray-700">
                    {listContent}
                </div>
                <div className="h-1/2 p-4">
                    {mapContent}
                </div>
            </div>
        );
    }

    // Desktop/Wide: side-by-side layout
    return (
        <div className="flex h-full" data-testid="list-first-layout">
            <div className="w-3/5 p-4 overflow-y-auto">{listContent}</div>
            <div className="w-2/5 p-4">{mapContent}</div>
        </div>
    );
}
