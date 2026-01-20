/**
 * SpatialInsightsMenu - Dropdown menu for spatial analysis tools.
 * Provides access to Heatmap Analysis, Route Traffic, Incident Trends, and Resource Allocation.
 * Follows WF2 wireframe specifications.
 */
import { useState, useRef, useEffect, useCallback } from 'react';

export interface SpatialInsightsMenuProps {
    /** Callback when Heatmap Analysis is selected */
    onSelectHeatmap?: () => void;
    /** Callback when Route Traffic is selected */
    onSelectRouteTraffic?: () => void;
    /** Callback when Incident Trends is selected */
    onSelectIncidentTrends?: () => void;
    /** Callback when Resource Allocation is selected */
    onSelectResourceAllocation?: () => void;
    /** Compact mode for smaller displays */
    compact?: boolean;
}

interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    onClick?: () => void;
}

/**
 * Heatmap icon
 */
function HeatmapIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
        </svg>
    );
}

/**
 * Route/Path icon
 */
function RouteIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
        </svg>
    );
}

/**
 * Trend/Chart icon
 */
function TrendIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
            />
        </svg>
    );
}

/**
 * Resource/Users icon
 */
function ResourceIcon() {
    return (
        <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
        </svg>
    );
}

/**
 * Menu trigger chevron icon
 */
function ChevronIcon({ isOpen }: { isOpen: boolean }) {
    return (
        <svg
            className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );
}

export function SpatialInsightsMenu({
    onSelectHeatmap,
    onSelectRouteTraffic,
    onSelectIncidentTrends,
    onSelectResourceAllocation,
    compact = false,
}: SpatialInsightsMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // Menu items configuration
    const menuItems: MenuItem[] = [
        {
            id: 'heatmap',
            label: 'Heatmap Analysis',
            icon: <HeatmapIcon />,
            onClick: onSelectHeatmap,
        },
        {
            id: 'route-traffic',
            label: 'Route Traffic',
            icon: <RouteIcon />,
            onClick: onSelectRouteTraffic,
        },
        {
            id: 'incident-trends',
            label: 'Incident Trends',
            icon: <TrendIcon />,
            onClick: onSelectIncidentTrends,
        },
        {
            id: 'resource-allocation',
            label: 'Resource Allocation',
            icon: <ResourceIcon />,
            onClick: onSelectResourceAllocation,
        },
    ];

    // Handle click outside to close menu
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    // Handle keyboard navigation
    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            setIsOpen(false);
            buttonRef.current?.focus();
        }
    }, []);

    // Handle menu item click
    const handleItemClick = useCallback((item: MenuItem) => {
        item.onClick?.();
        setIsOpen(false);
    }, []);

    return (
        <div
            ref={menuRef}
            className="relative"
            data-testid="spatial-insights-menu"
        >
            {/* Menu trigger button */}
            <button
                ref={buttonRef}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 text-gray-200 transition-colors ${
                    compact ? 'text-sm' : ''
                }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-label="Spatial Insights Menu"
            >
                <span>Spatial Insights</span>
                <ChevronIcon isOpen={isOpen} />
            </button>

            {/* Dropdown menu */}
            {isOpen && (
                <div
                    role="menu"
                    aria-orientation="vertical"
                    onKeyDown={handleKeyDown}
                    className="absolute top-full left-0 mt-1 w-56 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 overflow-hidden"
                >
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            role="menuitem"
                            onClick={() => handleItemClick(item)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-200 hover:bg-gray-700 transition-colors"
                        >
                            <span className="text-gray-400">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
