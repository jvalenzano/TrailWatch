import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HighRiskConfirmation } from './HighRiskConfirmation';
import { isHighRiskReport } from './utils';
import type { HazardReport } from '../../types/report';

const mockHighRiskReport: HazardReport = {
    id: 'RV-007',
    trail_name: 'River Valley Trail',
    location: { latitude: 46.842, longitude: -121.775 },
    hazard_type: 'structures',
    severity_estimate: 'dangerous',
    description: 'URGENT: Footbridge collapsed!',
    photos: ['/photo1.jpg'],
    reporter_type: 'coordinator',
    submitted_at: '2026-01-19T07:45:00Z',
    safety_alert: true,
    triage_result: {
        tracs_category: 'STR',
        tracs_category_name: 'Structures',
        severity: 'SEV3',
        severity_name: 'CLOSURE_RECOMMENDED',
        confidence_score: 0.97,
        reasoning: 'Bridge collapse confirmed',
        confidence_factors: {
            has_photo: true,
            photo_matches_hazard: true,
            gps_accurate: true,
            description_specific: true,
            reporter_trusted: true,
            corroborating_reports: 2,
        },
        recommended_action: 'IMMEDIATE: Close trail segment.',
        similar_reports: [],
    },
};

describe('HighRiskConfirmation', () => {
    const defaultProps = {
        report: mockHighRiskReport,
        onConfirm: vi.fn(),
        onCancel: vi.fn(),
    };

    it('renders warning header', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText('High-Risk Action Required')).toBeInTheDocument();
        expect(screen.getByText(/human verification/)).toBeInTheDocument();
    });

    it('displays report details', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText('RV-007')).toBeInTheDocument();
        expect(screen.getByText('River Valley Trail')).toBeInTheDocument();
        expect(screen.getByText('Structures')).toBeInTheDocument();
        expect(screen.getByText('CLOSURE_RECOMMENDED')).toBeInTheDocument();
    });

    it('displays AI recommendation', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText(/IMMEDIATE: Close trail segment/)).toBeInTheDocument();
    });

    it('renders all checklist items', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText(/reviewed all attached photos/)).toBeInTheDocument();
        expect(screen.getByText(/verified the GPS location/)).toBeInTheDocument();
        expect(screen.getByText(/close the trail/)).toBeInTheDocument();
    });

    it('disables confirm button until all checkboxes are checked', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const confirmButton = screen.getByTestId('high-risk-confirm');
        expect(confirmButton).toBeDisabled();
    });

    it('enables confirm button when all required checkboxes are checked and justification is valid', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Add valid justification
        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        const confirmButton = screen.getByTestId('high-risk-confirm');
        expect(confirmButton).not.toBeDisabled();
    });

    it('calls onConfirm when form is submitted with all checks and justification', () => {
        const onConfirm = vi.fn();
        render(<HighRiskConfirmation {...defaultProps} onConfirm={onConfirm} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Add valid justification
        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        // Submit
        fireEvent.click(screen.getByTestId('high-risk-confirm'));
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(onConfirm).toHaveBeenCalledWith(justification);
    });

    it('does not call onConfirm when not all checks are completed', () => {
        const onConfirm = vi.fn();
        render(<HighRiskConfirmation {...defaultProps} onConfirm={onConfirm} />);

        // Only check first checkbox
        const checkboxes = screen.getAllByRole('checkbox');
        fireEvent.click(checkboxes[0]);

        // Try to submit
        fireEvent.click(screen.getByTestId('high-risk-confirm'));
        expect(onConfirm).not.toHaveBeenCalled();
    });

    it('calls onCancel when cancel button is clicked', () => {
        const onCancel = vi.fn();
        render(<HighRiskConfirmation {...defaultProps} onCancel={onCancel} />);

        fireEvent.click(screen.getByTestId('high-risk-cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });

    it('uses custom action label', () => {
        render(
            <HighRiskConfirmation {...defaultProps} actionLabel="Approve Closure" />
        );

        expect(screen.getByText('Approve Closure')).toBeInTheDocument();
    });

    it('shows loading state', () => {
        render(<HighRiskConfirmation {...defaultProps} isLoading={true} />);

        expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('disables buttons during loading', () => {
        render(<HighRiskConfirmation {...defaultProps} isLoading={true} />);

        expect(screen.getByTestId('high-risk-confirm')).toBeDisabled();
        expect(screen.getByTestId('high-risk-cancel')).toBeDisabled();
    });

    it('toggles checkbox state on click', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const checkboxes = screen.getAllByRole('checkbox');
        const firstCheckbox = checkboxes[0];

        expect(firstCheckbox).not.toBeChecked();

        fireEvent.click(firstCheckbox);
        expect(firstCheckbox).toBeChecked();

        fireEvent.click(firstCheckbox);
        expect(firstCheckbox).not.toBeChecked();
    });

    it('shows helper text when not all required items checked', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(
            screen.getByText(/Please check all required items/)
        ).toBeInTheDocument();
    });

    it('hides checkbox helper text when all required items checked', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // The checkbox helper text should be hidden
        expect(
            screen.queryByText(/Please check all required items/)
        ).not.toBeInTheDocument();
        // But justification helper should show
        expect(
            screen.getByText(/Justification must be at least/)
        ).toBeInTheDocument();
    });

    it('has correct role and aria attributes', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const dialog = screen.getByRole('alertdialog');
        expect(dialog).toHaveAttribute('aria-labelledby');
        expect(dialog).toHaveAttribute('aria-describedby');
    });

    it('has correct test id', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByTestId('high-risk-confirmation')).toBeInTheDocument();
    });

    // WF7 Enhancement Tests - 4th checkbox, justification textarea

    it('renders 4 checklist items including severity appropriate', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText(/reviewed all attached photos/)).toBeInTheDocument();
        expect(screen.getByText(/verified the GPS location/)).toBeInTheDocument();
        expect(screen.getByText(/close the trail/)).toBeInTheDocument();
        expect(screen.getByText(/Severity level is appropriate/)).toBeInTheDocument();

        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes).toHaveLength(4);
    });

    it('renders justification textarea', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        expect(textarea).toBeInTheDocument();
        expect(textarea).toHaveAttribute('required');
    });

    it('displays character count for justification', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        expect(screen.getByText(/0 \/ 50 characters/)).toBeInTheDocument();
    });

    it('updates character count as user types', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        fireEvent.change(textarea, { target: { value: 'Hello' } });

        expect(screen.getByText(/5 \/ 50 characters/)).toBeInTheDocument();
    });

    it('shows character count in green when minimum reached', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        const charCount = screen.getByText(new RegExp(`${justification.length} \\/ 50 characters`));
        expect(charCount).toHaveClass('text-green-400');
    });

    it('shows character count in gray when below minimum', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        fireEvent.change(textarea, { target: { value: 'Short text' } });

        const charCount = screen.getByText(/10 \/ 50 characters/);
        expect(charCount).toHaveClass('text-gray-400');
    });

    it('requires justification >= 50 characters for confirm button', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Confirm button should still be disabled without justification
        const confirmButton = screen.getByTestId('high-risk-confirm');
        expect(confirmButton).toBeDisabled();
    });

    it('enables confirm button when all checkboxes checked AND justification >= 50 chars', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Add valid justification
        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        const confirmButton = screen.getByTestId('high-risk-confirm');
        expect(confirmButton).not.toBeDisabled();
    });

    it('calls onConfirm with justification when form is submitted', () => {
        const onConfirm = vi.fn();
        render(<HighRiskConfirmation {...defaultProps} onConfirm={onConfirm} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Add valid justification
        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        // Submit
        fireEvent.click(screen.getByTestId('high-risk-confirm'));
        expect(onConfirm).toHaveBeenCalledWith(justification);
    });

    it('shows helper text when justification is too short', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        expect(
            screen.getByText(/Justification must be at least 50 characters/)
        ).toBeInTheDocument();
    });

    it('hides justification helper text when minimum reached', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        // Check all checkboxes
        const checkboxes = screen.getAllByRole('checkbox');
        checkboxes.forEach((checkbox) => {
            fireEvent.click(checkbox);
        });

        // Add valid justification
        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        const justification = 'This is a valid justification that exceeds fifty characters minimum.';
        fireEvent.change(textarea, { target: { value: justification } });

        expect(
            screen.queryByText(/Justification must be at least 50 characters/)
        ).not.toBeInTheDocument();
    });

    it('has justification textarea with aria-describedby for character count', () => {
        render(<HighRiskConfirmation {...defaultProps} />);

        const textarea = screen.getByPlaceholderText(/Enter mandatory justification/);
        expect(textarea).toHaveAttribute('aria-describedby');
    });
});

