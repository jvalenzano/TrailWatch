import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ClusterAlertCard } from './ClusterAlertCard';
import type { ClusterMetadata } from '../../types/spatial';

expect.extend(toHaveNoViolations);

describe('ClusterAlertCard', () => {
    const baseMetadata: ClusterMetadata = {
        radius_miles: 1.0,
        time_span_hours: 4,
        report_count: 5,
        weather_correlation: 'Heavy wind gusts (45 mph)',
    };

    it('renders CRITICAL SPATIAL ALERT header', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByText('CRITICAL SPATIAL ALERT')).toBeInTheDocument();
    });

    it('has red border styling', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        const card = screen.getByTestId('cluster-alert-card');
        expect(card).toHaveClass('border-red-500');
    });

    it('displays weather context prominently', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByText(/Heavy wind gusts/)).toBeInTheDocument();
        expect(screen.getByTestId('weather-context')).toBeInTheDocument();
    });

    it('displays report count and radius', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByText(/5 reports/i)).toBeInTheDocument();
        expect(screen.getByText(/1\.0 mi radius/i)).toBeInTheDocument();
    });

    it('displays time span', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByText(/4 hour/i)).toBeInTheDocument();
    });

    it('renders warning icon', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByTestId('cluster-alert-warning-icon')).toBeInTheDocument();
    });

    it('shows "Show AI Reasoning" link when onShowReasoning provided', () => {
        const onShowReasoning = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onShowReasoning={onShowReasoning}
            />
        );

        expect(screen.getByText(/Show AI Reasoning/i)).toBeInTheDocument();
    });

    it('calls onShowReasoning when "Show AI Reasoning" clicked', () => {
        const onShowReasoning = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onShowReasoning={onShowReasoning}
            />
        );

        fireEvent.click(screen.getByText(/Show AI Reasoning/i));
        expect(onShowReasoning).toHaveBeenCalled();
    });

    it('shows "Assign Cluster" button when onAssignCluster provided', () => {
        const onAssignCluster = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onAssignCluster={onAssignCluster}
            />
        );

        expect(screen.getByRole('button', { name: /Assign Cluster/i })).toBeInTheDocument();
    });

    it('calls onAssignCluster when "Assign Cluster" clicked', () => {
        const onAssignCluster = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onAssignCluster={onAssignCluster}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /Assign Cluster/i }));
        expect(onAssignCluster).toHaveBeenCalled();
    });

    it('shows "View on Map" button when onViewOnMap provided', () => {
        const onViewOnMap = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onViewOnMap={onViewOnMap}
            />
        );

        expect(screen.getByRole('button', { name: /View on Map/i })).toBeInTheDocument();
    });

    it('calls onViewOnMap when "View on Map" clicked', () => {
        const onViewOnMap = vi.fn();
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onViewOnMap={onViewOnMap}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /View on Map/i }));
        expect(onViewOnMap).toHaveBeenCalled();
    });

    it('handles missing weather correlation gracefully', () => {
        const metadataNoWeather: ClusterMetadata = {
            radius_miles: 1.0,
            time_span_hours: 4,
            report_count: 5,
        };

        render(
            <ClusterAlertCard
                metadata={metadataNoWeather}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.queryByTestId('weather-context')).not.toBeInTheDocument();
        expect(screen.getByText('CRITICAL SPATIAL ALERT')).toBeInTheDocument();
    });

    it('formats radius to one decimal place', () => {
        const metadata: ClusterMetadata = {
            ...baseMetadata,
            radius_miles: 2.567,
        };

        render(
            <ClusterAlertCard
                metadata={metadata}
                clusterId="cluster-1"
                reportCount={3}
            />
        );

        expect(screen.getByText(/2\.6 mi radius/i)).toBeInTheDocument();
    });

    it('uses singular "report" for count of 1', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={1}
            />
        );

        expect(screen.getByText(/1 report(?!s)/i)).toBeInTheDocument();
    });

    it('exposes correct test id', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.getByTestId('cluster-alert-card')).toBeInTheDocument();
    });

    it('includes cluster id as data attribute', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-123"
                reportCount={5}
            />
        );

        const card = screen.getByTestId('cluster-alert-card');
        expect(card).toHaveAttribute('data-cluster-id', 'cluster-123');
    });

    it('has no accessibility violations', async () => {
        const { container } = render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onShowReasoning={() => {}}
                onAssignCluster={() => {}}
                onViewOnMap={() => {}}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders with aria-live for critical alerts', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        const card = screen.getByTestId('cluster-alert-card');
        expect(card).toHaveAttribute('aria-live', 'polite');
    });

    it('renders all action buttons when all callbacks provided', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
                onShowReasoning={() => {}}
                onAssignCluster={() => {}}
                onViewOnMap={() => {}}
            />
        );

        expect(screen.getByText(/Show AI Reasoning/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Assign Cluster/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /View on Map/i })).toBeInTheDocument();
    });

    it('renders no action buttons when no callbacks provided', () => {
        render(
            <ClusterAlertCard
                metadata={baseMetadata}
                clusterId="cluster-1"
                reportCount={5}
            />
        );

        expect(screen.queryByText(/Show AI Reasoning/i)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /Assign Cluster/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /View on Map/i })).not.toBeInTheDocument();
    });
});
