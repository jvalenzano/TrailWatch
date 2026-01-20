import { renderHook, waitFor, act } from '@testing-library/react';
import { useBatchAssignment } from './useBatchAssignment';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useBatchAssignment', () => {
    describe('selection management', () => {
        it('should start with empty selection', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.selectedReportIds).toEqual([]);
            expect(result.current.selectionCount).toBe(0);
            expect(result.current.hasSelection).toBe(false);
        });

        it('should select and deselect reports', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReport('report-1');
            });

            expect(result.current.selectedReportIds).toContain('report-1');
            expect(result.current.selectionCount).toBe(1);
            expect(result.current.hasSelection).toBe(true);
            expect(result.current.isSelected('report-1')).toBe(true);
            expect(result.current.isSelected('report-2')).toBe(false);

            act(() => {
                result.current.deselectReport('report-1');
            });

            expect(result.current.selectedReportIds).not.toContain('report-1');
            expect(result.current.selectionCount).toBe(0);
        });

        it('should toggle report selection', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.toggleReport('report-1');
            });
            expect(result.current.isSelected('report-1')).toBe(true);

            act(() => {
                result.current.toggleReport('report-1');
            });
            expect(result.current.isSelected('report-1')).toBe(false);
        });

        it('should select multiple reports at once', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReports(['report-1', 'report-2', 'report-3']);
            });

            expect(result.current.selectionCount).toBe(3);
            expect(result.current.isSelected('report-1')).toBe(true);
            expect(result.current.isSelected('report-2')).toBe(true);
            expect(result.current.isSelected('report-3')).toBe(true);
        });

        it('should clear all selections', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReports(['report-1', 'report-2']);
                result.current.clearSelection();
            });

            expect(result.current.selectionCount).toBe(0);
            expect(result.current.hasSelection).toBe(false);
        });

        it('should not duplicate selections', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReport('report-1');
                result.current.selectReport('report-1');
            });

            expect(result.current.selectionCount).toBe(1);
        });
    });

    describe('district and crew selection', () => {
        it('should manage district selection', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.selectedDistrictId).toBeNull();

            act(() => {
                result.current.setSelectedDistrictId('district-01');
            });

            expect(result.current.selectedDistrictId).toBe('district-01');
        });

        it('should manage crew selection', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.selectedCrewId).toBeNull();

            act(() => {
                result.current.setSelectedCrewId('crew-alpha');
            });

            expect(result.current.selectedCrewId).toBe('crew-alpha');
        });
    });

    describe('route optimization', () => {
        it('should fetch route summary when reports are selected', async () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReports(['report-1', 'report-2']);
            });

            await waitFor(() => {
                expect(result.current.routeSummary).not.toBeNull();
            });

            expect(result.current.routeSummary?.total_distance_miles).toBeGreaterThan(0);
            expect(result.current.routeSummary?.estimated_travel_hours).toBeGreaterThan(0);
            expect(result.current.routeSummary?.estimated_work_hours).toBeGreaterThan(0);
        });

        it('should not fetch route when no reports selected', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.routeSummary).toBeNull();
            expect(result.current.isLoadingRoute).toBe(false);
        });
    });

    describe('crew context', () => {
        it('should fetch crew context when crew is selected', async () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.setSelectedCrewId('crew-alpha');
            });

            await waitFor(() => {
                expect(result.current.crewContext).not.toBeNull();
            });

            expect(result.current.crewContext?.crew_id).toBe('crew-alpha');
            expect(result.current.crewContext?.crew_name).toBe('Alpha Crew');
            expect(result.current.crewContext?.performance).toBe('excellent');
        });

        it('should not fetch crew context when no crew selected', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.crewContext).toBeNull();
            expect(result.current.isLoadingCrewContext).toBe(false);
        });
    });

    describe('submission', () => {
        it('should not be submittable without required fields', () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            expect(result.current.canSubmit).toBe(false);

            act(() => {
                result.current.selectReport('report-1');
            });
            expect(result.current.canSubmit).toBe(false);

            act(() => {
                result.current.setSelectedDistrictId('district-01');
            });
            expect(result.current.canSubmit).toBe(false);

            act(() => {
                result.current.setSelectedCrewId('crew-alpha');
            });
            expect(result.current.canSubmit).toBe(true);
        });

        it('should submit assignment successfully', async () => {
            const onSuccess = vi.fn();
            const { result } = renderHook(
                () => useBatchAssignment({ onSuccess }),
                { wrapper: createWrapper() }
            );

            act(() => {
                result.current.selectReports(['report-1', 'report-2']);
                result.current.setSelectedDistrictId('district-01');
                result.current.setSelectedCrewId('crew-alpha');
            });

            await act(async () => {
                result.current.submitAssignment();
            });

            await waitFor(() => {
                expect(result.current.assignmentResult).not.toBeNull();
            });

            expect(result.current.assignmentResult?.success).toBe(true);
            expect(result.current.assignmentResult?.assigned_count).toBe(2);
            expect(onSuccess).toHaveBeenCalled();
        });
    });

    describe('reset', () => {
        it('should reset all state', async () => {
            const { result } = renderHook(() => useBatchAssignment(), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.selectReports(['report-1', 'report-2']);
                result.current.setSelectedDistrictId('district-01');
                result.current.setSelectedCrewId('crew-alpha');
            });

            act(() => {
                result.current.reset();
            });

            expect(result.current.selectedReportIds).toEqual([]);
            expect(result.current.selectedDistrictId).toBeNull();
            expect(result.current.selectedCrewId).toBeNull();
        });
    });
});
