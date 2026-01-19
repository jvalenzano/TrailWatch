
import { useState } from 'react';
import { useReports } from '../hooks/useReports';
import { ReportList } from '../components/ReportList';
import { ReportDetail } from '../components/ReportDetail';
import { MapView } from '../components/MapView';
import { ReportMarker } from '../components/ReportMarker';

export function Dashboard() {
    const { data: reports, isLoading, error } = useReports();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const selectedReport = reports?.find(r => r.id === selectedReportId) || null;

    const handleSelectReport = (id: string) => {
        setSelectedReportId(id);
    };

    const handleAssignCrew = (reportId: string, crewId?: string) => {
        if (crewId) {
            console.log(`Assigning crew ${crewId} to report ${reportId}`);
            alert(`Technically assigned crew ${crewId} to report ${reportId}`);
        } else {
            console.log('Please select a crew');
        }
    };

    const handleExtract = (reportId: string) => {
        console.log('Extracting info for', reportId);
    };

    const handleResolve = (reportId: string) => {
        console.log('Resolving report', reportId);
    };

    if (isLoading) return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading reports...</div>;
    if (error) return <div className="flex items-center justify-center h-screen bg-gray-900 text-red-500">Error loading reports</div>;

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-gray-100">
            {/* Header Placeholder - In Phase 3 we'll integrate AppShell properly */}
            <header className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center shadow-md z-10">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌲</span>
                    <h1 className="text-xl font-bold tracking-tight text-white">TrailWatch <span className="text-emerald-500">Dash</span></h1>
                </div>
                <div className="text-sm text-gray-400">
                    {reports?.length || 0} Open Reports
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Report List */}
                <div className="w-80 sm:w-96 flex flex-col border-r border-gray-800 bg-gray-900">
                    <div className="p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-10">
                        <h2 className="text-lg font-semibold text-gray-200">Incoming Reports</h2>
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar">
                        <ReportList
                            reports={reports || []}
                            selectedReportId={selectedReportId}
                            onSelectReport={handleSelectReport}
                        />
                    </div>
                </div>

                {/* Center Panel: Map */}
                <div className="flex-1 relative bg-gray-800">
                    <MapView>
                        {reports?.map(report => (
                            <ReportMarker
                                key={report.id}
                                report={report}
                                onClick={(r) => handleSelectReport(r.id)}
                            />
                        ))}
                    </MapView>

                    {/* Absolute overlay for "No selection" if we want, or just empty space */}
                    {!selectedReport && (
                        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur px-4 py-2 rounded-full text-sm text-gray-300 pointer-events-none">
                            Select a marker or list item to view details
                        </div>
                    )}
                </div>

                {/* Right Panel: Detail View */}
                {selectedReport ? (
                    <div className="w-96 border-l border-gray-800 bg-gray-900 overflow-y-auto shadow-xl z-20">
                        <ReportDetail
                            report={selectedReport}
                            onAssignCrew={handleAssignCrew}
                            onExtract={handleExtract}
                            onMarkResolved={handleResolve}
                        />
                    </div>
                ) : (
                    // Collapsed or Empty State on Right?
                    // Let's just keep it empty or hidden. Hidden gives more map space?
                    // With 3-column flex, hiding it expands the map (flex-1).
                    // Let's conditionally render instructions.
                    <div className="hidden lg:block w-0 border-l border-gray-800 transition-all duration-300"></div>
                )}
            </div>
        </div>
    );
}
