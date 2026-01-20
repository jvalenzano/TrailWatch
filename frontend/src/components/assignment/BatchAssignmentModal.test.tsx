import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BatchAssignmentModal } from './BatchAssignmentModal';
import type { HazardReport } from '../../types/report';
import type { Crew } from '../../types/crew';
import type { District } from '../../types/district';
import type { CrewContext, RouteSummary } from '../../types/assignment';

expect.extend(toHaveNoViolations);

const createMockReport = (id: string): HazardReport => ({
    id,
    trail_name: 'Test Trail',
    hazard_type: 'tree_down',
    severity_estimate: 'difficult',
    description: `Test report ${id}`,
    location: { latitude: 46.85, longitude: -121.75 },
    photos: [],
    reporter_type: 'volunteer',
    submitted_at: '2026-01-18T10:00:00Z',
});

const mockReports: HazardReport[] = [
    createMockReport('report-1'),
    createMockReport('report-2'),
    createMockReport('report-3'),
];

const mockDistricts: District[] = [
    { id: 'district-01', name: 'Mt. Adams Ranger District', number: 1, default_crew_ids: ['crew-alpha'] },
    { id: 'district-02', name: 'Cowlitz Valley Ranger District', number: 2, default_crew_ids: ['crew-bravo'] },
];

const mockCrews: Crew[] = [
    { id: 'crew-alpha', name: 'Alpha Crew', organization: 'PCTA', members: [], status: 'available', specialties: [] },
    { id: 'crew-bravo', name: 'Bravo Crew', organization: 'ATC', members: [], status: 'available', specialties: [] },
    { id: 'crew-charlie', name: 'Charlie Crew', organization: 'CDTC', members: [], status: 'assigned', specialties: [] },
];

const mockCrewContext: CrewContext = {
    crew_id: 'crew-alpha',
    crew_name: 'Alpha Crew',
    performance: 'excellent',
    last_assignment_date: '2026-01-15T14:30:00Z',
    capacity_percent: 25,
};

const mockRouteSummary: RouteSummary = {
    total_distance_miles: 15.7,
    estimated_travel_hours: 2.5,
    estimated_work_hours: 4.25,
};

const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onSubmit: vi.fn(),
    selectedReports: mockReports,
    onDeselectReport: vi.fn(),
    districts: mockDistricts,
    selectedDistrictId: null,
    onSelectDistrict: vi.fn(),
    crews: mockCrews,
    selectedCrewId: null,
    onSelectCrew: vi.fn(),
};

