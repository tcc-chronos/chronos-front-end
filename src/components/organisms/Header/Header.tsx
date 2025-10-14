import React from 'react';
import { Logo } from '../../atoms/Logo';
import { Navigation } from '../../molecules/Navigation';
import type { HeaderProps } from './Header.types';

/**
 * Componente Header
 *
 * Organismo que combina Logo e Navigation numa navbar
 */
const Header: React.FC<HeaderProps> = ({
  navigationItems = [
    { label: 'Training', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Documentation', href: '/documentation' },
  ],
  logoSize = 'xl',
  className = '',
  onNavigationItemClick,
  ...props
}) => {
  return (
    <header
      className={`bg-white shadow-sm border-b border-gray-200 ${className}`}
      {...props}
    >
      <div className='mx-auto px-4'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center mr-4'>
            <Logo size={logoSize} showText={true} />
          </div>

          <div className='block'>
            <Navigation
              items={navigationItems}
              onItemClick={onNavigationItemClick}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
