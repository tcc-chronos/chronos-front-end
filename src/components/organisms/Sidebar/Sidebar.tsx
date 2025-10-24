import React, { useCallback } from 'react';
import { SidebarItem } from '../../molecules/SidebarItem';
import { useSidebar } from '../../../hooks/useSidebar';
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

  const baseClasses = 'h-full bg-white border-r border-gray-200 flex z-40';

  return (
    <div
      className={`${baseClasses} ${className}`}
      role='complementary'
      {...props}
    >
      <div className='w-20 flex flex-col items-center py-4 space-y-2 bg-white border-r border-gray-200 h-full'>
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

      <div
        className={`${activeItem && activeItem.content ? 'w-80' : 'w-0'} bg-white text-gray-700 transition-all duration-300 overflow-y-auto text-nowrap`}
      >
        {activeItem?.content}
      </div>
    </div>
  );
};

export default Sidebar;
