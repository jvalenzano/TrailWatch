import { useState } from 'react';
import { useUIMode } from '../hooks/useUIMode';
import { useReports } from '../hooks/useReports';
import { MapView } from '../components/MapView';
import { ReportList } from '../components/ReportList';
import { ReportDetail } from '../components/ReportDetail';

export function Dashboard() {
    const { mode } = useUIMode();
    const { data: reports } = useReports();
    const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

    const selectedReport = reports?.find(r => r.id === selectedReportId);

    const handleAssignCrew = (reportId: string, crewId?: string) => {
        console.log('Assigning crew', crewId, 'to report', reportId);
    };

    const handleExtract = (reportId: string) => {
        console.log('Extracting info for', reportId);
    };

    const handleMarkResolved = (reportId: string) => {
        console.log('Marking as resolved', reportId);
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900 text-white">
            <header className="p-4 border-b border-gray-800">
                <h1 className="text-xl font-bold">Dashboard (Debug)</h1>
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
                    <MapView />
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
