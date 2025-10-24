import React from 'react';
import { RefreshCw } from 'lucide-react';

export interface PollingIndicatorProps {
  /**
   * Whether polling is active
   */
  isActive: boolean;
  /**
   * Text to display when polling is active
   */
  text?: string;
  /**
   * Size variant of the indicator
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * Visual variant of the indicator
   */
  variant?: 'primary' | 'secondary' | 'success';
  /**
   * Additional CSS classes
   */
  className?: string;
}

const PollingIndicator: React.FC<PollingIndicatorProps> = ({
  isActive,
  text = 'Atualizando...',
  size = 'md',
  variant = 'primary',
  className = '',
}) => {
  if (!isActive) return null;

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-2',
    lg: 'text-base px-4 py-3',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const variantClasses = {
    primary: 'text-blue-600 bg-blue-50 border-blue-200',
    secondary: 'text-gray-600 bg-gray-50 border-gray-200',
    success: 'text-green-600 bg-green-50 border-green-200',
  };

  return (
    <div
      className={`
        flex items-center border rounded-full
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <RefreshCw
        className={`${iconSizes[size]} animate-spin mr-2`}
        aria-hidden='true'
      />
      <span>{text}</span>
    </div>
  );
};

export default PollingIndicator;
