import { useContext, useEffect, useCallback } from 'react';
import type { HazardReport } from '../types/report';
import { MapContext } from './MapView';
import type { GeoJSONSourceSpecification } from 'maplibre-gl';

interface MarkerClusterProps {
    reports: HazardReport[];
    highlightedReportIds?: string[];
    onReportClick?: (reportId: string) => void;
}

const SOURCE_ID = 'reports-source';
const CLUSTER_LAYER_ID = 'clusters';
const CLUSTER_COUNT_LAYER_ID = 'cluster-count';
const UNCLUSTERED_LAYER_ID = 'unclustered-point';
const HIGHLIGHTED_LAYER_ID = 'highlighted-point';

/**
 * MarkerCluster component for rendering report markers with clustering support.
 * Uses MapLibre GL native clustering via GeoJSON source.
 */
export function MarkerCluster({
    reports,
    highlightedReportIds = [],
    onReportClick,
}: MarkerClusterProps) {
    const { map } = useContext(MapContext);

    // Convert reports to GeoJSON
    const reportsToGeoJSON = useCallback(() => {
        return {
            type: 'FeatureCollection' as const,
            features: reports.map((report) => ({
                type: 'Feature' as const,
                id: report.id,
                properties: {
                    id: report.id,
                    title: report.trail_name,
                    severity: report.severity_estimate,
                    hazardType: report.hazard_type,
                    isHighlighted: highlightedReportIds.includes(report.id),
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [report.location.longitude, report.location.latitude],
                },
            })),
        };
    }, [reports, highlightedReportIds]);

    useEffect(() => {
        if (!map) return;

        const geojsonData = reportsToGeoJSON();

        // Check if source already exists
        const existingSource = map.getSource(SOURCE_ID);
        if (existingSource) {
            // Update existing source data
            (existingSource as maplibregl.GeoJSONSource).setData(geojsonData);
            return;
        }

        // Add source with clustering enabled
        const sourceSpec: GeoJSONSourceSpecification = {
            type: 'geojson',
            data: geojsonData,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
        };

        map.addSource(SOURCE_ID, sourceSpec);

        // Cluster circles layer
        map.addLayer({
            id: CLUSTER_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#6366f1', // indigo for small clusters
                    5,
                    '#8b5cf6', // violet for medium clusters
                    10,
                    '#a855f7', // purple for large clusters
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20, // small cluster
                    5,
                    25, // medium cluster
                    10,
                    30, // large cluster
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#1f2937',
            },
        });

        // Cluster count labels
        map.addLayer({
            id: CLUSTER_COUNT_LAYER_ID,
            type: 'symbol',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': '{point_count_abbreviated}',
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
            paint: {
                'text-color': '#ffffff',
            },
        });

        // Unclustered (individual) points - default style
        map.addLayer({
            id: UNCLUSTERED_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['all', ['!', ['has', 'point_count']], ['!=', ['get', 'isHighlighted'], true]],
            paint: {
                'circle-color': '#6366f1', // indigo
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#1f2937',
            },
        });

        // Highlighted points - emerald color, larger size
        map.addLayer({
            id: HIGHLIGHTED_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'isHighlighted'], true]],
            paint: {
                'circle-color': '#10b981', // emerald
                'circle-radius': 12,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#065f46',
            },
        });

        // Click handler for clusters - zoom to expansion level
        map.on('click', CLUSTER_LAYER_ID, (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [CLUSTER_LAYER_ID],
            });
            if (!features.length) return;

            const clusterId = features[0].properties?.cluster_id;
            const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;

            source.getClusterExpansionZoom(clusterId).then((zoom: number) => {
                const geometry = features[0].geometry;
                if (geometry.type === 'Point') {
                    map.easeTo({
                        center: geometry.coordinates as [number, number],
                        zoom: zoom,
                    });
                }
            }).catch((err: Error) => {
                console.error('Failed to get cluster expansion zoom:', err);
            });
        });

        // Click handler for individual points
        const handlePointClick = (e: maplibregl.MapMouseEvent) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [UNCLUSTERED_LAYER_ID, HIGHLIGHTED_LAYER_ID],
            });
            if (!features.length) return;

            const reportId = features[0].properties?.id;
            if (reportId && onReportClick) {
                onReportClick(reportId);
            }
        };

        map.on('click', UNCLUSTERED_LAYER_ID, handlePointClick);
        map.on('click', HIGHLIGHTED_LAYER_ID, handlePointClick);

        // Cursor changes
        map.on('mouseenter', CLUSTER_LAYER_ID, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', CLUSTER_LAYER_ID, () => {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', UNCLUSTERED_LAYER_ID, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', UNCLUSTERED_LAYER_ID, () => {
            map.getCanvas().style.cursor = '';
        });
        map.on('mouseenter', HIGHLIGHTED_LAYER_ID, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', HIGHLIGHTED_LAYER_ID, () => {
            map.getCanvas().style.cursor = '';
        });

        // Cleanup on unmount
        return () => {
            try {
                if (map.getLayer(HIGHLIGHTED_LAYER_ID)) {
                    map.removeLayer(HIGHLIGHTED_LAYER_ID);
                }
                if (map.getLayer(UNCLUSTERED_LAYER_ID)) {
                    map.removeLayer(UNCLUSTERED_LAYER_ID);
                }
                if (map.getLayer(CLUSTER_COUNT_LAYER_ID)) {
                    map.removeLayer(CLUSTER_COUNT_LAYER_ID);
                }
                if (map.getLayer(CLUSTER_LAYER_ID)) {
                    map.removeLayer(CLUSTER_LAYER_ID);
                }
                if (map.getSource(SOURCE_ID)) {
                    map.removeSource(SOURCE_ID);
                }
            } catch (error) {
                console.warn('Error cleaning up MarkerCluster:', error);
            }
        };
    }, [map, reportsToGeoJSON, onReportClick]);

    // Update highlighted state when highlightedReportIds changes
    useEffect(() => {
        if (!map) return;

        const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
        if (source) {
            source.setData(reportsToGeoJSON());
        }
    }, [map, highlightedReportIds, reportsToGeoJSON]);

    return null; // This component only adds layers to the map
}
