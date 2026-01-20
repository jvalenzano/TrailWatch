/**
 * DistrictBoundaryLayer - Renders GeoJSON polygon boundaries for ranger districts.
 * Features: Blue outline for active districts, orange for inactive, district name labels.
 */
import { useContext, useEffect, useState, useCallback } from 'react';
import type { GeoJSON } from 'geojson';
import { MapContext } from '../MapView';
import type { DistrictBoundary } from '../../types/district';

const SOURCE_ID = 'district-boundaries';
const LAYER_FILL = 'district-boundaries-fill';
const LAYER_LINE = 'district-boundaries-line';
const LAYER_LABELS = 'district-boundaries-labels';

/** Colors for district status */
const STATUS_COLORS = {
    active: '#3b82f6', // blue-500
    inactive: '#f97316', // orange-500
};

export interface DistrictBoundaryLayerProps {
    /** District boundaries to render */
    districts: DistrictBoundary[];
    /** Show visibility toggle button */
    showToggle?: boolean;
    /** Initial visibility state */
    initialVisible?: boolean;
}

/**
 * Convert district boundaries to a GeoJSON FeatureCollection.
 */
function districtsToGeoJSON(
    districts: DistrictBoundary[]
): GeoJSON.FeatureCollection {
    return {
        type: 'FeatureCollection',
        features: districts.map((district) => ({
            type: 'Feature' as const,
            geometry: district.geometry,
            properties: {
                id: district.id,
                name: district.name,
                status: district.status,
            },
        })),
    };
}

export function DistrictBoundaryLayer({
    districts,
    showToggle = false,
    initialVisible = true,
}: DistrictBoundaryLayerProps) {
    const { map } = useContext(MapContext);
    const [isVisible, setIsVisible] = useState(initialVisible);

    // Toggle visibility
    const handleToggle = useCallback(() => {
        if (!map) return;

        const newVisibility = !isVisible;
        setIsVisible(newVisibility);

        const visibility = newVisibility ? 'visible' : 'none';
        map.setLayoutProperty(LAYER_FILL, 'visibility', visibility);
        map.setLayoutProperty(LAYER_LINE, 'visibility', visibility);
        map.setLayoutProperty(LAYER_LABELS, 'visibility', visibility);
    }, [map, isVisible]);

    // Add source and layers when map and districts are ready
    useEffect(() => {
        if (!map || districts.length === 0) return;

        const geoJSON = districtsToGeoJSON(districts);

        // Check if source already exists
        const existingSource = map.getSource(SOURCE_ID);
        if (existingSource) {
            // Update existing source data
            (existingSource as maplibregl.GeoJSONSource).setData(geoJSON);
            return;
        }

        // Add GeoJSON source
        map.addSource(SOURCE_ID, {
            type: 'geojson',
            data: geoJSON,
        });

        // Add fill layer (semi-transparent)
        map.addLayer({
            id: LAYER_FILL,
            type: 'fill',
            source: SOURCE_ID,
            paint: {
                'fill-color': [
                    'match',
                    ['get', 'status'],
                    'active',
                    STATUS_COLORS.active,
                    'inactive',
                    STATUS_COLORS.inactive,
                    STATUS_COLORS.active, // default
                ],
                'fill-opacity': 0.1,
            },
            layout: {
                visibility: isVisible ? 'visible' : 'none',
            },
        });

        // Add outline layer
        map.addLayer({
            id: LAYER_LINE,
            type: 'line',
            source: SOURCE_ID,
            paint: {
                'line-color': [
                    'match',
                    ['get', 'status'],
                    'active',
                    STATUS_COLORS.active,
                    'inactive',
                    STATUS_COLORS.inactive,
                    STATUS_COLORS.active, // default
                ],
                'line-width': 2,
                'line-opacity': 0.8,
            },
            layout: {
                visibility: isVisible ? 'visible' : 'none',
            },
        });

        // Add labels layer
        map.addLayer({
            id: LAYER_LABELS,
            type: 'symbol',
            source: SOURCE_ID,
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Regular', 'Arial Unicode MS Regular'],
                'text-size': 12,
                'text-anchor': 'center',
                visibility: isVisible ? 'visible' : 'none',
            },
            paint: {
                'text-color': '#ffffff',
                'text-halo-color': '#000000',
                'text-halo-width': 1,
            },
        });

        // Cleanup function
        return () => {
            if (map.getLayer(LAYER_FILL)) {
                map.removeLayer(LAYER_FILL);
            }
            if (map.getLayer(LAYER_LINE)) {
                map.removeLayer(LAYER_LINE);
            }
            if (map.getLayer(LAYER_LABELS)) {
                map.removeLayer(LAYER_LABELS);
            }
            if (map.getSource(SOURCE_ID)) {
                map.removeSource(SOURCE_ID);
            }
        };
    }, [map, districts, isVisible]);

    return (
        <div data-testid="district-boundary-layer">
            {showToggle && (
                <button
                    type="button"
                    onClick={handleToggle}
                    className={`
                        px-3 py-2 text-xs font-medium rounded-lg transition-colors
                        ${isVisible
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-700/50 text-gray-400 border border-gray-600'
                        }
                        hover:bg-blue-500/30
                    `}
                    aria-label="Toggle district boundaries"
                    aria-pressed={isVisible}
                >
                    <span className="flex items-center gap-2">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                        </svg>
                        Districts
                    </span>
                </button>
            )}
        </div>
    );
}
