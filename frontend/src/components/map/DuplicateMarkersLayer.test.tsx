import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DuplicateMarkersLayer } from './DuplicateMarkersLayer';
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

const mockReportA = {
    id: 'report-1',
    coordinates: { longitude: -120.5, latitude: 37.5 },
};

const mockReportB = {
    id: 'report-2',
    coordinates: { longitude: -120.502, latitude: 37.501 },
};

describe('DuplicateMarkersLayer', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockMap.getSource.mockReturnValue(undefined);
        mockMap.getLayer.mockReturnValue(undefined);
    });

    it('renders a hidden element for testid only', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const element = screen.getByTestId('duplicate-markers-layer');
        expect(element).toHaveStyle({ display: 'none' });
    });

    it('does not add layers when map is null', () => {
        render(
            <MapContextWrapper map={null}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).not.toHaveBeenCalled();
        expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it('adds source for markers when map is available', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'duplicate-markers-source',
            expect.objectContaining({
                type: 'geojson',
            })
        );
    });

    it('adds source for connecting line when map is available', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'duplicate-line-source',
            expect.objectContaining({
                type: 'geojson',
            })
        );
    });

    it('creates GeoJSON with both marker points', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const markersSourceCall = mockMap.addSource.mock.calls.find(
            call => call[0] === 'duplicate-markers-source'
        );
        expect(markersSourceCall).toBeDefined();

        const geoJSON = markersSourceCall![1].data;
        expect(geoJSON.features).toHaveLength(2);
        expect(geoJSON.features[0].geometry.coordinates).toEqual([
            mockReportA.coordinates.longitude,
            mockReportA.coordinates.latitude,
        ]);
        expect(geoJSON.features[1].geometry.coordinates).toEqual([
            mockReportB.coordinates.longitude,
            mockReportB.coordinates.latitude,
        ]);
    });

    it('creates GeoJSON line connecting the markers', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const lineSourceCall = mockMap.addSource.mock.calls.find(
            call => call[0] === 'duplicate-line-source'
        );
        expect(lineSourceCall).toBeDefined();

        const geoJSON = lineSourceCall![1].data;
        expect(geoJSON.features[0].geometry.type).toBe('LineString');
        expect(geoJSON.features[0].geometry.coordinates).toEqual([
            [mockReportA.coordinates.longitude, mockReportA.coordinates.latitude],
            [mockReportB.coordinates.longitude, mockReportB.coordinates.latitude],
        ]);
    });

    it('adds marker layer', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(mockMap.addLayer).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'duplicate-markers-layer',
                type: 'circle',
                source: 'duplicate-markers-source',
            })
        );
    });

    it('adds dashed line layer', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(mockMap.addLayer).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'duplicate-line-layer',
                type: 'line',
                source: 'duplicate-line-source',
                paint: expect.objectContaining({
                    'line-dasharray': expect.any(Array),
                }),
            })
        );
    });

    it('uses custom id for layer names', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer
                    reportA={mockReportA}
                    reportB={mockReportB}
                    id="custom-duplicate"
                />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-duplicate-markers-source',
            expect.anything()
        );
        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-duplicate-line-source',
            expect.anything()
        );
    });

    it('uses yellow marker color by default', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const markerLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'duplicate-markers-layer'
        );
        expect(markerLayerCall![0].paint['circle-color']).toBe('#EAB308');
    });

    it('uses yellow line color by default', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const lineLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'duplicate-line-layer'
        );
        expect(lineLayerCall![0].paint['line-color']).toBe('#EAB308');
    });

    it('allows custom marker color', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer
                    reportA={mockReportA}
                    reportB={mockReportB}
                    markerColor="#FF0000"
                />
            </MapContextWrapper>
        );

        const markerLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'duplicate-markers-layer'
        );
        expect(markerLayerCall![0].paint['circle-color']).toBe('#FF0000');
    });

    it('allows custom line color', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer
                    reportA={mockReportA}
                    reportB={mockReportB}
                    lineColor="#00FF00"
                />
            </MapContextWrapper>
        );

        const lineLayerCall = mockMap.addLayer.mock.calls.find(
            call => call[0].id === 'duplicate-line-layer'
        );
        expect(lineLayerCall![0].paint['line-color']).toBe('#00FF00');
    });

    it('updates existing source when reports change', () => {
        const mockGeoJSONSource = { setData: vi.fn() };
        mockMap.getSource.mockReturnValue(mockGeoJSONSource);
        mockMap.getLayer.mockReturnValue({ id: 'existing-layer' });

        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
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
            if (id.includes('duplicate')) {
                return { id };
            }
            return undefined;
        });

        const { unmount } = render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        mounted = true;
        unmount();

        expect(mockMap.removeLayer).toHaveBeenCalledWith('duplicate-markers-layer');
        expect(mockMap.removeLayer).toHaveBeenCalledWith('duplicate-line-layer');
        expect(mockMap.removeSource).toHaveBeenCalledWith('duplicate-markers-source');
        expect(mockMap.removeSource).toHaveBeenCalledWith('duplicate-line-source');
    });

    it('exposes correct testid', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        expect(screen.getByTestId('duplicate-markers-layer')).toBeInTheDocument();
    });

    it('stores report IDs in feature properties', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <DuplicateMarkersLayer reportA={mockReportA} reportB={mockReportB} />
            </MapContextWrapper>
        );

        const markersSourceCall = mockMap.addSource.mock.calls.find(
            call => call[0] === 'duplicate-markers-source'
        );
        const geoJSON = markersSourceCall![1].data;

        expect(geoJSON.features[0].properties.reportId).toBe('report-1');
        expect(geoJSON.features[0].properties.role).toBe('original');
        expect(geoJSON.features[1].properties.reportId).toBe('report-2');
        expect(geoJSON.features[1].properties.role).toBe('duplicate');
    });
});
