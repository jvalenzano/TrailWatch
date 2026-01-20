/**
 * ClusterWarningLayer - Warning triangle icons for critical cluster markers.
 * Displays warning symbols on clusters with high severity.
 * Follows WF2 wireframe specifications for cluster alerts.
 */
import { useContext, useEffect, useRef } from 'react';
import type maplibregl from 'maplibre-gl';
import { MapContext } from '../MapView';

export interface ClusterWarning {
    /** Unique identifier for the cluster */
    id: string;
    /** Coordinates [longitude, latitude] */
    coordinates: [number, number];
    /** Severity level of the cluster */
    severity: 'low' | 'medium' | 'high';
}

export interface ClusterWarningLayerProps {
    /** Clusters to display warnings for (only high severity will show icons) */
    clusters: ClusterWarning[];
    /** Unique identifier for this layer (default: 'cluster-warning') */
    id?: string;
}

/**
 * Create GeoJSON FeatureCollection from clusters.
 * Only includes high severity clusters.
 */
function clustersToGeoJSON(clusters: ClusterWarning[]): GeoJSON.FeatureCollection {
    const highSeverityClusters = clusters.filter(c => c.severity === 'high');

    return {
        type: 'FeatureCollection',
        features: highSeverityClusters.map(cluster => ({
            type: 'Feature' as const,
            properties: {
                id: cluster.id,
                severity: cluster.severity,
            },
            geometry: {
                type: 'Point' as const,
                coordinates: cluster.coordinates,
            },
        })),
    };
}

/**
 * Create SVG data URL for warning triangle icon.
 */
function createWarningIconDataURL(): string {
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L1 21h22L12 2z" fill="#EF4444" stroke="#FFFFFF" stroke-width="1"/>
            <path d="M12 8v5M12 16v1" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round"/>
        </svg>
    `;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function ClusterWarningLayer({
    clusters,
    id = 'cluster-warning',
}: ClusterWarningLayerProps) {
    const { map } = useContext(MapContext);
    const sourceIdRef = useRef(`${id}-source`);
    const layerIdRef = useRef(`${id}-layer`);
    const imageIdRef = useRef(`${id}-icon`);

    useEffect(() => {
        if (!map) return;

        const sourceId = sourceIdRef.current;
        const layerId = layerIdRef.current;
        const imageId = imageIdRef.current;

        // Create GeoJSON data
        const geoJSON = clustersToGeoJSON(clusters);

        // Add warning icon to map if not already added
        if (!map.hasImage(imageId)) {
            const img = new Image();
            img.onload = () => {
                if (!map.hasImage(imageId)) {
                    map.addImage(imageId, img);
                }
            };
            img.src = createWarningIconDataURL();
        }

        // Add or update source
        if (!map.getSource(sourceId)) {
            map.addSource(sourceId, {
                type: 'geojson',
                data: geoJSON,
            });
        } else {
            (map.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geoJSON);
        }

        // Add symbol layer for warning icons
        if (!map.getLayer(layerId)) {
            map.addLayer({
                id: layerId,
                type: 'symbol',
                source: sourceId,
                layout: {
                    'icon-image': imageId,
                    'icon-size': 1.2,
                    'icon-allow-overlap': true,
                    'icon-anchor': 'bottom',
                    'icon-offset': [0, -20], // Offset above the cluster marker
                },
            });
        }

        // Cleanup on unmount
        return () => {
            if (map.getLayer(layerId)) {
                map.removeLayer(layerId);
            }
            if (map.getSource(sourceId)) {
                map.removeSource(sourceId);
            }
        };
    }, [map, clusters, id]);

    // Render hidden div for testid
    return <div data-testid="cluster-warning-layer" style={{ display: 'none' }} />;
}
