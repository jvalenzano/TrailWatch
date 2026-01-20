import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExtractionDisplay } from './ExtractionDisplay';
import { UIModeProvider } from '../../contexts/UIModeContext';
import { axe, toHaveNoViolations } from 'jest-axe';
import { trackEvent } from '../../utils/analytics';
import type { HazardReport } from '../../types/report';
import type { UIFeatures } from '../../config/ui-modes';

expect.extend(toHaveNoViolations);

// Mock analytics
vi.mock('../../utils/analytics', () => ({
    trackEvent: vi.fn(),
    ANALYTICS_EVENTS: {
        REASONING_PANEL_EXPANDED: 'reasoning_panel_expanded',
    },
}));

// Helper to render with provider
function renderWithProvider(
    ui: React.ReactElement,
    options: {
        mode?: string;
        initialOverrides?: Partial<UIFeatures>;
    } = {}
) {
    const { mode = 'traditional', initialOverrides } = options;
    return render(
        <MemoryRouter initialEntries={[`/?mode=${mode}`]}>
            <UIModeProvider initialOverrides={initialOverrides}>
                {ui}
            </UIModeProvider>
        </MemoryRouter>
    );
}

const mockReport: HazardReport = {
    id: '123',
    location: { latitude: 0, longitude: 0 },
    hazard_type: 'clearing',
    severity_estimate: 'difficult',
    description: 'Test report',
    photos: [],
    reporter_type: 'anonymous',
    submitted_at: new Date().toISOString(),
    triage_result: {
        tracs_category: 'CLR',
        tracs_category_name: 'Clearing',
        severity: 'SEV2',
        severity_name: 'MAINTENANCE_NEEDED',
        confidence_score: 0.85,
        confidence_factors: {
            has_photo: true,
            photo_matches_hazard: true,
            gps_accurate: true,
            description_specific: true,
            reporter_trusted: false,
            corroborating_reports: 0,
        },
        reasoning: 'Extracted based on keywords.',
        recommended_action: 'Clear it.',
        similar_reports: [],
    },
};

describe('ExtractionDisplay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders confidence and reasoning in moderate mode', () => {
        renderWithProvider(<ExtractionDisplay report={mockReport} />, {
            mode: 'moderate',
        });

        expect(screen.getByText(/AI Transparency Layer/i)).toBeInTheDocument();
        expect(screen.getByText(/High Confidence/i)).toBeInTheDocument();
        expect(screen.getByText(/Why did AI classify this/i)).toBeInTheDocument();
    });

    it('hides confidence and reasoning in traditional mode', () => {
        renderWithProvider(<ExtractionDisplay report={mockReport} />, {
            mode: 'traditional',
        });

        expect(screen.queryByText(/High Confidence/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Why did AI classify this/i)).not.toBeInTheDocument();
    });

    it('triggers telemetry on panel expansion (hover)', () => {
        renderWithProvider(<ExtractionDisplay report={mockReport} />, {
            mode: 'moderate',
        });

        const panel = screen.getByText(/Why did AI classify this/i).closest('div');
        if (panel) fireEvent.mouseEnter(panel);

        expect(trackEvent).toHaveBeenCalledWith('reasoning_panel_expanded', {
            reportId: '123',
            confidence_score: 0.85,
        });
    });

    it('passes accessibility audit', async () => {
        const { container } = renderWithProvider(
            <ExtractionDisplay report={mockReport} />,
            { mode: 'moderate' }
        );

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
