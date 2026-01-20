import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReasoningStepItem } from './ReasoningStepItem';
import type { ReasoningStep } from '../../types/report';

describe('ReasoningStepItem', () => {
    const baseStep: ReasoningStep = {
        type: 'vision',
        label: 'Vision Analysis',
        status: 'complete',
        summary: 'Photo analyzed - hazard confirmed',
    };

    it('renders step icon and summary', () => {
        render(<ReasoningStepItem step={baseStep} />);

        expect(screen.getByText('Vision Analysis')).toBeInTheDocument();
        expect(screen.getByText('Photo analyzed - hazard confirmed')).toBeInTheDocument();
    });

    it('renders confidence badge when provided', () => {
        const stepWithConfidence: ReasoningStep = {
            ...baseStep,
            confidence: 0.85,
        };

        render(<ReasoningStepItem step={stepWithConfidence} />);

        expect(screen.getByText('85%')).toBeInTheDocument();
    });

    it('applies correct color for high confidence', () => {
        const stepWithHighConfidence: ReasoningStep = {
            ...baseStep,
            confidence: 0.9,
        };

        render(<ReasoningStepItem step={stepWithHighConfidence} />);

        const badge = screen.getByText('90%');
        expect(badge).toHaveClass('text-emerald-400');
    });

    it('applies correct color for medium confidence', () => {
        const stepWithMediumConfidence: ReasoningStep = {
            ...baseStep,
            confidence: 0.65,
        };

        render(<ReasoningStepItem step={stepWithMediumConfidence} />);

        const badge = screen.getByText('65%');
        expect(badge).toHaveClass('text-yellow-400');
    });

    it('applies correct color for low confidence', () => {
        const stepWithLowConfidence: ReasoningStep = {
            ...baseStep,
            confidence: 0.4,
        };

        render(<ReasoningStepItem step={stepWithLowConfidence} />);

        const badge = screen.getByText('40%');
        expect(badge).toHaveClass('text-red-400');
    });

    it('does not render confidence badge when not provided', () => {
        render(<ReasoningStepItem step={baseStep} />);

        expect(screen.queryByText(/%/)).not.toBeInTheDocument();
    });

    it('shows expand button when details are provided', () => {
        const stepWithDetails: ReasoningStep = {
            ...baseStep,
            details: ['Detail 1', 'Detail 2'],
        };

        render(<ReasoningStepItem step={stepWithDetails} />);

        expect(screen.getByText('Show details')).toBeInTheDocument();
    });

    it('does not show expand button when no details', () => {
        render(<ReasoningStepItem step={baseStep} />);

        expect(screen.queryByText('Show details')).not.toBeInTheDocument();
    });

    it('expands to show details when clicked', () => {
        const stepWithDetails: ReasoningStep = {
            ...baseStep,
            details: ['Detail 1', 'Detail 2'],
        };

        render(<ReasoningStepItem step={stepWithDetails} />);

        fireEvent.click(screen.getByText('Show details'));

        expect(screen.getByText('Hide details')).toBeInTheDocument();
        expect(screen.getByText('Detail 1')).toBeInTheDocument();
        expect(screen.getByText('Detail 2')).toBeInTheDocument();
    });

    it('collapses details when clicked again', () => {
        const stepWithDetails: ReasoningStep = {
            ...baseStep,
            details: ['Detail 1', 'Detail 2'],
        };

        render(<ReasoningStepItem step={stepWithDetails} />);

        // Expand
        fireEvent.click(screen.getByText('Show details'));
        expect(screen.getByText('Detail 1')).toBeInTheDocument();

        // Collapse
        fireEvent.click(screen.getByText('Hide details'));
        expect(screen.queryByText('Detail 1')).not.toBeInTheDocument();
    });

    it('renders different step types correctly', () => {
        const spatialStep: ReasoningStep = {
            ...baseStep,
            type: 'spatial',
            label: 'Spatial Validation',
        };

        const { rerender } = render(<ReasoningStepItem step={spatialStep} />);
        expect(screen.getByText('Spatial Validation')).toBeInTheDocument();

        const policyStep: ReasoningStep = {
            ...baseStep,
            type: 'policy',
            label: 'Policy Check',
        };

        rerender(<ReasoningStepItem step={policyStep} />);
        expect(screen.getByText('Policy Check')).toBeInTheDocument();
    });

    it('renders skipped status correctly', () => {
        const skippedStep: ReasoningStep = {
            ...baseStep,
            status: 'skipped',
        };

        render(<ReasoningStepItem step={skippedStep} />);

        expect(screen.getByTestId('reasoning-step-vision')).toBeInTheDocument();
    });

    it('renders processing status with animation', () => {
        const processingStep: ReasoningStep = {
            ...baseStep,
            status: 'processing',
        };

        const { container } = render(<ReasoningStepItem step={processingStep} />);

        // Check for animate-pulse class on status indicator
        const statusIndicator = container.querySelector('.animate-pulse');
        expect(statusIndicator).toBeInTheDocument();
    });

    it('has correct test id', () => {
        render(<ReasoningStepItem step={baseStep} />);

        expect(screen.getByTestId('reasoning-step-vision')).toBeInTheDocument();
    });

    it('does not render connector line when isLast is true', () => {
        const { container } = render(<ReasoningStepItem step={baseStep} isLast={true} />);

        // The connector line div should not exist when isLast is true
        const connectorLine = container.querySelector('.absolute.left-4.top-10');
        expect(connectorLine).not.toBeInTheDocument();
    });

    it('renders connector line when isLast is false', () => {
        const { container } = render(<ReasoningStepItem step={baseStep} isLast={false} />);

        const connectorLine = container.querySelector('.absolute.left-4.top-10');
        expect(connectorLine).toBeInTheDocument();
    });
});
