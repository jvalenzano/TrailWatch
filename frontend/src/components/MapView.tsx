
import React, { useEffect, useRef, useState, useCallback } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { MapViewport } from '../types/spatial';

const LIGHT_STYLE = 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
const DARK_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

interface MapViewProps {
    initialCenter?: [number, number];
    initialZoom?: number;
    /** Programmatic viewport to fly to */
    flyToViewport?: MapViewport | null;
    /** Callback when viewport changes via user interaction */
    onViewportChange?: (viewport: MapViewport) => void;
    children?: React.ReactNode;
}

// eslint-disable-next-line react-refresh/only-export-components
export const MapContext = React.createContext<{ map: maplibregl.Map | null }>({ map: null });

export function MapView({
    initialCenter = [-120.5, 37.5], // Default to Sierra Nevada roughly
    initialZoom = 7,
    flyToViewport,
    onViewportChange,
    children
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<maplibregl.Map | null>(null);

    // Handle viewport change callback
    const handleViewportChange = useCallback(() => {
        if (!map || !onViewportChange) return;

        const center = map.getCenter();
        const zoom = map.getZoom();
        const bearing = map.getBearing();
        const pitch = map.getPitch();

        onViewportChange({
            center: [center.lng, center.lat],
            zoom,
            bearing,
            pitch,
        });
    }, [map, onViewportChange]);

    useEffect(() => {
        if (map) return; // Initialize only once
        if (!mapContainer.current) return;

        try {
            const isDarkTheme = window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
            const mapStyle = isDarkTheme ? DARK_STYLE : LIGHT_STYLE;

            const mapInstance = new maplibregl.Map({
                container: mapContainer.current,
                style: mapStyle,
                center: initialCenter,
                zoom: initialZoom,
            });

            mapInstance.on('load', () => {
                setMap(mapInstance);
                mapInstance.resize();
            });

            return () => {
                mapInstance.remove();
            };
        } catch (e) {
            console.error("Failed to initialize map:", e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount. Ignore prop changes for init to prevent destruction loop.

    // Register viewport change listeners
    useEffect(() => {
        if (!map || !onViewportChange) return;

        map.on('moveend', handleViewportChange);
        map.on('zoomend', handleViewportChange);

        return () => {
            map.off('moveend', handleViewportChange);
            map.off('zoomend', handleViewportChange);
        };
    }, [map, onViewportChange, handleViewportChange]);

    // Handle programmatic flyTo
    useEffect(() => {
        if (!map || !flyToViewport) return;

        map.flyTo({
            center: flyToViewport.center,
            zoom: flyToViewport.zoom,
            bearing: flyToViewport.bearing ?? 0,
            pitch: flyToViewport.pitch ?? 0,
            duration: 1500,
            essential: true,
        });
    }, [map, flyToViewport]);

    return (
        <div className="relative w-full h-full min-h-[400px] rounded-lg overflow-hidden border border-gray-700 shadow-lg">
            <div ref={mapContainer} className="absolute inset-0 w-full h-full" />
            {map && (
                <MapContext.Provider value={{ map }}>
                    {children}
                </MapContext.Provider>
            )}
        </div>
    );
}
