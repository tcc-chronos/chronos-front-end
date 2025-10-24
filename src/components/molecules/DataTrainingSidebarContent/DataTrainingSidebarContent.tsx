import React, { useState } from 'react';
import { NumberInputField, SidebarContent, TrainingButton } from '../';
import type { DataTrainingSidebarContentProps } from './DataTrainingSidebarContent.types';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';

interface ValidationErrors {
  lookback_window?: string;
  learning_rate?: string;
  early_stopping_patience?: string;
  epochs?: string;
  forecast_horizon?: string;
}

const DataTrainingSidebarContent: React.FC<DataTrainingSidebarContentProps> = ({
  className = '',
  ...props
}) => {
  const {
    lookback_window,
    learning_rate,
    early_stopping_patience,
    epochs,
    forecast_horizon = 1,
    setField,
  } = useTrainingSidebarStore();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateLookbackWindow = (value: number | undefined) =>
    !value || value < 1 ? 'Janela de entrada deve ser no mínimo 1' : undefined;
  const validateLearningRate = (value: number | undefined) =>
    !value || value < 0.000001 || value > 1
      ? 'Taxa de aprendizado deve estar entre 0.000001 e 1'
      : undefined;
  const validateEarlyStoppingPatience = (value?: number) => {
    if (value === undefined || value === null) {
      return undefined;
    }

    if (Number(value) < 1) {
      return 'Paciência de early stopping deve ser no mínimo 1';
    }

    return undefined;
  };

  const validateEpochs = (value: number | undefined) =>
    !value || value < 1 ? 'Épocas deve ser no mínimo 1' : undefined;
  const validateForecastHorizon = (value: number | undefined) =>
    !value || value < 1 ? 'Janela de previsão deve ser no mínimo 1' : undefined;

  const handleLookbackWindowChange = (value: number | undefined) => {
    setField('lookback_window', value ?? 1);
    setErrors(prev => ({
      ...prev,
      lookback_window: validateLookbackWindow(value),
    }));
  };
  const handleLearningRateChange = (value: number | undefined) => {
    setField('learning_rate', value);
    setErrors(prev => ({
      ...prev,
      learning_rate: validateLearningRate(value),
    }));
  };
  const handleEarlyStoppingPatienceChange = (value: number | undefined) => {
    setField('early_stopping_patience', value);
    setErrors(prev => ({
      ...prev,
      early_stopping_patience: validateEarlyStoppingPatience(value),
    }));
  };
  const handleEpochsChange = (value: number | undefined) => {
    setField('epochs', value);
    setErrors(prev => ({
      ...prev,
      epochs: validateEpochs(value),
    }));
  };
  const handleForecastHorizonChange = (value: number | undefined) => {
    setField('forecast_horizon', value ?? 1);
    setErrors(prev => ({
      ...prev,
      forecast_horizon: validateForecastHorizon(value),
    }));
  };

  return (
    <SidebarContent
      title='Configuração de Dados'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-6 pb-24'>
        <NumberInputField
          id='lookback_window'
          label='Janela de entrada:'
          value={lookback_window}
          onChange={handleLookbackWindowChange}
          min={1}
          decimalPlaces={0}
          placeholder='60'
          error={errors.lookback_window}
          infoTooltip='Janela de entrada para os dados.'
          required
        />
        <NumberInputField
          id='forecast_horizon'
          label='Janela de Previsão:'
          value={forecast_horizon}
          onChange={handleForecastHorizonChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.forecast_horizon}
          infoTooltip='Número de passos à frente para previsão.'
          required
        />
        <NumberInputField
          id='epochs'
          label='Épocas:'
          value={epochs}
          onChange={handleEpochsChange}
          min={1}
          decimalPlaces={0}
          placeholder='10'
          error={errors.epochs}
          infoTooltip='Número de épocas para o treinamento.'
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
          placeholder='0.001'
          error={errors.learning_rate}
          infoTooltip='Taxa de aprendizado do modelo.'
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
          infoTooltip='Número de épocas sem melhora para parar.'
        />
      </div>
      <div className='fixed bottom-0 bg-white border-t border-gray-200 w-70 py-4'>
        <TrainingButton variant='primary' fullWidth />
      </div>
    </SidebarContent>
  );
};

export default DataTrainingSidebarContent;
