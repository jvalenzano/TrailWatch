
import { render } from '@testing-library/react';
import { MapView } from './MapView';

describe('MapView', () => {
  it('should render a map container', () => {
    const { container } = render(<MapView initialCenter={[0, 0]} initialZoom={1} />);
    expect(container.firstChild).toHaveClass('relative');
  });
});
