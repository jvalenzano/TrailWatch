
import { render, screen } from '@testing-library/react';
import { ListFirstLayout } from './ListFirstLayout';

describe('ListFirstLayout', () => {
  it('should render list and map children', () => {
    render(
      <ListFirstLayout
        listContent={<div>List Content</div>}
        mapContent={<div>Map Content</div>}
      />
    );
    expect(screen.getByText('List Content')).toBeInTheDocument();
    expect(screen.getByText('Map Content')).toBeInTheDocument();
  });
});
