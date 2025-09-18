import React, { useState } from 'react';
import { NumberInputField, SidebarContent } from '../';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import type { DataTrainingSidebarContentProps } from './DataTrainingSidebarContent.types';

interface ValidationErrors {
  window_size?: string;
  learning_rate?: string;
  dropout_rate?: string;
  early_stopping_patience?: string;
  volume?: string;
}

const DataTrainingSidebarContent: React.FC<DataTrainingSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const {
    window_size,
    learning_rate,
    dropout_rate,
    early_stopping_patience,
    volume,
    setField,
  } = useTrainingSidebarStore();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateWindowSize = (value: number | undefined) =>
    !value || value < 1 ? 'Janela de entrada deve ser no mínimo 1' : undefined;
  const validateLearningRate = (value: number | undefined) =>
    !value || value < 0.000001 || value > 1
      ? 'Taxa de aprendizado deve estar entre 0.000001 e 1'
      : undefined;
  const validateDropoutRate = (value: number | undefined) =>
    !value || value < 0.00001 || value > 1
      ? 'Taxa de dropout deve estar entre 0.00001 e 1'
      : undefined;
  const validateEarlyStoppingPatience = (value: number | undefined) =>
    !value || value < 1
      ? 'Paciência de early stopping deve ser no mínimo 1'
      : undefined;
  const validateVolume = (value: number | undefined) =>
    !value || value < 1
      ? 'Volume de Treinamento deve ser no mínimo 1'
      : undefined;

  const handleWindowSizeChange = (value: number | undefined) => {
    setField('window_size', value ?? 1);
    setErrors(prev => ({ ...prev, window_size: validateWindowSize(value) }));
  };
  const handleLearningRateChange = (value: number | undefined) => {
    setField('learning_rate', value ?? 0.000001);
    setErrors(prev => ({
      ...prev,
      learning_rate: validateLearningRate(value),
    }));
  };
  const handleDropoutRateChange = (value: number | undefined) => {
    setField('dropout_rate', value ?? 0.00001);
    setErrors(prev => ({ ...prev, dropout_rate: validateDropoutRate(value) }));
  };
  const handleEarlyStoppingPatienceChange = (value: number | undefined) => {
    setField('early_stopping_patience', value ?? 1);
    setErrors(prev => ({
      ...prev,
      early_stopping_patience: validateEarlyStoppingPatience(value),
    }));
  };
  const handleVolumeChange = (value: number | undefined) => {
    setField('volume', value ?? 1);
    setErrors(prev => ({ ...prev, volume: validateVolume(value) }));
  };

  return (
    <SidebarContent
      title='Configuração de Dados'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-6'>
        <NumberInputField
          id='window_size'
          label='Janela de entrada:'
          value={window_size}
          onChange={handleWindowSizeChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.window_size}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <NumberInputField
          id='learning_rate'
          label='Taxa de aprendizado:'
          value={learning_rate}
          onChange={handleLearningRateChange}
          min={0.000001}
          max={1}
          step={0.000001}
          decimalPlaces={6}
          placeholder='0.000001'
          error={errors.learning_rate}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <NumberInputField
          id='dropout_rate'
          label='Taxa de dropout:'
          value={dropout_rate}
          onChange={handleDropoutRateChange}
          min={0.00001}
          max={1}
          step={0.00001}
          decimalPlaces={5}
          placeholder='0.00001'
          error={errors.dropout_rate}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <NumberInputField
          id='early_stopping_patience'
          label='Paciência de early stopping:'
          value={early_stopping_patience}
          onChange={handleEarlyStoppingPatienceChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.early_stopping_patience}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <NumberInputField
          id='volume'
          label='Volume de Treinamento:'
          value={volume}
          onChange={handleVolumeChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.volume}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />
      </div>
    </SidebarContent>
  );
};

export default DataTrainingSidebarContent;
