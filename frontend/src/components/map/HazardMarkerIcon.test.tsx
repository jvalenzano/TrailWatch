import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { HazardMarkerIcon } from './HazardMarkerIcon';

expect.extend(toHaveNoViolations);

describe('HazardMarkerIcon', () => {
    it('renders bridge icon for structures hazard type', () => {
        render(<HazardMarkerIcon hazardType="structures" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toBeInTheDocument();
        expect(icon).toHaveAttribute('data-hazard-type', 'structures');
    });

    it('renders tree icon for obstruction hazard type', () => {
        render(<HazardMarkerIcon hazardType="obstruction" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'obstruction');
    });

    it('renders water icon for flooding hazard type', () => {
        render(<HazardMarkerIcon hazardType="flooding" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'flooding');
    });

    it('renders wildlife icon for wildlife hazard type', () => {
        render(<HazardMarkerIcon hazardType="wildlife" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'wildlife');
    });

    it('renders warning icon for unknown hazard type', () => {
        render(<HazardMarkerIcon hazardType="unknown" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'unknown');
    });

    it('uses default size of 24', () => {
        render(<HazardMarkerIcon hazardType="structures" />);

        const wrapper = screen.getByTestId('hazard-marker-icon');
        const svg = wrapper.querySelector('svg');
        expect(svg).toHaveAttribute('width', '24');
        expect(svg).toHaveAttribute('height', '24');
    });

    it('allows custom size', () => {
        render(<HazardMarkerIcon hazardType="structures" size={32} />);

        const wrapper = screen.getByTestId('hazard-marker-icon');
        const svg = wrapper.querySelector('svg');
        expect(svg).toHaveAttribute('width', '32');
        expect(svg).toHaveAttribute('height', '32');
    });

    it('uses red color by default', () => {
        render(<HazardMarkerIcon hazardType="structures" />);

        const wrapper = screen.getByTestId('hazard-marker-icon');
        const svg = wrapper.querySelector('svg');
        expect(svg).toHaveClass('text-red-500');
    });

    it('allows custom color class', () => {
        render(<HazardMarkerIcon hazardType="structures" colorClass="text-orange-500" />);

        const wrapper = screen.getByTestId('hazard-marker-icon');
        const svg = wrapper.querySelector('svg');
        expect(svg).toHaveClass('text-orange-500');
    });

    it('has aria-label for accessibility', () => {
        render(<HazardMarkerIcon hazardType="structures" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('aria-label', 'structures hazard');
    });

    it('renders erosion icon for erosion hazard type', () => {
        render(<HazardMarkerIcon hazardType="erosion" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'erosion');
    });

    it('renders danger icon for dangerous hazard type', () => {
        render(<HazardMarkerIcon hazardType="dangerous" />);

        const icon = screen.getByTestId('hazard-marker-icon');
        expect(icon).toHaveAttribute('data-hazard-type', 'dangerous');
    });

    it('has no accessibility violations', async () => {
        const { container } = render(<HazardMarkerIcon hazardType="structures" />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('applies custom className to SVG', () => {
        render(<HazardMarkerIcon hazardType="structures" className="my-custom-class" />);

        const wrapper = screen.getByTestId('hazard-marker-icon');
        const svg = wrapper.querySelector('svg');
        expect(svg).toHaveClass('my-custom-class');
    });
});
