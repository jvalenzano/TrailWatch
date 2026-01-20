import { useEffect, useCallback } from 'react';
import type { HazardReport } from '../types/report';
import { usePersistentMap } from '../hooks/usePersistentMap';
import type { GeoJSONSourceSpecification } from 'maplibre-gl';

interface AgenticMarkerClusterProps {
    reports: HazardReport[];
    highlightedReportIds?: string[];
    onReportClick?: (reportId: string) => void;
}

const SOURCE_ID = 'agentic-reports-source';
const CLUSTER_LAYER_ID = 'agentic-clusters';
const CLUSTER_COUNT_LAYER_ID = 'agentic-cluster-count';
const UNCLUSTERED_LAYER_ID = 'agentic-unclustered-point';
const HIGHLIGHTED_LAYER_ID = 'agentic-highlighted-point';
const HIGHLIGHTED_HALO_LAYER_ID = 'agentic-highlighted-halo';
const SAFETY_ALERT_LAYER_ID = 'agentic-safety-alert';

/**
 * MarkerCluster variant for AgenticLayout.
 * Uses the persistent map context instead of MapView context.
 * Includes special styling for safety alerts and pattern detection.
 */
export function AgenticMarkerCluster({
    reports,
    highlightedReportIds = [],
    onReportClick,
}: AgenticMarkerClusterProps) {
    const { map, isMapReady } = usePersistentMap();

    // Convert reports to GeoJSON with extended properties
    const reportsToGeoJSON = useCallback(() => {
        return {
            type: 'FeatureCollection' as const,
            features: reports.map((report) => ({
                type: 'Feature' as const,
                id: report.id,
                properties: {
                    id: report.id,
                    title: report.trail_name ?? 'Unknown Trail',
                    severity: report.severity_estimate,
                    hazardType: report.hazard_type,
                    isHighlighted: highlightedReportIds.includes(report.id),
                    isSafetyAlert: report.safety_alert ?? false,
                    isClusterMember: report.pattern_detection?.is_cluster_member ?? false,
                    isDuplicate: report.pattern_detection?.is_duplicate ?? false,
                    priority: report.assignment?.priority ?? 'low',
                },
                geometry: {
                    type: 'Point' as const,
                    coordinates: [report.location.longitude, report.location.latitude],
                },
            })),
        };
    }, [reports, highlightedReportIds]);

    useEffect(() => {
        if (!map || !isMapReady) return;

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
                    20,
                    5,
                    25,
                    10,
                    30,
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

        // Safety alert points - pulsing red (highest priority)
        map.addLayer({
            id: SAFETY_ALERT_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'isSafetyAlert'], true]],
            paint: {
                'circle-color': '#ef4444', // red
                'circle-radius': 14,
                'circle-stroke-width': 4,
                'circle-stroke-color': '#dc2626',
                'circle-opacity': 0.9,
            },
        });

        // Highlighted halo - pulsing background effect for highlighted markers
        map.addLayer({
            id: HIGHLIGHTED_HALO_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: [
                'all',
                ['!', ['has', 'point_count']],
                ['==', ['get', 'isHighlighted'], true],
                ['!=', ['get', 'isSafetyAlert'], true],
            ],
            paint: {
                'circle-color': '#10b981', // emerald
                'circle-radius': 24,
                'circle-opacity': 0.3,
                'circle-stroke-width': 0,
            },
        });

        // Highlighted points - emerald color, larger size
        map.addLayer({
            id: HIGHLIGHTED_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: [
                'all',
                ['!', ['has', 'point_count']],
                ['==', ['get', 'isHighlighted'], true],
                ['!=', ['get', 'isSafetyAlert'], true],
            ],
            paint: {
                'circle-color': '#10b981', // emerald
                'circle-radius': 12,
                'circle-stroke-width': 3,
                'circle-stroke-color': '#065f46',
            },
        });

        // Unclustered (individual) points - default style
        map.addLayer({
            id: UNCLUSTERED_LAYER_ID,
            type: 'circle',
            source: SOURCE_ID,
            filter: [
                'all',
                ['!', ['has', 'point_count']],
                ['!=', ['get', 'isHighlighted'], true],
                ['!=', ['get', 'isSafetyAlert'], true],
            ],
            paint: {
                'circle-color': [
                    'case',
                    ['==', ['get', 'isDuplicate'], true],
                    '#f59e0b', // amber for duplicates
                    ['==', ['get', 'isClusterMember'], true],
                    '#3b82f6', // blue for cluster members
                    '#6366f1', // indigo default
                ],
                'circle-radius': 8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#1f2937',
            },
        });

        // Click handler for clusters
        map.on('click', CLUSTER_LAYER_ID, (e) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: [CLUSTER_LAYER_ID],
            });
            if (!features.length) return;

            const clusterId = features[0].properties?.cluster_id;
            const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;

            source
                .getClusterExpansionZoom(clusterId)
                .then((zoom: number) => {
                    const geometry = features[0].geometry;
                    if (geometry.type === 'Point') {
                        map.easeTo({
                            center: geometry.coordinates as [number, number],
                            zoom: zoom,
                        });
                    }
                })
                .catch((err: Error) => {
                    console.error('Failed to get cluster expansion zoom:', err);
                });
        });

        // Click handler for individual points
        const clickableLayers = [UNCLUSTERED_LAYER_ID, HIGHLIGHTED_LAYER_ID, SAFETY_ALERT_LAYER_ID];

        const handlePointClick = (e: maplibregl.MapMouseEvent) => {
            const features = map.queryRenderedFeatures(e.point, {
                layers: clickableLayers,
            });
            if (!features.length) return;

            const reportId = features[0].properties?.id;
            if (reportId && onReportClick) {
                onReportClick(reportId);
            }
        };

        clickableLayers.forEach((layer) => {
            map.on('click', layer, handlePointClick);
        });

        // Cursor changes
        const allInteractiveLayers = [CLUSTER_LAYER_ID, ...clickableLayers];
        allInteractiveLayers.forEach((layer) => {
            map.on('mouseenter', layer, () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', layer, () => {
                map.getCanvas().style.cursor = '';
            });
        });

        // Cleanup on unmount
        return () => {
            try {
                const layersToRemove = [
                    SAFETY_ALERT_LAYER_ID,
                    HIGHLIGHTED_LAYER_ID,
                    HIGHLIGHTED_HALO_LAYER_ID,
                    UNCLUSTERED_LAYER_ID,
                    CLUSTER_COUNT_LAYER_ID,
                    CLUSTER_LAYER_ID,
                ];

                layersToRemove.forEach((layer) => {
                    if (map.getLayer(layer)) {
                        map.removeLayer(layer);
                    }
                });

                if (map.getSource(SOURCE_ID)) {
                    map.removeSource(SOURCE_ID);
                }
            } catch (error) {
                console.warn('Error cleaning up AgenticMarkerCluster:', error);
            }
        };
    }, [map, isMapReady, reportsToGeoJSON, onReportClick]);

    // Update data when highlightedReportIds changes
    useEffect(() => {
        if (!map || !isMapReady) return;

        const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
        if (source) {
            source.setData(reportsToGeoJSON());
        }
    }, [map, isMapReady, highlightedReportIds, reportsToGeoJSON]);

    // Pulse animation for highlighted markers
    useEffect(() => {
        if (!map || !isMapReady || highlightedReportIds.length === 0) return;

        let animationFrame: number;
        let startTime: number | null = null;
        const duration = 1500; // 1.5 second pulse cycle
        const minRadius = 18;
        const maxRadius = 28;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = (elapsed % duration) / duration;

            // Ease in-out sine wave for smooth pulsing
            const easedProgress = (Math.sin(progress * Math.PI * 2 - Math.PI / 2) + 1) / 2;
            const radius = minRadius + (maxRadius - minRadius) * easedProgress;
            const opacity = 0.2 + 0.2 * (1 - easedProgress);

            if (map.getLayer(HIGHLIGHTED_HALO_LAYER_ID)) {
                map.setPaintProperty(HIGHLIGHTED_HALO_LAYER_ID, 'circle-radius', radius);
                map.setPaintProperty(HIGHLIGHTED_HALO_LAYER_ID, 'circle-opacity', opacity);
            }

            animationFrame = requestAnimationFrame(animate);
        };

        animationFrame = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrame);
        };
    }, [map, isMapReady, highlightedReportIds.length]);

    return null; // This component only adds layers to the map
}
