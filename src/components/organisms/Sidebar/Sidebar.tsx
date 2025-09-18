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
      <div className='w-20 flex flex-col items-center py-4 space-y-2 bg-white border-r border-gray-200 min-h-full'>
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

      {activeItem && activeItem.content && (
        <div className='w-80 flex flex-col bg-white min-h-full'>
          <div className='flex-1 overflow-y-auto'>{activeItem.content}</div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
