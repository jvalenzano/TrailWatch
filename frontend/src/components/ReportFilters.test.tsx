
import { render, screen, fireEvent } from '@testing-library/react';
import { ReportFilters } from './ReportFilters';

describe('ReportFilters', () => {
  it('should render filter options', () => {
    render(<ReportFilters onFilterChange={() => {}} />);
    expect(screen.getByLabelText(/Severity/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'All' })).toBeInTheDocument();
  });

  it('should call onFilterChange when a filter is selected', () => {
    const mockOnFilterChange = vi.fn();
    render(<ReportFilters onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Severity/i), { target: { value: 'difficult' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ severity: 'difficult' });
  });

  it('should call onFilterChange with undefined when \'All\' is selected', () => {
    const mockOnFilterChange = vi.fn();
    render(<ReportFilters onFilterChange={mockOnFilterChange} />);

    fireEvent.change(screen.getByLabelText(/Severity/i), { target: { value: 'all' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({ severity: undefined });
  });
});
