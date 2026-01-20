import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ReportDetail } from './ReportDetail';
import type { HazardReport } from '../types/report';
import type { StreamingExtractionState } from '../types/extraction';
import { INITIAL_STREAMING_STATE } from '../types/extraction';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { UIModeProvider } from '../contexts/UIModeContext';

expect.extend(toHaveNoViolations);

vi.mock('./CrewSelector', () => ({
    CrewSelector: () => <div data-testid="crew-selector">Crew Selector</div>
}));

vi.mock('./ReportActions', () => ({
    ReportActions: () => <div data-testid="report-actions">Report Actions</div>
}));

vi.mock('./extraction/StreamingExtractionView', () => ({
    StreamingExtractionView: ({ state }: { state: StreamingExtractionState }) => (
        <div data-testid="streaming-extraction-view">
            Streaming: {state.status}
        </div>
    ),
}));

const mockReport: HazardReport = {
    id: 'RPT-1234',
    location: { latitude: 37.5, longitude: -120.5 },
    hazard_type: 'clearing',
    severity_estimate: 'difficult',
    description: 'A large tree has fallen across the trail making it impassable.',
    photos: [],
    reporter_type: 'anonymous',
    submitted_at: '2026-01-01T00:00:00Z',
};

const mockReportWithTriageAndAssignment: HazardReport = {
    ...mockReport,
    triaged_at: '2026-01-01T08:16:00Z',
    triage_result: {
        confidence_score: 0.89,
        similar_reports: [{ id: 'RPT-1001' }, { id: 'RPT-1002' }, { id: 'RPT-1003' }, { id: 'RPT-1004' }],
    },
    assignment: {
        district_id: '7',
    },
    photos: ['https://example.com/photo1.jpg'],
};

// Helper to render with provider
function renderWithProvider(ui: React.ReactElement, mode: string = 'traditional') {
    return render(
        <MemoryRouter initialEntries={[`/?mode=${mode}`]}>
            <UIModeProvider>
                {ui}
            </UIModeProvider>
        </MemoryRouter>
    );
}

