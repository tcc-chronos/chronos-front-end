import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../atoms';
import {
  NumberInputField,
  SidebarContent,
  SelectField,
  TrainingButton,
} from '../';
import { SortableList } from '../SortableList';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import type {
  RNNTrainingSidebarContentProps,
  Layer,
} from './RNNTrainingSidebarContent.types';

interface ValidationErrors {
  neurons?: string;
  dropout?: string;
  type?: string;
}

const RNNTrainingSidebarContent: React.FC<RNNTrainingSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const { rnn_units, dense_units, setField } = useTrainingSidebarStore();

  const [neurons, setNeurons] = useState<number | undefined>(undefined);
  const [dropout, setDropout] = useState<number | undefined>(0.2);
  const [layerType, setLayerType] = useState<'RNN' | 'Dense' | ''>('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const layerTypeOptions = [
    { value: 'RNN', label: 'RNN' },
    { value: 'Dense', label: 'Dense' },
  ];

  // Converter arrays do store para objetos Layer
  const layersRNN = useMemo<Layer[]>(() => {
    return rnn_units.map((layer, index) => ({
      id: `rnn-${index}`,
      neurons: layer.neurons,
      dropout: layer.dropout,
      type: 'RNN' as const,
    }));
  }, [rnn_units]);

  const layersDense = useMemo<Layer[]>(() => {
    return dense_units.map((layer, index) => ({
      id: `dense-${index}`,
      neurons: layer.neurons,
      dropout: layer.dropout,
      type: 'Dense' as const,
    }));
  }, [dense_units]);

  const validateNeurons = (value: number | undefined) =>
    !value || value < 1
      ? 'Número de neurônios deve ser no mínimo 1'
      : undefined;

  const validateDropout = (value: number | undefined) =>
    value === undefined || value < 0.00001 || value > 1
      ? 'Dropout deve estar entre 0.00001 e 1'
      : undefined;

  const validateLayerType = (value: string) =>
    !value ? 'Tipo da camada é obrigatório' : undefined;

  const isFormValid = () => {
    return (
      !validateNeurons(neurons) &&
      !validateDropout(dropout) &&
      !validateLayerType(layerType) &&
      neurons &&
      dropout !== undefined &&
      layerType
    );
  };

  const handleNeuronsChange = (value: number | undefined) => {
    setNeurons(value);
    setErrors(prev => ({ ...prev, neurons: validateNeurons(value) }));
  };

  const handleDropoutChange = (value: number | undefined) => {
    setDropout(value);
    setErrors(prev => ({ ...prev, dropout: validateDropout(value) }));
  };

  const handleLayerTypeChange = (value: string | number) => {
    const typeValue = String(value) as 'RNN' | 'Dense' | '';
    setLayerType(typeValue);
    setErrors(prev => ({ ...prev, type: validateLayerType(typeValue) }));
  };

  const handleAddLayer = () => {
    if (!isFormValid() || !neurons || dropout === undefined || !layerType) {
      setErrors({
        neurons: validateNeurons(neurons),
        dropout: validateDropout(dropout),
        type: validateLayerType(layerType),
      });
      return;
    }

    const newLayer = { neurons, dropout };

    if (layerType === 'RNN') {
      const newRnnUnits = [...rnn_units, newLayer];
      setField('rnn_units', newRnnUnits);
    } else if (layerType === 'Dense') {
      const newDenseUnits = [...dense_units, newLayer];
      setField('dense_units', newDenseUnits);
    }

    // Reset form
    setNeurons(undefined);
    setDropout(0.2);
    setLayerType('');
    setErrors({});
  };

  const handleOrderChangeRNN = useCallback(
    (newLayers: Layer[]) => {
      const newUnits = newLayers.map(layer => ({
        neurons: layer.neurons,
        dropout: layer.dropout,
      }));
      setField('rnn_units', newUnits);
    },
    [setField]
  );

  const handleOrderChangeDense = useCallback(
    (newLayers: Layer[]) => {
      const newUnits = newLayers.map(layer => ({
        neurons: layer.neurons,
        dropout: layer.dropout,
      }));
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
          infoTooltip='Número de neurônios da camada.'
          required
        />
        <NumberInputField
          id='dropout'
          label='Dropout:'
          value={dropout}
          onChange={handleDropoutChange}
          min={0.00001}
          max={1}
          step={0.00001}
          decimalPlaces={5}
          placeholder='0.2'
          error={errors.dropout}
          infoTooltip='Taxa de dropout para regularização.'
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
          infoTooltip='Tipo da camada (RNN ou Dense).'
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
      <div className='fixed bottom-0 bg-white pb-2 border-gray-200 w-70'>
        <TrainingButton variant='primary' fullWidth />
      </div>
    </SidebarContent>
  );
};

export default RNNTrainingSidebarContent;
