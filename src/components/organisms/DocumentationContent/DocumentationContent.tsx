import { DocumentationSection } from '../../molecules/DocumentationSection';
import { type DocumentationContentProps } from './DocumentationContent.types';
import { type DocumentationSection as DocSection } from '../../../types';
import { parseDocumentationInline } from '../../../utils/documentationParser';

/**
 * DocumentationContent Organism
 * Área principal da documentação com todas as seções
 */
const DocumentationContent: React.FC<DocumentationContentProps> = ({
  data,
}) => {
  return (
    <div
      className='scroll-smooth'
      role='main'
      aria-label='Conteúdo da documentação'
    >
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>{data.title}</h1>
        {data.description && (
          <p className='text-gray-600 mt-2 mb-8 leading-relaxed'>
            {parseDocumentationInline(data.description)}
          </p>
        )}
      </div>
      {data.sections.map((section: DocSection) => (
        <DocumentationSection key={section.id} section={section} />
      ))}
    </div>
  );
};

export default DocumentationContent;
