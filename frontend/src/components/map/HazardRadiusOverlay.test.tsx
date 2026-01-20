import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HazardRadiusOverlay } from './HazardRadiusOverlay';
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
    setLayoutProperty: vi.fn(),
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

describe('HazardRadiusOverlay', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockMap.getSource.mockReturnValue(undefined);
        mockMap.getLayer.mockReturnValue(undefined);
    });

    it('renders a hidden element for testid only', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        const element = screen.getByTestId('hazard-radius-overlay');
        expect(element).toHaveStyle({ display: 'none' });
    });

    it('does not add layers when map is null', () => {
        render(
            <MapContextWrapper map={null}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).not.toHaveBeenCalled();
        expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it('adds source and layers when map is available', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'hazard-radius-source',
            expect.objectContaining({
                type: 'geojson',
            })
        );
        expect(mockMap.addLayer).toHaveBeenCalled();
    });

    it('uses red fill color by default', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-fill'
        );
        expect(fillLayerCall![0].paint['fill-color']).toBe('#EF4444');
    });

    it('uses red stroke color by default', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        const strokeLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-stroke'
        );
        expect(strokeLayerCall![0].paint['line-color']).toBe('#DC2626');
    });

    it('allows custom fill color', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMeters={500}
                    fillColor="#FF00FF"
                />
            </MapContextWrapper>
        );

        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-fill'
        );
        expect(fillLayerCall![0].paint['fill-color']).toBe('#FF00FF');
    });

    it('allows custom stroke color', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMeters={500}
                    strokeColor="#00FF00"
                />
            </MapContextWrapper>
        );

        const strokeLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-stroke'
        );
        expect(strokeLayerCall![0].paint['line-color']).toBe('#00FF00');
    });

    it('uses custom id for layer names', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMeters={500}
                    id="custom-hazard"
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-hazard-source',
            expect.anything()
        );
    });

    it('creates circular GeoJSON based on radius', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        const sourceCall = mockMap.addSource.mock.calls.find(
            call => call[0] === 'hazard-radius-source'
        );
        expect(sourceCall).toBeDefined();

        const geoJSON = sourceCall![1].data;
        expect(geoJSON.type).toBe('Feature');
        expect(geoJSON.geometry.type).toBe('Polygon');
        // Circle should have many points to appear smooth
        expect(geoJSON.geometry.coordinates[0].length).toBeGreaterThan(30);
    });

    it('uses semi-transparent fill opacity', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-fill'
        );
        expect(fillLayerCall![0].paint['fill-opacity']).toBeLessThan(1);
    });

    it('allows custom fill opacity', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay
                    longitude={-120.5}
                    latitude={37.5}
                    radiusMeters={500}
                    fillOpacity={0.5}
                />
            </MapContextWrapper>
        );

        const fillLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'hazard-radius-fill'
        );
        expect(fillLayerCall![0].paint['fill-opacity']).toBe(0.5);
    });

    it('updates existing source when coordinates change', () => {
        const mockGeoJSONSource = { setData: vi.fn() };
        mockMap.getSource.mockReturnValue(mockGeoJSONSource);
        mockMap.getLayer.mockReturnValue({ id: 'existing-layer' });

        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        expect(mockGeoJSONSource.setData).toHaveBeenCalled();
    });

    it('cleans up layers on unmount', () => {
        let mounted = false;
        mockMap.getSource.mockImplementation(() => {
            if (!mounted) return undefined;
            return { type: 'geojson' };
        });
        mockMap.getLayer.mockImplementation((id: string) => {
            if (!mounted) return undefined;
            if (id.includes('hazard')) {
                return { id };
            }
            return undefined;
        });

        const { unmount } = render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        mounted = true;
        unmount();

        expect(mockMap.removeLayer).toHaveBeenCalledWith('hazard-radius-fill');
        expect(mockMap.removeLayer).toHaveBeenCalledWith('hazard-radius-stroke');
        expect(mockMap.removeSource).toHaveBeenCalledWith('hazard-radius-source');
    });

    it('exposes correct testid', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        expect(screen.getByTestId('hazard-radius-overlay')).toBeInTheDocument();
    });

    it('renders pulsing indicator element', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <HazardRadiusOverlay longitude={-120.5} latitude={37.5} radiusMeters={500} />
            </MapContextWrapper>
        );

        // The component should indicate pulsing via data attribute or aria
        const element = screen.getByTestId('hazard-radius-overlay');
        expect(element).toHaveAttribute('data-pulsing', 'true');
    });
});
