import React, { useState, useCallback, createContext, useContext, useRef, useEffect } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapViewport } from '../../types/spatial';

// ============================================================================
// Persistent Map Context - Prevents map from unmounting during panel switches
// ============================================================================

interface PersistentMapContextValue {
    map: maplibregl.Map | null;
    mapContainer: React.RefObject<HTMLDivElement | null>;
    isMapReady: boolean;
}

const PersistentMapContext = createContext<PersistentMapContextValue>({
    map: null,
    mapContainer: { current: null },
    isMapReady: false,
});

export function usePersistentMap() {
    return useContext(PersistentMapContext);
}

// ============================================================================
// Panel Types
// ============================================================================

export type LeftPanelContent = 'insights' | 'filters' | 'crews' | null;
export type RightPanelContent = 'reports' | 'detail' | 'actions' | null;

interface AgenticLayoutProps {
    /** Content for the left sidebar (20%) */
    leftPanel?: React.ReactNode;
    /** Content for the right panel (20%) */
    rightPanel?: React.ReactNode;
    /** Map overlay content (markers, clusters) - receives map context */
    mapOverlay?: React.ReactNode;
    /** Initial map center [lng, lat] */
    initialCenter?: [number, number];
    /** Initial zoom level */
    initialZoom?: number;
    /** Programmatic viewport to fly to */
    flyToViewport?: MapViewport | null;
    /** Callback when viewport changes */
    onViewportChange?: (viewport: MapViewport) => void;
    /** Currently active left panel */
    activeLeftPanel?: LeftPanelContent;
    /** Currently active right panel */
    activeRightPanel?: RightPanelContent;
    /** Callback to toggle left panel */
    onLeftPanelToggle?: (panel: LeftPanelContent) => void;
    /** Callback to toggle right panel */
    onRightPanelToggle?: (panel: RightPanelContent) => void;
}

const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

/**
 * AgenticLayout - Map-first layout with 20/60/20 grid
 *
 * The map is rendered as a persistent background layer that never unmounts.
 * Left and right panels overlay on top with semi-transparent backgrounds.
 *
 * Layout:
 * - Left panel: 20% width (collapsible)
 * - Map: 60% center (visible through gaps, click-through when panels open)
 * - Right panel: 20% width (collapsible)
 *
 * The map instance is preserved across panel state changes to prevent
 * expensive re-initialization.
 */
