
/**
 * WF3: Report action buttons with wireframe-conformant labels.
 * Primary actions: "Approve & Route", "Edit"
 */
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
    <div className="flex flex-wrap gap-2" role="group" aria-label="Report actions">
      {/* WF3: Primary action - Approve & Route */}
      <button
        type="button"
        onClick={() => onMarkResolved(reportId)}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        data-testid="approve-route-button"
      >
        Approve &amp; Route
      </button>
      {/* WF3: Secondary action - Edit */}
      <button
        type="button"
        onClick={() => onExtract(reportId)}
        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-800"
        data-testid="edit-button"
      >
        Edit
      </button>
      {/* Additional action - Assign Crew (kept for functionality) */}
      <button
        type="button"
        onClick={() => onAssignCrew(reportId)}
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
        data-testid="assign-crew-button"
      >
        Assign Crew
      </button>
    </div>
  );
}
