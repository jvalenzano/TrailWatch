import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { OfflineMapOverlay } from './OfflineMapOverlay';

expect.extend(toHaveNoViolations);

describe('OfflineMapOverlay', () => {
    describe('rendering', () => {
        it('should render the overlay', () => {
            render(<OfflineMapOverlay />);

            expect(screen.getByTestId('offline-map-overlay')).toBeInTheDocument();
        });

        it('should display default message', () => {
            render(<OfflineMapOverlay />);

            expect(
                screen.getByText('Live crew locations unavailable offline')
            ).toBeInTheDocument();
        });

        it('should accept custom message prop', () => {
            render(<OfflineMapOverlay message="Map data is offline" />);

            expect(screen.getByText('Map data is offline')).toBeInTheDocument();
        });

        it('should not display default message when custom message provided', () => {
            render(<OfflineMapOverlay message="Custom message" />);

            expect(
                screen.queryByText('Live crew locations unavailable offline')
            ).not.toBeInTheDocument();
        });
    });

    describe('icon', () => {
        it('should show icon by default', () => {
            render(<OfflineMapOverlay />);

            expect(screen.getByTestId('cloud-off-icon')).toBeInTheDocument();
        });

        it('should show icon when showIcon is true', () => {
            render(<OfflineMapOverlay showIcon={true} />);

            expect(screen.getByTestId('cloud-off-icon')).toBeInTheDocument();
        });

        it('should hide icon when showIcon is false', () => {
            render(<OfflineMapOverlay showIcon={false} />);

            expect(screen.queryByTestId('cloud-off-icon')).not.toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have semi-transparent background', () => {
            render(<OfflineMapOverlay />);

            const overlay = screen.getByTestId('offline-map-overlay');
            // Check for opacity in class name (bg-gray-900/75)
            expect(overlay.className).toMatch(/bg-gray-900\/75|bg-opacity/);
        });

        it('should center content', () => {
            render(<OfflineMapOverlay />);

            const overlay = screen.getByTestId('offline-map-overlay');
            expect(overlay).toHaveClass('flex');
            expect(overlay).toHaveClass('items-center');
            expect(overlay).toHaveClass('justify-center');
        });

        it('should be positioned for overlay', () => {
            render(<OfflineMapOverlay />);

            const overlay = screen.getByTestId('offline-map-overlay');
            expect(overlay).toHaveClass('absolute');
            expect(overlay).toHaveClass('inset-0');
        });

        it('should accept additional className', () => {
            render(<OfflineMapOverlay className="z-50" />);

            const overlay = screen.getByTestId('offline-map-overlay');
            expect(overlay).toHaveClass('z-50');
        });
    });

    describe('tablet optimization', () => {
        it('should have readable text size for tablet', () => {
            render(<OfflineMapOverlay />);

            const messageContainer = screen.getByTestId('offline-map-message');
            // Should have text that scales appropriately for tablets
            expect(messageContainer).toHaveClass('text-lg');
        });

        it('should have adequate touch-friendly padding', () => {
            render(<OfflineMapOverlay />);

            const messageContainer = screen.getByTestId('offline-map-message');
            // Padding should be comfortable for tablet touch
            expect(messageContainer).toHaveClass('p-6');
        });
    });

    describe('readability against map backgrounds', () => {
        it('should have text with high contrast', () => {
            render(<OfflineMapOverlay />);

            const messageContainer = screen.getByTestId('offline-map-message');
            expect(messageContainer).toHaveClass('text-white');
        });

        it('should have background on message container for readability', () => {
            render(<OfflineMapOverlay />);

            const messageContainer = screen.getByTestId('offline-map-message');
            // Message container should have its own background for readability
            expect(messageContainer.className).toMatch(/bg-gray-800|bg-gray-900/);
        });

        it('should have rounded corners on message container', () => {
            render(<OfflineMapOverlay />);

            const messageContainer = screen.getByTestId('offline-map-message');
            expect(messageContainer).toHaveClass('rounded-lg');
        });
    });

    describe('accessibility', () => {
        it('should have appropriate role', () => {
            render(<OfflineMapOverlay />);

            expect(screen.getByRole('status')).toBeInTheDocument();
        });

        it('should have aria-live for screen readers', () => {
            render(<OfflineMapOverlay />);

            const overlay = screen.getByTestId('offline-map-overlay');
            expect(overlay).toHaveAttribute('aria-live', 'polite');
        });

        it('should have descriptive aria-label', () => {
            render(<OfflineMapOverlay />);

            const overlay = screen.getByTestId('offline-map-overlay');
            expect(overlay).toHaveAttribute(
                'aria-label',
                expect.stringContaining('offline')
            );
        });

        it('should have icon marked as decorative', () => {
            render(<OfflineMapOverlay />);

            const icon = screen.getByTestId('cloud-off-icon');
            expect(icon).toHaveAttribute('aria-hidden', 'true');
        });

        it('should have no accessibility violations', async () => {
            const { container } = render(<OfflineMapOverlay />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with custom message', async () => {
            const { container } = render(
                <OfflineMapOverlay message="Custom offline message" />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations without icon', async () => {
            const { container } = render(<OfflineMapOverlay showIcon={false} />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
