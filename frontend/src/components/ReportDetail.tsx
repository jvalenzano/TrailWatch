
import React from 'react';
import { HazardReport } from '../types/report';

interface ReportDetailProps {
  report: HazardReport;
}

export function ReportDetail({ report }: ReportDetailProps) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-4">
      <h3 className="text-2xl font-bold text-emerald-400">Report Details</h3>
      <div>
        <p className="text-gray-300"><span className="font-semibold">ID:</span> {report.id}</p>
        <p className="text-gray-300"><span className="font-semibold">Trail Name:</span> {report.trail_name || 'N/A'}</p>
        <p className="text-gray-300"><span className="font-semibold">Hazard Type:</span> {report.hazard_type}</p>
        <p className="text-gray-300"><span className="font-semibold">Severity:</span> {report.severity_estimate}</p>
        <p className="text-gray-300"><span className="font-semibold">Description:</span> {report.description}</p>
        <p className="text-gray-300"><span className="font-semibold">Submitted At:</span> {new Date(report.submitted_at).toLocaleString()}</p>
      </div>
      {/* Placeholder for actions */}
      <div className="mt-4">
        <h4 className="text-xl font-semibold">Actions</h4>
        {/* ReportActions component will go here */}
      </div>
    </div>
  );
}
