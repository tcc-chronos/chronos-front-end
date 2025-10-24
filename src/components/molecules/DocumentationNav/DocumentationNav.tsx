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
  const [currentSection, setCurrentSection] = useState(
    activeSection || sections[0]?.id || ''
  );

  useEffect(() => {
    if (!sections.length) {
      setCurrentSection('');
      return;
    }

    if (
      activeSection &&
      sections.some(section => section.id === activeSection)
    ) {
      setCurrentSection(prev =>
        prev === activeSection ? prev : activeSection
      );
      return;
    }

    setCurrentSection(prev => {
      if (prev && sections.some(section => section.id === prev)) {
        return prev;
      }
      return sections[0].id;
    });
  }, [activeSection, sections]);

  useEffect(() => {
    const OFFSET = 140;

    const handleScroll = () => {
      if (!sections.length) return;

      let nextSectionId = sections[0]?.id ?? '';
      let closestTop = Number.NEGATIVE_INFINITY;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= OFFSET && rect.top > closestTop) {
          nextSectionId = section.id;
          closestTop = rect.top;
        } else {
          break;
        }
      }

      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (scrolledToBottom) {
        const lastSection = sections[sections.length - 1];
        if (lastSection) {
          nextSectionId = lastSection.id;
        }
      }

      setCurrentSection(prev =>
        prev === nextSectionId ? prev : nextSectionId
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && sections.some(section => section.id === hash)) {
        setCurrentSection(prev => (prev === hash ? prev : hash));
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [sections]);

  return (
    <nav className='space-y-2' aria-label='Navegação da documentação'>
      {sections.map(section => (
        <DocumentationLink
          key={section.id}
          href={`#${section.id}`}
          title={section.title}
          isActive={
            currentSection === section.id || activeSection === section.id
          }
        />
      ))}
    </nav>
  );
};

export default DocumentationNav;
