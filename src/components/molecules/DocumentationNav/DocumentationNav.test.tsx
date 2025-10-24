import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DocumentationNav from './DocumentationNav';
import { type DocumentationSection } from '../../../types';

describe('DocumentationNav', () => {
  const mockSections: DocumentationSection[] = [
    { id: 'intro', title: 'Introdução', content: 'Content 1' },
    { id: 'getting-started', title: 'Começando', content: 'Content 2' },
  ];

  it('renders all sections', () => {
    render(<DocumentationNav sections={mockSections} />);
    expect(screen.getByText('Introdução')).toBeInTheDocument();
    expect(screen.getByText('Começando')).toBeInTheDocument();
  });

  it('marks active section', () => {
    render(<DocumentationNav sections={mockSections} activeSection='intro' />);
    const activeLink = screen.getByText('Introdução').closest('a');
    expect(activeLink).toHaveClass('border-blue-600');
  });
});
