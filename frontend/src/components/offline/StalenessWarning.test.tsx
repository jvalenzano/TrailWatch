import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { StalenessWarning } from './StalenessWarning';

expect.extend(toHaveNoViolations);

describe('StalenessWarning', () => {
    describe('rendering', () => {
        it('should render the warning component', () => {
            render(<StalenessWarning />);

            expect(screen.getByTestId('staleness-warning')).toBeInTheDocument();
        });

        it('should display "[OFFLINE - STALE]" text', () => {
            render(<StalenessWarning />);

            expect(screen.getByText('[OFFLINE - STALE]')).toBeInTheDocument();
        });

        it('should display explanatory text about data currency', () => {
            render(<StalenessWarning />);

            expect(screen.getByText(/data may not be current/i)).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have yellow/amber background', () => {
            render(<StalenessWarning />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveClass('bg-amber-100');
        });

        it('should have amber text color', () => {
            render(<StalenessWarning />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveClass('text-amber-800');
        });

        it('should be inline and compact', () => {
            render(<StalenessWarning />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveClass('inline-flex');
        });
    });

    describe('accessibility', () => {
        it('should have role="alert" for screen readers', () => {
            render(<StalenessWarning />);

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('should have aria-label describing the warning', () => {
            render(<StalenessWarning />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveAttribute('aria-label', 'Warning: Data may be stale due to offline status');
        });

        it('should have no accessibility violations', async () => {
            const { container } = render(<StalenessWarning />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });
    });

    describe('custom className', () => {
        it('should accept additional className', () => {
            render(<StalenessWarning className="ml-2" />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveClass('ml-2');
        });

        it('should preserve default classes when custom className is provided', () => {
            render(<StalenessWarning className="custom-class" />);

            const warning = screen.getByTestId('staleness-warning');
            expect(warning).toHaveClass('bg-amber-100');
            expect(warning).toHaveClass('custom-class');
        });
    });

    describe('custom message', () => {
        it('should allow overriding the explanatory message', () => {
            const customMessage = 'Custom staleness message';
            render(<StalenessWarning message={customMessage} />);

            expect(screen.getByText(customMessage)).toBeInTheDocument();
        });

        it('should still display the badge text with custom message', () => {
            render(<StalenessWarning message="Custom message" />);

            expect(screen.getByText('[OFFLINE - STALE]')).toBeInTheDocument();
        });
    });
});
