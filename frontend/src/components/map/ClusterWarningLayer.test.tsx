import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClusterWarningLayer } from './ClusterWarningLayer';
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
    loadImage: vi.fn((url: string, callback: (error: Error | null, image?: ImageBitmap) => void) => {
        callback(null, {} as ImageBitmap);
    }),
    hasImage: vi.fn().mockReturnValue(false),
    addImage: vi.fn(),
    project: vi.fn().mockReturnValue({ x: 100, y: 100 }),
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

describe('ClusterWarningLayer', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockMap.getSource.mockReturnValue(undefined);
        mockMap.getLayer.mockReturnValue(undefined);
    });

    it('renders a hidden element for testid only', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={[]} />
            </MapContextWrapper>
        );

        const element = screen.getByTestId('cluster-warning-layer');
        expect(element).toHaveStyle({ display: 'none' });
    });

    it('does not add layers when map is null', () => {
        render(
            <MapContextWrapper map={null}>
                <ClusterWarningLayer clusters={[]} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).not.toHaveBeenCalled();
        expect(mockMap.addLayer).not.toHaveBeenCalled();
    });

    it('adds source and layer when map and clusters are available', () => {
        const clusters = [
            { id: 'cluster-1', coordinates: [-120.5, 37.5] as [number, number], severity: 'high' as const },
        ];

        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={clusters} />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'cluster-warning-source',
            expect.objectContaining({
                type: 'geojson',
            })
        );

        expect(mockMap.addLayer).toHaveBeenCalled();
    });

    it('only shows warnings for high severity clusters', () => {
        const clusters = [
            { id: 'cluster-1', coordinates: [-120.5, 37.5] as [number, number], severity: 'high' as const },
            { id: 'cluster-2', coordinates: [-121.0, 38.0] as [number, number], severity: 'medium' as const },
            { id: 'cluster-3', coordinates: [-122.0, 39.0] as [number, number], severity: 'low' as const },
        ];

        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={clusters} />
            </MapContextWrapper>
        );

        // Check that the GeoJSON source was added with only the high severity cluster
        const addSourceCall = mockMap.addSource.mock.calls[0];
        const geoJSON = addSourceCall[1].data;

        expect(geoJSON.features.length).toBe(1);
        expect(geoJSON.features[0].properties.id).toBe('cluster-1');
    });

    it('uses custom id for layer names', () => {
        const clusters = [
            { id: 'cluster-1', coordinates: [-120.5, 37.5] as [number, number], severity: 'high' as const },
        ];

        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={clusters} id="custom-warning" />
            </MapContextWrapper>
        );

        expect(mockMap.addSource).toHaveBeenCalledWith(
            'custom-warning-source',
            expect.anything()
        );
    });

    it('updates existing source when clusters change', () => {
        const mockGeoJSONSource = { setData: vi.fn() };
        mockMap.getSource.mockReturnValue(mockGeoJSONSource);
        mockMap.getLayer.mockReturnValue({ id: 'existing-layer' });

        const clusters = [
            { id: 'cluster-1', coordinates: [-120.5, 37.5] as [number, number], severity: 'high' as const },
        ];

        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={clusters} />
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
            if (id.includes('warning')) {
                return { id };
            }
            return undefined;
        });

        const clusters = [
            { id: 'cluster-1', coordinates: [-120.5, 37.5] as [number, number], severity: 'high' as const },
        ];

        const { unmount } = render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={clusters} />
            </MapContextWrapper>
        );

        mounted = true;
        unmount();

        expect(mockMap.removeLayer).toHaveBeenCalledWith('cluster-warning-layer');
        expect(mockMap.removeSource).toHaveBeenCalledWith('cluster-warning-source');
    });

    it('handles empty clusters array', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={[]} />
            </MapContextWrapper>
        );

        // Should still add source with empty features
        expect(mockMap.addSource).toHaveBeenCalledWith(
            'cluster-warning-source',
            expect.objectContaining({
                data: expect.objectContaining({
                    features: [],
                }),
            })
        );
    });

    it('exposes correct testid', () => {
        render(
            <MapContextWrapper map={mockMap}>
                <ClusterWarningLayer clusters={[]} />
            </MapContextWrapper>
        );

        expect(screen.getByTestId('cluster-warning-layer')).toBeInTheDocument();
    });
});
