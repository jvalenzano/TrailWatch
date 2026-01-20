import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InsightCard } from './InsightCard';
import type { SpatialInsight } from '../../types/spatial';

const mockInsight: SpatialInsight = {
    id: 'insight-1',
    type: 'cluster',
    title: 'High Activity Cluster',
    description: 'Multiple trail reports detected in concentrated area',
    location: { type: 'Point', coordinates: [-121.5, 37.8] },
    severity: 'high',
    report_ids: ['r1', 'r2', 'r3'],
};

describe('InsightCard', () => {
    it('renders insight title and description', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('High Activity Cluster')).toBeInTheDocument();
        expect(
            screen.getByText('Multiple trail reports detected in concentrated area')
        ).toBeInTheDocument();
    });

    it('renders type icon and label', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('Cluster')).toBeInTheDocument();
        expect(screen.getByRole('img', { name: 'Cluster' })).toBeInTheDocument();
    });

    it('renders severity badge', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('high')).toBeInTheDocument();
    });

    it('renders report count', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('3 reports')).toBeInTheDocument();
    });

    it('renders singular report text for single report', () => {
        const singleReportInsight: SpatialInsight = {
            ...mockInsight,
            report_ids: ['r1'],
        };

        render(
            <InsightCard
                insight={singleReportInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByText('1 report')).toBeInTheDocument();
    });

    it('calls onSelect when clicked', () => {
        const onSelect = vi.fn();
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={onSelect}
            />
        );

        fireEvent.click(screen.getByRole('button'));
        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('sets aria-pressed based on isSelected', () => {
        const { rerender } = render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');

        rerender(
            <InsightCard
                insight={mockInsight}
                isSelected={true}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('renders children when provided', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            >
                <div data-testid="child-content">Extra Metadata</div>
            </InsightCard>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByText('Extra Metadata')).toBeInTheDocument();
    });

    it('applies correct severity border colors', () => {
        const severities: Array<SpatialInsight['severity']> = ['low', 'medium', 'high'];

        severities.forEach((severity) => {
            const { container } = render(
                <InsightCard
                    insight={{ ...mockInsight, severity }}
                    isSelected={false}
                    onSelect={vi.fn()}
                />
            );

            const button = container.querySelector('button');
            expect(button).toHaveClass(`border-l-${severity === 'low' ? 'green' : severity === 'medium' ? 'yellow' : 'red'}-500`);
        });
    });

    it('renders different type icons correctly', () => {
        const types: Array<SpatialInsight['type']> = [
            'cluster',
            'hotspot',
            'trend',
            'anomaly',
            'duplicate',
            'consistency_check',
        ];

        types.forEach((type) => {
            const { unmount } = render(
                <InsightCard
                    insight={{ ...mockInsight, type }}
                    isSelected={false}
                    onSelect={vi.fn()}
                />
            );

            const expectedLabel =
                type === 'consistency_check' ? 'Consistency' : type.charAt(0).toUpperCase() + type.slice(1);
            expect(screen.getByRole('img', { name: expectedLabel })).toBeInTheDocument();
            unmount();
        });
    });

    it('has correct data-testid', () => {
        render(
            <InsightCard
                insight={mockInsight}
                isSelected={false}
                onSelect={vi.fn()}
            />
        );

        expect(screen.getByTestId('insight-card-insight-1')).toBeInTheDocument();
    });
});
