/**
 * FeatureAdminPanel - Main panel for Feature Flag Administration
 *
 * Displays all feature flags in a grid layout with status indicators,
 * metrics, and action buttons for status management.
 *
 * Matches WF10 wireframe specification.
 */

import { useState } from 'react';
import { FeatureCard } from './FeatureCard';
import { useFeatureFlags, useFeatureFlagAction } from '../../hooks/useFeatureFlags';
import type { FeatureAction } from '../../types/featureFlag';

/**
 * Settings icon component
 */
function SettingsIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
            data-testid="settings-icon"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}

/**
 * User icon component
 */
function UserIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
        </svg>
    );
}

/**
 * Loading skeleton for feature cards
 */
function LoadingSkeleton() {
    return (
        <div data-testid="feature-admin-loading" className="animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div
                        key={i}
                        className="bg-gray-800 rounded-lg p-5 border border-gray-700"
                    >
                        <div className="h-6 bg-gray-700 rounded w-3/4 mb-3" />
                        <div className="h-4 bg-gray-700 rounded w-1/4 mb-4" />
                        <div className="h-4 bg-gray-700 rounded w-1/2 mb-2" />
                        <div className="h-8 bg-gray-700 rounded w-1/3 mb-4" />
                        <div className="h-10 bg-gray-700 rounded w-2/3" />
                    </div>
                ))}
            </div>
        </div>
    );
}

/**
 * Error message component
 */
function ErrorMessage({ message }: { message: string }) {
    return (
        <div
            data-testid="feature-admin-error"
            className="bg-red-500/10 border border-red-500/50 rounded-lg p-6 text-center"
            role="alert"
        >
            <p className="text-red-400 font-medium">Failed to load feature flags</p>
            <p className="text-gray-400 text-sm mt-1">{message}</p>
            <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
            >
                Retry
            </button>
        </div>
    );
}

/**
 * Feature Admin Panel component
 */
export function FeatureAdminPanel() {
    const { data: features, isLoading, isError, error } = useFeatureFlags();
    const { mutate: performAction, isPending: isActionPending } = useFeatureFlagAction();

    // Track which feature is currently being updated
    const [updatingFeatureId, setUpdatingFeatureId] = useState<string | null>(null);

    const handleAction = (featureId: string, action: FeatureAction) => {
        setUpdatingFeatureId(featureId);
        performAction(
            { featureId, action },
            {
                onSettled: () => {
                    setUpdatingFeatureId(null);
                },
            }
        );
    };

    return (
        <main className="min-h-screen bg-gray-950 text-white">
            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">
                        Trust Calibration & Feature Management
                    </h1>
                    <div className="flex items-center gap-4">
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="Settings"
                        >
                            <SettingsIcon className="w-6 h-6" />
                        </button>
                        <button
                            type="button"
                            className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            aria-label="User profile"
                        >
                            <UserIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {isLoading && <LoadingSkeleton />}

                {isError && <ErrorMessage message={error?.message ?? 'Unknown error'} />}

                {!isLoading && !isError && features && (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        data-testid="feature-grid"
                    >
                        {features.map((feature) => (
                            <FeatureCard
                                key={feature.id}
                                feature={feature}
                                onAction={handleAction}
                                isLoading={
                                    isActionPending && updatingFeatureId === feature.id
                                }
                            />
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !isError && features?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-400">No feature flags configured.</p>
                    </div>
                )}
            </div>
        </main>
    );
}
