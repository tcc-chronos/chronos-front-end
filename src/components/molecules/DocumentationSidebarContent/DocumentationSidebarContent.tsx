import React from 'react';
import { SidebarContent } from '../';
import { DocumentationNav } from '../DocumentationNav';
import documentationData from '../../../data/documentation.json';
import type { DocumentationSidebarContentProps } from './DocumentationSidebarContent.types';

/**
 * DocumentationSidebarContent Molecule
 * Conteúdo da sidebar para navegação da documentação
 * Segue o padrão de BasicTrainingSidebarContent
 */
const DocumentationSidebarContent: React.FC<
  DocumentationSidebarContentProps
> = ({ className = '', ...props }) => {
  return (
    <SidebarContent
      title='Documentação'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-2'>
        <DocumentationNav sections={documentationData.sections} />
      </div>
    </SidebarContent>
  );
};

export default DocumentationSidebarContent;
