import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AgenticReasoningPanel } from './AgenticReasoningPanel';
import type { TriageResult, ReasoningStep } from '../../types/report';

const mockTriageResult: TriageResult = {
    tracs_category: 'STR',
    tracs_category_name: 'Structures',
    severity: 'SEV3',
    severity_name: 'CLOSURE_RECOMMENDED',
    confidence_score: 0.97,
    reasoning: 'Multiple high-resolution photos confirm structural failure. GPS coordinates align with Eagle Creek footbridge. Immediate closure required.',
    confidence_factors: {
        has_photo: true,
        photo_matches_hazard: true,
        gps_accurate: true,
        description_specific: true,
        reporter_trusted: true,
        corroborating_reports: 2,
        weather_context: 'Heavy rain event',
    },
    recommended_action: 'IMMEDIATE: Close trail segment.',
    similar_reports: [],
};

describe('AgenticReasoningPanel', () => {
    it('renders panel header', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        expect(screen.getByText('AI Reasoning Chain')).toBeInTheDocument();
    });

    it('displays overall confidence score', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        expect(screen.getByText('97% confidence')).toBeInTheDocument();
    });

    it('shows completed steps count', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        expect(screen.getByText(/\/3 steps completed/)).toBeInTheDocument();
    });

    it('starts collapsed by default', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        expect(screen.queryByTestId('agentic-reasoning-content')).not.toBeInTheDocument();
    });

    it('starts expanded when defaultOpen is true', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} defaultOpen={true} />);

        expect(screen.getByTestId('agentic-reasoning-content')).toBeInTheDocument();
    });

    it('toggles content when header is clicked', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        // Initially collapsed
        expect(screen.queryByTestId('agentic-reasoning-content')).not.toBeInTheDocument();

        // Click to expand
        fireEvent.click(screen.getByTestId('agentic-reasoning-toggle'));
        expect(screen.getByTestId('agentic-reasoning-content')).toBeInTheDocument();

        // Click to collapse
        fireEvent.click(screen.getByTestId('agentic-reasoning-toggle'));
        expect(screen.queryByTestId('agentic-reasoning-content')).not.toBeInTheDocument();
    });

    it('renders all three reasoning steps when expanded', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} defaultOpen={true} />);

        expect(screen.getByTestId('reasoning-step-vision')).toBeInTheDocument();
        expect(screen.getByTestId('reasoning-step-spatial')).toBeInTheDocument();
        expect(screen.getByTestId('reasoning-step-policy')).toBeInTheDocument();
    });

    it('generates vision step based on photo availability', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} defaultOpen={true} />);

        expect(screen.getByText('Vision Analysis')).toBeInTheDocument();
        expect(screen.getByText(/hazard confirmed/i)).toBeInTheDocument();
    });

    it('marks vision step as skipped when no photo', () => {
        const noPhotoResult: TriageResult = {
            ...mockTriageResult,
            confidence_factors: {
                ...mockTriageResult.confidence_factors,
                has_photo: false,
            },
        };

        render(<AgenticReasoningPanel triageResult={noPhotoResult} defaultOpen={true} />);

        expect(screen.getByText(/No photo provided/)).toBeInTheDocument();
    });

    it('shows raw reasoning text in collapsed details', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} defaultOpen={true} />);

        // Click to expand raw reasoning
        fireEvent.click(screen.getByText('View raw reasoning text'));

        expect(screen.getByText(mockTriageResult.reasoning)).toBeInTheDocument();
    });

    it('uses explicit reasoning steps when provided', () => {
        const customSteps: ReasoningStep[] = [
            {
                type: 'vision',
                label: 'Custom Vision',
                status: 'complete',
                summary: 'Custom vision summary',
                confidence: 0.95,
            },
            {
                type: 'spatial',
                label: 'Custom Spatial',
                status: 'complete',
                summary: 'Custom spatial summary',
                confidence: 0.88,
            },
            {
                type: 'policy',
                label: 'Custom Policy',
                status: 'complete',
                summary: 'Custom policy summary',
                confidence: 0.92,
            },
        ];

        const resultWithSteps: TriageResult = {
            ...mockTriageResult,
            reasoning_steps: customSteps,
        };

        render(<AgenticReasoningPanel triageResult={resultWithSteps} defaultOpen={true} />);

        expect(screen.getByText('Custom vision summary')).toBeInTheDocument();
        expect(screen.getByText('Custom spatial summary')).toBeInTheDocument();
        expect(screen.getByText('Custom policy summary')).toBeInTheDocument();
    });

    it('applies correct confidence color - high', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        const confidenceBadge = screen.getByText('97% confidence');
        expect(confidenceBadge).toHaveClass('text-emerald-400');
    });

    it('applies correct confidence color - medium', () => {
        const mediumConfidenceResult: TriageResult = {
            ...mockTriageResult,
            confidence_score: 0.65,
        };

        render(<AgenticReasoningPanel triageResult={mediumConfidenceResult} />);

        const confidenceBadge = screen.getByText('65% confidence');
        expect(confidenceBadge).toHaveClass('text-yellow-400');
    });

    it('applies correct confidence color - low', () => {
        const lowConfidenceResult: TriageResult = {
            ...mockTriageResult,
            confidence_score: 0.45,
        };

        render(<AgenticReasoningPanel triageResult={lowConfidenceResult} />);

        const confidenceBadge = screen.getByText('45% confidence');
        expect(confidenceBadge).toHaveClass('text-red-400');
    });

    it('has correct test ids', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        expect(screen.getByTestId('agentic-reasoning-panel')).toBeInTheDocument();
        expect(screen.getByTestId('agentic-reasoning-toggle')).toBeInTheDocument();
    });

    it('sets aria-expanded correctly', () => {
        render(<AgenticReasoningPanel triageResult={mockTriageResult} />);

        const toggle = screen.getByTestId('agentic-reasoning-toggle');
        expect(toggle).toHaveAttribute('aria-expanded', 'false');

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
    });
});
