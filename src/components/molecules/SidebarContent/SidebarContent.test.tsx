import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SidebarContent from './SidebarContent';

describe('SidebarContent', () => {
  it('renders title and children', () => {
    render(
      <SidebarContent title='Test Title'>
        <div>Test content</div>
      </SidebarContent>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('renders header actions when provided', () => {
    const actions = <button>Action</button>;
    render(
      <SidebarContent title='Test Title' headerActions={actions}>
        <div>Content</div>
      </SidebarContent>
    );

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    const footer = <div>Footer content</div>;
    render(
      <SidebarContent title='Test Title' footer={footer}>
        <div>Content</div>
      </SidebarContent>
    );

    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });

  it('applies correct variant classes', () => {
    const { container } = render(
      <SidebarContent title='Test Title' variant='compact'>
        <div>Content</div>
      </SidebarContent>
    );

    expect(container.firstChild).toHaveClass('p-4', 'space-y-3');
  });

  it('applies custom className', () => {
    const { container } = render(
      <SidebarContent title='Test Title' className='custom-class'>
        <div>Content</div>
      </SidebarContent>
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
