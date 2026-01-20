/**
 * BatchAssignmentModal - Modal for batch crew assignment workflow
 *
 * Composes:
 * - ReportChecklist (selected reports preview)
 * - DistrictSelector (district dropdown with suggestion)
 * - CrewSelector (crew dropdown)
 * - CrewContextCard (crew performance/availability)
 * - RouteSummary (optimized route metrics)
 *
 * Follows accessibility patterns from HighRiskConfirmation.
 */

import { useId, useEffect, useRef } from 'react';
import type { HazardReport } from '../../types/report';
import type { Crew } from '../../types/crew';
import type { District, DistrictSuggestion } from '../../types/district';
import type { CrewContext, RouteSummary as RouteSummaryType } from '../../types/assignment';
import { ReportChecklist } from './ReportChecklist';
import { DistrictSelector } from './DistrictSelector';
import { CrewContextCard } from './CrewContextCard';
import { RouteSummary } from './RouteSummary';

export interface BatchAssignmentModalProps {
    /** Whether the modal is open */
    isOpen: boolean;
    /** Close modal callback */
    onClose: () => void;
    /** Submit assignment callback */
    onSubmit: () => void;

    /** Selected reports for assignment */
    selectedReports: HazardReport[];
    /** Callback to deselect a report */
    onDeselectReport: (reportId: string) => void;

    /** Available districts */
    districts: District[];
    /** Currently selected district ID */
    selectedDistrictId: string | null;
    /** District selection callback */
    onSelectDistrict: (districtId: string | null) => void;
    /** AI-suggested district */
    districtSuggestion?: DistrictSuggestion;
    /** Whether districts are loading */
    isLoadingDistricts?: boolean;

    /** Available crews (filtered by district) */
    crews: Crew[];
    /** Currently selected crew ID */
    selectedCrewId: string | null;
    /** Crew selection callback */
    onSelectCrew: (crewId: string | null) => void;

    /** Crew context data */
    crewContext?: CrewContext | null;
    /** Whether crew context is loading */
    isLoadingCrewContext?: boolean;

    /** Route summary data */
    routeSummary?: RouteSummaryType | null;
    /** Whether route is loading */
    isLoadingRoute?: boolean;

    /** Whether assignment is being submitted */
    isSubmitting?: boolean;
    /** Whether form can be submitted */
    canSubmit?: boolean;
}

/**
 * Batch assignment modal component
 */
