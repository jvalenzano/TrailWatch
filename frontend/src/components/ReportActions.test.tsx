import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi } from 'vitest';
import { ReportActions } from './ReportActions';

expect.extend(toHaveNoViolations);

describe('ReportActions', () => {
    it('should render WF3 action buttons with correct labels', () => {
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={() => { }}
                onMarkResolved={() => { }}
            />
        );
        // WF3: Primary action buttons
        expect(screen.getByRole('button', { name: /Approve & Route/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Edit/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Assign Crew/i })).toBeInTheDocument();
    });

    it('should call onMarkResolved when Approve & Route button is clicked', () => {
        const mockOnMarkResolved = vi.fn();
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={() => { }}
                onMarkResolved={mockOnMarkResolved}
            />
        );
        fireEvent.click(screen.getByTestId('approve-route-button'));
        expect(mockOnMarkResolved).toHaveBeenCalledWith('test-123');
    });

    it('should call onExtract when Edit button is clicked', () => {
        const mockOnExtract = vi.fn();
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={mockOnExtract}
                onMarkResolved={() => { }}
            />
        );
        fireEvent.click(screen.getByTestId('edit-button'));
        expect(mockOnExtract).toHaveBeenCalledWith('test-123');
    });

    it('should call onAssignCrew when Assign Crew button is clicked', () => {
        const mockOnAssignCrew = vi.fn();
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={mockOnAssignCrew}
                onExtract={() => { }}
                onMarkResolved={() => { }}
            />
        );
        fireEvent.click(screen.getByTestId('assign-crew-button'));
        expect(mockOnAssignCrew).toHaveBeenCalledWith('test-123');
    });

    it('should have proper button types', () => {
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={() => { }}
                onMarkResolved={() => { }}
            />
        );
        const buttons = screen.getAllByRole('button');
        buttons.forEach((button) => {
            expect(button).toHaveAttribute('type', 'button');
        });
    });

    it('should have no accessibility violations', async () => {
        const { container } = render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={() => { }}
                onMarkResolved={() => { }}
            />
        );
        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA role group', () => {
        render(
            <ReportActions
                reportId="test-123"
                onAssignCrew={() => { }}
                onExtract={() => { }}
                onMarkResolved={() => { }}
            />
        );
        expect(screen.getByRole('group', { name: /Report actions/i })).toBeInTheDocument();
    });
});
