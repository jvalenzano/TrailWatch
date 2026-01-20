import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReportChecklist } from './ReportChecklist';
import type { HazardReport } from '../../types/report';

expect.extend(toHaveNoViolations);

const createMockReport = (overrides: Partial<HazardReport> = {}): HazardReport => ({
    id: `report-${Math.random().toString(36).slice(2)}`,
    trail_name: 'Test Trail',
    hazard_type: 'tree_down',
    severity_estimate: 'difficult',
    description: 'Large tree blocking trail after storm',
    location: { latitude: 46.85, longitude: -121.75 },
    photos: [],
    reporter_type: 'volunteer',
    submitted_at: '2026-01-18T10:00:00Z',
    ...overrides,
});

const mockReports: HazardReport[] = [
    createMockReport({
        id: 'report-1',
        description: 'Fallen tree across the main path',
        severity_estimate: 'dangerous',
    }),
    createMockReport({
        id: 'report-2',
        description: 'Trail washout near creek crossing',
        severity_estimate: 'impassable',
    }),
    createMockReport({
        id: 'report-3',
        description: 'Loose rocks on switchback',
        severity_estimate: 'difficult',
    }),
    createMockReport({
        id: 'report-4',
        description: 'Bridge damage from flooding',
        severity_estimate: 'impassable',
    }),
    createMockReport({
        id: 'report-5',
        description: 'Minor trail erosion',
        severity_estimate: 'passable',
    }),
];

describe('ReportChecklist', () => {
    it('renders empty state when no reports', () => {
        render(<ReportChecklist reports={[]} />);

        expect(screen.getByTestId('report-checklist-empty')).toBeInTheDocument();
        expect(screen.getByText('No reports selected')).toBeInTheDocument();
    });

    it('renders report list with correct count', () => {
        render(<ReportChecklist reports={mockReports.slice(0, 3)} />);

        expect(screen.getByTestId('report-checklist')).toBeInTheDocument();
        expect(screen.getByText('Selected Reports (3)')).toBeInTheDocument();
    });

    it('shows report descriptions', () => {
        render(<ReportChecklist reports={[mockReports[0]]} />);

        expect(screen.getByText(/Fallen tree across the main path/)).toBeInTheDocument();
    });

    it('shows trail name and hazard type', () => {
        render(<ReportChecklist reports={[mockReports[0]]} />);

        expect(screen.getByText(/Test Trail/)).toBeInTheDocument();
        expect(screen.getByText(/tree_down/)).toBeInTheDocument();
    });

    it('shows severity indicator with correct color', () => {
        render(<ReportChecklist reports={mockReports} />);

        // Only first 3 are visible by default, first one is dangerous (red)
        const dangerousItem = screen.getByTestId('report-checklist-item-report-1');
        const indicator = dangerousItem.querySelector('[aria-label="Severity: dangerous"]');
        expect(indicator).toHaveClass('bg-red-500');
    });

    it('collapses list when more than maxVisible', () => {
        render(<ReportChecklist reports={mockReports} maxVisible={3} />);

        // Should show 3 visible + hidden indicator
        expect(screen.getByTestId('report-checklist-item-report-1')).toBeInTheDocument();
        expect(screen.getByTestId('report-checklist-item-report-2')).toBeInTheDocument();
        expect(screen.getByTestId('report-checklist-item-report-3')).toBeInTheDocument();
        expect(screen.queryByTestId('report-checklist-item-report-4')).not.toBeInTheDocument();

        expect(screen.getByText('+2 more reports')).toBeInTheDocument();
    });

    it('expands list when toggle clicked', () => {
        render(<ReportChecklist reports={mockReports} maxVisible={3} />);

        const toggle = screen.getByTestId('report-checklist-toggle');
        expect(toggle).toHaveTextContent('Show all 5');

        fireEvent.click(toggle);

        // All reports should now be visible
        expect(screen.getByTestId('report-checklist-item-report-4')).toBeInTheDocument();
        expect(screen.getByTestId('report-checklist-item-report-5')).toBeInTheDocument();
        expect(toggle).toHaveTextContent('Show less');
    });

    it('does not show toggle when reports fit in maxVisible', () => {
        render(<ReportChecklist reports={mockReports.slice(0, 2)} maxVisible={3} />);

        expect(screen.queryByTestId('report-checklist-toggle')).not.toBeInTheDocument();
    });

    it('calls onDeselectReport when remove button clicked', () => {
        const onDeselect = vi.fn();
        render(<ReportChecklist reports={mockReports.slice(0, 2)} onDeselectReport={onDeselect} />);

        const removeButton = screen.getByTestId('report-checklist-remove-report-1');
        fireEvent.click(removeButton);

        expect(onDeselect).toHaveBeenCalledWith('report-1');
    });

    it('does not show remove buttons when onDeselectReport is not provided', () => {
        render(<ReportChecklist reports={mockReports.slice(0, 2)} />);

        expect(screen.queryByTestId('report-checklist-remove-report-1')).not.toBeInTheDocument();
    });

    it('truncates long descriptions', () => {
        const longDescription = 'A'.repeat(100);
        render(
            <ReportChecklist
                reports={[createMockReport({ id: 'report-long', description: longDescription })]}
            />
        );

        // Should show truncated text (40 chars + ...)
        expect(screen.getByText('A'.repeat(40) + '...')).toBeInTheDocument();
    });

    it('has correct aria-expanded attribute on toggle', () => {
        render(<ReportChecklist reports={mockReports} maxVisible={3} />);

        const toggle = screen.getByTestId('report-checklist-toggle');
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('has accessible remove button labels', () => {
        const onDeselect = vi.fn();
        render(<ReportChecklist reports={mockReports.slice(0, 1)} onDeselectReport={onDeselect} />);

        const removeButton = screen.getByTestId('report-checklist-remove-report-1');
        expect(removeButton).toHaveAttribute('aria-label', expect.stringContaining('Remove'));
    });

    it('has no accessibility violations', async () => {
        const { container } = render(
            <ReportChecklist reports={mockReports.slice(0, 3)} onDeselectReport={vi.fn()} />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when empty', async () => {
        const { container } = render(<ReportChecklist reports={[]} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
