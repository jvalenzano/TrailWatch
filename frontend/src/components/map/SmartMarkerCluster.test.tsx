import { render, screen, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SmartMarkerCluster } from './SmartMarkerCluster';
import { MapContext } from '../MapView';
import { useReports } from '../../hooks/useReports';
import type { HazardReport } from '../../types/report';

// Mock useReports hook
vi.mock('../../hooks/useReports');
const mockUseReports = vi.mocked(useReports);

// Mock MapLibre map instance
const createMockMap = () => {
    const eventHandlers: Record<string, Array<(e?: unknown) => void>> = {};

    return {
        on: vi.fn((event: string, layerOrCallback: string | ((e?: unknown) => void), callback?: (e?: unknown) => void) => {
            const handler = callback || (layerOrCallback as (e?: unknown) => void);
            const key = typeof layerOrCallback === 'string' ? `${event}:${layerOrCallback}` : event;
            if (!eventHandlers[key]) {
                eventHandlers[key] = [];
            }
            eventHandlers[key].push(handler);
        }),
        off: vi.fn(),
        addSource: vi.fn(),
        addLayer: vi.fn(),
        removeSource: vi.fn(),
        removeLayer: vi.fn(),
        getSource: vi.fn().mockReturnValue(null),
        getLayer: vi.fn().mockReturnValue(null),
        getCanvas: vi.fn().mockReturnValue({
            style: { cursor: '' },
        }),
        queryRenderedFeatures: vi.fn().mockReturnValue([]),
        getZoom: vi.fn().mockReturnValue(10),
        easeTo: vi.fn(),
        // Helper to trigger events in tests
        _triggerEvent: (event: string, layer?: string, data?: unknown) => {
            const key = layer ? `${event}:${layer}` : event;
            eventHandlers[key]?.forEach(handler => handler(data));
        },
        _eventHandlers: eventHandlers,
    };
};

// Create wrapper with QueryClient and MapContext
function createTestWrapper(map: ReturnType<typeof createMockMap>) {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
        },
    });

    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            <MapContext.Provider value={{ map: map as unknown as maplibregl.Map }}>
                {children}
            </MapContext.Provider>
        </QueryClientProvider>
    );
}

const mockReports: HazardReport[] = [
    {
        id: 'report-001',
        trail_name: 'Wonderland Trail',
        location: { latitude: 46.852, longitude: -121.760 },
        hazard_type: 'obstruction',
        severity_estimate: 'difficult',
        description: 'Large tree down',
        photos: [],
        reporter_type: 'volunteer',
        submitted_at: '2026-01-19T08:15:00Z',
        triage_result: {
            tracs_category: 'CLR',
            tracs_category_name: 'Clearing',
            severity: 'SEV2',
            severity_name: 'MAINTENANCE_NEEDED',
            confidence_score: 0.89,
            reasoning: 'Tree obstruction detected',
            confidence_factors: {
                has_photo: true,
                photo_matches_hazard: true,
                gps_accurate: true,
                description_specific: true,
                reporter_trusted: true,
                corroborating_reports: 0,
            },
            recommended_action: 'Dispatch clearing crew',
            similar_reports: [],
        },
    },
    {
        id: 'report-002',
        trail_name: 'Wonderland Trail',
        location: { latitude: 46.855, longitude: -121.755 },
        hazard_type: 'obstruction',
        severity_estimate: 'difficult',
        description: 'Another tree down',
        photos: [],
        reporter_type: 'volunteer',
        submitted_at: '2026-01-19T09:00:00Z',
    },
];

