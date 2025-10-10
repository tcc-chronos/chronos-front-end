import React, { useState, useEffect } from 'react';
import { SidebarContent, SelectField, TrainingButton } from '../';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import { useDevices } from '../../../hooks/useDevices';
import { useModelTypes } from '../../../hooks/useModelTypes';
import type { BasicTrainingSidebarContentProps } from './BasicTrainingSidebarContent.types';

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

  // Use devices hook for real API data
  const {
    deviceTypes,
    deviceEntities,
    deviceAttributes,
    isLoading,
    error: devicesError,
    setSelectedDeviceType,
    setSelectedEntityId,
    refetch: refetchDevices,
  } = useDevices({
    initialDeviceType: entity_type,
    initialEntityId: entity_id,
    autoFetch: false, // Don't auto-fetch on mount
  });

  // Fetch devices only when user interacts with dropdowns or component becomes visible
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (hasInteracted && deviceTypes.length === 0 && !isLoading) {
      console.log(
        'BasicTrainingSidebarContent: Fetching devices due to user interaction'
      );
      refetchDevices();
    }
  }, [hasInteracted, deviceTypes.length, isLoading, refetchDevices]);

  // Use model types hook for dynamic RNN types
  const {
    modelTypes: rnnTypeOptions,
    loading: modelTypesLoading,
    error: modelTypesError,
  } = useModelTypes();

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
    // Mark that user has interacted with devices dropdown
    if (!hasInteracted) {
      setHasInteracted(true);
    }

    const stringValue = String(value);
    setField('entity_type', stringValue);
    setField('entity_id', undefined);
    setField('feature', undefined);

    // Update devices hook state
    setSelectedDeviceType(stringValue);
    setSelectedEntityId(undefined);

    setErrors(prev => ({
      ...prev,
      entity_type: validateEntityType(stringValue),
      entity_id: undefined,
      feature: undefined,
    }));
  };

  const handleEntityIdChange = (value: string | number) => {
    const stringValue = String(value);
    setField('entity_id', stringValue);
    setField('feature', undefined);

    // Update devices hook state
    setSelectedEntityId(stringValue);

    setErrors(prev => ({
      ...prev,
      entity_id: validateEntityId(stringValue),
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

  // Show error message if devices failed to load
  if (devicesError) {
    return (
      <SidebarContent
        title='Configuração de Modelo'
        variant='default'
        className={className}
        {...props}
      >
        <div className='p-4 text-red-600 bg-red-50 rounded-md'>
          <p className='font-medium'>Erro ao carregar dispositivos:</p>
          <p className='text-sm mt-1'>{devicesError}</p>
        </div>
      </SidebarContent>
    );
  }

  return (
    <SidebarContent
      title='Configuração de Modelo'
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
          error={errors.rnn_type || modelTypesError || undefined}
          infoTooltip='Tipo de rede neural recorrente.'
          required
          loading={modelTypesLoading}
        />

        <SelectField
          id='entity_type'
          label='Tipo de dispositivo:'
          value={entity_type}
          onChange={handleEntityTypeChange}
          onFocus={() => {
            if (!hasInteracted) {
              setHasInteracted(true);
            }
          }}
          options={deviceTypes}
          placeholder='Selecione o tipo de dispositivo'
          error={errors.entity_type}
          infoTooltip='Tipo de entidade/dispositivo.'
          required
          loading={isLoading}
        />

        <SelectField
          id='entity_id'
          label='Dispositivo:'
          value={entity_id}
          onChange={handleEntityIdChange}
          options={deviceEntities}
          placeholder='Selecione o dispositivo'
          error={errors.entity_id}
          infoTooltip='Identificador do dispositivo.'
          required
          loading={isLoading || deviceEntities.length === 0}
          disabled={!entity_type}
        />

        <SelectField
          id='feature'
          label='Atributo:'
          value={feature}
          onChange={handleFeatureChange}
          options={deviceAttributes}
          placeholder='Selecione o atributo'
          error={errors.feature}
          infoTooltip='Atributo/feature do dispositivo.'
          required
          loading={isLoading || deviceAttributes.length === 0}
          disabled={!entity_id}
        />

        <div className='fixed bottom-0 bg-white pb-2 border-gray-200 w-70'>
          <TrainingButton variant='primary' fullWidth />
        </div>
      </div>
    </SidebarContent>
  );
};

export default BasicTrainingSidebarContent;
