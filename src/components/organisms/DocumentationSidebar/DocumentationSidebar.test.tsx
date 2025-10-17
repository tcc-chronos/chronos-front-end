import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DocumentationSidebar from './DocumentationSidebar';
import { type DocumentationSection } from '../../../types';

describe('DocumentationSidebar', () => {
  const mockSections: DocumentationSection[] = [
    { id: 'intro', title: 'Introdução', content: 'Content 1' },
    { id: 'guide', title: 'Guia', content: 'Content 2' },
  ];

  it('renders sidebar heading', () => {
    render(<DocumentationSidebar sections={mockSections} />);
    expect(screen.getByText('Conteúdo')).toBeInTheDocument();
  });

  it('renders navigation with sections', () => {
    render(<DocumentationSidebar sections={mockSections} />);
    expect(screen.getByText('Introdução')).toBeInTheDocument();
    expect(screen.getByText('Guia')).toBeInTheDocument();
  });

  it('has proper ARIA labels', () => {
    render(<DocumentationSidebar sections={mockSections} />);
    const aside = screen.getByRole('complementary');
    expect(aside).toHaveAttribute('aria-label', 'Navegação da documentação');
  });
});
