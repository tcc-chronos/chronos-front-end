import { type ReactNode } from 'react';
import { type DocumentationSectionProps } from './DocumentationSection.types';
import { parseDocumentationInline } from '../../../utils/documentationParser';

/**
 * DocumentationSection Molecule
 * Seção de conteúdo da documentação com parsing de markdown básico
 */
const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  section,
}) => {
  // Renderização com suporte a listas agrupadas e títulos intermediários
  const renderContent = (): ReactNode[] => {
    const lines = section.content.split('\n');
    const elements: ReactNode[] = [];
    let listBuffer: { type: 'ul' | 'ol'; items: string[] } | null = null;
    let elementKey = 0;

    const nextKey = (prefix: string) =>
      `${section.id}-${prefix}-${elementKey++}`;

    const flushList = () => {
      if (!listBuffer) return;

      const items = listBuffer.items.map((item, idx) => (
        <li key={`${section.id}-list-item-${idx}`}>
          {parseDocumentationInline(item)}
        </li>
      ));

      if (listBuffer.type === 'ol') {
        elements.push(
          <ol
            key={nextKey('list')}
            className='pl-5 list-decimal list-inside space-y-1 text-gray-700'
          >
            {items}
          </ol>
        );
      } else {
        elements.push(
          <ul
            key={nextKey('list')}
            className='pl-5 list-disc list-inside space-y-1 text-gray-700'
          >
            {items}
          </ul>
        );
      }

      listBuffer = null;
    };

    lines.forEach(rawLine => {
      const line = rawLine.replace(/\r$/, '');
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        flushList();
        return;
      }

      const unorderedMatch = trimmedLine.match(/^[-*]\s+(.+)/);
      const orderedMatch = trimmedLine.match(/^\d+[.)]\s+(.+)/);

      if (unorderedMatch || orderedMatch) {
        const type: 'ul' | 'ol' = unorderedMatch ? 'ul' : 'ol';
        const content = (unorderedMatch?.[1] ?? orderedMatch?.[1] ?? '').trim();

        if (!listBuffer || listBuffer.type !== type) {
          flushList();
          listBuffer = { type, items: [] };
        }

        listBuffer.items.push(content);
        return;
      }

      const headingMatch = trimmedLine.match(/^(#{2,4})\s+(.+)/);
      if (headingMatch) {
        flushList();
        const [, hashes, headingText] = headingMatch;
        const level = hashes.length;
        const sizeClass =
          level === 2 ? 'text-xl' : level === 3 ? 'text-lg' : 'text-base';

        elements.push(
          <h3
            key={nextKey('heading')}
            className={`${sizeClass} font-semibold text-gray-900 mt-4`}
          >
            {headingText}
          </h3>
        );
        return;
      }

      const blockquoteMatch = trimmedLine.match(/^>\s+(.+)/);
      if (blockquoteMatch) {
        flushList();
        elements.push(
          <div
            key={nextKey('blockquote')}
            className='border-l-4 border-blue-200 bg-blue-50/60 text-gray-700 italic px-4 py-2 rounded'
          >
            {parseDocumentationInline(blockquoteMatch[1])}
          </div>
        );
        return;
      }

      flushList();

      elements.push(
        <p key={nextKey('paragraph')} className='text-gray-700 leading-relaxed'>
          {parseDocumentationInline(trimmedLine)}
        </p>
      );
    });

    flushList();

    return elements;
  };

  return (
    <section id={section.id} className='mb-10 scroll-mt-20'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-900'>
        {section.title}
      </h2>
      <div className='space-y-4'>{renderContent()}</div>
    </section>
  );
};

export default DocumentationSection;
