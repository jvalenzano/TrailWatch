import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { LocationHighlight } from './LocationHighlight';
import { MapContext } from '../MapView';
import type { ReactNode } from 'react';
import type maplibregl from 'maplibre-gl';

// Mock map instance methods
const createMockMap = () => ({
    addSource: vi.fn(),
    addLayer: vi.fn(),
    removeLayer: vi.fn(),
    removeSource: vi.fn(),
    getSource: vi.fn(),
    getLayer: vi.fn(),
    setPaintProperty: vi.fn(),
});

// Wrapper component for providing map context
function MapContextWrapper({ map, children }: { map: ReturnType<typeof createMockMap> | null; children: ReactNode }) {
    return (
        <MapContext.Provider value={{ map: map as unknown as maplibregl.Map | null }}>
            {children}
        </MapContext.Provider>
    );
}

describe('LocationHighlight', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockMap.getSource.mockReturnValue(undefined);
        mockMap.getLayer.mockReturnValue(undefined);
    });

    it('renders nothing to the DOM', () => {
        const { container } = render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight longitude={-120.5} latitude={37.5} />
            </MapContextWrapper>
        );

        expect(container.firstChild).toBeNull();
    });

    it('does not add layers when map is null', () => {
        render(
            <MapContextWrapper map={null}>
                <LocationHighlight longitude={-120.5} latitude={37.5} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).not.toHaveBeenCalled();
        expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it('adds source and layers when map is available', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight longitude={-120.5} latitude={37.5} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'location-highlight-source',
            expect.objectContaining({
                type: 'geojson',
                data: expect.objectContaining({
                    type: 'Feature',
                    geometry: expect.objectContaining({
                        type: 'Polygon',
                    }),
                }),
            })
        );

        expect(mockMap.addLayer).toHaveBeenCalledTimes(2);
    });

    it('uses default blue color and opacity', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight longitude={-120.5} latitude={37.5} />
            </MapContextWrapper>
        );

        // Check fill layer paint properties
        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            (call) => call[0].type === 'fill'
        );
        expect(fillLayerCall[0].paint['fill-color']).toBe('#3B82F6');
        expect(fillLayerCall[0].paint['fill-opacity']).toBe(0.3);
    });

    it('uses custom colors when provided', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight
                    longitude={-120.5}
                    latitude={37.5}
                    fillColor="#FF0000"
                    fillOpacity={0.5}
                    strokeColor="#AA0000"
                    strokeWidth={3}
                />
            </MapContextWrapper>
        );

        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            (call) => call[0].type === 'fill'
        );
        const strokeLayerCall = mockMap.addLayer.mock.calls.find(
            (call) => call[0].type === 'line'
        );

        expect(fillLayerCall[0].paint['fill-color']).toBe('#FF0000');
        expect(fillLayerCall[0].paint['fill-opacity']).toBe(0.5);
        expect(strokeLayerCall[0].paint['line-color']).toBe('#AA0000');
        expect(strokeLayerCall[0].paint['line-width']).toBe(3);
    });

    it('uses custom id for layer names', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight
                    longitude={-120.5}
                    latitude={37.5}
                    id="custom-highlight"
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-highlight-source',
            expect.anything()
        );
    });

    it('updates existing layers when source already exists', () => {
        const mockGeoJSONSource = { setData: vi.fn() };
        mockMap.getSource.mockReturnValue(mockGeoJSONSource);
        mockMap.getLayer.mockReturnValue({ id: 'existing-layer' });

        render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight
                    longitude={-120.5}
                    latitude={37.5}
                    fillColor="#00FF00"
                />
            </MapContextWrapper>
        );

        // Should update existing source data
        expect(mockGeoJSONSource.setData).toHaveBeenCalled();

        // Should update paint properties instead of adding new layers
        expect(mockMap.addLayer).not.toHaveBeenCalled();
        expect(mockMap.setPaintProperty).toHaveBeenCalled();
    });

    it('cleans up layers on unmount', () => {
        // Set up mock to return undefined initially (for addSource/addLayer path)
        // then return truthy values during cleanup
        let mounted = false;
        mockMap.getSource.mockImplementation(() => {
            if (!mounted) return undefined;
            return { type: 'geojson' };
        });
        mockMap.getLayer.mockImplementation((id: string) => {
            if (!mounted) return undefined;
            // Return truthy value to indicate layer exists during cleanup
            if (id.includes('fill') || id.includes('stroke')) {
                return { id };
            }
            return undefined;
        });

        const { unmount } = render(
            <MapContextWrapper map={mockMap}>
                <LocationHighlight longitude={-120.5} latitude={37.5} />
            </MapContextWrapper>
        );

        // Indicate layers are now mounted
        mounted = true;

        unmount();

        expect(mockMap.removeLayer).toHaveBeenCalledWith('location-highlight-stroke');
        expect(mockMap.removeLayer).toHaveBeenCalledWith('location-highlight-fill');
        expect(mockMap.removeSource).toHaveBeenCalledWith('location-highlight-source');
    });

    describe('circle geometry', () => {
        it('creates a polygon with multiple points', () => {
            render(
                <MapContextWrapper map={mockMap}>
                    <LocationHighlight longitude={-120.5} latitude={37.5} />
                </MapContextWrapper>
            );

            const sourceCall = mockMap.addSource.mock.calls[0];
            const geoJson = sourceCall[1].data;

            expect(geoJson.geometry.type).toBe('Polygon');
            expect(geoJson.geometry.coordinates[0].length).toBeGreaterThan(10);
        });

        it('creates circle centered at specified coordinates', () => {
            render(
                <MapContextWrapper map={mockMap}>
                    <LocationHighlight longitude={-100} latitude={40} />
                </MapContextWrapper>
            );

            const sourceCall = mockMap.addSource.mock.calls[0];
            const geoJson = sourceCall[1].data;
            const coordinates = geoJson.geometry.coordinates[0];

            // Calculate center of the polygon
            const lons = coordinates.map((c: [number, number]) => c[0]);
            const lats = coordinates.map((c: [number, number]) => c[1]);
            const avgLon = lons.reduce((a: number, b: number) => a + b, 0) / lons.length;
            const avgLat = lats.reduce((a: number, b: number) => a + b, 0) / lats.length;

            // Should be approximately centered at the specified coordinates
            expect(avgLon).toBeCloseTo(-100, 0);
            expect(avgLat).toBeCloseTo(40, 0);
        });
    });

    describe('accessibility', () => {
        it('has no accessibility violations (renders null)', () => {
            // LocationHighlight renders nothing visible - it only manipulates map layers
            // No axe check needed as there's no DOM content
            const { container } = render(
                <MapContextWrapper map={mockMap}>
                    <LocationHighlight longitude={-120.5} latitude={37.5} />
                </MapContextWrapper>
            );
            expect(container.firstChild).toBeNull();
        });
    });
});
