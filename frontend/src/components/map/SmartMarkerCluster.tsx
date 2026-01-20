/**
 * SmartMarkerCluster - Interactive clustering layer for map reports.
 * Implements "smart" hover interactions with 2-second delay preview.
 */
import { useContext, useEffect, useRef, useState, useCallback } from 'react';
// GeoJSON types imported via maplibre-gl
import { MapContext } from '../MapView';
import { useReports } from '../../hooks/useReports';
import type { HazardReport } from '../../types/report';

const SOURCE_ID = 'reports-source';
const LAYER_CLUSTERS = 'clusters';
const LAYER_CLUSTER_COUNT = 'cluster-count';
const LAYER_UNCLUSTERED = 'unclustered-point';
// Note: LAYER_HIGHLIGHTED and LAYER_SELECTED reserved for future enhancement

/** Hover delay in milliseconds before showing cluster preview */
const HOVER_DELAY_MS = 2000;

export interface SmartMarkerClusterProps {
    /** Optional reports to display (overrides useReports hook) */
    reports?: HazardReport[];
    /** ID of currently selected report */
    selectedReportId?: string | null;
    /** IDs of highlighted reports (e.g., from insight selection) */
    highlightedReportIds?: string[];
    /** Callback when a report marker is clicked */
    onReportClick?: (reportId: string) => void;
}

interface ClusterPreviewData {
    clusterId: number;
    pointCount: number;
    coordinates: [number, number];
    screenPosition: { x: number; y: number };
}

/**
 * Convert HazardReports to a GeoJSON FeatureCollection.
 */
function reportsToGeoJSON(
    reports: HazardReport[],
    highlightedIds: string[] = [],
    selectedId?: string | null
): GeoJSON.FeatureCollection {
    const highlightedSet = new Set(highlightedIds);
    return {
        type: 'FeatureCollection',
        features: reports.map((report) => ({
            type: 'Feature' as const,
            geometry: {
                type: 'Point' as const,
                coordinates: [report.location.longitude, report.location.latitude],
            },
            properties: {
                id: report.id,
                trail_name: report.trail_name,
                hazard_type: report.hazard_type,
                severity_estimate: report.severity_estimate,
                description: report.description,
                confidence_score: report.triage_result?.confidence_score,
                tracs_category: report.triage_result?.tracs_category,
                isHighlighted: highlightedSet.has(report.id),
                isSelected: report.id === selectedId,
            },
        })),
    };
}

/**
 * Get color for cluster based on size.
 */
function getClusterColor(pointCount: number): string {
    if (pointCount >= 10) return '#ef4444'; // red-500
    if (pointCount >= 5) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
}

