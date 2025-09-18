import React, { useEffect, useState } from 'react';
import { Button } from '../../atoms';
import { NumberInputField, SidebarContent, SelectField } from '../';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import type { BasicTrainingSidebarContentProps } from './BasicTrainingSidebarContent.types';

interface ValidationErrors {
  rnn_type?: string;
  device?: string;
  attribute?: string;
  epochs?: string;
  n_steps_ahead?: string;
}

const BasicTrainingSidebarContent: React.FC<
  BasicTrainingSidebarContentProps
> = ({ className = '', ...props }) => {
  const {
    rnn_type,
    device,
    attribute,
    epochs,
    n_steps_ahead,
    setField,
    ...storeData
  } = useTrainingSidebarStore();
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rnnTypeOptions = [
    { value: 'lstm', label: 'LSTM' },
    { value: 'gru', label: 'GRU' },
  ];

  const [deviceOptions, setDeviceOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [attributeOptions, setAttributeOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    setTimeout(() => {
      setDeviceOptions([
        { value: 'cpu', label: 'CPU' },
        { value: 'gpu', label: 'GPU' },
        { value: 'tpu', label: 'TPU' },
      ]);
    }, 500);
  }, []);

  useEffect(() => {
    if (device) {
      setAttributeOptions([
        { value: 'temperature', label: 'Temperatura' },
        { value: 'voltage', label: 'Tensão' },
        { value: 'current', label: 'Corrente' },
      ]);
    } else {
      setAttributeOptions([]);
    }
  }, [device]);

  const validateRnnType = (value: string | undefined) =>
    !value ? 'Tipo de RNN obrigatório' : undefined;
  const validateDevice = (value: string | undefined) =>
    !value ? 'Dispositivo obrigatório' : undefined;
  const validateAttribute = (value: string | undefined) =>
    !value ? 'Atributo obrigatório' : undefined;
  const validateEpochs = (value: number | undefined) =>
    !value || value < 1 ? 'Épocas deve ser no mínimo 1' : undefined;
  const validateNStepsAhead = (value: number | undefined) =>
    !value || value < 1 ? 'Janela de Previsão deve ser no mínimo 1' : undefined;

  const isFormValid = () => {
    return (
      !validateRnnType(rnn_type) &&
      !validateDevice(device) &&
      !validateAttribute(attribute) &&
      !validateEpochs(epochs) &&
      !validateNStepsAhead(n_steps_ahead)
    );
  };

  const handleRnnTypeChange = (value: string | number) => {
    setField('rnn_type', value as 'gru' | 'lstm');
    setErrors(prev => ({ ...prev, rnn_type: validateRnnType(String(value)) }));
  };
  const handleDeviceChange = (value: string | number) => {
    setField('device', String(value));
    setField('attribute', undefined);
    setErrors(prev => ({
      ...prev,
      device: validateDevice(String(value)),
      attribute: undefined,
    }));
  };
  const handleAttributeChange = (value: string | number) => {
    setField('attribute', String(value));
    setErrors(prev => ({
      ...prev,
      attribute: validateAttribute(String(value)),
    }));
  };
  const handleEpochsChange = (value: number | undefined) => {
    setField('epochs', value ?? 1);
    setErrors(prev => ({ ...prev, epochs: validateEpochs(value) }));
  };
  const handleNStepsAheadChange = (value: number | undefined) => {
    setField('n_steps_ahead', value ?? 1);
    setErrors(prev => ({ ...prev, n_steps_ahead: validateNStepsAhead(value) }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      alert('Preencha todos os campos obrigatórios corretamente.');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Dados enviados:', {
        ...storeData,
        rnn_type,
        device,
        attribute,
        epochs,
        n_steps_ahead,
      });
      alert('Treinamento iniciado!');
    } catch {
      alert('Erro ao treinar modelo');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SidebarContent
      title='Configuração de Treinamento'
      variant='default'
      className={className}
      {...props}
    >
      <div className='space-y-6'>
        <SelectField
          id='rnn_type'
          label='Tipo de RNN:'
          value={rnn_type}
          onChange={handleRnnTypeChange}
          options={rnnTypeOptions}
          placeholder='Selecione o tipo de RNN'
          error={errors.rnn_type}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur adipiscing elit.'
          required
        />

        <SelectField
          id='device'
          label='Dispositivo:'
          value={device}
          onChange={handleDeviceChange}
          options={deviceOptions}
          placeholder='Selecione o dispositivo'
          error={errors.device}
          infoTooltip='Lorem Ipsum dolor sit amet, consectetur.'
          required
          loading={deviceOptions.length === 0}
        />

        <SelectField
          id='attribute'
          label='Atributo:'
          value={attribute}
          onChange={handleAttributeChange}
          options={attributeOptions}
          placeholder='Selecione o atributo'
          error={errors.attribute}
          infoTooltip='Lorem Ipsum dolor sit amet.'
          required
          loading={Boolean(device && attributeOptions.length === 0)}
          disabled={!device}
        />

        <NumberInputField
          id='epochs'
          label='Épocas:'
          value={epochs}
          onChange={handleEpochsChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.epochs}
          infoTooltip='Lorem Ipsum dolor sit amet, integer.'
          required
        />

        <NumberInputField
          id='n_steps_ahead'
          label='Janela de Previsão:'
          value={n_steps_ahead}
          onChange={handleNStepsAheadChange}
          min={1}
          decimalPlaces={0}
          placeholder='1'
          error={errors.n_steps_ahead}
          infoTooltip='Lorem Ipsum dolor sit amet, integer.'
          required
        />

        <div className='pt-4'>
          <Button
            onClick={handleSubmit}
            variant='primary'
            fullWidth
            isLoading={isSubmitting}
            loadingText='Treinando...'
            disabled={isSubmitting || !isFormValid()}
          >
            Treinar Modelo
          </Button>
        </div>
      </div>
    </SidebarContent>
  );
};

export default BasicTrainingSidebarContent;
