import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DuplicateComparisonCard } from './DuplicateComparisonCard';

expect.extend(toHaveNoViolations);

const mockReportA = {
    id: 'report-1',
    description: 'Large fallen tree blocking north section of trail near mile marker 3',
    photoUrl: 'https://example.com/photo1.jpg',
    coordinates: { latitude: 37.5, longitude: -120.5 },
    status: 'new' as const,
    timestamp: new Date('2026-01-20T08:30:00'),
};

const mockReportB = {
    id: 'report-2',
    description: 'Tree down on trail, appears to be a large oak blocking the path',
    photoUrl: 'https://example.com/photo2.jpg',
    coordinates: { latitude: 37.5001, longitude: -120.5002 },
    status: 'assigned' as const,
    timestamp: new Date('2026-01-20T09:15:00'),
};

describe('DuplicateComparisonCard', () => {
    it('renders POSSIBLE DUPLICATE header', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByText('POSSIBLE DUPLICATE')).toBeInTheDocument();
    });

    it('has yellow border styling', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        const card = screen.getByTestId('duplicate-comparison-card');
        expect(card).toHaveClass('border-yellow-500');
    });

    it('displays similarity percentage', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByText('94%')).toBeInTheDocument();
        expect(screen.getByText(/similar/i)).toBeInTheDocument();
    });

    it('displays distance between reports', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByText(/15 meters/i)).toBeInTheDocument();
    });

    it('renders photo thumbnails for both reports', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        const images = screen.getAllByRole('img');
        expect(images).toHaveLength(2);
        expect(images[0]).toHaveAttribute('src', mockReportA.photoUrl);
        expect(images[1]).toHaveAttribute('src', mockReportB.photoUrl);
    });

    it('renders photo placeholders when no photos provided', () => {
        render(
            <DuplicateComparisonCard
                reportA={{ ...mockReportA, photoUrl: undefined }}
                reportB={{ ...mockReportB, photoUrl: undefined }}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        const placeholders = screen.getAllByTestId(/photo-placeholder/);
        expect(placeholders).toHaveLength(2);
    });

    it('displays GPS coordinates for both reports', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByText(/37\.5000/)).toBeInTheDocument();
        expect(screen.getByText(/-120\.5000/)).toBeInTheDocument();
    });

    it('displays truncated description previews', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        // Descriptions should be truncated
        expect(screen.getByText(/Large fallen tree/)).toBeInTheDocument();
        expect(screen.getByText(/Tree down on trail/)).toBeInTheDocument();
    });

    it('displays status badges', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByText('NEW')).toBeInTheDocument();
        expect(screen.getByText('ASSIGNED')).toBeInTheDocument();
    });

    it('renders "Mark as Duplicate" button when callback provided', () => {
        const onMarkDuplicate = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onMarkDuplicate={onMarkDuplicate}
            />
        );

        expect(screen.getByRole('button', { name: /mark as duplicate/i })).toBeInTheDocument();
    });

    it('calls onMarkDuplicate when button is clicked', () => {
        const onMarkDuplicate = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onMarkDuplicate={onMarkDuplicate}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /mark as duplicate/i }));
        expect(onMarkDuplicate).toHaveBeenCalledWith(mockReportA.id, mockReportB.id);
    });

    it('renders "Keep Separate" button when callback provided', () => {
        const onKeepSeparate = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onKeepSeparate={onKeepSeparate}
            />
        );

        expect(screen.getByRole('button', { name: /keep separate/i })).toBeInTheDocument();
    });

    it('calls onKeepSeparate when button is clicked', () => {
        const onKeepSeparate = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onKeepSeparate={onKeepSeparate}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /keep separate/i }));
        expect(onKeepSeparate).toHaveBeenCalledWith(mockReportA.id, mockReportB.id);
    });

    it('renders "View Both on Map" button when callback provided', () => {
        const onViewOnMap = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onViewOnMap={onViewOnMap}
            />
        );

        expect(screen.getByRole('button', { name: /view both on map/i })).toBeInTheDocument();
    });

    it('calls onViewOnMap when button is clicked', () => {
        const onViewOnMap = vi.fn();
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onViewOnMap={onViewOnMap}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /view both on map/i }));
        expect(onViewOnMap).toHaveBeenCalledWith(mockReportA.id, mockReportB.id);
    });

    it('does not render action buttons when no callbacks provided', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.queryByRole('button', { name: /mark as duplicate/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /keep separate/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /view both on map/i })).not.toBeInTheDocument();
    });

    it('renders warning icon', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByTestId('duplicate-warning-icon')).toBeInTheDocument();
    });

    it('has correct testid', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        expect(screen.getByTestId('duplicate-comparison-card')).toBeInTheDocument();
    });

    it('formats distance in km when over 1000 meters', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={1500}
            />
        );

        expect(screen.getByText(/1\.5 km/i)).toBeInTheDocument();
    });

    it('has no accessibility violations', async () => {
        const { container } = render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
                onMarkDuplicate={() => {}}
                onKeepSeparate={() => {}}
                onViewOnMap={() => {}}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('renders with aria-live for alerts', () => {
        render(
            <DuplicateComparisonCard
                reportA={mockReportA}
                reportB={mockReportB}
                similarityScore={0.94}
                distanceMeters={15}
            />
        );

        const card = screen.getByTestId('duplicate-comparison-card');
        expect(card).toHaveAttribute('aria-live', 'polite');
    });
});
