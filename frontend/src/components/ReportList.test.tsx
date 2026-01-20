import { render, screen, fireEvent } from '@testing-library/react';
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

  describe('multi-select mode', () => {
    it('should show checkboxes when multiSelectEnabled is true', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId('report-checkbox-1')).toBeInTheDocument();
      expect(screen.getByTestId('report-checkbox-2')).toBeInTheDocument();
    });

    it('should not show checkboxes when multiSelectEnabled is false', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={false}
          />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('report-checkbox-1')).not.toBeInTheDocument();
    });

    it('should call onBatchSelectionChange when checkbox is toggled', () => {
      const onBatchSelectionChange = vi.fn();
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            onBatchSelectionChange={onBatchSelectionChange}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('report-checkbox-1'));
      expect(onBatchSelectionChange).toHaveBeenCalledWith('1', true);
    });

    it('should show selection footer when reports are selected', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1', '2']}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId('batch-selection-footer')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText(/reports selected/)).toBeInTheDocument();
    });

    it('should use singular form for single report selected', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1']}
          />
        </MemoryRouter>
      );

      expect(screen.getByText(/report selected/)).toBeInTheDocument();
      expect(screen.queryByText(/reports selected/)).not.toBeInTheDocument();
    });

    it('should not show footer when no reports selected', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={[]}
          />
        </MemoryRouter>
      );

      expect(screen.queryByTestId('batch-selection-footer')).not.toBeInTheDocument();
    });

    it('should call onOpenBatchAssignment when Assign Crew button clicked', () => {
      const onOpenBatchAssignment = vi.fn();
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1']}
            onOpenBatchAssignment={onOpenBatchAssignment}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('batch-assign-button'));
      expect(onOpenBatchAssignment).toHaveBeenCalled();
    });

    it('should show Extract Info button when reports are selected', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1', '2']}
          />
        </MemoryRouter>
      );

      expect(screen.getByTestId('batch-extract-button')).toBeInTheDocument();
      expect(screen.getByText('Extract Info')).toBeInTheDocument();
    });

    it('should call onExtractInfo when Extract Info button clicked', () => {
      const onExtractInfo = vi.fn();
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1', '2']}
            onExtractInfo={onExtractInfo}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByTestId('batch-extract-button'));
      expect(onExtractInfo).toHaveBeenCalledWith(['1', '2']);
    });

    it('should highlight batch selected reports', () => {
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={() => {}}
            multiSelectEnabled={true}
            selectedForBatch={['1']}
          />
        </MemoryRouter>
      );

      const reportItem = screen.getByTestId('report-item-1');
      expect(reportItem).toHaveAttribute('data-batch-selected', 'true');

      const reportItem2 = screen.getByTestId('report-item-2');
      expect(reportItem2).toHaveAttribute('data-batch-selected', 'false');
    });

    it('should not trigger row selection when clicking checkbox', () => {
      const onSelectReport = vi.fn();
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={onSelectReport}
            multiSelectEnabled={true}
          />
        </MemoryRouter>
      );

      // Click on checkbox
      fireEvent.click(screen.getByTestId('report-checkbox-1'));
      expect(onSelectReport).not.toHaveBeenCalled();
    });

    it('should trigger row selection when clicking outside checkbox', () => {
      const onSelectReport = vi.fn();
      render(
        <MemoryRouter>
          <ReportList
            reports={mockReports}
            onSelectReport={onSelectReport}
            multiSelectEnabled={true}
          />
        </MemoryRouter>
      );

      // Click on the report text
      fireEvent.click(screen.getByText('Report 1'));
      expect(onSelectReport).toHaveBeenCalledWith('1');
    });
  });
});
