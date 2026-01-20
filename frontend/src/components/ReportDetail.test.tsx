import { render, screen, fireEvent } from '@testing-library/react';
import { ReportDetail } from './ReportDetail';
import type { HazardReport } from '../types/report';
import type { StreamingExtractionState } from '../types/extraction';
import { INITIAL_STREAMING_STATE } from '../types/extraction';
import { vi, describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { UIModeProvider } from '../contexts/UIModeContext';

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
    id: '1',
    location: { latitude: 0, longitude: 0 },
    hazard_type: 'clearing',
    severity_estimate: 'difficult',
    description: 'A large tree has fallen across the trail making it impassable.',
    photos: [],
    reporter_type: 'anonymous',
    submitted_at: '2026-01-01T00:00:00Z',
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

            expect(onStartStreamingExtraction).toHaveBeenCalledWith('1');
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
});
