import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DocumentationContent from './DocumentationContent';
import { type DocumentationData } from '../../../types';

describe('DocumentationContent', () => {
  const mockData: DocumentationData = {
    title: 'Test Documentation',
    sections: [
      {
        id: 'intro',
        title: 'Introduction',
        content: 'Welcome to the documentation',
      },
      {
        id: 'guide',
        title: 'Guide',
        content: 'This is a guide',
      },
    ],
  };

  it('renders documentation title', () => {
    render(<DocumentationContent data={mockData} />);
    expect(screen.getByText('Test Documentation')).toBeInTheDocument();
  });

  it('renders all sections', () => {
    render(<DocumentationContent data={mockData} />);
    expect(screen.getByText('Introduction')).toBeInTheDocument();
    expect(screen.getByText('Guide')).toBeInTheDocument();
  });

  it('has proper ARIA labels', () => {
    render(<DocumentationContent data={mockData} />);
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-label', 'Conteúdo da documentação');
  });
});
