


interface ReportActionsProps {
  reportId: string;
  onAssignCrew: (reportId: string) => void;
  onExtract: (reportId: string) => void;
  onMarkResolved: (reportId: string) => void;
}

export function ReportActions({
  reportId,
  onAssignCrew,
  onExtract,
  onMarkResolved,
}: ReportActionsProps) {
  return (
    <div className="flex space-x-2">
      <button
        onClick={() => onAssignCrew(reportId)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Assign Crew
      </button>
      <button
        onClick={() => onExtract(reportId)}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Extract Info
      </button>
      <button
        onClick={() => onMarkResolved(reportId)}
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
      >
        Mark Resolved
      </button>
    </div>
  );
}
