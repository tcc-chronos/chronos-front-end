import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AnalyticsSidebarContent from './AnalyticsSidebarContent';
import type { MetricCardProps } from './AnalyticsSidebarContent.types';

const mockIcon = <div data-testid='mock-icon'>Icon</div>;

const mockMetrics: MetricCardProps[] = [
  {
    title: 'Total Users',
    value: '1,234',
    change: '+12% from last month',
    changeType: 'positive',
    variant: 'blue',
    icon: mockIcon,
  },
  {
    title: 'Revenue',
    value: '$45,678',
    change: '-5% from last month',
    changeType: 'negative',
    variant: 'green',
  },
  {
    title: 'Active Sessions',
    value: 892,
    change: '±0% from last month',
    changeType: 'neutral',
    variant: 'purple',
  },
];

describe('AnalyticsSidebarContent', () => {
  it('renders analytics content correctly', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
  });

  it('renders all metric cards', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('Active Sessions')).toBeInTheDocument();
  });

  it('displays metric values correctly', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByText('$45,678')).toBeInTheDocument();
    expect(screen.getByText('892')).toBeInTheDocument();
  });

  it('displays change information when provided', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    expect(screen.getByText('+12% from last month')).toBeInTheDocument();
    expect(screen.getByText('-5% from last month')).toBeInTheDocument();
    expect(screen.getByText('±0% from last month')).toBeInTheDocument();
  });

  it('applies correct change type colors', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    const positiveChange = screen.getByText('+12% from last month');
    const negativeChange = screen.getByText('-5% from last month');
    const neutralChange = screen.getByText('±0% from last month');

    expect(positiveChange).toHaveClass('text-green-600');
    expect(negativeChange).toHaveClass('text-red-600');
    expect(neutralChange).toHaveClass('text-gray-600');
  });

  it('applies correct variant classes to metric cards', () => {
    const { container } = render(
      <AnalyticsSidebarContent metrics={mockMetrics} />
    );

    const blueCard = container.querySelector('.bg-blue-50');
    const greenCard = container.querySelector('.bg-green-50');
    const purpleCard = container.querySelector('.bg-purple-50');

    expect(blueCard).toBeInTheDocument();
    expect(greenCard).toBeInTheDocument();
    expect(purpleCard).toBeInTheDocument();
  });

  it('renders icons when provided', () => {
    render(<AnalyticsSidebarContent metrics={mockMetrics} />);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('handles metrics without change information', () => {
    const metricsWithoutChange: MetricCardProps[] = [
      {
        title: 'Simple Metric',
        value: '100',
        variant: 'yellow',
      },
    ];

    render(<AnalyticsSidebarContent metrics={metricsWithoutChange} />);

    expect(screen.getByText('Simple Metric')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('handles metrics without icons', () => {
    const metricsWithoutIcons: MetricCardProps[] = [
      {
        title: 'No Icon Metric',
        value: '500',
        variant: 'red',
      },
    ];

    render(<AnalyticsSidebarContent metrics={metricsWithoutIcons} />);

    expect(screen.getByText('No Icon Metric')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <AnalyticsSidebarContent
        metrics={mockMetrics}
        className='custom-analytics-class'
      />
    );

    expect(container.firstChild).toHaveClass('custom-analytics-class');
  });

  it('renders empty state when no metrics provided', () => {
    render(<AnalyticsSidebarContent metrics={[]} />);

    expect(screen.getByText('Analytics')).toBeInTheDocument();
    // Should still render the container but with no metrics
    const container = screen.getByText('Analytics').closest('div');
    expect(container).toBeInTheDocument();
  });

  it('handles all variant types correctly', () => {
    const allVariants: MetricCardProps[] = [
      { title: 'Blue', value: '1', variant: 'blue' },
      { title: 'Green', value: '2', variant: 'green' },
      { title: 'Purple', value: '3', variant: 'purple' },
      { title: 'Red', value: '4', variant: 'red' },
      { title: 'Yellow', value: '5', variant: 'yellow' },
    ];

    const { container } = render(
      <AnalyticsSidebarContent metrics={allVariants} />
    );

    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-green-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-purple-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-red-50')).toBeInTheDocument();
    expect(container.querySelector('.bg-yellow-50')).toBeInTheDocument();
  });

  it('uses default variant when not specified', () => {
    const metricsWithoutVariant: MetricCardProps[] = [
      {
        title: 'Default Variant',
        value: '999',
      },
    ];

    const { container } = render(
      <AnalyticsSidebarContent metrics={metricsWithoutVariant} />
    );

    // Default variant should be blue
    expect(container.querySelector('.bg-blue-50')).toBeInTheDocument();
  });

  it('uses default changeType when not specified', () => {
    const metricsWithChange: MetricCardProps[] = [
      {
        title: 'Change Without Type',
        value: '123',
        change: 'Some change text',
      },
    ];

    render(<AnalyticsSidebarContent metrics={metricsWithChange} />);

    const changeText = screen.getByText('Some change text');
    expect(changeText).toHaveClass('text-gray-600'); // neutral default
  });
});
