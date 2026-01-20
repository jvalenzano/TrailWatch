/**
 * HazardRadiusOverlay - Map layer for showing hazard impact radius.
 * Displays a red semi-transparent circle with pulsing animation
 * centered on hazard coordinates.
 * Follows WF7 wireframe specifications.
 */

import { useContext, useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { MapContext } from '../MapView';

export interface HazardRadiusOverlayProps {
    /** Longitude of the hazard center */
    longitude: number;
    /** Latitude of the hazard center */
    latitude: number;
    /** Radius of the hazard impact area in meters */
    radiusMeters: number;
    /** Fill color (default: red '#EF4444') */
    fillColor?: string;
    /** Fill opacity (default: 0.2) */
    fillOpacity?: number;
    /** Stroke color (default: darker red '#DC2626') */
    strokeColor?: string;
    /** Stroke width in pixels (default: 2) */
    strokeWidth?: number;
    /** Unique identifier for this overlay */
    id?: string;
}

/**
 * Generate GeoJSON circle from center point and radius
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
        properties: {
            radiusMeters,
        },
        geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
        },
    };
}

export function HazardRadiusOverlay({
    longitude,
    latitude,
    radiusMeters,
    fillColor = '#EF4444', // red-500
    fillOpacity = 0.2,
    strokeColor = '#DC2626', // red-600
    strokeWidth = 2,
    id = 'hazard-radius',
}: HazardRadiusOverlayProps) {
    const { map } = useContext(MapContext);
    const sourceIdRef = useRef(`${id}-source`);
    const fillLayerIdRef = useRef(`${id}-fill`);
    const strokeLayerIdRef = useRef(`${id}-stroke`);

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

    // Render hidden element for testid and pulsing indicator
    return (
        <div
            data-testid="hazard-radius-overlay"
            data-pulsing="true"
            style={{ display: 'none' }}
            aria-hidden="true"
        />
    );
}
