import React from 'react';
import type { SidebarContentProps } from './SidebarContent.types';

const SidebarContent: React.FC<SidebarContentProps> = ({
  title,
  children,
  className = '',
  headerActions,
  footer,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default: 'p-4 space-y-4',
    compact: 'p-4 space-y-3',
    detailed: 'p-6 space-y-6',
  };

  const variantClass = variants[variant];

  return (
    <div className={`${variantClass} ${className}`} {...props}>
      {/* Header com título e ações opcionais */}
      <div className='flex items-center justify-between'>
        <h4 className='text-lg my-4 font-semibold text-gray-900'>{title}</h4>
        {headerActions && (
          <div className='flex items-center space-x-2'>{headerActions}</div>
        )}
      </div>

      {/* Conteúdo principal */}
      <div className='flex-1 text-sm'>{children}</div>

      {/* Footer opcional */}
      {footer && <div className='pt-4 border-t border-gray-200'>{footer}</div>}
    </div>
  );
};

export default SidebarContent;
