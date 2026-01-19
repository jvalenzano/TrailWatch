
import { render, screen } from '@testing-library/react';
import { ReportDetail } from './ReportDetail';
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

describe('ReportDetail', () => {
  it('should render report details', () => {
    render(<ReportDetail report={mockReport} />);
    expect(screen.getByText('A large tree has fallen across the trail making it impassable.')).toBeInTheDocument();
    expect(screen.getByText('A large tree has fallen across the trail making it impassable.')).toBeInTheDocument();
  });
});
