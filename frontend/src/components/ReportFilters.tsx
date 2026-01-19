
import React from 'react';

interface ReportFiltersProps {
  onFilterChange: (filters: { severity?: string }) => void;
}

export function ReportFilters({ onFilterChange }: ReportFiltersProps) {
  const handleSeverityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ severity: event.target.value === 'all' ? undefined : event.target.value });
  };

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="severity-filter" className="text-white">Severity:</label>
      <select
        id="severity-filter"
        onChange={handleSeverityChange}
        className="bg-gray-700 text-white border-gray-600 rounded p-1"
      >
        <option value="all">All</option>
        <option value="passable">Passable</option>
        <option value="difficult">Difficult</option>
        <option value="impassable">Impassable</option>
        <option value="dangerous">Dangerous</option>
      </select>
    </div>
  );
}
