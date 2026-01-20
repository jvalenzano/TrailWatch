/**
 * DistrictSelector - Dropdown for selecting a USFS district
 *
 * Shows AI suggestion when available with reason.
 * Follows dark theme styling pattern.
 */

import { useId } from 'react';
import type { District, DistrictSuggestion } from '../../types/district';

export interface DistrictSelectorProps {
    /** Available districts */
    districts: District[];
    /** Currently selected district ID */
    selectedDistrictId: string | null;
    /** Callback when selection changes */
    onSelect: (districtId: string | null) => void;
    /** AI-suggested district */
    suggestion?: DistrictSuggestion;
    /** Whether the selector is disabled */
    disabled?: boolean;
    /** Loading state */
    isLoading?: boolean;
}

/**
 * District selector dropdown with AI suggestion
 */
export function DistrictSelector({
    districts,
    selectedDistrictId,
    onSelect,
    suggestion,
    disabled = false,
    isLoading = false,
}: DistrictSelectorProps) {
    const selectId = useId();

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        onSelect(value === '' ? null : value);
    };

    const suggestedDistrict = suggestion
        ? districts.find((d) => d.id === suggestion.district_id)
        : null;

    return (
        <div className="space-y-2">
            <label
                htmlFor={selectId}
                className="block text-sm font-medium text-gray-300"
            >
                District
            </label>

            {/* AI Suggestion hint */}
            {suggestion && suggestedDistrict && (
                <div
                    className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-sm"
                    data-testid="district-suggestion"
                >
                    <svg
                        className="w-4 h-4 text-emerald-400 shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                        />
                    </svg>
                    <div>
                        <span className="text-emerald-400 font-medium">
                            Suggested: {suggestedDistrict.name}
                        </span>
                        <span className="text-gray-400 ml-2">
                            ({suggestion.matching_reports} reports match)
                        </span>
                    </div>
                </div>
            )}

            {/* District dropdown */}
            <div className="relative">
                <select
                    id={selectId}
                    value={selectedDistrictId ?? ''}
                    onChange={handleChange}
                    disabled={disabled || isLoading}
                    className={`
                        w-full px-4 py-2.5 pr-10
                        bg-gray-800 border border-gray-600 rounded-lg
                        text-white text-sm
                        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                        disabled:opacity-50 disabled:cursor-not-allowed
                        appearance-none cursor-pointer
                        ${selectedDistrictId === suggestion?.district_id
                            ? 'ring-1 ring-emerald-500/50'
                            : ''
                        }
                    `}
                    data-testid="district-selector"
                    aria-describedby={suggestion ? `${selectId}-suggestion` : undefined}
                >
                    <option value="">Select a district...</option>
                    {districts.map((district) => (
                        <option key={district.id} value={district.id}>
                            {district.name}
                            {district.id === suggestion?.district_id ? ' (Suggested)' : ''}
                        </option>
                    ))}
                </select>

                {/* Dropdown arrow */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    {isLoading ? (
                        <svg
                            className="w-5 h-5 text-gray-400 animate-spin"
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
                    ) : (
                        <svg
                            className="w-5 h-5 text-gray-400"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    )}
                </div>
            </div>

            {/* Suggestion reason (screen reader) */}
            {suggestion && (
                <p id={`${selectId}-suggestion`} className="sr-only">
                    AI suggests {suggestedDistrict?.name}: {suggestion.reason}
                </p>
            )}
        </div>
    );
}
