import React from 'react';
import type { NavigationLinkProps } from './NavigationLink.types';
import { NavLink } from 'react-router-dom';

/**
 * Componente NavigationLink
 *
 * Átomo para links de navegação com estados ativo/inativo usando React Router
 */
const NavigationLink: React.FC<NavigationLinkProps> = ({
  children,
  href,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses =
    'px-3 py-2 rounded-md font-secondary transition-colors duration-200 hover:text-blue-600 focus:outline-none';

  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `${baseClasses} ${
          isActive
            ? 'text-blue-600 bg-blue-50 active'
            : 'text-gray-600 hover:bg-gray-50'
        } ${className}`
      }
      onClick={onClick}
      {...props}
    >
      {children}
    </NavLink>
  );
};

export default NavigationLink;
