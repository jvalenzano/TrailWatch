
import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

interface MapViewProps {
    initialCenter?: [number, number];
    initialZoom?: number;
    children?: React.ReactNode;
}

export const MapContext = React.createContext<{ map: maplibregl.Map | null }>({ map: null });

export function MapView({
    initialCenter = [-120.5, 37.5], // Default to Sierra Nevada roughly
    initialZoom = 7,
    children
}: MapViewProps) {
    const mapContainer = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<maplibregl.Map | null>(null);

    useEffect(() => {
        if (map) return; // Initialize only once
        if (!mapContainer.current) return;

        const mapInstance = new maplibregl.Map({
            container: mapContainer.current,
            style: 'https://demotiles.maplibre.org/style.json', // Free demo style for dev/verification
            center: initialCenter,
            zoom: initialZoom,
        });

        mapInstance.on('load', () => {
            setMap(mapInstance);
            mapInstance.resize(); // Fix for flexbox resizing issues
        });

        return () => {
            mapInstance.remove();
        };
    }, [initialCenter, initialZoom]);

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
