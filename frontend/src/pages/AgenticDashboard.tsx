import { useState, useCallback } from 'react';
import { MapFirstLayout } from '../components/layout/MapFirstLayout';
import { MapView } from '../components/MapView';
import { SmartMarkerCluster } from '../components/map/SmartMarkerCluster';
import { SpatialInsightsSidebar } from '../components/SpatialInsightsSidebar';
import { ReportList } from '../components/ReportList';
import { ReportDetail } from '../components/ReportDetail';
import { HighRiskConfirmation, isHighRiskReport } from '../components/reasoning';
import { useMockAgent } from '../hooks/useMockAgent';
import { useStreamingExtraction } from '../hooks/useStreamingExtraction';
import { calculateInsightBounds, expandBounds } from '../utils/mapUtils';
import type { MapViewport } from '../types/spatial';

interface AgenticDashboardProps {
    /** Callback to switch back to traditional view */
    onSwitchToTraditional?: () => void;
}

/**
 * AgenticDashboard - Map-first dashboard using synthetic data
 *
 * Features:
 * - 20/60/20 layout with persistent map
 * - Spatial insights sidebar (left)
 * - Report list and detail (right)
 * - Pattern detection (clusters, duplicates, safety alerts)
 * - Scenario-based filtering
 */
export function AgenticDashboard({ onSwitchToTraditional }: AgenticDashboardProps) {
    // Use synthetic data from mock agent
    const {
        reports,
        insights,
        allReports,
        scenarios,
        activeScenario,
        triggerScenario,
        reset: resetScenario,
        weatherContext,
    } = useMockAgent();

    // Streaming extraction
    const {
        state: extractionState,
        startExtraction,
        cancelExtraction,
        reset: resetExtraction,
    } = useStreamingExtraction();

    // Selection state
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
    const [highlightedReportIds, setHighlightedReportIds] = useState<string[]>([]);
    const [flyToViewport, setFlyToViewport] = useState<MapViewport | null>(null);

    // High-risk confirmation state
    const [showHighRiskConfirm, setShowHighRiskConfirm] = useState(false);
    const [highRiskConfirmLoading, setHighRiskConfirmLoading] = useState(false);

    const selectedReport = allReports.find((r) => r.id === selectedReportId);
    const selectedReportIsHighRisk = selectedReport ? isHighRiskReport(selectedReport) : false;

    // Handle insight selection - calculates bounding box from insight reports
    const handleInsightSelect = useCallback(
        (insightId: string) => {
            setSelectedInsightId(insightId);
            const insight = insights.find((i) => i.id === insightId);
            if (insight) {
                setHighlightedReportIds(insight.report_ids);

                // Calculate bounding box from insight's report locations
                const bounds = calculateInsightBounds(insight, allReports);
                if (bounds) {
                    // Expand bounds by 20% for visual padding
                    const expandedBounds = expandBounds(bounds, 0.2);
                    setFlyToViewport({
                        center: insight.location.coordinates,
                        zoom: 13, // Fallback zoom if bounds fail
                        bounds: expandedBounds,
                        boundsPadding: 60,
                    });
                } else {
                    // Fallback to center point if no bounds calculated
                    setFlyToViewport({
                        center: insight.location.coordinates,
                        zoom: 13,
                    });
                }
            }
        },
        [insights, allReports]
    );

    // Handle report selection from map
    const handleReportClickFromMap = useCallback((reportId: string) => {
        setSelectedReportId(reportId);
    }, []);

    // Handle report selection from list
    const handleReportSelect = useCallback((reportId: string) => {
        setSelectedReportId(reportId);
        // Find report and fly to it
        const report = allReports.find((r) => r.id === reportId);
        if (report) {
            setFlyToViewport({
                center: [report.location.longitude, report.location.latitude],
                zoom: 14,
            });
        }
    }, [allReports]);

    // Placeholder action handlers
    const handleAssignCrew = (reportId: string, crewId?: string) => {
        console.log('Assigning crew', crewId, 'to report', reportId);
    };

    const handleExtract = (reportId: string) => {
        console.log('Extracting info for', reportId);
    };

    const handleMarkResolved = (reportId: string) => {
        console.log('Marking as resolved', reportId);
    };

    // High-risk confirmation handlers
    const handleHighRiskAction = useCallback(() => {
        if (selectedReportIsHighRisk && selectedReport) {
            setShowHighRiskConfirm(true);
        }
    }, [selectedReportIsHighRisk, selectedReport]);

    const handleHighRiskConfirm = useCallback(() => {
        if (!selectedReport) return;

        setHighRiskConfirmLoading(true);

        // Simulate status update with a small delay
        setTimeout(() => {
            console.log('HIGH RISK ACTION CONFIRMED:', selectedReport.id);
            console.log('Status updated to: CLOSURE_INITIATED');
            setHighRiskConfirmLoading(false);
            setShowHighRiskConfirm(false);
            // In a real implementation, this would trigger an API call
        }, 1500);
    }, [selectedReport]);

    const handleHighRiskCancel = useCallback(() => {
        setShowHighRiskConfirm(false);
    }, []);

    return (
        <div className="h-screen flex flex-col bg-gray-950 text-white">
            {/* Header with mode toggle and scenario controls */}
            <header className="px-4 py-3 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm shrink-0 z-20">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-white">TrailWatch</h1>
                        <span className="px-2 py-1 text-xs font-medium bg-emerald-500/20 text-emerald-400 rounded-full border border-emerald-500/30">
                            Agentic Mode
                        </span>
                        {weatherContext && (
                            <span className="text-xs text-amber-400 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Storm Alert: {weatherContext.max_wind_speed_mph} mph winds
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Scenario selector */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Scenario:</span>
                            <select
                                value={activeScenario ?? 'all'}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    if (value === 'all') {
                                        resetScenario();
                                        setHighlightedReportIds([]);
                                        setSelectedInsightId(null);
                                    } else {
                                        triggerScenario(value);
                                    }
                                }}
                                className="px-2 py-1 text-sm bg-gray-800 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                <option value="all">All Reports ({allReports.length})</option>
                                {scenarios.map((s) => (
                                    <option key={s.id} value={s.id}>
                                        {s.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Mode toggle */}
                        {onSwitchToTraditional && (
                            <button
                                type="button"
                                onClick={onSwitchToTraditional}
                                className="px-3 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded-lg
                                         hover:bg-gray-700 transition-colors
                                         focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            >
                                Switch to Traditional
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats bar */}
                <div className="flex items-center gap-6 mt-2 text-xs text-gray-400">
                    <span>
                        Reports: <span className="text-white font-medium">{reports.length}</span>
                    </span>
                    <span>
                        Insights: <span className="text-white font-medium">{insights.length}</span>
                    </span>
                    {highlightedReportIds.length > 0 && (
                        <span>
                            Highlighted: <span className="text-emerald-400 font-medium">{highlightedReportIds.length}</span>
                            <button
                                type="button"
                                onClick={() => {
                                    setHighlightedReportIds([]);
                                    setSelectedInsightId(null);
                                }}
                                className="ml-2 text-gray-500 hover:text-gray-300"
                            >
                                (clear)
                            </button>
                        </span>
                    )}
                </div>
            </header>

            {/* Main content area - 20/60/20 layout */}
            <main className="flex-1 overflow-hidden">
                <MapFirstLayout
                    insightPanel={
                        <SpatialInsightsSidebar
                            insights={insights}
                            selectedInsightId={selectedInsightId}
                            onSelectInsight={handleInsightSelect}
                        />
                    }
                    mapPanel={
                        <MapView
                            initialCenter={[-121.75, 46.85]}
                            initialZoom={10}
                            flyToViewport={flyToViewport}
                        >
                            <SmartMarkerCluster
                                reports={reports}
                                selectedReportId={selectedReportId}
                                highlightedReportIds={highlightedReportIds}
                                onReportClick={handleReportClickFromMap}
                            />
                        </MapView>
                    }
                    reportPanel={
                        <div className="h-full flex flex-col">
                            {/* Report list header */}
                            <div className="p-4 border-b border-gray-700/50 shrink-0">
                                <h2 className="text-lg font-semibold text-white">Reports</h2>
                                <p className="text-xs text-gray-400 mt-1">
                                    {highlightedReportIds.length > 0
                                        ? `${highlightedReportIds.length} highlighted`
                                        : `${reports.length} total`}
                                </p>
                            </div>

                            {/* Report list */}
                            <div className="flex-1 overflow-y-auto">
                                <ReportList
                                    reports={reports}
                                    onSelectReport={handleReportSelect}
                                    selectedReportId={selectedReportId}
                                    highlightedReportIds={highlightedReportIds}
                                />
                            </div>

                            {/* Report detail */}
                            {selectedReport && (
                                <div className="border-t border-gray-700/50 max-h-[40%] overflow-y-auto">
                                    <ReportDetail
                                        report={selectedReport}
                                        onAssignCrew={handleAssignCrew}
                                        onExtract={handleExtract}
                                        onMarkResolved={handleMarkResolved}
                                        extractionState={extractionState}
                                        onStartStreamingExtraction={startExtraction}
                                        onCancelStreamingExtraction={cancelExtraction}
                                        onResetStreamingExtraction={resetExtraction}
                                    />

                                    {/* High-risk action button */}
                                    {selectedReportIsHighRisk && !showHighRiskConfirm && (
                                        <div className="p-4 border-t border-red-500/30 bg-red-500/10">
                                            <button
                                                type="button"
                                                onClick={handleHighRiskAction}
                                                className="w-full px-4 py-2 text-sm font-medium text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/20 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                data-testid="high-risk-action-btn"
                                            >
                                                Initiate Trail Closure
                                            </button>
                                        </div>
                                    )}

                                    {/* High-risk confirmation modal */}
                                    {showHighRiskConfirm && (
                                        <div className="p-4 border-t border-gray-700/50">
                                            <HighRiskConfirmation
                                                report={selectedReport}
                                                onConfirm={handleHighRiskConfirm}
                                                onCancel={handleHighRiskCancel}
                                                actionLabel="Confirm Trail Closure"
                                                isLoading={highRiskConfirmLoading}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    }
                />
            </main>
        </div>
    );
}
