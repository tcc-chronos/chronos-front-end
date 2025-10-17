import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import DocumentationSection from './DocumentationSection';
import { type DocumentationSection as DocSection } from '../../../types';

describe('DocumentationSection', () => {
  it('renders section title and content', () => {
    const mockSection: DocSection = {
      id: 'test',
      title: 'Test Section',
      content: 'This is a test content',
    };

    render(<DocumentationSection section={mockSection} />);
    expect(screen.getByText('Test Section')).toBeInTheDocument();
    expect(screen.getByText('This is a test content')).toBeInTheDocument();
  });

  it('parses bold text correctly', () => {
    const mockSection: DocSection = {
      id: 'test',
      title: 'Test',
      content: 'This is **bold text**',
    };

    render(<DocumentationSection section={mockSection} />);
    const boldElement = screen.getByText('bold text');
    expect(boldElement.tagName).toBe('STRONG');
  });

  it('parses inline code correctly', () => {
    const mockSection: DocSection = {
      id: 'test',
      title: 'Test',
      content: 'This is `inline code`',
    };

    render(<DocumentationSection section={mockSection} />);
    const codeElement = screen.getByText('inline code');
    expect(codeElement.tagName).toBe('CODE');
  });

  it('renders list items correctly', () => {
    const mockSection: DocSection = {
      id: 'test',
      title: 'Test',
      content: '- First item\n- Second item',
    };

    render(<DocumentationSection section={mockSection} />);
    expect(screen.getByText('First item')).toBeInTheDocument();
    expect(screen.getByText('Second item')).toBeInTheDocument();
  });
});
