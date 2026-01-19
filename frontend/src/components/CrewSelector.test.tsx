
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CrewSelector } from './CrewSelector';
import { Crew } from '../types/crew';
import { vi } from 'vitest';

// Mock useCrews hook since we don't want to actually hit the API or rely on QueryClient implementation details ideally,
// but for integration testing the component with the provider is cleaner if we rely on the hook's structure.
// However, since useCrews fetches real data, we should mock the hook itself to return our mock data.

// Mock the hook directly
vi.mock('../hooks/useCrews', () => ({
  useCrews: () => ({
    data: mockCrews,
    isLoading: false,
    error: null,
  }),
}));

const mockCrews: Crew[] = [
  {
    id: 'crew-1',
    name: 'Alpha Crew',
    organization: 'Org A',
    members: [],
    status: 'available',
    specialties: [],
  },
  {
    id: 'crew-2',
    name: 'Bravo Crew',
    organization: 'Org B',
    members: [],
    status: 'assigned',
    specialties: [],
  },
];

const createTestClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

describe('CrewSelector', () => {
  it('should render crew options', () => {
    const queryClient = createTestClient();
    render(
      <QueryClientProvider client={queryClient}>
        <CrewSelector onSelect={() => { }} />
      </QueryClientProvider>
    );

    expect(screen.getByRole('combobox')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: '-- Select a Crew --' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Alpha Crew/ })).toBeInTheDocument();
  });

  it('should call onSelect when a crew is selected', () => {
    const queryClient = createTestClient();
    const mockOnSelect = vi.fn();
    render(
      <QueryClientProvider client={queryClient}>
        <CrewSelector onSelect={mockOnSelect} />
      </QueryClientProvider>
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'crew-1' } });

    expect(mockOnSelect).toHaveBeenCalledWith('crew-1');
  });
});