describe('BatchAssignmentModal', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders when open', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByTestId('batch-assignment-modal')).toBeInTheDocument();
        expect(screen.getByText('Batch Assignment')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<BatchAssignmentModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByTestId('batch-assignment-modal')).not.toBeInTheDocument();
    });

    it('shows correct report count in description', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByText('Assign 3 reports to a crew')).toBeInTheDocument();
    });

    it('uses singular form for single report', () => {
        render(<BatchAssignmentModal {...defaultProps} selectedReports={[mockReports[0]]} />);

        expect(screen.getByText('Assign 1 report to a crew')).toBeInTheDocument();
    });

    it('calls onClose when close button clicked', () => {
        const onClose = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onClose={onClose} />);

        fireEvent.click(screen.getByTestId('batch-assignment-close'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop clicked', () => {
        const onClose = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onClose={onClose} />);

        // Find backdrop by its aria-hidden attribute
        const backdrop = document.querySelector('[aria-hidden="true"]');
        fireEvent.click(backdrop!);
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when Cancel button clicked', () => {
        const onClose = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onClose={onClose} />);

        fireEvent.click(screen.getByTestId('batch-assignment-cancel'));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when ESC key pressed', () => {
        const onClose = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onClose={onClose} />);

        fireEvent.keyDown(document, { key: 'Escape' });
        expect(onClose).toHaveBeenCalled();
    });

    it('displays report checklist', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByTestId('report-checklist')).toBeInTheDocument();
        expect(screen.getByText('Selected Reports (3)')).toBeInTheDocument();
    });

    it('calls onDeselectReport when report removed', () => {
        const onDeselect = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onDeselectReport={onDeselect} />);

        fireEvent.click(screen.getByTestId('report-checklist-remove-report-1'));
        expect(onDeselect).toHaveBeenCalledWith('report-1');
    });

    it('displays district selector', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByTestId('district-selector')).toBeInTheDocument();
    });

    it('calls onSelectDistrict when district changed', () => {
        const onSelectDistrict = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onSelectDistrict={onSelectDistrict} />);

        fireEvent.change(screen.getByTestId('district-selector'), {
            target: { value: 'district-01' },
        });
        expect(onSelectDistrict).toHaveBeenCalledWith('district-01');
    });

    it('displays district suggestion when provided', () => {
        render(
            <BatchAssignmentModal
                {...defaultProps}
                districtSuggestion={{
                    district_id: 'district-01',
                    reason: 'Most reports match',
                    matching_reports: 2,
                }}
            />
        );

        expect(screen.getByTestId('district-suggestion')).toBeInTheDocument();
    });

    it('displays crew selector', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByTestId('crew-selector')).toBeInTheDocument();
    });

    it('disables crew selector when no district selected', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        expect(screen.getByTestId('crew-selector')).toBeDisabled();
    });

    it('enables crew selector when district selected', () => {
        render(<BatchAssignmentModal {...defaultProps} selectedDistrictId="district-01" />);

        expect(screen.getByTestId('crew-selector')).not.toBeDisabled();
    });

    it('calls onSelectCrew when crew changed', () => {
        const onSelectCrew = vi.fn();
        render(
            <BatchAssignmentModal
                {...defaultProps}
                selectedDistrictId="district-01"
                onSelectCrew={onSelectCrew}
            />
        );

        fireEvent.change(screen.getByTestId('crew-selector'), {
            target: { value: 'crew-alpha' },
        });
        expect(onSelectCrew).toHaveBeenCalledWith('crew-alpha');
    });

    it('displays crew context when provided', () => {
        render(
            <BatchAssignmentModal
                {...defaultProps}
                selectedDistrictId="district-01"
                selectedCrewId="crew-alpha"
                crewContext={mockCrewContext}
            />
        );

        expect(screen.getByTestId('crew-context-card')).toBeInTheDocument();
    });

    it('displays route summary when provided', () => {
        render(<BatchAssignmentModal {...defaultProps} routeSummary={mockRouteSummary} />);

        expect(screen.getByTestId('route-summary')).toBeInTheDocument();
    });

    it('disables submit button when canSubmit is false', () => {
        render(<BatchAssignmentModal {...defaultProps} canSubmit={false} />);

        expect(screen.getByTestId('batch-assignment-submit')).toBeDisabled();
    });

    it('enables submit button when canSubmit is true', () => {
        render(<BatchAssignmentModal {...defaultProps} canSubmit={true} />);

        expect(screen.getByTestId('batch-assignment-submit')).not.toBeDisabled();
    });

    it('calls onSubmit when submit button clicked', () => {
        const onSubmit = vi.fn();
        render(<BatchAssignmentModal {...defaultProps} onSubmit={onSubmit} canSubmit={true} />);

        fireEvent.click(screen.getByTestId('batch-assignment-submit'));
        expect(onSubmit).toHaveBeenCalled();
    });

    it('shows loading state when submitting', () => {
        render(<BatchAssignmentModal {...defaultProps} isSubmitting={true} canSubmit={true} />);

        expect(screen.getByText('Assigning...')).toBeInTheDocument();
        expect(screen.getByTestId('batch-assignment-submit')).toBeDisabled();
    });

    it('has correct ARIA attributes', () => {
        render(<BatchAssignmentModal {...defaultProps} />);

        const modal = screen.getByTestId('batch-assignment-modal');
        expect(modal).toHaveAttribute('role', 'dialog');
        expect(modal).toHaveAttribute('aria-modal', 'true');
        expect(modal).toHaveAttribute('aria-labelledby');
        expect(modal).toHaveAttribute('aria-describedby');
    });

    it('has no accessibility violations', async () => {
        const { container } = render(
            <BatchAssignmentModal
                {...defaultProps}
                selectedDistrictId="district-01"
                selectedCrewId="crew-alpha"
                crewContext={mockCrewContext}
                routeSummary={mockRouteSummary}
                canSubmit={true}
            />
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });

    it('shows loading state for route summary', () => {
        render(<BatchAssignmentModal {...defaultProps} isLoadingRoute={true} />);

        expect(screen.getByTestId('route-summary-loading')).toBeInTheDocument();
    });

    it('shows loading state for crew context', () => {
        render(
            <BatchAssignmentModal
                {...defaultProps}
                selectedDistrictId="district-01"
                selectedCrewId="crew-alpha"
                isLoadingCrewContext={true}
            />
        );

        expect(screen.getByTestId('crew-context-loading')).toBeInTheDocument();
    });
});
