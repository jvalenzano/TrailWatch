
import React from 'react';
import { HazardReport } from '../types/report';

interface ReportListProps {
  reports: HazardReport[];
}

export function ReportList({ reports }: ReportListProps) {
  if (reports.length === 0) {
    return <p>No reports found.</p>;
  }

  return (
    <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="p-4 border rounded-lg">
          <h3>{report.description}</h3>
        </div>
      ))}
    </div>
  );
}
