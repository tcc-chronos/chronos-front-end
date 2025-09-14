import React, { useEffect } from 'react';
import { BarChart3 } from 'lucide-react';
import { useSidebar } from '../../../hooks/useSidebarHook';
import { AnalyticsSidebarContent } from '../../molecules';

const DashboardPage: React.FC = () => {
  const { addItem, clearItems } = useSidebar();

  useEffect(() => {
    clearItems();

    addItem({
      id: 'analytics',
      icon: <BarChart3 className='w-5 h-5' />,
      label: 'Analytics',
      tooltip: 'Visualizar métricas e estatísticas',
      content: (
        <AnalyticsSidebarContent
          metrics={[
            {
              title: 'Visitas',
              value: '12,345',
              change: '+23%',
              changeType: 'positive',
              variant: 'blue',
            },
            {
              title: 'Conversões',
              value: '847',
              change: '+12%',
              changeType: 'positive',
              variant: 'green',
            },
            {
              title: 'Receita',
              value: 'R$ 45.678',
              change: '+8%',
              changeType: 'positive',
              variant: 'purple',
            },
            {
              title: 'Taxa de Rejeição',
              value: '2.4%',
              change: '-5%',
              changeType: 'positive',
              variant: 'red',
            },
          ]}
        />
      ),
    });

    return () => {
      clearItems();
    };
  }, [addItem, clearItems]);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <p className='text-gray-600 mt-2'>
          Bem-vindo ao painel principal. Use a sidebar para visualizar as
          métricas.
        </p>
      </div>
    </div>
  );
};

export default DashboardPage;
