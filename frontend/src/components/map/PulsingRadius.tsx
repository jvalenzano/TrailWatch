/**
 * PulsingRadius - Animated circle overlay for cluster alerts.
 * Displays a pulsing red radius circle on the map with optional label.
 * Follows WF2 wireframe specifications for critical spatial alerts.
 */
import { useContext, useEffect, useRef, useState } from 'react';
import type maplibregl from 'maplibre-gl';
import { MapContext } from '../MapView';

export interface PulsingRadiusProps {
    /** Longitude of the circle center */
    longitude: number;
    /** Latitude of the circle center */
    latitude: number;
    /** Radius of the circle in miles */
    radiusMiles: number;
    /** Fill color of the circle (default: '#EF4444' - red) */
    fillColor?: string;
    /** Fill opacity (default: 0.2) */
    fillOpacity?: number;
    /** Stroke color of the circle border (default: '#DC2626' - darker red) */
    strokeColor?: string;
    /** Stroke width in pixels (default: 2) */
    strokeWidth?: number;
    /** Whether to show the label (default: true) */
    showLabel?: boolean;
    /** Unique identifier for this radius (default: 'pulsing-radius') */
    id?: string;
}

// Conversion constant: 1 mile = 1609.34 meters
const METERS_PER_MILE = 1609.34;

/**
 * Generate GeoJSON circle from center point and radius in meters.
 */
function createCircleGeoJSON(
    center: [number, number],
    radiusMeters: number,
    points: number = 64
): GeoJSON.Feature<GeoJSON.Polygon> {
    const coordinates: [number, number][] = [];
    const distanceX = radiusMeters / (111320 * Math.cos((center[1] * Math.PI) / 180));
    const distanceY = radiusMeters / 110540;

    for (let i = 0; i < points; i++) {
        const theta = (i / points) * 2 * Math.PI;
        const x = distanceX * Math.cos(theta);
        const y = distanceY * Math.sin(theta);
        coordinates.push([center[0] + x, center[1] + y]);
    }
    // Close the polygon
    coordinates.push(coordinates[0]);

    return {
        type: 'Feature',
        properties: {},
        geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
        },
    };
}

/**
 * Format the radius label text.
 */
function formatRadiusLabel(radiusMiles: number): string {
    const miles = radiusMiles <= 1 ? 'MILE' : 'MILES';
    return `${radiusMiles} ${miles} RADIUS`;
}

export function PulsingRadius({
    longitude,
    latitude,
    radiusMiles,
    fillColor = '#EF4444',
    fillOpacity = 0.2,
    strokeColor = '#DC2626',
    strokeWidth = 2,
    showLabel = true,
    id = 'pulsing-radius',
}: PulsingRadiusProps) {
    const { map } = useContext(MapContext);
    const sourceIdRef = useRef(`${id}-source`);
    const fillLayerIdRef = useRef(`${id}-fill`);
    const strokeLayerIdRef = useRef(`${id}-stroke`);
    const [labelPosition, setLabelPosition] = useState<{ x: number; y: number } | null>(null);

    // Convert miles to meters
    const radiusMeters = radiusMiles * METERS_PER_MILE;

    // Update label position when map moves
    useEffect(() => {
        if (!map || !showLabel) return;

        const updateLabelPosition = () => {
            const point = map.project([longitude, latitude]);
            setLabelPosition({ x: point.x, y: point.y });
        };

        // Initial position
        updateLabelPosition();

        // Update on map move
        map.on('move', updateLabelPosition);

        return () => {
            map.off('move', updateLabelPosition);
        };
    }, [map, longitude, latitude, showLabel]);

    // Add/update map layers
    useEffect(() => {
        if (!map) return;

        const sourceId = sourceIdRef.current;
        const fillLayerId = fillLayerIdRef.current;
        const strokeLayerId = strokeLayerIdRef.current;

        // Create circle GeoJSON
        const circleGeoJSON = createCircleGeoJSON([longitude, latitude], radiusMeters);

        // Add source
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: circleGeoJSON,
            });
        } else {
            (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(circleGeoJSON);
        }

        // Add fill layer
        if (!map.getLayer(fillLayerId)) {
            map.addLayer({
                id: fillLayerId,
                type: 'fill',
                source: sourceId,
                paint: {
                    'fill-color': fillColor,
                    'fill-opacity': fillOpacity,
                },
            });
        } else {
            map.setPaintProperty(fillLayerId, 'fill-color', fillColor);
            map.setPaintProperty(fillLayerId, 'fill-opacity', fillOpacity);
        }

        // Add stroke layer
        if (!map.getLayer(strokeLayerId)) {
            map.addLayer({
                id: strokeLayerId,
                type: 'line',
                source: sourceId,
                paint: {
                    'line-color': strokeColor,
                    'line-width': strokeWidth,
                },
            });
        } else {
            map.setPaintProperty(strokeLayerId, 'line-color', strokeColor);
            map.setPaintProperty(strokeLayerId, 'line-width', strokeWidth);
        }

        // Cleanup on unmount
        return () => {
            if (map.getLayer(strokeLayerId)) {
                map.removeLayer(strokeLayerId);
            }
            if (map.getLayer(fillLayerId)) {
                map.removeLayer(fillLayerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, longitude, latitude, radiusMeters, fillColor, fillOpacity, strokeColor, strokeWidth, id]);

    // Render the label overlay (if showLabel is true)
    if (!showLabel) {
        return null;
    }

    return (
        <div
            className="animate-pulse-slow pointer-events-none"
            data-testid="pulsing-radius-container"
        >
            {labelPosition && (
                <div
                    className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                        left: labelPosition.x,
                        top: labelPosition.y,
                    }}
                    data-testid="pulsing-radius-label"
                >
                    <span className="px-2 py-1 text-xs font-bold text-red-400 bg-red-900/80 rounded border border-red-500/50 whitespace-nowrap">
                        {formatRadiusLabel(radiusMiles)}
                    </span>
                </div>
            )}
        </div>
    );
}
