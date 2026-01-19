import { useState, useCallback } from 'react';
import { useUIMode } from '../hooks/useUIMode';
import { useReports } from '../hooks/useReports';
import { useSpatialInsights } from '../hooks/useSpatialInsights';
import { MapView } from '../components/MapView';
import { ReportList } from '../components/ReportList';
import { ReportDetail } from '../components/ReportDetail';
import { MapFirstLayout } from '../components/common/MapFirstLayout';
import { SpatialInsightsSidebar } from '../components/SpatialInsightsSidebar';
import { MarkerCluster } from '../components/MarkerCluster';
import type { MapViewport } from '../types/spatial';

export function Dashboard() {
    const { mode } = useUIMode();
    const { data: reports } = useReports();
    const { data: insights, isLoading: insightsLoading } = useSpatialInsights();

    // Selection state
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
    const [selectedInsightId, setSelectedInsightId] = useState<string | null>(null);
    const [highlightedReportIds, setHighlightedReportIds] = useState<string[]>([]);
    const [flyToViewport, setFlyToViewport] = useState<MapViewport | null>(null);

    const selectedReport = reports?.find(r => r.id === selectedReportId);

    // Handler for insight selection
    const handleInsightSelect = useCallback((insightId: string) => {
        setSelectedInsightId(insightId);
        const insight = insights?.find(i => i.id === insightId);
        if (insight) {
            setHighlightedReportIds(insight.report_ids);
            setFlyToViewport({
                center: insight.location.coordinates,
                zoom: 12,
            });
        }
    }, [insights]);

    // Handler for report selection from map marker
    const handleReportClickFromMap = useCallback((reportId: string) => {
        setSelectedReportId(reportId);
    }, []);

    const handleAssignCrew = (reportId: string, crewId?: string) => {
        console.log('Assigning crew', crewId, 'to report', reportId);
    };

    const handleExtract = (reportId: string) => {
        console.log('Extracting info for', reportId);
    };

    const handleMarkResolved = (reportId: string) => {
        console.log('Marking as resolved', reportId);
    };

    // Agentic mode: Map-first layout with spatial insights
    if (mode.features.mapPrimary) {
        return (
            <div className="h-screen flex flex-col bg-gray-900 text-white">
                <header className="p-4 border-b border-gray-800 shrink-0">
                    <h1 className="text-xl font-bold">Dashboard</h1>
                    <p className="text-sm text-gray-400">
                        Mode: {mode.name} | Reports: {reports?.length ?? 0} | Insights: {insights?.length ?? 0}
                    </p>
                </header>
                <main className="flex-1 overflow-hidden">
                    <MapFirstLayout
                        sidebarContent={
                            <SpatialInsightsSidebar
                                insights={insights ?? []}
                                selectedInsightId={selectedInsightId}
                                onSelectInsight={handleInsightSelect}
                                isLoading={insightsLoading}
                            />
                        }
                        mapContent={
                            <MapView flyToViewport={flyToViewport}>
                                {reports && (
                                    <MarkerCluster
                                        reports={reports}
                                        highlightedReportIds={highlightedReportIds}
                                        onReportClick={handleReportClickFromMap}
                                    />
                                )}
                            </MapView>
                        }
                        listContent={
                            <div className="h-full flex flex-col">
                                <div className="p-4 border-b border-gray-700 shrink-0">
                                    <h2 className="text-lg font-semibold text-white">Reports</h2>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {highlightedReportIds.length > 0
                                            ? `${highlightedReportIds.length} highlighted`
                                            : `${reports?.length ?? 0} total`}
                                    </p>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    {reports && (
                                        <ReportList
                                            reports={reports}
                                            onSelectReport={setSelectedReportId}
                                            selectedReportId={selectedReportId}
                                            highlightedReportIds={highlightedReportIds}
                                        />
                                    )}
                                </div>
                                {selectedReport && (
                                    <div className="border-t border-gray-700 max-h-[40%] overflow-y-auto">
                                        <ReportDetail
                                            report={selectedReport}
                                            onAssignCrew={handleAssignCrew}
                                            onExtract={handleExtract}
                                            onMarkResolved={handleMarkResolved}
                                        />
                                    </div>
                                )}
                            </div>
                        }
                    />
                </main>
            </div>
        );
    }

    // Traditional/Moderate mode: List-first layout
    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            <header className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">Dashboard</h1>
                <p className="text-sm text-gray-400">Mode: {mode.name} | Reports: {reports?.length}</p>
            </header>
            <main className="flex-1 flex overflow-hidden">
                <div className="w-1/4 overflow-y-auto border-r border-gray-800">
                    {reports && (
                        <ReportList
                            reports={reports}
                            onSelectReport={setSelectedReportId}
                            selectedReportId={selectedReportId}
                        />
                    )}
                </div>
                <div className="flex-1 relative">
                    <MapView>
                        {reports && (
                            <MarkerCluster
                                reports={reports}
                                onReportClick={handleReportClickFromMap}
                            />
                        )}
                    </MapView>
                </div>
                {selectedReport && (
                    <div className="w-1/3 border-l border-gray-800">
                        <ReportDetail
                            report={selectedReport}
                            onAssignCrew={handleAssignCrew}
                            onExtract={handleExtract}
                            onMarkResolved={handleMarkResolved}
                        />
                    </div>
                )}
            </main>
        </div>
    );
}