describe('SmartMarkerCluster', () => {
    let mockMap: ReturnType<typeof createMockMap>;

    beforeEach(() => {
        mockMap = createMockMap();
        mockUseReports.mockReturnValue({
            data: mockReports,
            isLoading: false,
            error: null,
            isError: false,
        } as ReturnType<typeof useReports>);
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('rendering', () => {
        it('should render the cluster container', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(screen.getByTestId('smart-marker-cluster')).toBeInTheDocument();
        });

        it('should not crash when map is null', () => {
            const queryClient = new QueryClient({
                defaultOptions: { queries: { retry: false } },
            });

            expect(() =>
                render(
                    <QueryClientProvider client={queryClient}>
                        <MapContext.Provider value={{ map: null }}>
                            <SmartMarkerCluster />
                        </MapContext.Provider>
                    </QueryClientProvider>
                )
            ).not.toThrow();
        });
    });

    describe('map source and layers', () => {
        it('should add GeoJSON source with clustering enabled', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addSource).toHaveBeenCalledWith(
                'reports-source',
                expect.objectContaining({
                    type: 'geojson',
                    cluster: true,
                    clusterMaxZoom: expect.any(Number),
                    clusterRadius: expect.any(Number),
                })
            );
        });

        it('should add cluster circle layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addLayer).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'clusters',
                    type: 'circle',
                    source: 'reports-source',
                    filter: ['has', 'point_count'],
                })
            );
        });

        it('should add cluster count text layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addLayer).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'reports-source',
                    filter: ['has', 'point_count'],
                })
            );
        });

        it('should add unclustered point layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addLayer).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'reports-source',
                    filter: ['!', ['has', 'point_count']],
                })
            );
        });

        it('should convert reports to GeoJSON FeatureCollection', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addSource).toHaveBeenCalledWith(
                'reports-source',
                expect.objectContaining({
                    data: expect.objectContaining({
                        type: 'FeatureCollection',
                        features: expect.arrayContaining([
                            expect.objectContaining({
                                type: 'Feature',
                                geometry: expect.objectContaining({
                                    type: 'Point',
                                    coordinates: [-121.760, 46.852], // lng, lat order
                                }),
                                properties: expect.objectContaining({
                                    id: 'report-001',
                                }),
                            }),
                        ]),
                    }),
                })
            );
        });
    });

    describe('event registration', () => {
        it('should register mouseenter event on clusters layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.on).toHaveBeenCalledWith(
                'mouseenter',
                'clusters',
                expect.any(Function)
            );
        });

        it('should register mouseleave event on clusters layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.on).toHaveBeenCalledWith(
                'mouseleave',
                'clusters',
                expect.any(Function)
            );
        });

        it('should register click event on clusters layer', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.on).toHaveBeenCalledWith(
                'click',
                'clusters',
                expect.any(Function)
            );
        });
    });

    describe('hover interactions', () => {
        it('should not show preview immediately on hover (requires 2s delay)', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            // Trigger mouseenter on cluster
            act(() => {
                mockMap._triggerEvent('mouseenter', 'clusters', {
                    point: { x: 100, y: 100 },
                    features: [
                        {
                            properties: { cluster: true, cluster_id: 1, point_count: 4 },
                            geometry: { type: 'Point', coordinates: [-121.760, 46.852] },
                        },
                    ],
                });
            });

            // Preview should not be visible immediately (2s delay required)
            expect(screen.queryByTestId('cluster-preview')).not.toBeInTheDocument();
        });

        it('should clear hover state on mouseleave', () => {
            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            // Trigger mouseenter
            act(() => {
                mockMap._triggerEvent('mouseenter', 'clusters', {
                    point: { x: 100, y: 100 },
                    features: [
                        {
                            properties: { cluster: true, cluster_id: 1, point_count: 4 },
                            geometry: { type: 'Point', coordinates: [-121.760, 46.852] },
                        },
                    ],
                });
            });

            // Trigger mouseleave (should clear any pending timer)
            act(() => {
                mockMap._triggerEvent('mouseleave', 'clusters');
            });

            // Preview should NOT be visible
            expect(screen.queryByTestId('cluster-preview')).not.toBeInTheDocument();
        });
    });

    describe('loading state', () => {
        it('should not add layers when reports are loading', () => {
            mockUseReports.mockReturnValue({
                data: undefined,
                isLoading: true,
                error: null,
                isError: false,
            } as ReturnType<typeof useReports>);

            render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addSource).not.toHaveBeenCalled();
        });
    });

    describe('cleanup', () => {
        it('should remove source and layers on unmount', () => {
            // First render with source not existing
            const { unmount } = render(<SmartMarkerCluster />, {
                wrapper: createTestWrapper(mockMap),
            });

            expect(mockMap.addSource).toHaveBeenCalled();

            // Now mock that layers/source exist for cleanup
            mockMap.getSource.mockReturnValue({ setData: vi.fn() });
            mockMap.getLayer.mockReturnValue({});

            unmount();

            expect(mockMap.removeLayer).toHaveBeenCalledWith('clusters');
            expect(mockMap.removeLayer).toHaveBeenCalledWith('cluster-count');
            expect(mockMap.removeLayer).toHaveBeenCalledWith('unclustered-point');
            expect(mockMap.removeSource).toHaveBeenCalledWith('reports-source');
        });
    });
});
