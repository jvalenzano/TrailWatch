import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ExtractionDisplay } from './ExtractionDisplay';
import { useUIMode } from '../../hooks/useUIMode';
import { axe, toHaveNoViolations } from 'jest-axe';
import { trackEvent } from '../../utils/analytics';
import type { HazardReport } from '../../types/report';

expect.extend(toHaveNoViolations);

// Mock the hook and analytics
vi.mock('../../hooks/useUIMode', () => ({
    useUIMode: vi.fn(),
}));

vi.mock('../../utils/analytics', () => ({
    trackEvent: vi.fn(),
    ANALYTICS_EVENTS: {
        REASONING_PANEL_EXPANDED: 'reasoning_panel_expanded',
    },
}));

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
    },
};

describe('ExtractionDisplay', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders confidence and reasoning in moderate mode', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: {
                    enable_confidence_indicators: true,
                    enable_reasoning_panel: true,
                }
            }
        } as any);

        render(<ExtractionDisplay report={mockReport} />);

        expect(screen.getByText(/AI Transparency Layer/i)).toBeInTheDocument();
        expect(screen.getByText(/High Confidence/i)).toBeInTheDocument();
        expect(screen.getByText(/Why did AI classify this/i)).toBeInTheDocument();
    });

    it('hides confidence and reasoning in traditional mode', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: {
                    enable_confidence_indicators: false,
                    enable_reasoning_panel: false,
                }
            }
        } as any);

        const { container } = render(<ExtractionDisplay report={mockReport} />);

        expect(screen.queryByText(/High Confidence/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/Why did AI classify this/i)).not.toBeInTheDocument();
    });

    it('triggers telemetry on panel expansion (hover)', () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: {
                    enable_confidence_indicators: true,
                    enable_reasoning_panel: true,
                }
            }
        } as any);

        render(<ExtractionDisplay report={mockReport} />);

        const panel = screen.getByText(/Why did AI classify this/i).closest('div');
        if (panel) fireEvent.mouseEnter(panel);

        expect(trackEvent).toHaveBeenCalledWith('reasoning_panel_expanded', {
            reportId: '123',
            confidence_score: 0.85,
        });
    });

    it('passes accessibility audit', async () => {
        vi.mocked(useUIMode).mockReturnValue({
            mode: {
                features: {
                    enable_confidence_indicators: true,
                    enable_reasoning_panel: true,
                }
            }
        } as any);

        const { container } = render(<ExtractionDisplay report={mockReport} />);

        const results = await axe(container);
        expect(results).toHaveNoViolations();
    });
});
