import React, { useCallback } from 'react';
import { SidebarItem } from '../../molecules/SidebarItem';
import { useSidebar } from '../../../hooks/useSidebarHook';
import type { SidebarProps } from './Sidebar.types';

const Sidebar: React.FC<Partial<SidebarProps>> = ({
  className = '',
  ...props
}) => {
  const { items, activeItemId, setActiveItem } = useSidebar();

  const handleItemClick = useCallback(
    (itemId: string) => {
      const newActiveId = activeItemId === itemId ? null : itemId;
      setActiveItem(newActiveId);
    },
    [activeItemId, setActiveItem]
  );

  const activeItem = items.find(item => item.id === activeItemId);

  const baseClasses =
    'min-h-full bg-white border-r border-gray-200 shadow-lg flex z-40';

  return (
    <div
      className={`${baseClasses} ${className}`}
      role='complementary'
      {...props}
    >
      {/* Parte fixa da sidebar - w-20 */}
      <div className='w-20 flex flex-col items-center py-4 space-y-2 bg-gray-50 border-r border-gray-200 min-h-full'>
        {items.map(item => (
          <SidebarItem
            key={item.id}
            id={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activeItemId === item.id}
            onClick={handleItemClick}
            disabled={item.disabled}
            tooltip={item.tooltip}
          />
        ))}
      </div>

      {/* Parte expansível da sidebar - w-80 */}
      {activeItem && activeItem.content && (
        <div className='w-80 flex flex-col bg-white min-h-full'>
          {/* Header do conteúdo expandido */}
          <div className='px-6 py-4 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {activeItem.label}
              </h3>
              <button
                onClick={() => handleItemClick(activeItem.id)}
                className='p-1 text-gray-400 hover:text-gray-600 rounded'
                aria-label='Fechar painel'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Conteúdo expandido */}
          <div className='flex-1 overflow-y-auto'>{activeItem.content}</div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
