/**
 * useBatchAssignment hook - Manages batch assignment workflow state
 *
 * Handles:
 * - Report selection state
 * - Route optimization fetching
 * - Crew context fetching
 * - Batch assignment submission
 */

import { useState, useCallback, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchApi } from '../utils/api';
import type {
    CrewContext,
    RouteSummary,
    BatchAssignmentRequest,
    BatchAssignmentResult,
} from '../types/assignment';

interface UseBatchAssignmentOptions {
    /** Callback when assignment succeeds */
    onSuccess?: (result: BatchAssignmentResult) => void;
    /** Callback when assignment fails */
    onError?: (error: Error) => void;
}

interface UseBatchAssignmentReturn {
    /** Currently selected report IDs */
    selectedReportIds: string[];
    /** Add a report to selection */
    selectReport: (reportId: string) => void;
    /** Remove a report from selection */
    deselectReport: (reportId: string) => void;
    /** Toggle report selection */
    toggleReport: (reportId: string) => void;
    /** Select multiple reports at once */
    selectReports: (reportIds: string[]) => void;
    /** Clear all selections */
    clearSelection: () => void;
    /** Check if a report is selected */
    isSelected: (reportId: string) => boolean;
    /** Number of selected reports */
    selectionCount: number;
    /** Whether any reports are selected */
    hasSelection: boolean;

    /** Selected district ID */
    selectedDistrictId: string | null;
    /** Set selected district */
    setSelectedDistrictId: (districtId: string | null) => void;

    /** Selected crew ID */
    selectedCrewId: string | null;
    /** Set selected crew */
    setSelectedCrewId: (crewId: string | null) => void;

    /** Route summary for selected reports */
    routeSummary: RouteSummary | null;
    /** Whether route is being calculated */
    isLoadingRoute: boolean;
    /** Route fetch error */
    routeError: Error | null;

    /** Crew context for selected crew */
    crewContext: CrewContext | null;
    /** Whether crew context is loading */
    isLoadingCrewContext: boolean;
    /** Crew context fetch error */
    crewContextError: Error | null;

    /** Submit batch assignment */
    submitAssignment: () => void;
    /** Whether assignment is being submitted */
    isSubmitting: boolean;
    /** Assignment result */
    assignmentResult: BatchAssignmentResult | null;
    /** Assignment error */
    assignmentError: Error | null;

    /** Reset all state */
    reset: () => void;
    /** Whether the form is ready to submit */
    canSubmit: boolean;
}

/**
 * Hook to manage batch assignment workflow
 */
export const useBatchAssignment = (
    options: UseBatchAssignmentOptions = {}
): UseBatchAssignmentReturn => {
    const { onSuccess, onError } = options;
    const queryClient = useQueryClient();

    // Selection state
    const [selectedReportIds, setSelectedReportIds] = useState<string[]>([]);
    const [selectedDistrictId, setSelectedDistrictId] = useState<string | null>(null);
    const [selectedCrewId, setSelectedCrewId] = useState<string | null>(null);

    // Selection helpers
    const selectReport = useCallback((reportId: string) => {
        setSelectedReportIds((prev) => {
            if (prev.includes(reportId)) return prev;
            return [...prev, reportId];
        });
    }, []);

    const deselectReport = useCallback((reportId: string) => {
        setSelectedReportIds((prev) => prev.filter((id) => id !== reportId));
    }, []);

    const toggleReport = useCallback((reportId: string) => {
        setSelectedReportIds((prev) => {
            if (prev.includes(reportId)) {
                return prev.filter((id) => id !== reportId);
            }
            return [...prev, reportId];
        });
    }, []);

    const selectReports = useCallback((reportIds: string[]) => {
        setSelectedReportIds(reportIds);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedReportIds([]);
    }, []);

    const isSelected = useCallback(
        (reportId: string) => selectedReportIds.includes(reportId),
        [selectedReportIds]
    );

    const selectionCount = selectedReportIds.length;
    const hasSelection = selectionCount > 0;

    // Route optimization query
    const {
        data: routeSummary,
        isLoading: isLoadingRoute,
        error: routeError,
    } = useQuery<RouteSummary, Error>({
        queryKey: ['route-optimize', selectedReportIds],
        queryFn: async () => {
            const response = await fetchApi<RouteSummary>('/api/route/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ report_ids: selectedReportIds }),
            });
            return response;
        },
        enabled: selectedReportIds.length > 0,
    });

    // Crew context query
    const {
        data: crewContext,
        isLoading: isLoadingCrewContext,
        error: crewContextError,
    } = useQuery<CrewContext, Error>({
        queryKey: ['crew-context', selectedCrewId],
        queryFn: () => fetchApi<CrewContext>(`/api/crews/${selectedCrewId}/context`),
        enabled: !!selectedCrewId,
    });

    // Assignment mutation
    const assignmentMutation = useMutation<
        BatchAssignmentResult,
        Error,
        BatchAssignmentRequest
    >({
        mutationFn: async (request: BatchAssignmentRequest) => {
            return fetchApi<BatchAssignmentResult>('/api/assignments/batch', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });
        },
        onSuccess: (result) => {
            // Invalidate relevant queries
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            queryClient.invalidateQueries({ queryKey: ['crews'] });
            onSuccess?.(result);
        },
        onError: (error) => {
            onError?.(error);
        },
    });

    const submitAssignment = useCallback(() => {
        if (!selectedDistrictId || !selectedCrewId || selectedReportIds.length === 0) {
            return;
        }

        assignmentMutation.mutate({
            report_ids: selectedReportIds,
            district_id: selectedDistrictId,
            crew_id: selectedCrewId,
        });
    }, [selectedDistrictId, selectedCrewId, selectedReportIds, assignmentMutation]);

    const reset = useCallback(() => {
        setSelectedReportIds([]);
        setSelectedDistrictId(null);
        setSelectedCrewId(null);
        assignmentMutation.reset();
    }, [assignmentMutation]);

    const canSubmit = useMemo(() => {
        return (
            selectedReportIds.length > 0 &&
            selectedDistrictId !== null &&
            selectedCrewId !== null &&
            !assignmentMutation.isPending
        );
    }, [selectedReportIds, selectedDistrictId, selectedCrewId, assignmentMutation.isPending]);

    return {
        selectedReportIds,
        selectReport,
        deselectReport,
        toggleReport,
        selectReports,
        clearSelection,
        isSelected,
        selectionCount,
        hasSelection,

        selectedDistrictId,
        setSelectedDistrictId,

        selectedCrewId,
        setSelectedCrewId,

        routeSummary: routeSummary ?? null,
        isLoadingRoute,
        routeError: routeError ?? null,

        crewContext: crewContext ?? null,
        isLoadingCrewContext,
        crewContextError: crewContextError ?? null,

        submitAssignment,
        isSubmitting: assignmentMutation.isPending,
        assignmentResult: assignmentMutation.data ?? null,
        assignmentError: assignmentMutation.error ?? null,

        reset,
        canSubmit,
    };
};
