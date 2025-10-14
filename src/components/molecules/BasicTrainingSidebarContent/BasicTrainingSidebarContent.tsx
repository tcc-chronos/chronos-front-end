import React, { useState, useEffect } from 'react';
import { SidebarContent, SelectField, TrainingButton } from '../';
import { useTrainingSidebarStore } from '../../../store/trainingSidebarStore';
import { useDevices } from '../../../hooks/useDevices';
import { useModelTypes } from '../../../hooks/useModelTypes';
import { useSidebar } from '../../../hooks/useSidebar';
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
  const { activeItemId } = useSidebar();

  const {
    deviceTypes,
    deviceEntities,
    deviceAttributes,
    error: devicesError,
    setSelectedDeviceType,
    setSelectedEntityId,
    refetch: refetchDevices,
  } = useDevices({
    initialDeviceType: entity_type,
    initialEntityId: entity_id,
    autoFetch: false,
  });

  const {
    modelTypes: rnnTypeOptions,
    loading: modelTypesLoading,
    error: modelTypesError,
    fetchModelTypes,
  } = useModelTypes({ autoFetch: false });

  useEffect(() => {
    if (activeItemId) {
      refetchDevices();
      fetchModelTypes();
    }
  }, [activeItemId, refetchDevices, fetchModelTypes]);

  useEffect(() => {
    if (entity_type) {
      setSelectedDeviceType(entity_type);
    }
    if (entity_id) {
      setSelectedEntityId(entity_id);
    }
  }, [entity_type, entity_id, setSelectedDeviceType, setSelectedEntityId]);

  useEffect(() => {
    const handleRefreshDevices = (
      event: CustomEvent<{
        entity_type: string;
        entity_id: string;
        feature: string;
      }>
    ) => {
      refetchDevices().then(() => {
        setSelectedDeviceType(event.detail.entity_type);
        setSelectedEntityId(event.detail.entity_id);
      });
    };

    window.addEventListener(
      'refreshDevicesForCopiedParams',
      handleRefreshDevices as EventListener
    );
    return () => {
      window.removeEventListener(
        'refreshDevicesForCopiedParams',
        handleRefreshDevices as EventListener
      );
    };
  }, [refetchDevices, setSelectedDeviceType, setSelectedEntityId]);

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
    const stringValue = String(value);
    setField('entity_type', stringValue);
    setField('entity_id', undefined);
    setField('feature', undefined);

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
          disabled={!!modelTypesError}
        />

        <SelectField
          id='entity_type'
          label='Tipo de dispositivo:'
          value={entity_type}
          onChange={handleEntityTypeChange}
          options={deviceTypes}
          placeholder='Selecione o tipo de dispositivo'
          error={errors.entity_type}
          infoTooltip='Tipo de entidade/dispositivo.'
          required
          loading={false}
          disabled={!!devicesError}
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
          loading={false}
          disabled={!entity_type || !!devicesError}
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
          loading={false}
          disabled={!entity_id || !!devicesError}
        />

        <div className='fixed bottom-0 bg-white pb-2 border-gray-200 w-70'>
          <TrainingButton variant='primary' fullWidth />
        </div>
      </div>
    </SidebarContent>
  );
};

export default BasicTrainingSidebarContent;
