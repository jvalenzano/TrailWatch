import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ReasoningPanel, type ReasoningStep } from './ReasoningPanel';

const mockSteps: ReasoningStep[] = [
    {
        step: 'Visual Analysis',
        status: 'success',
        detail: 'Identified fallen tree > 12in diameter',
    },
    {
        step: 'Location Validation',
        status: 'success',
        detail: 'GPS coordinates match Wonderland Trail segment',
    },
    {
        step: 'Severity Assessment',
        status: 'warning',
        detail: 'Photo quality insufficient for precise measurement',
    },
    {
        step: 'Category Classification',
        status: 'info',
        detail: 'Classified as CLR (Clearing) based on obstruction type',
    },
];

describe('ReasoningPanel', () => {
    describe('rendering', () => {
        it('should render the panel container', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByTestId('reasoning-panel')).toBeInTheDocument();
        });

        it('should render all reasoning steps', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByText('Visual Analysis')).toBeInTheDocument();
            expect(screen.getByText('Location Validation')).toBeInTheDocument();
            expect(screen.getByText('Severity Assessment')).toBeInTheDocument();
            expect(screen.getByText('Category Classification')).toBeInTheDocument();
        });

        it('should render step details', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByText('Identified fallen tree > 12in diameter')).toBeInTheDocument();
            expect(screen.getByText('GPS coordinates match Wonderland Trail segment')).toBeInTheDocument();
        });

        it('should render overall confidence as percentage', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByText('89%')).toBeInTheDocument();
        });

        it('should render panel header', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByText('AI Reasoning Chain')).toBeInTheDocument();
        });
    });

    describe('status indicators', () => {
        it('should render success status with green indicator', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const successIndicators = screen.getAllByTestId('status-indicator-success');
            expect(successIndicators.length).toBe(2);
        });

        it('should render warning status with amber indicator', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const warningIndicators = screen.getAllByTestId('status-indicator-warning');
            expect(warningIndicators.length).toBe(1);
        });

        it('should render info status with blue indicator', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const infoIndicators = screen.getAllByTestId('status-indicator-info');
            expect(infoIndicators.length).toBe(1);
        });
    });

    describe('confidence display', () => {
        it('should display high confidence (>80%) with green styling', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const confidenceBadge = screen.getByTestId('confidence-badge');
            expect(confidenceBadge).toHaveClass('bg-emerald-500');
        });

        it('should display moderate confidence (50-79%) with amber styling', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.65} />);

            const confidenceBadge = screen.getByTestId('confidence-badge');
            expect(confidenceBadge).toHaveClass('bg-amber-500');
        });

        it('should display low confidence (<50%) with red styling', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.35} />);

            const confidenceBadge = screen.getByTestId('confidence-badge');
            expect(confidenceBadge).toHaveClass('bg-red-500');
        });

        it('should round confidence to nearest integer percentage', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.876} />);

            expect(screen.getByText('88%')).toBeInTheDocument();
        });
    });

    describe('empty state', () => {
        it('should render empty state message when no steps provided', () => {
            render(<ReasoningPanel steps={[]} overallConfidence={0} />);

            expect(screen.getByText('No reasoning steps available')).toBeInTheDocument();
        });

        it('should still show confidence even with no steps', () => {
            render(<ReasoningPanel steps={[]} overallConfidence={0.5} />);

            expect(screen.getByText('50%')).toBeInTheDocument();
        });
    });

    describe('accessibility', () => {
        it('should have accessible panel role', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByRole('region')).toHaveAttribute('aria-label', 'AI Reasoning Chain');
        });

        it('should have accessible list structure', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByRole('list')).toBeInTheDocument();
            expect(screen.getAllByRole('listitem')).toHaveLength(4);
        });

        it('should have sr-only status labels', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            // Check for screen reader text (use getAllByText since there are multiple success steps)
            expect(screen.getAllByText('Status: success').length).toBeGreaterThan(0);
            expect(screen.getByText('Status: warning')).toBeInTheDocument();
            expect(screen.getByText('Status: info')).toBeInTheDocument();
        });
    });

    describe('dark mode styling', () => {
        it('should have dark background styling', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const panel = screen.getByTestId('reasoning-panel');
            expect(panel).toHaveClass('bg-gray-800');
        });
    });

    // WF4 Enhancement Tests - Step numbering, tool names, classifications, audit log

    describe('step numbering', () => {
        it('should display step numbers (Step 1, Step 2, etc.)', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.getByText(/Step 1/)).toBeInTheDocument();
            expect(screen.getByText(/Step 2/)).toBeInTheDocument();
            expect(screen.getByText(/Step 3/)).toBeInTheDocument();
            expect(screen.getByText(/Step 4/)).toBeInTheDocument();
        });

        it('should style step numbers prominently', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            const stepNumber = screen.getByText(/Step 1/);
            expect(stepNumber).toHaveClass('font-bold');
        });
    });

    describe('tool names', () => {
        const stepsWithTools: ReasoningStep[] = [
            {
                step: 'Visual Analysis',
                status: 'success',
                detail: 'Identified fallen tree',
                toolName: 'ImageClassifier',
            },
            {
                step: 'Location Check',
                status: 'success',
                detail: 'GPS validated',
                toolName: 'GeoValidator',
            },
        ];

        it('should display tool name when provided', () => {
            render(<ReasoningPanel steps={stepsWithTools} overallConfidence={0.89} />);

            expect(screen.getByText(/ImageClassifier/)).toBeInTheDocument();
            expect(screen.getByText(/GeoValidator/)).toBeInTheDocument();
        });

        it('should display tool name with icon or badge styling', () => {
            render(<ReasoningPanel steps={stepsWithTools} overallConfidence={0.89} />);

            const toolBadge = screen.getByText(/ImageClassifier/);
            expect(toolBadge.closest('[data-testid="tool-badge"]')).toBeInTheDocument();
        });
    });

    describe('alternative classifications', () => {
        const classifications = {
            primary: { code: 'TRACS 245', confidence: 0.89 },
            alternatives: [
                { code: 'TRACS 242', confidence: 0.08 },
                { code: 'TRACS 248', confidence: 0.03 },
            ],
        };

        it('should display primary classification when provided', () => {
            render(
                <ReasoningPanel
                    steps={mockSteps}
                    overallConfidence={0.89}
                    classifications={classifications}
                />
            );

            expect(screen.getByText(/TRACS 245/)).toBeInTheDocument();
            // Use getAllByText since 89% appears in confidence badge and classification
            expect(screen.getAllByText(/89%/).length).toBeGreaterThanOrEqual(2);
        });

        it('should display alternative classifications', () => {
            render(
                <ReasoningPanel
                    steps={mockSteps}
                    overallConfidence={0.89}
                    classifications={classifications}
                />
            );

            expect(screen.getByText(/TRACS 242/)).toBeInTheDocument();
            expect(screen.getByText(/8%/)).toBeInTheDocument();
        });

        it('should label primary and alternative classifications', () => {
            render(
                <ReasoningPanel
                    steps={mockSteps}
                    overallConfidence={0.89}
                    classifications={classifications}
                />
            );

            expect(screen.getByText('Primary:')).toBeInTheDocument();
            // Multiple alternatives may be shown
            expect(screen.getAllByText('Alternative:').length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('audit log link', () => {
        it('should render "View Full Audit Log" link', () => {
            render(
                <ReasoningPanel
                    steps={mockSteps}
                    overallConfidence={0.89}
                    onViewAuditLog={() => {}}
                />
            );

            expect(screen.getByRole('button', { name: /View Full Audit Log/i })).toBeInTheDocument();
        });

        it('should call onViewAuditLog callback when clicked', () => {
            const mockHandler = vi.fn();
            render(
                <ReasoningPanel
                    steps={mockSteps}
                    overallConfidence={0.89}
                    onViewAuditLog={mockHandler}
                />
            );

            const link = screen.getByRole('button', { name: /View Full Audit Log/i });
            link.click();
            expect(mockHandler).toHaveBeenCalledTimes(1);
        });

        it('should not render audit log link when callback not provided', () => {
            render(<ReasoningPanel steps={mockSteps} overallConfidence={0.89} />);

            expect(screen.queryByRole('button', { name: /View Full Audit Log/i })).not.toBeInTheDocument();
        });
    });
});