describe('ReportDetail', () => {
    it('should render report details', () => {
        const noop = () => { };
        renderWithProvider(
            <ReportDetail
                report={mockReport}
                onAssignCrew={noop}
                onExtract={noop}
                onMarkResolved={noop}
            />,
            'traditional'
        );
        expect(screen.getByText(/A large tree has fallen across/)).toBeInTheDocument();
        expect(screen.getByTestId('crew-selector')).toBeInTheDocument();
        expect(screen.getByTestId('report-actions')).toBeInTheDocument();
    });

    it('should display report ID in header', () => {
        const noop = () => { };
        renderWithProvider(
            <ReportDetail
                report={mockReport}
                onAssignCrew={noop}
                onExtract={noop}
                onMarkResolved={noop}
            />,
            'traditional'
        );
        expect(screen.getByText(/Report #RPT-1234/)).toBeInTheDocument();
    });

    describe('WF3 numbered section headers', () => {
        it('should render Section 2: AI CLASSIFICATION header', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('section-header-2')).toHaveTextContent('2. AI CLASSIFICATION');
        });

        it('should render Section 3: ASSIGNMENT header', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('section-header-3')).toHaveTextContent('3. ASSIGNMENT');
        });

        it('should render Section 4: ACTIONS header', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('section-header-4')).toHaveTextContent('4. ACTIONS');
        });

        it('should render Section 1: PHOTO SECTION when photos exist', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReportWithTriageAndAssignment}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('section-header-1')).toHaveTextContent('1. PHOTO SECTION');
        });

        it('should not render Section 1 when no photos', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.queryByTestId('section-header-1')).not.toBeInTheDocument();
        });
    });

    describe('WF3 classification timestamp', () => {
        it('should display classification time when triaged_at is provided', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReportWithTriageAndAssignment}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('classification-timestamp')).toBeInTheDocument();
            expect(screen.getByTestId('classification-timestamp')).toHaveTextContent(/Classified:/);
        });

        it('should not display classification time when triaged_at is missing', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.queryByTestId('classification-timestamp')).not.toBeInTheDocument();
        });
    });

    describe('WF3 assignment reasoning', () => {
        it('should display assignment reasoning when similar reports and district exist', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReportWithTriageAndAssignment}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('assignment-reasoning')).toBeInTheDocument();
            expect(screen.getByTestId('assignment-reasoning')).toHaveTextContent(/Based on 4 similar reports in District 7/);
        });

        it('should not display assignment reasoning when no similar reports or district', () => {
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.queryByTestId('assignment-reasoning')).not.toBeInTheDocument();
        });

        it('should display reasoning with just similar reports', () => {
            const reportWithSimilar: HazardReport = {
                ...mockReport,
                triage_result: {
                    confidence_score: 0.8,
                    similar_reports: [{ id: 'RPT-1001' }],
                },
            };
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={reportWithSimilar}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('assignment-reasoning')).toHaveTextContent(/Based on 1 similar report in the area/);
        });

        it('should display reasoning with just district', () => {
            const reportWithDistrict: HazardReport = {
                ...mockReport,
                assignment: {
                    district_id: '5',
                },
            };
            const noop = () => { };
            renderWithProvider(
                <ReportDetail
                    report={reportWithDistrict}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            expect(screen.getByTestId('assignment-reasoning')).toHaveTextContent(/Assigned to District 5/);
        });
    });

    describe('streaming extraction', () => {
        it('shows StreamingExtractionView when streaming is active', () => {
            const extractionState: StreamingExtractionState = {
                ...INITIAL_STREAMING_STATE,
                status: 'extracting',
                reportId: '1',
            };

            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={vi.fn()}
                    onExtract={vi.fn()}
                    onMarkResolved={vi.fn()}
                    extractionState={extractionState}
                    onStartStreamingExtraction={vi.fn()}
                    onCancelStreamingExtraction={vi.fn()}
                    onResetStreamingExtraction={vi.fn()}
                />,
                'agentic'
            );

            expect(screen.getByTestId('streaming-extraction-view')).toBeInTheDocument();
        });

        it('shows Start AI Extraction button when streaming is idle', () => {
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={vi.fn()}
                    onExtract={vi.fn()}
                    onMarkResolved={vi.fn()}
                    extractionState={INITIAL_STREAMING_STATE}
                    onStartStreamingExtraction={vi.fn()}
                    onCancelStreamingExtraction={vi.fn()}
                    onResetStreamingExtraction={vi.fn()}
                />,
                'agentic'
            );

            expect(screen.getByTestId('start-streaming-extraction')).toBeInTheDocument();
        });

        it('calls onStartStreamingExtraction when button is clicked', () => {
            const onStartStreamingExtraction = vi.fn();

            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={vi.fn()}
                    onExtract={vi.fn()}
                    onMarkResolved={vi.fn()}
                    extractionState={INITIAL_STREAMING_STATE}
                    onStartStreamingExtraction={onStartStreamingExtraction}
                    onCancelStreamingExtraction={vi.fn()}
                    onResetStreamingExtraction={vi.fn()}
                />,
                'agentic'
            );

            fireEvent.click(screen.getByTestId('start-streaming-extraction'));

            expect(onStartStreamingExtraction).toHaveBeenCalledWith('RPT-1234');
        });

        it('falls back to ExtractionDisplay when streaming is disabled', () => {
            renderWithProvider(
                <ReportDetail
                    report={mockReport}
                    onAssignCrew={vi.fn()}
                    onExtract={vi.fn()}
                    onMarkResolved={vi.fn()}
                />,
                'traditional'
            );

            // Should not show streaming button in traditional mode
            expect(screen.queryByTestId('start-streaming-extraction')).not.toBeInTheDocument();
            expect(screen.queryByTestId('streaming-extraction-view')).not.toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have no accessibility violations', async () => {
            const noop = () => { };
            const { container } = renderWithProvider(
                <ReportDetail
                    report={mockReportWithTriageAndAssignment}
                    onAssignCrew={noop}
                    onExtract={noop}
                    onMarkResolved={noop}
                />,
                'traditional'
            );
            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });
});
