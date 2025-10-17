import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DocumentationSidebarContent from './DocumentationSidebarContent';

// Mock do JSON
vi.mock('../../../data/documentation.json', () => ({
  default: {
    title: 'Test Documentation',
    sections: [
      {
        id: 'intro',
        title: 'Introdução',
        content: 'Content',
      },
    ],
  },
}));

describe('DocumentationSidebarContent', () => {
  it('renders sidebar title', () => {
    render(<DocumentationSidebarContent />);
    expect(screen.getByText('Documentação')).toBeInTheDocument();
  });

  it('renders navigation sections', () => {
    render(<DocumentationSidebarContent />);
    expect(screen.getByText('Introdução')).toBeInTheDocument();
  });
});
