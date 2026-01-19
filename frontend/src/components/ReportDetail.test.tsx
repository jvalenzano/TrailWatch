import { render, screen } from '@testing-library/react';
import { ReportDetail } from './ReportDetail';
import type { HazardReport } from '../types/report';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('./CrewSelector', () => ({
  CrewSelector: () => <div data-testid="crew-selector">Crew Selector</div>
}));

vi.mock('./ReportActions', () => ({
  ReportActions: () => <div data-testid="report-actions">Report Actions</div>
}));

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

describe('ReportDetail', () => {
  it('should render report details', () => {
    const noop = () => { };
    render(
      <MemoryRouter>
        <ReportDetail
          report={mockReport}
          onAssignCrew={noop}
          onExtract={noop}
          onMarkResolved={noop}
        />
      </MemoryRouter>
    );
    expect(screen.getByText(/A large tree has fallen across/)).toBeInTheDocument();
    expect(screen.getByTestId('crew-selector')).toBeInTheDocument();
    expect(screen.getByTestId('report-actions')).toBeInTheDocument();
  });
});
