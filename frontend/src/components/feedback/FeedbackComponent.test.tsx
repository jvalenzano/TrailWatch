import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FeedbackComponent } from './FeedbackComponent';
import { UIModeProvider } from '../../contexts/UIModeContext';
import { auditLog } from '../../services/auditLog';
import { FEEDBACK_STORAGE_KEY } from '../../types/feedback';

// Mock sessionStorage
const mockSessionStorage: Record<string, string> = {};
const sessionStorageMock = {
    getItem: vi.fn((key: string) => mockSessionStorage[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
        mockSessionStorage[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
        delete mockSessionStorage[key];
    }),
    clear: vi.fn(() => {
        Object.keys(mockSessionStorage).forEach((key) => delete mockSessionStorage[key]);
    }),
};

Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
});

// Helper to render with providers
function renderWithProviders(ui: React.ReactElement) {
    return render(
        <MemoryRouter initialEntries={['/?mode=moderate']}>
            <UIModeProvider>{ui}</UIModeProvider>
        </MemoryRouter>
    );
}

describe('FeedbackComponent', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorageMock.clear();
        auditLog.clearLogs();
    });

    describe('rendering', () => {
        it('renders thumbs up and down buttons', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            expect(screen.getByTestId('feedback-positive')).toBeInTheDocument();
            expect(screen.getByTestId('feedback-negative')).toBeInTheDocument();
        });

        it('shows "Was this helpful?" text in non-compact mode', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            expect(screen.getByText('Was this helpful?')).toBeInTheDocument();
        });

        it('hides helper text in compact mode', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                    compact
                />
            );

            expect(screen.queryByText('Was this helpful?')).not.toBeInTheDocument();
        });

        it('has correct aria labels', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            expect(screen.getByLabelText('Mark AI prediction as correct')).toBeInTheDocument();
            expect(screen.getByLabelText('Mark AI prediction as incorrect')).toBeInTheDocument();
        });
    });

    describe('positive feedback (thumbs up)', () => {
        it('submits feedback immediately on thumbs up click', async () => {
            const onSubmit = vi.fn();

            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                    onSubmit={onSubmit}
                />
            );

            fireEvent.click(screen.getByTestId('feedback-positive'));

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        targetId: 'report-1',
                        targetType: 'confidence',
                        rating: 'positive',
                    })
                );
            });
        });

        it('shows success state after positive feedback', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-positive'));

            await waitFor(() => {
                expect(screen.getByTestId('feedback-submitted')).toBeInTheDocument();
                expect(screen.getByText('Thanks!')).toBeInTheDocument();
            });
        });

        it('logs to audit service on positive feedback', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-positive'));

            await waitFor(() => {
                const logs = auditLog.getLogsByType('feedback_submitted');
                expect(logs).toHaveLength(1);
                expect(logs[0].payload).toMatchObject({
                    targetId: 'report-1',
                    targetType: 'confidence',
                    rating: 'positive',
                });
            });
        });
    });

    describe('negative feedback (thumbs down)', () => {
        it('opens feedback form on thumbs down click', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-negative'));

            await waitFor(() => {
                expect(screen.getByText('Help us improve')).toBeInTheDocument();
                expect(screen.getByLabelText(/What should the result have been/)).toBeInTheDocument();
            });
        });

        it('shows AI output in the form', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence (87%)"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-negative'));

            await waitFor(() => {
                expect(screen.getByText('High Confidence (87%)')).toBeInTheDocument();
            });
        });

        it('submits feedback with correction text', async () => {
            const onSubmit = vi.fn();

            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                    onSubmit={onSubmit}
                />
            );

            // Open form
            fireEvent.click(screen.getByTestId('feedback-negative'));

            // Type correction
            const textarea = screen.getByLabelText(/What should the result have been/);
            fireEvent.change(textarea, { target: { value: 'Should be low confidence' } });

            // Submit
            fireEvent.click(screen.getByLabelText('Submit feedback'));

            await waitFor(() => {
                expect(onSubmit).toHaveBeenCalledWith(
                    expect.objectContaining({
                        targetId: 'report-1',
                        targetType: 'confidence',
                        rating: 'negative',
                        correctionText: 'Should be low confidence',
                    })
                );
            });
        });

        it('closes form on cancel', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            // Open form
            fireEvent.click(screen.getByTestId('feedback-negative'));
            expect(screen.getByText('Help us improve')).toBeInTheDocument();

            // Cancel
            fireEvent.click(screen.getByLabelText('Cancel feedback'));

            await waitFor(() => {
                expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
            });
        });

        it('closes form on Escape key', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            // Open form
            fireEvent.click(screen.getByTestId('feedback-negative'));
            expect(screen.getByText('Help us improve')).toBeInTheDocument();

            // Press Escape
            const textarea = screen.getByLabelText(/What should the result have been/);
            fireEvent.keyDown(textarea, { key: 'Escape' });

            await waitFor(() => {
                expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
            });
        });

        it('logs to audit service on negative feedback submission', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="cluster"
                    aiOutput="3 related reports"
                />
            );

            // Open form and submit
            fireEvent.click(screen.getByTestId('feedback-negative'));
            const textarea = screen.getByLabelText(/What should the result have been/);
            fireEvent.change(textarea, { target: { value: 'These reports are not related' } });
            fireEvent.click(screen.getByLabelText('Submit feedback'));

            await waitFor(() => {
                const logs = auditLog.getLogsByType('feedback_submitted');
                expect(logs).toHaveLength(1);
                expect(logs[0].payload).toMatchObject({
                    targetId: 'report-1',
                    targetType: 'cluster',
                    rating: 'negative',
                    correctionText: 'These reports are not related',
                });
            });
        });

        it('shows success state after negative feedback submission', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            // Open form and submit
            fireEvent.click(screen.getByTestId('feedback-negative'));
            const textarea = screen.getByLabelText(/What should the result have been/);
            fireEvent.change(textarea, { target: { value: 'Wrong!' } });
            fireEvent.click(screen.getByLabelText('Submit feedback'));

            await waitFor(() => {
                expect(screen.getByTestId('feedback-submitted')).toBeInTheDocument();
                expect(screen.getByText('Feedback sent')).toBeInTheDocument();
            });
        });
    });

    describe('disabled state', () => {
        it('disables buttons when disabled prop is true', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                    disabled
                />
            );

            expect(screen.getByTestId('feedback-positive')).toBeDisabled();
            expect(screen.getByTestId('feedback-negative')).toBeDisabled();
        });

        it('does not open form when disabled', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                    disabled
                />
            );

            fireEvent.click(screen.getByTestId('feedback-negative'));

            expect(screen.queryByText('Help us improve')).not.toBeInTheDocument();
        });
    });

    describe('persistence', () => {
        it('persists feedback state to sessionStorage', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-positive'));

            await waitFor(() => {
                expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
                    FEEDBACK_STORAGE_KEY,
                    expect.any(String)
                );
            });

            const stored = sessionStorageMock.getItem(FEEDBACK_STORAGE_KEY);
            const parsed = JSON.parse(stored as string);
            expect(parsed['report-1']).toMatchObject({
                submitted: true,
                rating: 'positive',
            });
        });

        it('shows submitted state if feedback already exists', () => {
            // Pre-populate storage
            mockSessionStorage[FEEDBACK_STORAGE_KEY] = JSON.stringify({
                'report-1': {
                    submitted: true,
                    rating: 'positive',
                    submittedAt: '2026-01-01T00:00:00Z',
                },
            });

            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            expect(screen.getByTestId('feedback-submitted')).toBeInTheDocument();
        });
    });

    describe('form validation', () => {
        it('disables submit button when textarea is empty', () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-negative'));

            const submitButton = screen.getByLabelText('Submit feedback');
            expect(submitButton).toBeDisabled();
        });

        it('enables submit button when textarea has content', async () => {
            renderWithProviders(
                <FeedbackComponent
                    targetId="report-1"
                    targetType="confidence"
                    aiOutput="High Confidence"
                />
            );

            fireEvent.click(screen.getByTestId('feedback-negative'));

            const textarea = screen.getByLabelText(/What should the result have been/);
            fireEvent.change(textarea, { target: { value: 'Some correction' } });

            const submitButton = screen.getByLabelText('Submit feedback');
            expect(submitButton).not.toBeDisabled();
        });
    });
});

describe('FeedbackForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        sessionStorageMock.clear();
    });

    it('focuses textarea on mount', () => {
        renderWithProviders(
            <FeedbackComponent
                targetId="report-1"
                targetType="confidence"
                aiOutput="High Confidence"
            />
        );

        fireEvent.click(screen.getByTestId('feedback-negative'));

        const textarea = screen.getByLabelText(/What should the result have been/);
        expect(document.activeElement).toBe(textarea);
    });

    it('submits on Ctrl+Enter', async () => {
        const onSubmit = vi.fn();

        renderWithProviders(
            <FeedbackComponent
                targetId="report-1"
                targetType="confidence"
                aiOutput="High Confidence"
                onSubmit={onSubmit}
            />
        );

        fireEvent.click(screen.getByTestId('feedback-negative'));

        const textarea = screen.getByLabelText(/What should the result have been/);
        fireEvent.change(textarea, { target: { value: 'My correction' } });

        // Simulate Ctrl+Enter
        fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });
});
