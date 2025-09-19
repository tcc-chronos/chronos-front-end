import { useEffect } from 'react';
import { Settings, ChartLine, GitFork } from 'lucide-react';
import {
  BasicTrainingSidebarContent,
  DataTrainingSidebarContent,
  RNNTrainingSidebarContent,
} from '../../molecules';
import { ModelsList } from '../../organisms';
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

    addItem({
      id: 'rnn',
      icon: <GitFork className='rotate-90' />,
      label: 'Configuração de RNN',
      tooltip: 'Configure a arquitetura da rede neural',
      content: <RNNTrainingSidebarContent />,
    });

    return () => {
      clearItems();
    };
  }, [addItem, clearItems]);

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h1 className='text-3xl font-bold text-gray-900'>Treinamento</h1>
        <p className='text-gray-600 mt-2'>
          Gerencie seus modelos de rede neural e configure novos treinamentos.
          Use a sidebar para configurar os parâmetros dos seus modelos.
        </p>
      </div>

      {/* Models List */}
      <div>
        <h2 className='text-xl font-semibold text-gray-900 mb-4'>
          Seus Modelos
        </h2>
        <ModelsList />
      </div>
    </div>
  );
};

export default Training;
