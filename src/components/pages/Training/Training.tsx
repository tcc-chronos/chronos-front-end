import { useEffect } from 'react';
import { Settings, ChartLine } from 'lucide-react';
import {
  BasicTrainingSidebarContent,
  DataTrainingSidebarContent,
} from '../../molecules';
import { useSidebar } from '../../../hooks/useSidebarHook';

const Training = () => {
  const { addItem, clearItems } = useSidebar();

  useEffect(() => {
    clearItems();

    addItem({
      id: 'basic',
      icon: <Settings />,
      label: 'Configuração de Treinamento',
      tooltip: 'Configure os parâmetros do seu treinamento',
      content: <BasicTrainingSidebarContent />,
    });

    addItem({
      id: 'data',
      icon: <ChartLine />,
      label: 'Configuração de Dados',
      tooltip: 'Configure os parâmetros dos dados de treinamento',
      content: <DataTrainingSidebarContent />,
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

export default Training;
