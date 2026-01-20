/**
 * Tests for DistrictBoundaryLayer component.
 * Renders GeoJSON polygon boundaries for ranger districts.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DistrictBoundaryLayer } from './DistrictBoundaryLayer';
import { MapContext } from '../MapView';
import type { DistrictBoundary } from '../../types/district';
import type maplibregl from 'maplibre-gl';

expect.extend(toHaveNoViolations);

// Mock maplibre-gl
const mockAddSource = vi.fn();
const mockAddLayer = vi.fn();
const mockRemoveLayer = vi.fn();
const mockRemoveSource = vi.fn();
const mockGetSource = vi.fn();
const mockGetLayer = vi.fn();
const mockSetLayoutProperty = vi.fn();

const createMockMap = () => ({
    addSource: mockAddSource,
    addLayer: mockAddLayer,
    removeLayer: mockRemoveLayer,
    removeSource: mockRemoveSource,
    getSource: mockGetSource,
    getLayer: mockGetLayer,
    setLayoutProperty: mockSetLayoutProperty,
});

const sampleDistricts: DistrictBoundary[] = [
    {
        id: 'district-01',
        name: 'District 01',
        status: 'active',
        geometry: {
            type: 'Polygon',
            coordinates: [[[-120, 37], [-119, 37], [-119, 38], [-120, 38], [-120, 37]]],
        },
    },
    {
        id: 'district-02',
        name: 'District 02',
        status: 'inactive',
        geometry: {
            type: 'Polygon',
            coordinates: [[[-119, 37], [-118, 37], [-118, 38], [-119, 38], [-119, 37]]],
        },
    },
];

describe('DistrictBoundaryLayer', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockGetSource.mockReturnValue(null);
        mockGetLayer.mockReturnValue(null);
    });

    describe('rendering', () => {
        it('renders container with correct test id', () => {
            render(
                <MapContext.Provider value={{ map: null }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            expect(screen.getByTestId('district-boundary-layer')).toBeInTheDocument();
        });

        it('does not add layer when map is null', () => {
            render(
                <MapContext.Provider value={{ map: null }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            expect(mockAddSource).not.toHaveBeenCalled();
            expect(mockAddLayer).not.toHaveBeenCalled();
        });

        it('adds source and layers when map is available', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            expect(mockAddSource).toHaveBeenCalledWith(
                'district-boundaries',
                expect.objectContaining({
                    type: 'geojson',
                })
            );

            // Should add fill and line layers
            expect(mockAddLayer).toHaveBeenCalledTimes(3); // fill, line, labels
        });
    });

    describe('color coding', () => {
        it('converts districts to GeoJSON with correct properties', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            const addSourceCall = mockAddSource.mock.calls[0];
            const geoJSON = addSourceCall[1].data;

            expect(geoJSON.features).toHaveLength(2);
            expect(geoJSON.features[0].properties.status).toBe('active');
            expect(geoJSON.features[1].properties.status).toBe('inactive');
        });
    });

    describe('visibility toggle', () => {
        it('renders toggle button', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} showToggle />
                </MapContext.Provider>
            );

            expect(screen.getByRole('button', { name: /toggle district boundaries/i })).toBeInTheDocument();
        });

        it('toggles visibility when button is clicked', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} showToggle />
                </MapContext.Provider>
            );

            const toggleButton = screen.getByRole('button', { name: /toggle district boundaries/i });
            fireEvent.click(toggleButton);

            expect(mockSetLayoutProperty).toHaveBeenCalledWith(
                expect.any(String),
                'visibility',
                'none'
            );
        });

        it('does not render toggle button when showToggle is false', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            expect(screen.queryByRole('button', { name: /toggle district boundaries/i })).not.toBeInTheDocument();
        });
    });

    describe('cleanup', () => {
        it('removes layers and source on unmount', () => {
            const mockMap = createMockMap();
            // First getSource returns null (for setup), then returns a mock source (for cleanup)
            mockGetLayer.mockReturnValue({ id: 'test' });
            mockGetSource.mockReturnValue(null);

            const { unmount } = render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            // Now set up mocks to return existing layers for cleanup
            mockGetLayer.mockReturnValue({ id: 'test' });
            mockGetSource.mockReturnValue({ type: 'geojson' });

            unmount();

            expect(mockRemoveLayer).toHaveBeenCalled();
            expect(mockRemoveSource).toHaveBeenCalled();
        });
    });

    describe('accessibility', () => {
        it('has no accessibility violations', async () => {
            const mockMap = createMockMap();

            const { container } = render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} showToggle />
                </MapContext.Provider>
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('toggle button has accessible name', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} showToggle />
                </MapContext.Provider>
            );

            const button = screen.getByRole('button');
            expect(button).toHaveAttribute('aria-label', 'Toggle district boundaries');
        });
    });

    describe('labels', () => {
        it('renders district name labels in layer', () => {
            const mockMap = createMockMap();

            render(
                <MapContext.Provider value={{ map: mockMap as unknown as maplibregl.Map }}>
                    <DistrictBoundaryLayer districts={sampleDistricts} />
                </MapContext.Provider>
            );

            // Check that symbol layer is added for labels
            const labelLayerCall = mockAddLayer.mock.calls.find(
                call => call[0].type === 'symbol'
            );
            expect(labelLayerCall).toBeDefined();
        });
    });
});
