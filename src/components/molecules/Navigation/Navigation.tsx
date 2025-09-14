import React from 'react';
import { NavigationLink } from '../../atoms/NavigationLink';
import type { NavigationProps } from './Navigation.types';

/**
 * Componente Navigation
 *
 * Molécula que agrupa links de navegação usando NavigationLink
 */
const Navigation: React.FC<NavigationProps> = ({
  items,
  className = '',
  onItemClick,
  ...props
}) => {
  return (
    <nav
      className={`flex space-x-1 ${className}`}
      role='navigation'
      aria-label='Navegação principal'
      {...props}
    >
      {items.map(item => (
        <NavigationLink
          key={item.href}
          href={item.href}
          onClick={(event: React.MouseEvent<HTMLAnchorElement>) =>
            onItemClick?.(item, event)
          }
        >
          {item.label}
        </NavigationLink>
      ))}
    </nav>
  );
};

export default Navigation;
