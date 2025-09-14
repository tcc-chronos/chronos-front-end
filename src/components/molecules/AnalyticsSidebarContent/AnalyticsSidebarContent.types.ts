import type { ReactNode } from 'react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: ReactNode;
  variant?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
}

export interface AnalyticsSidebarContentProps {
  metrics: MetricCardProps[];
  className?: string;
}
