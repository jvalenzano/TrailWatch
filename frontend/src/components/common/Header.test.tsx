
import { render, screen } from '@testing-library/react';
import { Header } from './Header';

describe('Header', () => {
  it('should render the title', () => {
    render(<Header title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});