export function AgenticLayout({
    leftPanel,
    rightPanel,
    mapOverlay,
    initialCenter = [-121.75, 46.85], // Pacific Northwest default
    initialZoom = 10,
    flyToViewport,
    onViewportChange,
    activeLeftPanel = 'insights',
    activeRightPanel = 'reports',
}: AgenticLayoutProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [isMapReady, setIsMapReady] = useState(false);

    // Initialize map once and keep it persistent
    useEffect(() => {
        if (mapRef.current) return; // Already initialized
        if (!mapContainerRef.current) return;

        try {
            const mapInstance = new maplibregl.Map({
                container: mapContainerRef.current,
                style: DARK_STYLE,
                center: initialCenter,
                zoom: initialZoom,
                attributionControl: false,
            });

            // Add minimal attribution
            mapInstance.addControl(
                new maplibregl.AttributionControl({ compact: true }),
                'bottom-right'
            );

            // Add navigation controls
            mapInstance.addControl(
                new maplibregl.NavigationControl({ showCompass: true }),
                'top-right'
            );

            mapInstance.on('load', () => {
                mapRef.current = mapInstance;
                setIsMapReady(true);
                // Ensure map fills container after load
                mapInstance.resize();
            });

            // Cleanup only on full unmount (not panel changes)
            return () => {
                mapInstance.remove();
                mapRef.current = null;
                setIsMapReady(false);
            };
        } catch (e) {
            console.error('Failed to initialize map:', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty deps = only run once

    // Handle viewport change callback
    const handleViewportChange = useCallback(() => {
        if (!mapRef.current || !onViewportChange) return;

        const map = mapRef.current;
        const center = map.getCenter();

        onViewportChange({
            center: [center.lng, center.lat],
            zoom: map.getZoom(),
            bearing: map.getBearing(),
            pitch: map.getPitch(),
        });
    }, [onViewportChange]);

    // Register viewport change listeners
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !onViewportChange) return;

        map.on('moveend', handleViewportChange);
        map.on('zoomend', handleViewportChange);

        return () => {
            map.off('moveend', handleViewportChange);
            map.off('zoomend', handleViewportChange);
        };
    }, [isMapReady, onViewportChange, handleViewportChange]);

    // Handle programmatic flyTo
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !flyToViewport) return;

        map.flyTo({
            center: flyToViewport.center,
            zoom: flyToViewport.zoom,
            bearing: flyToViewport.bearing ?? 0,
            pitch: flyToViewport.pitch ?? 0,
            duration: 1500,
            essential: true,
        });
    }, [flyToViewport]);

    // Resize map when panels toggle
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Small delay to allow CSS transition to complete
        const timer = setTimeout(() => {
            map.resize();
        }, 350);

        return () => clearTimeout(timer);
    }, [activeLeftPanel, activeRightPanel]);

    const showLeftPanel = activeLeftPanel !== null;
    const showRightPanel = activeRightPanel !== null;

    return (
        <div
            className="relative w-full h-full overflow-hidden bg-gray-950"
            data-testid="agentic-layout"
        >
            {/* ============================================================
                Layer 1: Persistent Map Background (always rendered)
                ============================================================ */}
            <div
                ref={mapContainerRef}
                className="absolute inset-0 w-full h-full z-0"
                data-testid="agentic-map-container"
            />

            {/* ============================================================
                Layer 2: Map Overlay Content (markers, clusters, etc.)
                Rendered inside map context when map is ready
                ============================================================ */}
            {isMapReady && mapRef.current && (
                <PersistentMapContext.Provider
                    value={{
                        map: mapRef.current,
                        mapContainer: mapContainerRef,
                        isMapReady,
                    }}
                >
                    {mapOverlay}
                </PersistentMapContext.Provider>
            )}

            {/* ============================================================
                Layer 3: Panel Grid Overlay (20% | 60% | 20%)
                Panels have semi-transparent backgrounds
                ============================================================ */}
            <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="flex h-full">
                    {/* Left Panel (20%) */}
                    <aside
                        className={`
                            h-full overflow-hidden transition-all duration-300 ease-in-out
                            pointer-events-auto
                            ${showLeftPanel ? 'w-[20%]' : 'w-0'}
                        `}
                        aria-label="Left panel"
                        aria-hidden={!showLeftPanel}
                        data-testid="agentic-left-panel"
                    >
                        <div
                            className={`
                                h-full overflow-y-auto
                                bg-gray-900/95 backdrop-blur-sm
                                border-r border-gray-700/50
                                transition-opacity duration-300
                                ${showLeftPanel ? 'opacity-100' : 'opacity-0'}
                            `}
                        >
                            {leftPanel}
                        </div>
                    </aside>

                    {/* Center Map Area (60%) - Click-through to map */}
                    <div
                        className={`
                            h-full flex-1 transition-all duration-300
                            ${showLeftPanel ? '' : 'ml-0'}
                            ${showRightPanel ? '' : 'mr-0'}
                        `}
                        data-testid="agentic-center-area"
                    >
                        {/* Map controls float here - could add toggle buttons */}
                    </div>

                    {/* Right Panel (20%) */}
                    <aside
                        className={`
                            h-full overflow-hidden transition-all duration-300 ease-in-out
                            pointer-events-auto
                            ${showRightPanel ? 'w-[20%]' : 'w-0'}
                        `}
                        aria-label="Right panel"
                        aria-hidden={!showRightPanel}
                        data-testid="agentic-right-panel"
                    >
                        <div
                            className={`
                                h-full overflow-y-auto
                                bg-gray-900/95 backdrop-blur-sm
                                border-l border-gray-700/50
                                transition-opacity duration-300
                                ${showRightPanel ? 'opacity-100' : 'opacity-0'}
                            `}
                        >
                            {rightPanel}
                        </div>
                    </aside>
                </div>
            </div>

            {/* ============================================================
                Layer 4: Panel Toggle Controls (floating buttons)
                ============================================================ */}
            <div className="absolute top-4 left-4 z-20 flex gap-2">
                {!showLeftPanel && (
                    <button
                        type="button"
                        className="p-2 bg-gray-800/90 border border-gray-600 rounded-lg
                                   hover:bg-gray-700 transition-colors
                                   focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Show insights panel"
                        data-testid="show-left-panel-btn"
                    >
                        <svg
                            className="w-5 h-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                            />
                        </svg>
                    </button>
                )}
            </div>

            <div className="absolute top-4 right-4 z-20 flex gap-2">
                {!showRightPanel && (
                    <button
                        type="button"
                        className="p-2 bg-gray-800/90 border border-gray-600 rounded-lg
                                   hover:bg-gray-700 transition-colors
                                   focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Show reports panel"
                        data-testid="show-right-panel-btn"
                    >
                        <svg
                            className="w-5 h-5 text-gray-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}

// ============================================================================
// MapMarkerPortal - Renders children into the map's marker layer
// ============================================================================

interface MapMarkerPortalProps {
    children: React.ReactNode;
}

/**
 * Portal component for rendering markers within the persistent map context.
 * Use this to add markers, popups, or other map overlays.
 */
export function MapMarkerPortal({ children }: MapMarkerPortalProps) {
    const { map, isMapReady } = usePersistentMap();

    if (!map || !isMapReady) {
        return null;
    }

    return <>{children}</>;
}
