import React from 'react';
import type { LogoProps } from './Logo.types';

/**
 * Componente Logo do Chronos
 *
 * Átomo que exibe o logo da aplicação com diferentes tamanhos
 * e opção de mostrar o texto
 */
const Logo: React.FC<LogoProps> = ({
  size = 'sm',
  showText = true,
  className = '',
  ...props
}) => {
  // Definindo os tamanhos do logo
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`} {...props}>
      <svg
        className={`${sizeClasses[size]} flex-shrink-0`}
        viewBox='0 0 797 749'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
        aria-label='Chronos Logo'
      >
        <circle cx='396' cy='358' r='350' fill='#0E5476' />
        <path
          d='M581.83 60.8311C680.504 122.724 746.108 232.472 746.108 357.544C746.108 550.844 589.408 707.544 396.108 707.544C220.604 707.544 75.2715 578.367 50 409.905L221.82 206.124L480 222.5L581.83 60.8311Z'
          fill='#1F6E95'
        />
        <path
          d='M705.271 193C731.489 242.081 746.354 298.141 746.354 357.673C746.354 550.973 589.653 707.673 396.354 707.673C250.592 707.673 125.642 618.57 73 491.86L232.354 324.673L519.5 374.358L705.271 193Z'
          fill='#1EA2BD'
        />
        <path
          d='M745.671 350.71C745.722 353.183 745.75 355.661 745.75 358.146C745.75 551.446 589.05 708.146 395.75 708.146C297.719 708.146 209.103 667.842 145.563 602.902L243.204 466.146L470.324 536.931L745.671 350.71Z'
          fill='#6CE5E8'
        />
      </svg>
      {showText && (
        <span
          className={`font-bold text-brand-primary-darkest font-secondary text-2xl`}
          aria-label='Chronos'
        >
          Chronos
        </span>
      )}
    </div>
  );
};

export default Logo;
