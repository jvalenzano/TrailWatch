import { useState, useCallback } from 'react';
import { AgenticLayout, type LeftPanelContent, type RightPanelContent } from '../components/common/AgenticLayout';
import { AgenticMarkerCluster } from '../components/AgenticMarkerCluster';
import { SpatialInsightsSidebar } from '../components/SpatialInsightsSidebar';
import { ReportList } from '../components/ReportList';
import { ReportDetail } from '../components/ReportDetail';
import { useMockAgent } from '../hooks/useMockAgent';
import { useStreamingExtraction } from '../hooks/useStreamingExtraction';
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

    // Panel state
    const [activeLeftPanel, setActiveLeftPanel] = useState<LeftPanelContent>('insights');
    const [activeRightPanel, setActiveRightPanel] = useState<RightPanelContent>('reports');

    // Selection state
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
    const [highlightedReportIds, setHighlightedReportIds] = useState<string[]>([]);
    const [flyToViewport, setFlyToViewport] = useState<MapViewport | null>(null);

    const selectedReport = allReports.find((r) => r.id === selectedReportId);

    // Handle insight selection
    const handleInsightSelect = useCallback(
        (insightId: string) => {
            setSelectedInsightId(insightId);
            const insight = insights.find((i) => i.id === insightId);
            if (insight) {
                setHighlightedReportIds(insight.report_ids);
                setFlyToViewport({
                    center: insight.location.coordinates,
                    zoom: 13,
                });
            }
        },
        [insights]
    );

    // Handle report selection from map
    const handleReportClickFromMap = useCallback((reportId: string) => {
        setSelectedReportId(reportId);
        setActiveRightPanel('reports');
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

    // Clear highlights when clicking on map background
    const handleViewportChange = useCallback(() => {
        // Could track viewport changes here if needed
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

            {/* Main content area */}
            <main className="flex-1 overflow-hidden">
                <AgenticLayout
                    initialCenter={[-121.75, 46.85]}
                    initialZoom={10}
                    flyToViewport={flyToViewport}
                    onViewportChange={handleViewportChange}
                    activeLeftPanel={activeLeftPanel}
                    activeRightPanel={activeRightPanel}
                    onLeftPanelToggle={setActiveLeftPanel}
                    onRightPanelToggle={setActiveRightPanel}
                    leftPanel={
                        <div className="h-full flex flex-col">
                            <SpatialInsightsSidebar
                                insights={insights}
                                selectedInsightId={selectedInsightId}
                                onSelectInsight={handleInsightSelect}
                            />
                        </div>
                    }
                    rightPanel={
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
                                </div>
                            )}
                        </div>
                    }
                    mapOverlay={
                        <AgenticMarkerCluster
                            reports={reports}
                            highlightedReportIds={highlightedReportIds}
                            onReportClick={handleReportClickFromMap}
                        />
                    }
                />
            </main>
        </div>
    );
}