export function SmartMarkerCluster({
    reports: propReports,
    selectedReportId,
    highlightedReportIds = [],
    onReportClick,
}: SmartMarkerClusterProps = {}) {
    const { map } = useContext(MapContext);
    const { data: hookReports, isLoading } = useReports();
    // Use prop reports if provided, otherwise use hook reports
    const reports = propReports ?? hookReports;
    const [previewData, setPreviewData] = useState<ClusterPreviewData | null>(null);
    const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pendingHoverRef = useRef<ClusterPreviewData | null>(null);

    // Clear hover timer
    const clearHoverTimer = useCallback(() => {
        if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
        }
        pendingHoverRef.current = null;
    }, []);

    // Handle cluster mouseenter
    const handleClusterMouseEnter = useCallback(
        (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
            if (!map || !e.features?.[0]) return;

            const feature = e.features[0];
            const properties = feature.properties;
            const geometry = feature.geometry as GeoJSON.Point;

            if (!properties?.cluster) return;

            // Change cursor
            map.getCanvas().style.cursor = 'pointer';

            // Store pending hover data
            const hoverData: ClusterPreviewData = {
                clusterId: properties.cluster_id as number,
                pointCount: properties.point_count as number,
                coordinates: geometry.coordinates as [number, number],
                screenPosition: { x: e.point.x, y: e.point.y },
            };
            pendingHoverRef.current = hoverData;

            // Clear any existing timer
            clearHoverTimer();

            // Start 2-second timer
            hoverTimerRef.current = setTimeout(() => {
                if (pendingHoverRef.current) {
                    setPreviewData(pendingHoverRef.current);
                }
            }, HOVER_DELAY_MS);
        },
        [map, clearHoverTimer]
    );

    // Handle cluster mouseleave
    const handleClusterMouseLeave = useCallback(() => {
        if (!map) return;

        map.getCanvas().style.cursor = '';
        clearHoverTimer();
        setPreviewData(null);
    }, [map, clearHoverTimer]);

    // Handle cluster click (zoom in)
    const handleClusterClick = useCallback(
        (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
            if (!map || !e.features?.[0]) return;

            const feature = e.features[0];
            const geometry = feature.geometry as GeoJSON.Point;
            const clusterId = feature.properties?.cluster_id;

            if (clusterId === undefined) return;

            // Get the cluster expansion zoom
            const source = map.getSource(SOURCE_ID) as maplibregl.GeoJSONSource;
            if (!source) return;

            // Use Promise-based API for MapLibre GL JS v4+
            source.getClusterExpansionZoom(clusterId).then((zoom) => {
                if (zoom === undefined) return;

                map.easeTo({
                    center: geometry.coordinates as [number, number],
                    zoom: zoom,
                    duration: 500,
                });
            }).catch(() => {
                // Ignore cluster expansion errors
            });

            // Hide preview when clicking
            setPreviewData(null);
            clearHoverTimer();
        },
        [map, clearHoverTimer]
    );

    // Handle unclustered point click
    const handlePointClick = useCallback(
        (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
            if (!e.features?.[0]) return;

            const feature = e.features[0];
            const reportId = feature.properties?.id as string;

            if (reportId && onReportClick) {
                onReportClick(reportId);
            }
        },
        [onReportClick]
    );

    // Add source and layers when map and reports are ready
    useEffect(() => {
        if (!map || isLoading || !reports) return;

        const geoJSON = reportsToGeoJSON(reports, highlightedReportIds, selectedReportId);

        // Check if source already exists
        const existingSource = map.getSource(SOURCE_ID);
        if (existingSource) {
            // Update existing source data
            (existingSource as maplibregl.GeoJSONSource).setData(geoJSON);
            return;
        }

        // Add GeoJSON source with clustering
        map.addSource(SOURCE_ID, {
            type: 'geojson',
            data: geoJSON,
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50,
        });

        // Add cluster circles layer
        map.addLayer({
            id: LAYER_CLUSTERS,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            paint: {
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#10b981', // emerald-500 for small clusters
                    5,
                    '#f59e0b', // amber-500 for medium
                    10,
                    '#ef4444', // red-500 for large
                ],
                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    20, // base size
                    5,
                    25, // medium
                    10,
                    30, // large
                ],
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
            },
        });

        // Add cluster count labels
        map.addLayer({
            id: LAYER_CLUSTER_COUNT,
            type: 'symbol',
            source: SOURCE_ID,
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                'text-size': 12,
            },
            paint: {
                'text-color': '#ffffff',
            },
        });

        // Add unclustered point layer with data-driven styling
        map.addLayer({
            id: LAYER_UNCLUSTERED,
            type: 'circle',
            source: SOURCE_ID,
            filter: ['!', ['has', 'point_count']],
            paint: {
                // Color: emerald for highlighted, cyan for selected, indigo for default
                'circle-color': [
                    'case',
                    ['==', ['get', 'isSelected'], true],
                    '#06b6d4', // cyan-500 for selected
                    ['==', ['get', 'isHighlighted'], true],
                    '#10b981', // emerald-500 for highlighted
                    '#6366f1', // indigo-500 default
                ],
                // Larger radius for selected/highlighted
                'circle-radius': [
                    'case',
                    ['==', ['get', 'isSelected'], true],
                    12,
                    ['==', ['get', 'isHighlighted'], true],
                    10,
                    8,
                ],
                'circle-stroke-width': [
                    'case',
                    ['==', ['get', 'isSelected'], true],
                    3,
                    2,
                ],
                'circle-stroke-color': '#ffffff',
            },
        });

        // Register event handlers
        map.on('mouseenter', LAYER_CLUSTERS, handleClusterMouseEnter);
        map.on('mouseleave', LAYER_CLUSTERS, handleClusterMouseLeave);
        map.on('click', LAYER_CLUSTERS, handleClusterClick);
        map.on('click', LAYER_UNCLUSTERED, handlePointClick);

        // Cursor change for unclustered points
        map.on('mouseenter', LAYER_UNCLUSTERED, () => {
            map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', LAYER_UNCLUSTERED, () => {
            map.getCanvas().style.cursor = '';
        });

        // Cleanup function
        return () => {
            clearHoverTimer();

            // Remove event handlers
            map.off('mouseenter', LAYER_CLUSTERS, handleClusterMouseEnter);
            map.off('mouseleave', LAYER_CLUSTERS, handleClusterMouseLeave);
            map.off('click', LAYER_CLUSTERS, handleClusterClick);
            map.off('click', LAYER_UNCLUSTERED, handlePointClick);

            // Remove layers and source
            if (map.getLayer(LAYER_CLUSTERS)) {
                map.removeLayer(LAYER_CLUSTERS);
            }
            if (map.getLayer(LAYER_CLUSTER_COUNT)) {
                map.removeLayer(LAYER_CLUSTER_COUNT);
            }
            if (map.getLayer(LAYER_UNCLUSTERED)) {
                map.removeLayer(LAYER_UNCLUSTERED);
            }
            if (map.getSource(SOURCE_ID)) {
                map.removeSource(SOURCE_ID);
            }
        };
    }, [
        map,
        reports,
        isLoading,
        highlightedReportIds,
        selectedReportId,
        handleClusterMouseEnter,
        handleClusterMouseLeave,
        handleClusterClick,
        handlePointClick,
        clearHoverTimer,
    ]);

    return (
        <div data-testid="smart-marker-cluster">
            {/* Cluster Preview Popup */}
            {previewData && (
                <div
                    data-testid="cluster-preview"
                    className="absolute z-50 pointer-events-none"
                    style={{
                        left: previewData.screenPosition.x + 10,
                        top: previewData.screenPosition.y - 60,
                    }}
                >
                    <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-3 min-w-[180px]">
                        {/* Header */}
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                    backgroundColor: getClusterColor(previewData.pointCount),
                                }}
                            />
                            <span className="text-xs text-gray-400 uppercase tracking-wider">
                                Cluster Detected
                            </span>
                        </div>

                        {/* Content */}
                        <div className="text-white font-semibold">
                            {previewData.pointCount} reports
                        </div>
                        <p className="text-xs text-gray-400 mt-1">
                            Click to expand cluster
                        </p>
                    </div>

                    {/* Arrow pointer */}
                    <div
                        className="absolute left-4 -bottom-2 w-0 h-0"
                        style={{
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #374151', // gray-700
                        }}
                    />
                </div>
            )}
        </div>
    );
}
