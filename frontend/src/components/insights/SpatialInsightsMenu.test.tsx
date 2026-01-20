import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SpatialInsightsMenu } from './SpatialInsightsMenu';

expect.extend(toHaveNoViolations);

describe('SpatialInsightsMenu', () => {
    it('renders menu trigger button', () => {
        render(<SpatialInsightsMenu />);

        expect(screen.getByRole('button', { name: /spatial insights/i })).toBeInTheDocument();
    });

    it('menu is closed by default', () => {
        render(<SpatialInsightsMenu />);

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('opens menu when trigger is clicked', () => {
        render(<SpatialInsightsMenu />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('shows Heatmap Analysis menu item', () => {
        render(<SpatialInsightsMenu />);
        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        expect(screen.getByRole('menuitem', { name: /heatmap analysis/i })).toBeInTheDocument();
    });

    it('shows Route Traffic menu item', () => {
        render(<SpatialInsightsMenu />);
        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        expect(screen.getByRole('menuitem', { name: /route traffic/i })).toBeInTheDocument();
    });

    it('shows Incident Trends menu item', () => {
        render(<SpatialInsightsMenu />);
        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        expect(screen.getByRole('menuitem', { name: /incident trends/i })).toBeInTheDocument();
    });

    it('shows Resource Allocation menu item', () => {
        render(<SpatialInsightsMenu />);
        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        expect(screen.getByRole('menuitem', { name: /resource allocation/i })).toBeInTheDocument();
    });

    it('calls onSelectHeatmap when Heatmap Analysis is clicked', () => {
        const onSelectHeatmap = vi.fn();
        render(<SpatialInsightsMenu onSelectHeatmap={onSelectHeatmap} />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /heatmap analysis/i }));

        expect(onSelectHeatmap).toHaveBeenCalled();
    });

    it('calls onSelectRouteTraffic when Route Traffic is clicked', () => {
        const onSelectRouteTraffic = vi.fn();
        render(<SpatialInsightsMenu onSelectRouteTraffic={onSelectRouteTraffic} />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /route traffic/i }));

        expect(onSelectRouteTraffic).toHaveBeenCalled();
    });

    it('calls onSelectIncidentTrends when Incident Trends is clicked', () => {
        const onSelectIncidentTrends = vi.fn();
        render(<SpatialInsightsMenu onSelectIncidentTrends={onSelectIncidentTrends} />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /incident trends/i }));

        expect(onSelectIncidentTrends).toHaveBeenCalled();
    });

    it('calls onSelectResourceAllocation when Resource Allocation is clicked', () => {
        const onSelectResourceAllocation = vi.fn();
        render(<SpatialInsightsMenu onSelectResourceAllocation={onSelectResourceAllocation} />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /resource allocation/i }));

        expect(onSelectResourceAllocation).toHaveBeenCalled();
    });

    it('closes menu after selecting an item', () => {
        const onSelect = vi.fn();
        render(<SpatialInsightsMenu onSelectHeatmap={onSelect} />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        fireEvent.click(screen.getByRole('menuitem', { name: /heatmap analysis/i }));

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes menu when clicking outside', () => {
        render(
            <div>
                <SpatialInsightsMenu />
                <button data-testid="outside">Outside</button>
            </div>
        );

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        expect(screen.getByRole('menu')).toBeInTheDocument();

        fireEvent.mouseDown(screen.getByTestId('outside'));

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('closes menu on Escape key', () => {
        render(<SpatialInsightsMenu />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));
        expect(screen.getByRole('menu')).toBeInTheDocument();

        fireEvent.keyDown(screen.getByRole('menu'), { key: 'Escape' });

        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('has correct testid', () => {
        render(<SpatialInsightsMenu />);

        expect(screen.getByTestId('spatial-insights-menu')).toBeInTheDocument();
    });

    it('menu items have icons', () => {
        render(<SpatialInsightsMenu />);
        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        // Check that each menu item has an icon
        const menuItems = screen.getAllByRole('menuitem');
        menuItems.forEach(item => {
            expect(item.querySelector('svg')).toBeInTheDocument();
        });
    });

    it('has no accessibility violations when closed', async () => {
        const { container } = render(<SpatialInsightsMenu />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when open', async () => {
        const { container } = render(<SpatialInsightsMenu />);

        fireEvent.click(screen.getByRole('button', { name: /spatial insights/i }));

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('applies compact mode styling when compact prop is true', () => {
        render(<SpatialInsightsMenu compact />);

        const button = screen.getByRole('button', { name: /spatial insights/i });
        expect(button).toHaveClass('text-sm');
    });
});
