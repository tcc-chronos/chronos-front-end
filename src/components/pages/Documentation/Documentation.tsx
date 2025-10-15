import { useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { DocumentationSidebarContent } from '../../molecules/DocumentationSidebarContent';
import { DocumentationContent } from '../../organisms/DocumentationContent';
import { useSidebar } from '../../../hooks/useSidebar';
import documentationData from '../../../data/documentation.json';

/**
 * Documentation Page
 * Página de documentação integrada com DefaultLayout
 * Utiliza a Sidebar do contexto para navegação
 */
const Documentation: React.FC = () => {
  const { addItem, clearItems } = useSidebar();

  useEffect(() => {
    clearItems();

    addItem({
      id: 'documentation',
      icon: <BookOpen />,
      label: 'Navegação',
      tooltip: 'Navegue pelos tópicos da documentação',
      content: <DocumentationSidebarContent />,
    });

    return () => {
      clearItems();
    };
  }, [addItem, clearItems]);

  return (
    <div className='space-y-6 scroll-smooth'>
      <DocumentationContent data={documentationData} />
    </div>
  );
};

export default Documentation;
