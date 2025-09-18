import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../atoms';
import { NumberInputField, SidebarContent, SelectField } from '../';
import { SortableList } from '../SortableList';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import type {
  RNNTrainingSidebarContentProps,
  Layer,
} from './RNNTrainingSidebarContent.types';

interface ValidationErrors {
  neurons?: string;
  type?: string;
}

const RNNTrainingSidebarContent: React.FC<RNNTrainingSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const { rnn_units, dense_units, setField } = useTrainingSidebarStore();

  const [neurons, setNeurons] = useState<number | undefined>(undefined);
  const [layerType, setLayerType] = useState<'RNN' | 'Dense' | ''>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const layerTypeOptions = [
    { value: 'RNN', label: 'RNN' },
    { value: 'Dense', label: 'Dense' },
  ];

  // Converter arrays do store para objetos Layer
  const layersRNN = useMemo<Layer[]>(() => {
    return rnn_units.map((neurons, index) => ({
      id: `rnn-${index}`,
      neurons,
      type: 'RNN' as const,
    }));
  }, [rnn_units]);

  const layersDense = useMemo<Layer[]>(() => {
    return dense_units.map((neurons, index) => ({
      id: `dense-${index}`,
      neurons,
      type: 'Dense' as const,
    }));
  }, [dense_units]);

  const validateNeurons = (value: number | undefined) =>
    !value || value < 1
      ? 'Número de neurônios deve ser no mínimo 1'
      : undefined;

  const validateLayerType = (value: string) =>
    !value ? 'Tipo da camada é obrigatório' : undefined;

  const isFormValid = () => {
    return (
      !validateNeurons(neurons) &&
      !validateLayerType(layerType) &&
      neurons &&
      layerType
    );
  };

  const handleNeuronsChange = (value: number | undefined) => {
    setNeurons(value);
    setErrors(prev => ({ ...prev, neurons: validateNeurons(value) }));
  };

  const handleLayerTypeChange = (value: string | number) => {
    const typeValue = String(value) as 'RNN' | 'Dense' | '';
    setLayerType(typeValue);
    setErrors(prev => ({ ...prev, type: validateLayerType(typeValue) }));
  };

  const handleAddLayer = () => {
    if (!isFormValid() || !neurons || !layerType) {
      setErrors({
        neurons: validateNeurons(neurons),
        type: validateLayerType(layerType),
      });
      return;
    }

    if (layerType === 'RNN') {
      const newRnnUnits = [...rnn_units, neurons];
      setField('rnn_units', newRnnUnits);
    } else if (layerType === 'Dense') {
      const newDenseUnits = [...dense_units, neurons];
      setField('dense_units', newDenseUnits);
    }

    // Reset form
    setNeurons(undefined);
    setLayerType('');
    setErrors({});
  };

  const handleOrderChangeRNN = useCallback(
    (newLayers: Layer[]) => {
      const newUnits = newLayers.map(layer => layer.neurons);
      setField('rnn_units', newUnits);
    },
    [setField]
  );

  const handleOrderChangeDense = useCallback(
    (newLayers: Layer[]) => {
      const newUnits = newLayers.map(layer => layer.neurons);
      setField('dense_units', newUnits);
    },
    [setField]
  );

  const handleRemoveLayer = useCallback(
    (id: string, type: 'RNN' | 'Dense') => {
      if (type === 'RNN') {
        const layerIndex = parseInt(id.split('-')[1]);
        const newUnits = rnn_units.filter((_, index) => index !== layerIndex);
        setField('rnn_units', newUnits);
      } else if (type === 'Dense') {
        const layerIndex = parseInt(id.split('-')[1]);
        const newUnits = dense_units.filter((_, index) => index !== layerIndex);
        setField('dense_units', newUnits);
      }
    },
    [rnn_units, dense_units, setField]
  );

  return (
    <SidebarContent
      title='Configuração de RNN'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-6'>
        <NumberInputField
          id='neurons'
          label='Neurônios:'
          value={neurons}
          onChange={handleNeuronsChange}
          min={1}
          decimalPlaces={0}
          placeholder='128'
          error={errors.neurons}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <SelectField
          id='layer_type'
          label='Tipo da camada:'
          value={layerType}
          onChange={handleLayerTypeChange}
          options={layerTypeOptions}
          placeholder='Selecione o tipo'
          error={errors.type}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <Button
          onClick={handleAddLayer}
          variant='primary'
          fullWidth
          disabled={!isFormValid()}
        >
          Adicionar Camada
        </Button>

        {/* Lista de camadas */}
        <SortableList
          layersRNN={layersRNN}
          layersDense={layersDense}
          onOrderChangeRNN={handleOrderChangeRNN}
          onOrderChangeDense={handleOrderChangeDense}
          onRemoveLayer={handleRemoveLayer}
        />
      </div>
    </SidebarContent>
  );
};

export default RNNTrainingSidebarContent;
