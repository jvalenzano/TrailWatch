import { render, screen } from '@testing-library/react';
import { AgenticLayout } from './AgenticLayout';
import { usePersistentMap } from '../../hooks/usePersistentMap';

// Mock maplibre-gl since it requires WebGL
vi.mock('maplibre-gl', () => ({
    default: {
        Map: vi.fn().mockImplementation(() => ({
            on: vi.fn(),
            off: vi.fn(),
            remove: vi.fn(),
            resize: vi.fn(),
            addControl: vi.fn(),
            getCenter: vi.fn().mockReturnValue({ lng: -121.75, lat: 46.85 }),
            getZoom: vi.fn().mockReturnValue(10),
            getBearing: vi.fn().mockReturnValue(0),
            getPitch: vi.fn().mockReturnValue(0),
            flyTo: vi.fn(),
        })),
        NavigationControl: vi.fn(),
        AttributionControl: vi.fn(),
    },
}));

describe('AgenticLayout', () => {
    describe('rendering', () => {
        it('should render the layout container', () => {
            render(<AgenticLayout />);

            expect(screen.getByTestId('agentic-layout')).toBeInTheDocument();
        });

        it('should render the map container', () => {
            render(<AgenticLayout />);

            expect(screen.getByTestId('agentic-map-container')).toBeInTheDocument();
        });

        it('should render the center area', () => {
            render(<AgenticLayout />);

            expect(screen.getByTestId('agentic-center-area')).toBeInTheDocument();
        });
    });

    describe('panels', () => {
        it('should render left panel when activeLeftPanel is set', () => {
            render(
                <AgenticLayout
                    activeLeftPanel="insights"
                    leftPanel={<div data-testid="left-content">Left Panel Content</div>}
                />
            );

            const leftPanel = screen.getByTestId('agentic-left-panel');
            expect(leftPanel).toBeInTheDocument();
            expect(leftPanel).not.toHaveAttribute('aria-hidden', 'true');
            expect(screen.getByTestId('left-content')).toBeInTheDocument();
        });

        it('should hide left panel when activeLeftPanel is null', () => {
            render(
                <AgenticLayout
                    activeLeftPanel={null}
                    leftPanel={<div data-testid="left-content">Left Panel Content</div>}
                />
            );

            const leftPanel = screen.getByTestId('agentic-left-panel');
            expect(leftPanel).toHaveAttribute('aria-hidden', 'true');
        });

        it('should render right panel when activeRightPanel is set', () => {
            render(
                <AgenticLayout
                    activeRightPanel="reports"
                    rightPanel={<div data-testid="right-content">Right Panel Content</div>}
                />
            );

            const rightPanel = screen.getByTestId('agentic-right-panel');
            expect(rightPanel).toBeInTheDocument();
            expect(rightPanel).not.toHaveAttribute('aria-hidden', 'true');
            expect(screen.getByTestId('right-content')).toBeInTheDocument();
        });

        it('should hide right panel when activeRightPanel is null', () => {
            render(
                <AgenticLayout
                    activeRightPanel={null}
                    rightPanel={<div data-testid="right-content">Right Panel Content</div>}
                />
            );

            const rightPanel = screen.getByTestId('agentic-right-panel');
            expect(rightPanel).toHaveAttribute('aria-hidden', 'true');
        });

        it('should show toggle button when left panel is hidden', () => {
            render(
                <AgenticLayout
                    activeLeftPanel={null}
                    leftPanel={<div>Left Panel</div>}
                />
            );

            expect(screen.getByTestId('show-left-panel-btn')).toBeInTheDocument();
        });

        it('should show toggle button when right panel is hidden', () => {
            render(
                <AgenticLayout
                    activeRightPanel={null}
                    rightPanel={<div>Right Panel</div>}
                />
            );

            expect(screen.getByTestId('show-right-panel-btn')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have proper aria labels on panels', () => {
            render(
                <AgenticLayout
                    leftPanel={<div>Left</div>}
                    rightPanel={<div>Right</div>}
                />
            );

            expect(screen.getByLabelText('Left panel')).toBeInTheDocument();
            expect(screen.getByLabelText('Right panel')).toBeInTheDocument();
        });
    });

    describe('default props', () => {
        it('should default activeLeftPanel to insights', () => {
            render(
                <AgenticLayout
                    leftPanel={<div data-testid="left-content">Left</div>}
                />
            );

            // Left panel should be visible by default
            expect(screen.getByTestId('agentic-left-panel')).not.toHaveAttribute('aria-hidden', 'true');
        });

        it('should default activeRightPanel to reports', () => {
            render(
                <AgenticLayout
                    rightPanel={<div data-testid="right-content">Right</div>}
                />
            );

            // Right panel should be visible by default
            expect(screen.getByTestId('agentic-right-panel')).not.toHaveAttribute('aria-hidden', 'true');
        });
    });
});

describe('usePersistentMap', () => {
    it('should be defined', () => {
        expect(usePersistentMap).toBeDefined();
    });

    it('should return default context when not inside provider', () => {
        // Create a test component that uses the hook
        function TestComponent() {
            const { map, isMapReady } = usePersistentMap();
            return (
                <div>
                    <span data-testid="map-status">{map ? 'has-map' : 'no-map'}</span>
                    <span data-testid="ready-status">{isMapReady ? 'ready' : 'not-ready'}</span>
                </div>
            );
        }

        render(<TestComponent />);

        expect(screen.getByTestId('map-status')).toHaveTextContent('no-map');
        expect(screen.getByTestId('ready-status')).toHaveTextContent('not-ready');
    });
});
