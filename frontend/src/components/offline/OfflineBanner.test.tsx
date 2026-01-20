import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { OfflineBanner } from './OfflineBanner';

expect.extend(toHaveNoViolations);

describe('OfflineBanner', () => {
    const defaultProps = {
        isOffline: true,
        lastSyncTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        pendingSyncCount: 3,
    };

    describe('rendering', () => {
        it('should render when offline', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByTestId('offline-banner')).toBeInTheDocument();
        });

        it('should not render when online', () => {
            render(<OfflineBanner {...defaultProps} isOffline={false} />);

            expect(screen.queryByTestId('offline-banner')).not.toBeInTheDocument();
        });

        it('should display "OFFLINE MODE" text', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByText('OFFLINE MODE')).toBeInTheDocument();
        });

        it('should display satellite icon', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByTestId('satellite-icon')).toBeInTheDocument();
        });
    });

    describe('last sync time', () => {
        it('should display relative time since last sync', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByText(/Last sync:/)).toBeInTheDocument();
            expect(screen.getByText(/2 hours ago/)).toBeInTheDocument();
        });

        it('should display minutes for recent sync', () => {
            const recentSync = new Date(Date.now() - 15 * 60 * 1000); // 15 minutes ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={recentSync} />);

            expect(screen.getByText(/15 minutes ago/)).toBeInTheDocument();
        });

        it('should display "just now" for very recent sync', () => {
            const justNow = new Date(Date.now() - 30 * 1000); // 30 seconds ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={justNow} />);

            expect(screen.getByText(/just now/)).toBeInTheDocument();
        });

        it('should display days for old sync', () => {
            const oldSync = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={oldSync} />);

            expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
        });

        it('should display singular "minute" for 1 minute ago', () => {
            const oneMinuteAgo = new Date(Date.now() - 1 * 60 * 1000); // 1 minute ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={oneMinuteAgo} />);

            expect(screen.getByText(/1 minute ago/)).toBeInTheDocument();
        });

        it('should display singular "hour" for 1 hour ago', () => {
            const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={oneHourAgo} />);

            expect(screen.getByText(/1 hour ago/)).toBeInTheDocument();
        });

        it('should display singular "day" for 1 day ago', () => {
            const oneDayAgo = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000); // 1 day ago
            render(<OfflineBanner {...defaultProps} lastSyncTime={oneDayAgo} />);

            expect(screen.getByText(/1 day ago/)).toBeInTheDocument();
        });
    });

    describe('data staleness warning', () => {
        it('should display staleness warning', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByText(/Data may be stale/)).toBeInTheDocument();
        });
    });

    describe('pending sync count', () => {
        it('should display pending sync count when greater than 0', () => {
            render(<OfflineBanner {...defaultProps} pendingSyncCount={5} />);

            expect(screen.getByText(/5 pending/)).toBeInTheDocument();
        });

        it('should not display pending count when 0', () => {
            render(<OfflineBanner {...defaultProps} pendingSyncCount={0} />);

            expect(screen.queryByText(/pending/)).not.toBeInTheDocument();
        });

        it('should display singular form for 1 pending item', () => {
            render(<OfflineBanner {...defaultProps} pendingSyncCount={1} />);

            expect(screen.getByText(/1 pending/)).toBeInTheDocument();
        });
    });

    describe('styling', () => {
        it('should have orange background', () => {
            render(<OfflineBanner {...defaultProps} />);

            const banner = screen.getByTestId('offline-banner');
            expect(banner).toHaveClass('bg-orange-500');
        });

        it('should have white text', () => {
            render(<OfflineBanner {...defaultProps} />);

            const banner = screen.getByTestId('offline-banner');
            expect(banner).toHaveClass('text-white');
        });
    });

    describe('animation', () => {
        it('should have transition classes for smooth animation', () => {
            render(<OfflineBanner {...defaultProps} />);

            const banner = screen.getByTestId('offline-banner');
            expect(banner).toHaveClass('transition-all');
        });
    });

    describe('accessibility', () => {
        it('should have accessible role', () => {
            render(<OfflineBanner {...defaultProps} />);

            expect(screen.getByRole('alert')).toBeInTheDocument();
        });

        it('should have aria-live for dynamic updates', () => {
            render(<OfflineBanner {...defaultProps} />);

            const banner = screen.getByTestId('offline-banner');
            expect(banner).toHaveAttribute('aria-live', 'polite');
        });

        it('should have no accessibility violations', async () => {
            const { container } = render(<OfflineBanner {...defaultProps} />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have descriptive aria-label', () => {
            render(<OfflineBanner {...defaultProps} />);

            const banner = screen.getByTestId('offline-banner');
            expect(banner).toHaveAttribute('aria-label', expect.stringContaining('offline'));
        });
    });
});
