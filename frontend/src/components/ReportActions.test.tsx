
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportActions } from './ReportActions';
import { HazardReport } from '../types/report';

const mockReport: HazardReport = {
  id: '1',
  location: { latitude: 0, longitude: 0 },
  hazard_type: 'clearing',
  severity_estimate: 'difficult',
  description: 'A large tree has fallen across the trail making it impassable.',
  photos: [],
  reporter_type: 'anonymous',
  submitted_at: '2026-01-01T00:00:00Z',
};

describe('ReportActions', () => {
  it('should render action buttons', () => {
    render(
      <ReportActions
        reportId={mockReport.id}
        onAssignCrew={() => {}}
        onExtract={() => {}}
        onMarkResolved={() => {}}
      />
    );
    expect(screen.getByRole('button', { name: /Assign Crew/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Extract Info/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mark Resolved/i })).toBeInTheDocument();
  });

  it('should call onAssignCrew when button is clicked', () => {
    const mockOnAssignCrew = vi.fn();
    render(
      <ReportActions
        reportId={mockReport.id}
        onAssignCrew={mockOnAssignCrew}
        onExtract={() => {}}
        onMarkResolved={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Assign Crew/i }));
    expect(mockOnAssignCrew).toHaveBeenCalledWith(mockReport.id);
  });

  it('should call onExtract when button is clicked', () => {
    const mockOnExtract = vi.fn();
    render(
      <ReportActions
        reportId={mockReport.id}
        onAssignCrew={() => {}}
        onExtract={mockOnExtract}
        onMarkResolved={() => {}}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Extract Info/i }));
    expect(mockOnExtract).toHaveBeenCalledWith(mockReport.id);
  });

  it('should call onMarkResolved when button is clicked', () => {
    const mockOnMarkResolved = vi.fn();
    render(
      <ReportActions
        reportId={mockReport.id}
        onAssignCrew={() => {}}
        onExtract={() => {}}
        onMarkResolved={mockOnMarkResolved}
      />
    );
    fireEvent.click(screen.getByRole('button', { name: /Mark Resolved/i }));
    expect(mockOnMarkResolved).toHaveBeenCalledWith(mockReport.id);
  });
});
