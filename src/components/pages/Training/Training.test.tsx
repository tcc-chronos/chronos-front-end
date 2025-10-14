import { render } from '../../../test/test-utils';
import { describe, it, expect } from 'vitest';
import { Training } from '../..';

describe('Training Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<Training />);
    expect(container).toBeInTheDocument();
  });
});
