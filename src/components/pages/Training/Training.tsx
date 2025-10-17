import { useEffect } from 'react';
import { Settings, ChartLine, GitFork } from 'lucide-react';
import {
  BasicTrainingSidebarContent,
  DataTrainingSidebarContent,
  RNNTrainingSidebarContent,
} from '../../molecules';
import { ModelsList } from '../../organisms';
import { PollingIndicator } from '../../atoms';
import { useSidebar } from '../../../hooks/useSidebar';
import { useModels } from '../../../hooks/useModels';

const Training = () => {
  const { addItem, clearItemsPreservingActive } = useSidebar();
  const { isPolling } = useModels();

  useEffect(() => {
    clearItemsPreservingActive();

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
      clearItemsPreservingActive();
    };
  }, [addItem, clearItemsPreservingActive]);

  return (
    <div className='space-y-6'>
      <div>
        <div className='flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-gray-900'>Treinamento</h1>
          <PollingIndicator
            isActive={isPolling}
            text='Treinamento em andamento...'
            size='md'
            variant='primary'
          />
        </div>
        <p className='text-gray-600 mt-2'>
          Gerencie seus modelos de rede neural e configure novos treinamentos.
          Use a sidebar para configurar os parâmetros dos seus modelos.
        </p>
      </div>

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