describe('isHighRiskReport', () => {
    it('returns true for safety_alert reports', () => {
        const report: HazardReport = {
            ...mockHighRiskReport,
            safety_alert: true,
        };

        expect(isHighRiskReport(report)).toBe(true);
    });

    it('returns true for SEV3 severity reports', () => {
        const report: HazardReport = {
            ...mockHighRiskReport,
            safety_alert: false,
            triage_result: {
                ...mockHighRiskReport.triage_result!,
                severity: 'SEV3',
            },
        };

        expect(isHighRiskReport(report)).toBe(true);
    });

    it('returns true for dangerous severity estimate', () => {
        const report: HazardReport = {
            ...mockHighRiskReport,
            safety_alert: false,
            severity_estimate: 'dangerous',
            triage_result: {
                ...mockHighRiskReport.triage_result!,
                severity: 'SEV2',
            },
        };

        expect(isHighRiskReport(report)).toBe(true);
    });

    it('returns false for non-high-risk reports', () => {
        const report: HazardReport = {
            id: 'RV-001',
            trail_name: 'Test Trail',
            location: { latitude: 46.85, longitude: -121.76 },
            hazard_type: 'obstruction',
            severity_estimate: 'passable',
            description: 'Small branch on trail',
            photos: [],
            reporter_type: 'anonymous',
            submitted_at: '2026-01-19T08:00:00Z',
            triage_result: {
                tracs_category: 'CLR',
                tracs_category_name: 'Clearing',
                severity: 'SEV1',
                severity_name: 'INFO_ONLY',
                confidence_score: 0.75,
                reasoning: 'Minor debris',
                confidence_factors: {
                    has_photo: false,
                    photo_matches_hazard: false,
                    gps_accurate: true,
                    description_specific: true,
                    reporter_trusted: false,
                    corroborating_reports: 0,
                },
                recommended_action: 'No action needed',
                similar_reports: [],
            },
        };

        expect(isHighRiskReport(report)).toBe(false);
    });

    it('returns false for reports without triage result', () => {
        const report: HazardReport = {
            id: 'RV-001',
            trail_name: 'Test Trail',
            location: { latitude: 46.85, longitude: -121.76 },
            hazard_type: 'obstruction',
            severity_estimate: 'passable',
            description: 'Small branch on trail',
            photos: [],
            reporter_type: 'anonymous',
            submitted_at: '2026-01-19T08:00:00Z',
        };

        expect(isHighRiskReport(report)).toBe(false);
    });
});
