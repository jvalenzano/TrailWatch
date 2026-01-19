
import { render, screen } from '@testing-library/react';
import { ReportListItem } from './ReportListItem';
import { HazardReport } from '../types/report';

const mockReport: HazardReport = {
  id: '1',
  location: { latitude: 0, longitude: 0 },
  hazard_type: 'clearing',
  severity_estimate: 'difficult',
  description: 'Tree down across trail',
  photos: [],
  reporter_type: 'anonymous',
  submitted_at: '2026-01-01T00:00:00Z',
};

describe('ReportListItem', () => {
  it('should render report details', () => {
    render(<ReportListItem report={mockReport} />);
    expect(screen.getByText('Tree down across trail')).toBeInTheDocument();
    expect(screen.getByText('Hazard Type: clearing')).toBeInTheDocument();
    expect(screen.getByText('Severity: difficult')).toBeInTheDocument();
  });
});
