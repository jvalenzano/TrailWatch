import React, { useState, useId } from 'react';
import type { TriageResult } from '../../types/report';

interface ReasoningPanelProps {
    triageResult: TriageResult;
}

export const ReasoningPanel: React.FC<ReasoningPanelProps> = ({ triageResult }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { reasoning, confidence_factors } = triageResult;
    const panelId = useId();

    const factors = [
        { label: 'Photo matches hazard', value: confidence_factors.has_photo && confidence_factors.photo_matches_hazard, icon: '📸' },
        { label: 'GPS matches trail', value: confidence_factors.gps_accurate, icon: '📍' },
        { label: 'Specific description', value: confidence_factors.description_specific, icon: '📝' },
        { label: 'Trusted reporter', value: confidence_factors.reporter_trusted, icon: '👤' },
        { label: 'Corroborating reports', value: confidence_factors.corroborating_reports > 0, icon: '👥' },
        { label: 'Weather context', value: !!confidence_factors.weather_context, icon: '☁️' },
    ];

    return (
        <div
            className="mt-4 border border-indigo-100 rounded-lg overflow-hidden bg-indigo-50/50"
            data-testid="reasoning-panel"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 text-sm font-medium text-indigo-900 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset"
                aria-expanded={isOpen}
                aria-controls={panelId}
                aria-label="Toggle AI reasoning explanation"
                data-testid="reasoning-panel-toggle"
            >
                <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Why did AI classify this?
                </div>
                <svg
                    className={`w-4 h-4 text-indigo-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div id={panelId} className="p-4 pt-0 text-sm" data-testid="reasoning-panel-content">
                    {/* Primary Reasoning Prose */}
                    <div className="prose prose-sm text-gray-700 bg-white p-3 rounded border border-indigo-100 mb-3">
                        {reasoning || "No detailed reasoning available."}
                    </div>

                    {/* Secondary Confidence Factors */}
                    <div className="grid grid-cols-2 gap-2">
                        {factors.map((factor, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center gap-2 text-xs px-2 py-1 rounded ${factor.value ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                                    }`}
                            >
                                <span>{factor.icon}</span>
                                <span className={factor.value ? 'font-medium' : ''}>{factor.label}</span>
                                {factor.value && (
                                    <svg className="w-3 h-3 ml-auto text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
