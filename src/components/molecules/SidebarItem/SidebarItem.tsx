import React from 'react';
import { IconButton } from '../../atoms/IconButton';
import type { SidebarItemProps } from './SidebarItem.types';

const SidebarItem: React.FC<SidebarItemProps> = ({
  id,
  icon,
  label,
  content,
  isActive = false,
  onClick,
  disabled = false,
  tooltip,
  className = '',
  ...props
}) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick(id);
    }
  };

  return (
    <div className={`flex flex-col ${className}`} {...props}>
      <div className='flex items-center justify-center p-2'>
        <IconButton
          icon={icon}
          isActive={isActive}
          onClick={handleClick}
          disabled={disabled}
          ariaLabel={label}
          tooltip={tooltip}
          size='lg'
        />
      </div>

      {isActive && content && <div className='hidden'>{content}</div>}
    </div>
  );
};

export default SidebarItem;
