import { useState, useEffect, useMemo, useCallback } from 'react';
import { DevicesService } from '../services/models';
import type { DeviceType } from '../types/api';
import { useTrainingSidebarStore } from '../store/trainingSidebarStore';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface UseDevicesOptions {
  initialDeviceType?: string;
  initialEntityId?: string;
  autoFetch?: boolean;
}

export interface UseDevicesReturn {
  deviceTypes: DropdownOption[];
  deviceEntities: DropdownOption[];
  deviceAttributes: DropdownOption[];
  selectedDeviceType: string | undefined;
  selectedEntityId: string | undefined;
  setSelectedDeviceType: (type: string | undefined) => void;
  setSelectedEntityId: (entityId: string | undefined) => void;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  rawDevices: DeviceType[];
}

export const useDevices = (
  options: UseDevicesOptions = {}
): UseDevicesReturn => {
  const { initialDeviceType, initialEntityId, autoFetch = false } = options;

  const {
    devices: rawDevices,
    devicesLoading: isLoading,
    devicesError: error,
    setDevices,
    setDevicesLoading,
    setDevicesError,
    shouldFetchDevices,
  } = useTrainingSidebarStore();

  const [selectedDeviceType, setSelectedDeviceType] = useState<
    string | undefined
  >(initialDeviceType);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(
    initialEntityId
  );

  const fetchDevices = useCallback(async (): Promise<void> => {
    if (!shouldFetchDevices()) {
      return;
    }

    setDevicesLoading(true);
    setDevicesError(null);

    try {
      const response = await DevicesService.getDevices();
      setDevices(response.devices || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch devices';
      setDevicesError(errorMessage);
      console.warn('useDevices: Failed to fetch devices', err);
    } finally {
      setDevicesLoading(false);
    }
  }, [shouldFetchDevices, setDevices, setDevicesLoading, setDevicesError]);

  useEffect(() => {
    if (autoFetch) {
      fetchDevices();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch]);

  const deviceTypes = useMemo((): DropdownOption[] => {
    return rawDevices.map(device => ({
      value: device.entity_type,
      label: device.entity_type,
    }));
  }, [rawDevices]);

  const deviceEntities = useMemo((): DropdownOption[] => {
    if (!selectedDeviceType) {
      return [];
    }

    const selectedDevice = rawDevices.find(
      device => device.entity_type === selectedDeviceType
    );
    if (!selectedDevice) {
      return [];
    }

    return selectedDevice.entities.map(entity => ({
      value: entity.entity_name,
      label: entity.entity_name,
    }));
  }, [rawDevices, selectedDeviceType]);

  const deviceAttributes = useMemo((): DropdownOption[] => {
    if (!selectedDeviceType || !selectedEntityId) {
      return [];
    }

    const selectedDevice = rawDevices.find(
      device => device.entity_type === selectedDeviceType
    );
    if (!selectedDevice) {
      return [];
    }

    const selectedEntity = selectedDevice.entities.find(
      entity => entity.entity_name === selectedEntityId
    );
    if (!selectedEntity) {
      return [];
    }

    return selectedEntity.attributes.map(attribute => ({
      value: attribute,
      label: attribute,
    }));
  }, [rawDevices, selectedDeviceType, selectedEntityId]);

  useEffect(() => {
    if (selectedDeviceType) {
      const selectedDevice = rawDevices.find(
        device => device.entity_type === selectedDeviceType
      );
      if (selectedDevice && selectedEntityId) {
        const entityExists = selectedDevice.entities.some(
          entity => entity.entity_name === selectedEntityId
        );
        if (!entityExists) {
          setSelectedEntityId(undefined);
        }
      }
    } else {
      setSelectedEntityId(undefined);
    }
  }, [selectedDeviceType, rawDevices, selectedEntityId]);

  return {
    deviceTypes,
    deviceEntities,
    deviceAttributes,

    selectedDeviceType,
    selectedEntityId,

    setSelectedDeviceType,
    setSelectedEntityId,

    isLoading,
    error,

    refetch: fetchDevices,

    rawDevices,
  };
};

export default useDevices;
