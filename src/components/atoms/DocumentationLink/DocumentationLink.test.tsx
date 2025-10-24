import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DocumentationLink from './DocumentationLink';

describe('DocumentationLink', () => {
  it('renders with title', () => {
    render(<DocumentationLink href='#section' title='Test Section' />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('applies active styles when isActive is true', () => {
    render(
      <DocumentationLink href='#section' title='Active Section' isActive />
    );
    const link = screen.getByText('Active Section').closest('a');
    expect(link).toHaveClass('border-blue-600');
  });

  it('applies correct href', () => {
    render(<DocumentationLink href='#test' title='Test' />);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('href', '#test');
  });
});