export function BatchAssignmentModal({
    isOpen,
    onClose,
    onSubmit,
    selectedReports,
    onDeselectReport,
    districts,
    selectedDistrictId,
    onSelectDistrict,
    districtSuggestion,
    isLoadingDistricts = false,
    crews,
    selectedCrewId,
    onSelectCrew,
    crewContext,
    isLoadingCrewContext = false,
    routeSummary,
    isLoadingRoute = false,
    isSubmitting = false,
    canSubmit = false,
}: BatchAssignmentModalProps) {
    const modalId = useId();
    const modalRef = useRef<HTMLDivElement>(null);
    const firstFocusableRef = useRef<HTMLButtonElement>(null);

    // Handle ESC key to close
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    // Focus trap and initial focus
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        // Focus first focusable element
        firstFocusableRef.current?.focus();

        // Get all focusable elements
        const modal = modalRef.current;
        const focusableElements = modal.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement?.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement?.focus();
                }
            }
        };

        modal.addEventListener('keydown', handleTab);
        return () => modal.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    if (!isOpen) return null;

    // Filter crews by selected district
    const filteredCrews = selectedDistrictId
        ? crews.filter((crew) => {
              const district = districts.find((d) => d.id === selectedDistrictId);
              return district?.default_crew_ids?.includes(crew.id) ?? true;
          })
        : crews;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div
                ref={modalRef}
                className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl"
                role="dialog"
                aria-modal="true"
                aria-labelledby={`${modalId}-title`}
                aria-describedby={`${modalId}-description`}
                data-testid="batch-assignment-modal"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 px-6 py-4 bg-gray-900 border-b border-gray-700 flex items-center justify-between">
                    <div>
                        <h2
                            id={`${modalId}-title`}
                            className="text-xl font-semibold text-white"
                        >
                            Batch Assignment
                        </h2>
                        <p
                            id={`${modalId}-description`}
                            className="text-sm text-gray-400 mt-1"
                        >
                            Assign {selectedReports.length} report
                            {selectedReports.length !== 1 ? 's' : ''} to a crew
                        </p>
                    </div>
                    <button
                        ref={firstFocusableRef}
                        type="button"
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        aria-label="Close modal"
                        data-testid="batch-assignment-close"
                    >
                        <svg
                            className="w-5 h-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Selected Reports */}
                    <section aria-labelledby={`${modalId}-reports`}>
                        <h3
                            id={`${modalId}-reports`}
                            className="text-sm font-medium text-gray-400 mb-3"
                        >
                            Reports
                        </h3>
                        <ReportChecklist
                            reports={selectedReports}
                            onDeselectReport={onDeselectReport}
                            maxVisible={3}
                        />
                    </section>

                    {/* Route Summary */}
                    {(routeSummary || isLoadingRoute) && (
                        <section aria-labelledby={`${modalId}-route`}>
                            <RouteSummary
                                routeSummary={routeSummary ?? { total_distance_miles: 0, estimated_travel_hours: 0, estimated_work_hours: 0 }}
                                isLoading={isLoadingRoute}
                            />
                        </section>
                    )}

                    {/* District Selection */}
                    <section aria-labelledby={`${modalId}-district`}>
                        <DistrictSelector
                            districts={districts}
                            selectedDistrictId={selectedDistrictId}
                            onSelect={onSelectDistrict}
                            suggestion={districtSuggestion}
                            isLoading={isLoadingDistricts}
                        />
                    </section>

                    {/* Crew Selection */}
                    <section aria-labelledby={`${modalId}-crew-label`}>
                        <label
                            id={`${modalId}-crew-label`}
                            htmlFor={`${modalId}-crew-select`}
                            className="block text-sm font-medium text-gray-300 mb-2"
                        >
                            Crew
                        </label>
                        <select
                            id={`${modalId}-crew-select`}
                            value={selectedCrewId ?? ''}
                            onChange={(e) => onSelectCrew(e.target.value || null)}
                            disabled={!selectedDistrictId}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                            data-testid="crew-selector"
                        >
                            <option value="">
                                {selectedDistrictId
                                    ? 'Select a crew...'
                                    : 'Select a district first'}
                            </option>
                            {filteredCrews.map((crew) => (
                                <option
                                    key={crew.id}
                                    value={crew.id}
                                    disabled={crew.status !== 'available'}
                                >
                                    {crew.name}
                                    {crew.status !== 'available' ? ` (${crew.status})` : ''}
                                </option>
                            ))}
                        </select>

                        {/* Crew Context Card */}
                        {(crewContext || isLoadingCrewContext) && selectedCrewId && (
                            <div className="mt-3">
                                <CrewContextCard
                                    crewContext={crewContext ?? {
                                        crew_id: '',
                                        crew_name: '',
                                        performance: 'good',
                                        last_assignment_date: null,
                                        capacity_percent: 0,
                                    }}
                                    isLoading={isLoadingCrewContext}
                                />
                            </div>
                        )}
                    </section>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 z-10 px-6 py-4 bg-gray-900 border-t border-gray-700 flex items-center justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="batch-assignment-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!canSubmit || isSubmitting}
                        className={`px-6 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                            canSubmit && !isSubmitting
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        data-testid="batch-assignment-submit"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <svg
                                    className="animate-spin w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    aria-hidden="true"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                    />
                                </svg>
                                Assigning...
                            </span>
                        ) : (
                            `Assign ${selectedReports.length} Report${selectedReports.length !== 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
