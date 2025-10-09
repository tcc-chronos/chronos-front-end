import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DevicesService,
  type DeviceType,
  type DevicesResponse,
} from '../services/models';
import { useApiErrorHandler } from './useApiErrorHandler';

interface DropdownOption {
  value: string;
  label: string;
}

interface UseDevicesOptions {
  initialDeviceType?: string;
  initialEntityId?: string;
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

  // Raw data for advanced use cases
  rawDevices: DeviceType[];
}

/**
 * Custom hook for managing device data and dropdown states
 */
export const useDevices = (options: UseDevicesOptions = {}) => {
  const { initialDeviceType, initialEntityId } = options;
  const [rawDevices, setRawDevices] = useState<DeviceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleApiError } = useApiErrorHandler();

  // Selection states
  const [selectedDeviceType, setSelectedDeviceType] = useState<
    string | undefined
  >(initialDeviceType);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(
    initialEntityId
  );

  // Fetch devices from API
  const fetchDevices = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: DevicesResponse = await DevicesService.getDevices();
      setRawDevices(response.devices || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(errorMessage);
      handleApiError(err, 'Carregamento de dispositivos');
      console.error('Error fetching devices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError]);

  // Load devices on mount
  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Memoized device types dropdown options
  const deviceTypes = useMemo((): DropdownOption[] => {
    return rawDevices.map(device => ({
      value: device.entity_type,
      label: device.entity_type,
    }));
  }, [rawDevices]);

  // Memoized device entities dropdown options based on selected device type
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

  // Memoized device attributes dropdown options based on selected entity
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

  // Reset dependent selections when parent changes
  useEffect(() => {
    if (selectedDeviceType) {
      // Reset entity selection when device type changes
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

    rawDevices,
  };
};

export default useDevices;
