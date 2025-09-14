import React from 'react';
import { SidebarContent } from '../SidebarContent';
import type {
  AnalyticsSidebarContentProps,
  MetricCardProps,
} from './AnalyticsSidebarContent.types';

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  variant = 'blue',
}) => {
  const variants = {
    blue: 'bg-blue-50 text-blue-900 border-blue-100',
    green: 'bg-green-50 text-green-900 border-green-100',
    purple: 'bg-purple-50 text-purple-900 border-purple-100',
    red: 'bg-red-50 text-red-900 border-red-100',
    yellow: 'bg-yellow-50 text-yellow-900 border-yellow-100',
  };

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const variantClass = variants[variant];
  const changeColor = changeColors[changeType];

  return (
    <div className={`p-4 rounded-lg border ${variantClass}`}>
      <div className='flex items-center justify-between mb-2'>
        <h5 className='font-medium'>{title}</h5>
        {icon && <div className='text-current opacity-80'>{icon}</div>}
      </div>
      <p className='text-2xl font-bold mb-1'>{value}</p>
      {change && <p className={`text-sm ${changeColor}`}>{change}</p>}
    </div>
  );
};

const AnalyticsSidebarContent: React.FC<AnalyticsSidebarContentProps> = ({
  metrics,
  className = '',
  ...props
}) => {
  return (
    <SidebarContent
      title='Analytics'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-3'>
        {metrics.map((metric, index) => (
          <MetricCard key={index} {...metric} />
        ))}
      </div>
    </SidebarContent>
  );
};

export default AnalyticsSidebarContent;
