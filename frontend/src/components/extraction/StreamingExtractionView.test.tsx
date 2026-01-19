import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { StreamingExtractionView } from './StreamingExtractionView';
import type { StreamingExtractionState } from '../../types/extraction';
import { INITIAL_STREAMING_STATE } from '../../types/extraction';

expect.extend(toHaveNoViolations);

function createState(overrides: Partial<StreamingExtractionState>): StreamingExtractionState {
    return {
        ...INITIAL_STREAMING_STATE,
        ...overrides,
    };
}

describe('StreamingExtractionView', () => {
    describe('connecting state', () => {
        it('shows connecting indicator', () => {
            const state = createState({ status: 'connecting', reportId: 'report-123' });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText(/connecting/i)).toBeInTheDocument();
        });

        it('shows spinner when connecting', () => {
            const state = createState({ status: 'connecting', reportId: 'report-123' });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByRole('status')).toBeInTheDocument();
        });
    });

    describe('extracting state', () => {
        it('shows progress stepper', () => {
            const state = createState({
                status: 'extracting',
                reportId: 'report-123',
                progress: 50,
                extractedFields: [
                    { field: 'tracs_category', value: 'CLR', displayValue: 'Clearing', extractedAt: new Date() },
                ],
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByRole('progressbar')).toBeInTheDocument();
        });

        it('displays extracted fields as they arrive', () => {
            const state = createState({
                status: 'extracting',
                reportId: 'report-123',
                extractedFields: [
                    { field: 'tracs_category', value: 'CLR', displayValue: 'Clearing', extractedAt: new Date() },
                    { field: 'severity', value: 'SEV_HIGH', displayValue: 'High', extractedAt: new Date() },
                ],
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText('Clearing')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
        });

        it('displays reasoning text with typewriter effect', () => {
            const state = createState({
                status: 'extracting',
                reportId: 'report-123',
                reasoningText: 'Analyzing the hazard description...',
                reasoningComplete: false,
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText(/Analyzing the hazard description/)).toBeInTheDocument();
        });
    });

    describe('complete state', () => {
        it('shows completion message', () => {
            const state = createState({
                status: 'complete',
                reportId: 'report-123',
                progress: 100,
                result: {
                    tracs_category: 'CLR',
                    tracs_category_name: 'Clearing',
                    severity: 'SEV_HIGH',
                    severity_name: 'High',
                    confidence: 0.85,
                    reasoning: 'Full analysis complete.',
                },
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText(/extraction complete/i)).toBeInTheDocument();
        });

        it('displays final result summary', () => {
            const state = createState({
                status: 'complete',
                result: {
                    tracs_category: 'CLR',
                    tracs_category_name: 'Clearing',
                    severity: 'SEV_HIGH',
                    severity_name: 'High',
                    confidence: 0.85,
                    reasoning: 'Full analysis complete.',
                },
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText('Clearing')).toBeInTheDocument();
            expect(screen.getByText('High')).toBeInTheDocument();
            expect(screen.getByText('85%')).toBeInTheDocument();
        });
    });

    describe('error state', () => {
        it('shows error message', () => {
            const state = createState({
                status: 'error',
                error: 'Connection failed. Please try again.',
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByText(/connection failed/i)).toBeInTheDocument();
        });

        it('shows retry button on error', () => {
            const state = createState({
                status: 'error',
                error: 'Connection failed.',
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
        });
    });

    describe('cancel functionality', () => {
        it('calls onCancel when cancel button is clicked', () => {
            const onCancel = vi.fn();
            const state = createState({
                status: 'extracting',
                reportId: 'report-123',
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={onCancel}
                    onReset={vi.fn()}
                />
            );

            const cancelButton = screen.getByRole('button', { name: /cancel/i });
            fireEvent.click(cancelButton);

            expect(onCancel).toHaveBeenCalledTimes(1);
        });
    });

    describe('accessibility', () => {
        it('passes axe accessibility audit', async () => {
            const state = createState({
                status: 'extracting',
                reportId: 'report-123',
                progress: 50,
                extractedFields: [
                    { field: 'tracs_category', value: 'CLR', displayValue: 'Clearing', extractedAt: new Date() },
                ],
            });

            const { container } = render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('has proper ARIA labels on progress bar', () => {
            const state = createState({
                status: 'extracting',
                progress: 60,
            });

            render(
                <StreamingExtractionView
                    state={state}
                    onCancel={vi.fn()}
                    onReset={vi.fn()}
                />
            );

            const progressBar = screen.getByRole('progressbar');
            expect(progressBar).toHaveAttribute('aria-valuenow', '60');
            expect(progressBar).toHaveAttribute('aria-valuemin', '0');
            expect(progressBar).toHaveAttribute('aria-valuemax', '100');
        });
    });
});
