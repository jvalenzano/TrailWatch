/**
 * HighRiskConfirmation - Circuit breaker component for Pattern C reports.
 * Requires explicit user confirmation with checkbox friction before
 * approving high-risk actions like trail closures or emergency responses.
 */
import { useState, useId } from 'react';
import type { HazardReport } from '../../types/report';

export interface HighRiskConfirmationProps {
    report: HazardReport;
    onConfirm: () => void;
    onCancel: () => void;
    /** Custom action label (default: "Approve Closure") */
    actionLabel?: string;
    /** Whether the confirm button is in loading state */
    isLoading?: boolean;
}

interface ChecklistItem {
    id: string;
    label: string;
    required: boolean;
}

const defaultChecklist: ChecklistItem[] = [
    {
        id: 'reviewed-photos',
        label: 'I have reviewed all attached photos',
        required: true,
    },
    {
        id: 'verified-location',
        label: 'I have verified the GPS location is accurate',
        required: true,
    },
    {
        id: 'understand-impact',
        label: 'I understand this action may close the trail to public access',
        required: true,
    },
];

export function HighRiskConfirmation({
    report,
    onConfirm,
    onCancel,
    actionLabel = 'Approve Action',
    isLoading = false,
}: HighRiskConfirmationProps) {
    const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
    const formId = useId();

    const checklist = defaultChecklist;
    const requiredItems = checklist.filter((item) => item.required);
    const allRequiredChecked = requiredItems.every((item) =>
        checkedItems.has(item.id)
    );

    const handleCheckChange = (itemId: string, checked: boolean) => {
        setCheckedItems((prev) => {
            const next = new Set(prev);
            if (checked) {
                next.add(itemId);
            } else {
                next.delete(itemId);
            }
            return next;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (allRequiredChecked && !isLoading) {
            onConfirm();
        }
    };

    const triageResult = report.triage_result;
    const severity = triageResult?.severity_name ?? 'Unknown';
    const category = triageResult?.tracs_category_name ?? 'Unknown';

    return (
        <div
            className="border-2 border-red-500/50 rounded-lg overflow-hidden bg-gray-900/90 backdrop-blur-sm"
            data-testid="high-risk-confirmation"
            role="alertdialog"
            aria-labelledby={`${formId}-title`}
            aria-describedby={`${formId}-description`}
        >
            {/* Warning header */}
            <div className="bg-red-500/20 px-4 py-3 border-b border-red-500/30">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-500/30 flex items-center justify-center">
                        <svg
                            className="w-6 h-6 text-red-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                    <div>
                        <h3
                            id={`${formId}-title`}
                            className="text-lg font-semibold text-red-400"
                        >
                            High-Risk Action Required
                        </h3>
                        <p
                            id={`${formId}-description`}
                            className="text-sm text-red-300/80"
                        >
                            This report requires human verification before proceeding
                        </p>
                    </div>
                </div>
            </div>

            {/* Report summary */}
            <div className="px-4 py-3 bg-gray-800/50 border-b border-gray-700">
                <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                    <div>
                        <dt className="text-gray-500">Report ID</dt>
                        <dd className="text-white font-medium">{report.id}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Trail</dt>
                        <dd className="text-white">{report.trail_name ?? 'Unknown'}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Category</dt>
                        <dd className="text-white">{category}</dd>
                    </div>
                    <div>
                        <dt className="text-gray-500">Severity</dt>
                        <dd className="text-red-400 font-medium">{severity}</dd>
                    </div>
                </dl>

                {triageResult && (
                    <div className="mt-3 p-2 bg-gray-900/50 rounded text-xs text-gray-400">
                        <strong className="text-gray-300">AI Recommendation:</strong>{' '}
                        {triageResult.recommended_action}
                    </div>
                )}
            </div>

            {/* Confirmation checklist */}
            <form onSubmit={handleSubmit} className="p-4">
                <fieldset>
                    <legend className="text-sm font-medium text-white mb-3">
                        Confirmation checklist
                    </legend>

                    <div className="space-y-3">
                        {checklist.map((item) => (
                            <label
                                key={item.id}
                                className="flex items-start gap-3 cursor-pointer group"
                            >
                                <div className="relative mt-0.5">
                                    <input
                                        type="checkbox"
                                        id={`${formId}-${item.id}`}
                                        checked={checkedItems.has(item.id)}
                                        onChange={(e) =>
                                            handleCheckChange(item.id, e.target.checked)
                                        }
                                        className="sr-only peer"
                                        required={item.required}
                                    />
                                    <div
                                        className={`w-5 h-5 rounded border-2 transition-colors ${
                                            checkedItems.has(item.id)
                                                ? 'bg-emerald-500 border-emerald-500'
                                                : 'border-gray-500 group-hover:border-gray-400'
                                        }`}
                                    >
                                        {checkedItems.has(item.id) && (
                                            <svg
                                                className="w-full h-full text-white"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="3"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        )}
                                    </div>
                                </div>
                                <span
                                    className={`text-sm ${
                                        checkedItems.has(item.id)
                                            ? 'text-white'
                                            : 'text-gray-400 group-hover:text-gray-300'
                                    }`}
                                >
                                    {item.label}
                                    {item.required && (
                                        <span className="text-red-400 ml-1">*</span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        data-testid="high-risk-cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!allRequiredChecked || isLoading}
                        className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            allRequiredChecked && !isLoading
                                ? 'bg-red-600 hover:bg-red-500 text-white'
                                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                        }`}
                        data-testid="high-risk-confirm"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg
                                    className="animate-spin w-4 h-4"
                                    viewBox="0 0 24 24"
                                    fill="none"
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
                                Processing...
                            </span>
                        ) : (
                            actionLabel
                        )}
                    </button>
                </div>

                {!allRequiredChecked && (
                    <p className="mt-3 text-xs text-gray-500 text-center">
                        Please check all required items before confirming
                    </p>
                )}
            </form>
        </div>
    );
}
