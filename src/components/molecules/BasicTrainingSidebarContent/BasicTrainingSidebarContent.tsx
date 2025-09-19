import React, { useEffect, useState } from 'react';
import { SidebarContent, SelectField } from '../';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import type { BasicTrainingSidebarContentProps } from './BasicTrainingSidebarContent.types';
import { Button } from '../..';

interface ValidationErrors {
  rnn_type?: string;
  entity_type?: string;
  entity_id?: string;
  feature?: string;
  epochs?: string;
  forecast_horizon?: string;
}

const BasicTrainingSidebarContent: React.FC<
  BasicTrainingSidebarContentProps
> = ({ className = '', ...props }) => {
  const { rnn_type, entity_type, entity_id, feature, setField } =
    useTrainingSidebarStore();
  const [errors, setErrors] = useState<ValidationErrors>({});

  const rnnTypeOptions = [
    { value: 'lstm', label: 'LSTM' },
    { value: 'gru', label: 'GRU' },
  ];

  const [entityTypeOptions] = useState<{ value: string; label: string }[]>([
    { value: 'sensor', label: 'Sensor' },
    { value: 'equipamento', label: 'Equipamento' },
    { value: 'ambiente', label: 'Ambiente' },
  ]);
  const [entityIdOptions, setEntityIdOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [featureOptions, setFeatureOptions] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    // Mock: Carregar opções de entity_id baseado no tipo
    if (entity_type) {
      setTimeout(() => {
        setEntityIdOptions([
          { value: 'cpu', label: 'CPU' },
          { value: 'gpu', label: 'GPU' },
          { value: 'tpu', label: 'TPU' },
        ]);
      }, 500);
    } else {
      setEntityIdOptions([]);
    }
  }, [entity_type]);

  useEffect(() => {
    // Mock: Carregar opções de feature baseado no entity_id
    if (entity_id) {
      setFeatureOptions([
        { value: 'temperature', label: 'Temperatura' },
        { value: 'voltage', label: 'Tensão' },
        { value: 'current', label: 'Corrente' },
      ]);
    } else {
      setFeatureOptions([]);
    }
  }, [entity_id]);

  const validateRnnType = (value: string | undefined) =>
    !value ? 'Tipo de RNN obrigatório' : undefined;
  const validateEntityType = (value: string | undefined) =>
    !value ? 'Tipo de dispositivo obrigatório' : undefined;
  const validateEntityId = (value: string | undefined) =>
    !value ? 'Dispositivo obrigatório' : undefined;
  const validateFeature = (value: string | undefined) =>
    !value ? 'Atributo obrigatório' : undefined;

  const handleRnnTypeChange = (value: string | number) => {
    setField('rnn_type', value as 'gru' | 'lstm');
    setErrors(prev => ({ ...prev, rnn_type: validateRnnType(String(value)) }));
  };
  const handleEntityTypeChange = (value: string | number) => {
    setField('entity_type', String(value));
    setField('entity_id', undefined);
    setField('feature', undefined);
    setErrors(prev => ({
      ...prev,
      entity_type: validateEntityType(String(value)),
      entity_id: undefined,
      feature: undefined,
    }));
  };
  const handleEntityIdChange = (value: string | number) => {
    setField('entity_id', String(value));
    setField('feature', undefined);
    setErrors(prev => ({
      ...prev,
      entity_id: validateEntityId(String(value)),
      feature: undefined,
    }));
  };
  const handleFeatureChange = (value: string | number) => {
    setField('feature', String(value));
    setErrors(prev => ({
      ...prev,
      feature: validateFeature(String(value)),
    }));
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
          infoTooltip='Tipo de rede neural recorrente.'
          required
        />

        <SelectField
          id='entity_type'
          label='Tipo de dispositivo:'
          value={entity_type}
          onChange={handleEntityTypeChange}
          options={entityTypeOptions}
          placeholder='Selecione o tipo de dispositivo'
          error={errors.entity_type}
          infoTooltip='Tipo de entidade/dispositivo.'
          required
        />

        <SelectField
          id='entity_id'
          label='Dispositivo:'
          value={entity_id}
          onChange={handleEntityIdChange}
          options={entityIdOptions}
          placeholder='Selecione o dispositivo'
          error={errors.entity_id}
          infoTooltip='Identificador do dispositivo.'
          required
          loading={entityTypeOptions.length === 0}
          disabled={!entity_type}
        />

        <SelectField
          id='feature'
          label='Atributo:'
          value={feature}
          onChange={handleFeatureChange}
          options={featureOptions}
          placeholder='Selecione o atributo'
          error={errors.feature}
          infoTooltip='Atributo/feature do dispositivo.'
          required
          loading={Boolean(entity_id && featureOptions.length === 0)}
          disabled={!entity_id}
        />

        <div className='fixed bottom-0 bg-white pb-2 border-gray-200 w-70'>
          <Button variant='primary' fullWidth>
            Adicionar Modelo
          </Button>
        </div>
      </div>
    </SidebarContent>
  );
};

export default BasicTrainingSidebarContent;
