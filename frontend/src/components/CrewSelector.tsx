

import { useCrews } from '../hooks/useCrews';
import type { Crew } from '../types/crew';

interface CrewSelectorProps {
  selectedCrewId?: string;
  onSelect: (crewId: string) => void;
  filterByStatus?: boolean; // If true, only show available
  disabled?: boolean;
}

export function CrewSelector({
  selectedCrewId,
  onSelect,
  filterByStatus = false,
  disabled = false,
}: CrewSelectorProps) {
  const { data: crews, isLoading, error } = useCrews();

  if (isLoading) {
    return <div className="text-gray-400 text-sm">Loading crews...</div>;
  }

  if (error) {
    return <div className="text-red-400 text-sm">Error loading crews</div>;
  }

  if (!crews || crews.length === 0) {
    return <div className="text-gray-400 text-sm">No crews found</div>;
  }

  const displayedCrews = filterByStatus
    ? crews.filter((c: Crew) => c.status === 'available')
    : crews;

  return (
    <div className="space-y-1">
      <label htmlFor="crew-select" className="block text-sm font-medium text-gray-300">
        Assign Crew
      </label>
      <select
        id="crew-select"
        value={selectedCrewId || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="block w-full rounded border-gray-600 bg-gray-700 text-white shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm p-2"
      >
        <option value="">-- Select a Crew --</option>
        {displayedCrews.map((crew: Crew) => (
          <option key={crew.id} value={crew.id} disabled={crew.status !== 'available'}>
            {crew.name} ({crew.organization}) - {crew.status.replace('_', ' ')}
            {crew.specialties.length > 0 ? ` [${crew.specialties.join(', ')}]` : ''}
          </option>
        ))}
      </select>
    </div>
  );
}
