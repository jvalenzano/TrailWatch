
import { render, screen } from '@testing-library/react';
import { AppShell } from './AppShell';

describe('AppShell', () => {
  it('should render children', () => {
    render(<AppShell><div>Test Child</div></AppShell>);
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
