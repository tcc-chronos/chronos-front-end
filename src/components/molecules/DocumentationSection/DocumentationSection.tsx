import { type DocumentationSectionProps } from './DocumentationSection.types';

/**
 * DocumentationSection Molecule
 * Seção de conteúdo da documentação com parsing de markdown básico
 */
const DocumentationSection: React.FC<DocumentationSectionProps> = ({
  section,
}) => {
  /**
   * Função para fazer parsing básico de texto com markdown
   * Suporta: **texto em negrito** e `código inline`
   */
  const parseText = (text: string): React.ReactNode[] => {
    return text.split(/(\*\*.*?\*\*|`.*?`)/g).map((part, idx) => {
      // Negrito: **texto**
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={idx} className='font-semibold text-gray-900'>
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Código inline: `código`
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={idx}
            className='px-1.5 py-0.5 rounded text-sm font-mono bg-gray-100 text-gray-800'
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  /**
   * Renderiza o conteúdo da seção, processando cada linha
   */
  const renderContent = () => {
    const lines = section.content.split('\n');

    return lines.map((line: string, index: number) => {
      const trimmedLine = line.trim();

      // Lista (começa com "- ")
      if (trimmedLine.startsWith('- ')) {
        return (
          <ul key={index} className='list-disc list-inside mb-2'>
            <li className='text-gray-700'>
              {parseText(trimmedLine.replace('- ', ''))}
            </li>
          </ul>
        );
      }

      // Linha vazia
      if (trimmedLine === '') {
        return <div key={index} className='h-2' />;
      }

      // Parágrafo normal
      return (
        <p key={index} className='text-gray-700 mb-2'>
          {parseText(trimmedLine)}
        </p>
      );
    });
  };

  return (
    <section id={section.id} className='mb-10 scroll-mt-20'>
      <h2 className='text-2xl font-semibold mb-4 text-gray-900'>
        {section.title}
      </h2>
      <div className='space-y-2'>{renderContent()}</div>
    </section>
  );
};

export default DocumentationSection;
