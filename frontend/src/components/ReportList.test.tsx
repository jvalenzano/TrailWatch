import { render, screen } from '@testing-library/react';
import { ReportList } from './ReportList';
import type { HazardReport } from '../types/report';
import { MemoryRouter } from 'react-router-dom';

const mockReports: HazardReport[] = [
  {
    id: '1',
    location: { latitude: 0, longitude: 0 },
    hazard_type: 'clearing',
    severity_estimate: 'difficult',
    description: 'Report 1',
    photos: [],
    reporter_type: 'anonymous',
    submitted_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '2',
    location: { latitude: 0, longitude: 0 },
    hazard_type: 'drainage',
    severity_estimate: 'passable',
    description: 'Report 2',
    photos: [],
    reporter_type: 'anonymous',
    submitted_at: '2026-01-01T00:00:00Z',
  },
];

describe('ReportList', () => {
  it('should render a list of reports', () => {
    render(
      <MemoryRouter>
        <ReportList reports={mockReports} onSelectReport={() => { }} />
      </MemoryRouter>
    );
    expect(screen.getByText('Report 1')).toBeInTheDocument();
    expect(screen.getByText('Report 2')).toBeInTheDocument();
  });

  it('should display a message when no reports are available', () => {
    render(
      <MemoryRouter>
        <ReportList reports={[]} onSelectReport={() => { }} />
      </MemoryRouter>
    );
    expect(screen.getByText('No reports found.')).toBeInTheDocument();
  });
});
