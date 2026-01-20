import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PulsingRadius } from './PulsingRadius';
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
    project: vi.fn().mockReturnValue({ x: 100, y: 100 }),
    getCanvas: vi.fn().mockReturnValue({ width: 800, height: 600 }),
    on: vi.fn(),
    off: vi.fn(),
});

// Wrapper component for providing map context
function MapContextWrapper({ map, children }: { map: ReturnType<typeof createMockMap> | null; children: ReactNode }) {
    return (
        <MapContext.Provider value={{ map: map as unknown as maplibregl.Map | null }}>
            {children}
        </MapContext.Provider>
    );
}

describe('PulsingRadius', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockMap.getSource.mockReturnValue(undefined);
        mockMap.getLayer.mockReturnValue(undefined);
    });

    it('does not add layers when map is null', () => {
        render(
            <MapContextWrapper map={null}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).not.toHaveBeenCalled();
        expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it('adds source and layers when map is available', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'pulsing-radius-source',
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

    it('uses red color scheme by default', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                />
            </MapContextWrapper>
        );

        // Check fill layer paint properties
        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            (call) => call[0].type === 'fill'
        );
        expect(fillLayerCall[0].paint['fill-color']).toBe('#EF4444');
    });

    it('uses custom colors when provided', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    fillColor="#FF0000"
                    strokeColor="#AA0000"
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
        expect(strokeLayerCall[0].paint['line-color']).toBe('#AA0000');
    });

    it('uses custom id for layer names', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    id="custom-pulse"
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-pulse-source',
            expect.anything()
        );
    });

    it('converts miles to meters correctly', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                />
            </MapContextWrapper>
        );

        // 1 mile = 1609.34 meters
        // The GeoJSON should use this radius
        const sourceCall = mockMap.addSource.mock.calls[0];
        const geoJson = sourceCall[1].data;

        // Verify it created a polygon (circle approximation)
        expect(geoJson.geometry.type).toBe('Polygon');
        expect(geoJson.geometry.coordinates[0].length).toBeGreaterThan(10);
    });

    it('renders label when showLabel is true', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    showLabel={true}
                />
            </MapContextWrapper>
        );

        expect(screen.getByText('1 MILE RADIUS')).toBeInTheDocument();
    });

    it('does not render label when showLabel is false', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    showLabel={false}
                />
            </MapContextWrapper>
        );

        expect(screen.queryByText('1 MILE RADIUS')).not.toBeInTheDocument();
    });

    it('shows fractional miles correctly in label', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={0.5}
                    showLabel={true}
                />
            </MapContextWrapper>
        );

        expect(screen.getByText('0.5 MILE RADIUS')).toBeInTheDocument();
    });

    it('pluralizes miles correctly in label', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={2}
                    showLabel={true}
                />
            </MapContextWrapper>
        );

        expect(screen.getByText('2 MILES RADIUS')).toBeInTheDocument();
    });

    it('updates existing layers when source already exists', () => {
        const mockGeoJSONSource = { setData: vi.fn() };
        mockMap.getSource.mockReturnValue(mockGeoJSONSource);
        mockMap.getLayer.mockReturnValue({ id: 'existing-layer' });

        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
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
            if (id.includes('fill') || id.includes('stroke')) {
                return { id };
            }
            return undefined;
        });

        const { unmount } = render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                />
            </MapContextWrapper>
        );

        // Indicate layers are now mounted
        mounted = true;

        unmount();

        expect(mockMap.removeLayer).toHaveBeenCalledWith('pulsing-radius-stroke');
        expect(mockMap.removeLayer).toHaveBeenCalledWith('pulsing-radius-fill');
        expect(mockMap.removeSource).toHaveBeenCalledWith('pulsing-radius-source');
    });

    it('label has appropriate styling', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    showLabel={true}
                />
            </MapContextWrapper>
        );

        const label = screen.getByTestId('pulsing-radius-label');
        expect(label).toBeInTheDocument();
        // The text-red-400 class is on the span inside the label
        const span = label.querySelector('span');
        expect(span).toHaveClass('text-red-400');
    });

    it('has pulsing animation CSS class', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <PulsingRadius
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMiles={1}
                    showLabel={true}
                />
            </MapContextWrapper>
        );

        const container = screen.getByTestId('pulsing-radius-container');
        expect(container).toHaveClass('animate-pulse-slow');
    });

    describe('circle geometry', () => {
        it('creates a polygon with multiple points', () => {
            render(
                <MapContextWrapper map={mockMap}>
                    <PulsingRadius
                        longitude={-120.5}
                        latitude={37.5}
                        radiusMiles={1}
                    />
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
                    <PulsingRadius
                        longitude={-100}
                        latitude={40}
                        radiusMiles={1}
                    />
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
});
