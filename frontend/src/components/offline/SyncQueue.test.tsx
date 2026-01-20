import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SyncQueue } from './SyncQueue';
import type { PendingSyncItem } from '../../hooks/useOfflineStatus';

expect.extend(toHaveNoViolations);

// Mock useOfflineStatus hook
const mockTriggerSync = vi.fn();
const mockUseOfflineStatus = vi.fn();

vi.mock('../../hooks/useOfflineStatus', () => ({
    useOfflineStatus: () => mockUseOfflineStatus(),
}));

describe('SyncQueue', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default mock state
        mockUseOfflineStatus.mockReturnValue({
            isOffline: false,
            isOnline: true,
            pendingItems: [],
            pendingSyncCount: 0,
            isSyncing: false,
            triggerSync: mockTriggerSync,
            lastSyncTime: new Date(),
            addPendingItem: vi.fn(),
        });
    });

    describe('rendering', () => {
        it('should render the component', () => {
            render(<SyncQueue />);

            expect(screen.getByTestId('sync-queue')).toBeInTheDocument();
        });

        it('should display "Sync Queue" heading', () => {
            render(<SyncQueue />);

            expect(screen.getByRole('heading', { name: /sync queue/i })).toBeInTheDocument();
        });

        it('should show empty state when no pending items', () => {
            render(<SyncQueue />);

            expect(screen.getByText(/no pending items/i)).toBeInTheDocument();
        });

        it('should display pending items count', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
                { type: 'report_update', id: '2' },
                { type: 'insight_action', id: '3' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 3,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByText(/3 pending items/i)).toBeInTheDocument();
        });
    });

    describe('pending items list', () => {
        it('should display list of pending items', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: 'abc123' },
                { type: 'report_update', id: 'def456' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 2,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByTestId('sync-queue-list')).toBeInTheDocument();
        });

        it('should show item type for each item', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: 'abc123' },
                { type: 'report_update', id: 'def456' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 2,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByText(/report_create/i)).toBeInTheDocument();
            expect(screen.getByText(/report_update/i)).toBeInTheDocument();
        });

        it('should show item ID for each item', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: 'abc123' },
                { type: 'report_update', id: 'def456' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 2,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByText(/abc123/i)).toBeInTheDocument();
            expect(screen.getByText(/def456/i)).toBeInTheDocument();
        });

        it('should show item title if available', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: 'abc123', title: 'Trail Damage Report' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByText(/trail damage report/i)).toBeInTheDocument();
        });
    });

    describe('sync button', () => {
        it('should display "Sync Now" button', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByRole('button', { name: /sync now/i })).toBeInTheDocument();
        });

        it('should call triggerSync when clicked', async () => {
            mockTriggerSync.mockResolvedValue(true);
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            fireEvent.click(button);

            expect(mockTriggerSync).toHaveBeenCalledTimes(1);
        });

        it('should be disabled when syncing', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: true,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /syncing/i });
            expect(button).toBeDisabled();
        });

        it('should be disabled when offline', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: true,
                isOnline: false,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            expect(button).toBeDisabled();
        });

        it('should be enabled when online and not syncing', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            expect(button).toBeEnabled();
        });

        it('should not show sync button when queue is empty', () => {
            render(<SyncQueue />);

            expect(screen.queryByRole('button', { name: /sync now/i })).not.toBeInTheDocument();
        });
    });

    describe('progress indicator', () => {
        it('should display progress indicator when syncing', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: true,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByTestId('sync-progress')).toBeInTheDocument();
        });

        it('should hide progress indicator when not syncing', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.queryByTestId('sync-progress')).not.toBeInTheDocument();
        });

        it('should show loading state text', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: true,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const progress = screen.getByTestId('sync-progress');
            expect(progress).toHaveTextContent(/syncing/i);
        });
    });

    describe('sync failure handling', () => {
        it('should handle sync failure gracefully', async () => {
            mockTriggerSync.mockResolvedValue(false);
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText(/sync failed/i)).toBeInTheDocument();
            });
        });

        it('should display error message on sync exception', async () => {
            mockTriggerSync.mockRejectedValue(new Error('Network error'));
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByRole('alert')).toHaveTextContent(/network error/i);
            });
        });

        it('should clear error on successful sync', async () => {
            // First, trigger a failure
            mockTriggerSync.mockResolvedValueOnce(false);
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.getByText(/sync failed/i)).toBeInTheDocument();
            });

            // Now trigger success
            mockTriggerSync.mockResolvedValueOnce(true);
            fireEvent.click(button);

            await waitFor(() => {
                expect(screen.queryByText(/sync failed/i)).not.toBeInTheDocument();
            });
        });
    });

    describe('accessibility', () => {
        it('should have no accessibility violations', async () => {
            const { container } = render(<SyncQueue />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have no accessibility violations with pending items', async () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
                { type: 'report_update', id: '2' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 2,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            const { container } = render(<SyncQueue />);

            const results = await axe(container);
            expect(results).toHaveNoViolations();
        });

        it('should have accessible sync button', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            expect(button).toBeInTheDocument();
        });

        it('should have descriptive aria-labels', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const queue = screen.getByTestId('sync-queue');
            expect(queue).toHaveAttribute('aria-label');
        });

        it('should announce sync status to screen readers', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: true,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const progress = screen.getByTestId('sync-progress');
            expect(progress).toHaveAttribute('aria-live', 'polite');
        });

        it('should have keyboard-accessible sync button', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: false,
                isOnline: true,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            const button = screen.getByRole('button', { name: /sync now/i });
            button.focus();
            expect(document.activeElement).toBe(button);
        });
    });

    describe('styling', () => {
        it('should have appropriate background styling', () => {
            render(<SyncQueue />);

            const queue = screen.getByTestId('sync-queue');
            expect(queue).toHaveClass('bg-white');
        });

        it('should have rounded corners', () => {
            render(<SyncQueue />);

            const queue = screen.getByTestId('sync-queue');
            expect(queue).toHaveClass('rounded-lg');
        });

        it('should have shadow for elevation', () => {
            render(<SyncQueue />);

            const queue = screen.getByTestId('sync-queue');
            expect(queue).toHaveClass('shadow');
        });
    });

    describe('offline indicator', () => {
        it('should show offline indicator when offline', () => {
            const pendingItems: PendingSyncItem[] = [
                { type: 'report_create', id: '1' },
            ];
            mockUseOfflineStatus.mockReturnValue({
                isOffline: true,
                isOnline: false,
                pendingItems,
                pendingSyncCount: 1,
                isSyncing: false,
                triggerSync: mockTriggerSync,
                lastSyncTime: new Date(),
                addPendingItem: vi.fn(),
            });

            render(<SyncQueue />);

            expect(screen.getByText(/offline/i)).toBeInTheDocument();
        });
    });
});
