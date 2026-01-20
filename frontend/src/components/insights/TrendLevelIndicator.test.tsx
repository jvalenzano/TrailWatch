import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TrendLevelIndicator } from './TrendLevelIndicator';
import type { SpatialInsightType } from '../../types/spatial';

describe('TrendLevelIndicator', () => {
    it('renders type and level in combined format', () => {
        render(
            <TrendLevelIndicator type="trend" severity="low" />
        );

        expect(screen.getByText(/TREND/)).toBeInTheDocument();
        expect(screen.getByText(/Low/)).toBeInTheDocument();
    });

    it('renders cluster type correctly', () => {
        render(
            <TrendLevelIndicator type="cluster" severity="high" />
        );

        expect(screen.getByText(/CLUSTER/)).toBeInTheDocument();
        expect(screen.getByText(/High/)).toBeInTheDocument();
    });

    it('renders hotspot type as PATTERN', () => {
        render(
            <TrendLevelIndicator type="hotspot" severity="medium" />
        );

        expect(screen.getByText(/PATTERN/)).toBeInTheDocument();
        expect(screen.getByText(/Medium/)).toBeInTheDocument();
    });

    it('renders anomaly type correctly', () => {
        render(
            <TrendLevelIndicator type="anomaly" severity="high" />
        );

        expect(screen.getByText(/ANOMALY/)).toBeInTheDocument();
        expect(screen.getByText(/High/)).toBeInTheDocument();
    });

    it('renders duplicate type correctly', () => {
        render(
            <TrendLevelIndicator type="duplicate" severity="low" />
        );

        expect(screen.getByText(/DUPLICATE/)).toBeInTheDocument();
        expect(screen.getByText(/Low/)).toBeInTheDocument();
    });

    it('renders consistency_check type correctly', () => {
        render(
            <TrendLevelIndicator type="consistency_check" severity="medium" />
        );

        expect(screen.getByText(/CONSISTENCY/)).toBeInTheDocument();
        expect(screen.getByText(/Medium/)).toBeInTheDocument();
    });

    it('applies correct color for low severity', () => {
        const { container } = render(
            <TrendLevelIndicator type="trend" severity="low" />
        );

        const indicator = container.firstChild;
        expect(indicator).toHaveClass('text-green-400');
    });

    it('applies correct color for medium severity', () => {
        const { container } = render(
            <TrendLevelIndicator type="trend" severity="medium" />
        );

        const indicator = container.firstChild;
        expect(indicator).toHaveClass('text-yellow-400');
    });

    it('applies correct color for high severity', () => {
        const { container } = render(
            <TrendLevelIndicator type="trend" severity="high" />
        );

        const indicator = container.firstChild;
        expect(indicator).toHaveClass('text-red-400');
    });

    it('renders icon based on type', () => {
        render(
            <TrendLevelIndicator type="trend" severity="low" />
        );

        // Should have an icon element
        expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(
            <TrendLevelIndicator type="cluster" severity="high" />
        );

        expect(screen.getByTestId('trend-level-indicator')).toBeInTheDocument();
    });

    it('has accessible label', () => {
        render(
            <TrendLevelIndicator type="trend" severity="low" />
        );

        expect(screen.getByLabelText(/trend.*low/i)).toBeInTheDocument();
    });
});
