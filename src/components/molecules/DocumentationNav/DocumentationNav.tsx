import { useState, useEffect } from 'react';
import { DocumentationLink } from '../../atoms/DocumentationLink';
import { type DocumentationNavProps } from './DocumentationNav.types';

/**
 * DocumentationNav Molecule
 * Navegação lateral com lista de tópicos da documentação
 */
const DocumentationNav: React.FC<DocumentationNavProps> = ({
  sections,
  activeSection,
}) => {
  const [currentSection, setCurrentSection] = useState(activeSection || '');

  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section =>
        document.getElementById(section.id)
      );

      const currentSectionElement = sectionElements.find(element => {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSectionElement) {
        setCurrentSection(currentSectionElement.id);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <nav className='space-y-2' aria-label='Navegação da documentação'>
      {sections.map(section => (
        <DocumentationLink
          key={section.id}
          href={`#${section.id}`}
          title={section.title}
          isActive={currentSection === section.id}
        />
      ))}
    </nav>
  );
};

export default DocumentationNav;
