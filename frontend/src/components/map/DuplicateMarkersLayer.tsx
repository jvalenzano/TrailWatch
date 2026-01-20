/**
 * DuplicateMarkersLayer - Map layer for showing potential duplicate report markers.
 * Displays two markers connected by a dashed line to visualize spatial proximity.
 * Follows WF5 wireframe specifications.
 */

import { useContext, useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { MapContext } from '../MapView';

export interface DuplicateMarkerData {
    /** Report ID */
    id: string;
    /** GPS coordinates */
    coordinates: {
        longitude: number;
        latitude: number;
    };
}

export interface DuplicateMarkersLayerProps {
    /** First report (original) */
    reportA: DuplicateMarkerData;
    /** Second report (potential duplicate) */
    reportB: DuplicateMarkerData;
    /** Color for the markers (default: yellow '#EAB308') */
    markerColor?: string;
    /** Color for the connecting line (default: yellow '#EAB308') */
    lineColor?: string;
    /** Marker radius in pixels (default: 10) */
    markerRadius?: number;
    /** Line width in pixels (default: 2) */
    lineWidth?: number;
    /** Unique identifier for this layer */
    id?: string;
}

/**
 * Create GeoJSON FeatureCollection for marker points
 */
function createMarkersGeoJSON(
    reportA: DuplicateMarkerData,
    reportB: DuplicateMarkerData
): GeoJSON.FeatureCollection<GeoJSON.Point> {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {
                    reportId: reportA.id,
                    role: 'original',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [reportA.coordinates.longitude, reportA.coordinates.latitude],
                },
            },
            {
                type: 'Feature',
                properties: {
                    reportId: reportB.id,
                    role: 'duplicate',
                },
                geometry: {
                    type: 'Point',
                    coordinates: [reportB.coordinates.longitude, reportB.coordinates.latitude],
                },
            },
        ],
    };
}

/**
 * Create GeoJSON FeatureCollection for connecting line
 */
function createLineGeoJSON(
    reportA: DuplicateMarkerData,
    reportB: DuplicateMarkerData
): GeoJSON.FeatureCollection<GeoJSON.LineString> {
    return {
        type: 'FeatureCollection',
        features: [
            {
                type: 'Feature',
                properties: {},
                geometry: {
                    type: 'LineString',
                    coordinates: [
                        [reportA.coordinates.longitude, reportA.coordinates.latitude],
                        [reportB.coordinates.longitude, reportB.coordinates.latitude],
                    ],
                },
            },
        ],
    };
}

export function DuplicateMarkersLayer({
    reportA,
    reportB,
    markerColor = '#EAB308', // yellow-500
    lineColor = '#EAB308', // yellow-500
    markerRadius = 10,
    lineWidth = 2,
    id = 'duplicate',
}: DuplicateMarkersLayerProps) {
    const { map } = useContext(MapContext);
    const markersSourceIdRef = useRef(`${id}-markers-source`);
    const lineSourceIdRef = useRef(`${id}-line-source`);
    const markersLayerIdRef = useRef(`${id}-markers-layer`);
    const lineLayerIdRef = useRef(`${id}-line-layer`);

    useEffect(() => {
        if (!map) return;

        const markersSourceId = markersSourceIdRef.current;
        const lineSourceId = lineSourceIdRef.current;
        const markersLayerId = markersLayerIdRef.current;
        const lineLayerId = lineLayerIdRef.current;

        // Create GeoJSON data
        const markersGeoJSON = createMarkersGeoJSON(reportA, reportB);
        const lineGeoJSON = createLineGeoJSON(reportA, reportB);

        // Add markers source
        if (!map.getSource(markersSourceId)) {
            map.addSource(markersSourceId, {
                type: 'geojson',
                data: markersGeoJSON,
            });
        } else {
            (map.getSource(markersSourceId) as maplibregl.GeoJSONSource).setData(markersGeoJSON);
        }

        // Add line source
        if (!map.getSource(lineSourceId)) {
            map.addSource(lineSourceId, {
                type: 'geojson',
                data: lineGeoJSON,
            });
        } else {
            (map.getSource(lineSourceId) as maplibregl.GeoJSONSource).setData(lineGeoJSON);
        }

        // Add line layer (add first so it appears below markers)
        if (!map.getLayer(lineLayerId)) {
            map.addLayer({
                id: lineLayerId,
                type: 'line',
                source: lineSourceId,
                paint: {
                    'line-color': lineColor,
                    'line-width': lineWidth,
                    'line-dasharray': [4, 4],
                },
            });
        } else {
            map.setPaintProperty(lineLayerId, 'line-color', lineColor);
            map.setPaintProperty(lineLayerId, 'line-width', lineWidth);
        }

        // Add markers layer
        if (!map.getLayer(markersLayerId)) {
            map.addLayer({
                id: markersLayerId,
                type: 'circle',
                source: markersSourceId,
                paint: {
                    'circle-color': markerColor,
                    'circle-radius': markerRadius,
                    'circle-stroke-color': '#FFFFFF',
                    'circle-stroke-width': 2,
                },
            });
        } else {
            map.setPaintProperty(markersLayerId, 'circle-color', markerColor);
            map.setPaintProperty(markersLayerId, 'circle-radius', markerRadius);
        }

        // Cleanup on unmount
        return () => {
            if (map.getLayer(markersLayerId)) {
                map.removeLayer(markersLayerId);
            }
            if (map.getLayer(lineLayerId)) {
                map.removeLayer(lineLayerId);
            }
            if (map.getSource(markersSourceId)) {
                map.removeSource(markersSourceId);
            }
            if (map.getSource(lineSourceId)) {
                map.removeSource(lineSourceId);
            }
        };
    }, [map, reportA, reportB, markerColor, lineColor, markerRadius, lineWidth, id]);

    // Render hidden element for testid only
    return (
        <div
            data-testid="duplicate-markers-layer"
            style={{ display: 'none' }}
            aria-hidden="true"
        />
    );
}
