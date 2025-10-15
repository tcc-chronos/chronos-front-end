import { DocumentationNav } from '../../molecules/DocumentationNav';
import { type DocumentationSidebarProps } from './DocumentationSidebar.types';

/**
 * DocumentationSidebar Organism
 * Sidebar completa com navegação da documentação
 */
const DocumentationSidebar: React.FC<DocumentationSidebarProps> = ({
  sections,
}) => {
  return (
    <aside
      className='w-64 bg-gray-50 border-r border-gray-200 p-6 max-h-[calc(100vh-70px)] overflow-y-auto'
      role='complementary'
      aria-label='Navegação da documentação'
    >
      <h2 className='text-lg font-semibold mb-4 text-gray-900'>Conteúdo</h2>
      <DocumentationNav sections={sections} />
    </aside>
  );
};

export default DocumentationSidebar;
