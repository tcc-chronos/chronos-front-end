import { useState, useEffect, useMemo, useCallback } from 'react';
import { DevicesService } from '../services/models';
import type { DeviceType } from '../types/api';
import { useApiErrorHandler } from './useApiErrorHandler';

// Types for better type safety
export interface DropdownOption {
  value: string;
  label: string;
}

export interface UseDevicesOptions {
  initialDeviceType?: string;
  initialEntityId?: string;
  autoFetch?: boolean; // Allow disabling auto-fetch - defaults to false
}

export interface UseDevicesReturn {
  // Dropdown options
  deviceTypes: DropdownOption[];
  deviceEntities: DropdownOption[];
  deviceAttributes: DropdownOption[];

  // Selection states
  selectedDeviceType: string | undefined;
  selectedEntityId: string | undefined;

  // Selection handlers
  setSelectedDeviceType: (type: string | undefined) => void;
  setSelectedEntityId: (entityId: string | undefined) => void;

  // Loading and error states
  isLoading: boolean;
  error: string | null;

  // Actions
  refetch: () => Promise<void>;

  // Raw data for advanced use cases
  rawDevices: DeviceType[];
}

/**
 * Custom hook for managing device data and dropdown states
 * Provides reactive device selection with memoized dropdown options
 */
export const useDevices = (
  options: UseDevicesOptions = {}
): UseDevicesReturn => {
  const { initialDeviceType, initialEntityId, autoFetch = false } = options;

  // State management
  const [rawDevices, setRawDevices] = useState<DeviceType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handleApiError } = useApiErrorHandler();

  // Selection states with proper initialization
  const [selectedDeviceType, setSelectedDeviceType] = useState<
    string | undefined
  >(initialDeviceType);
  const [selectedEntityId, setSelectedEntityId] = useState<string | undefined>(
    initialEntityId
  );

  // Fetch devices from API with proper error handling
  const fetchDevices = useCallback(async (): Promise<void> => {
    if (isLoading) return; // Prevent concurrent requests

    setIsLoading(true);
    setError(null);

    try {
      const response = await DevicesService.getDevices();
      setRawDevices(response.devices || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch devices';
      setError(errorMessage);
      handleApiError(err, 'Carregamento de dispositivos');
    } finally {
      setIsLoading(false);
    }
  }, [handleApiError, isLoading]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch) {
      console.log('useDevices: Auto-fetching devices');
      fetchDevices();
    } else {
      console.log('useDevices: Auto-fetch disabled');
    }
  }, [autoFetch, fetchDevices]);

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

    refetch: fetchDevices,

    rawDevices,
  };
};

export default useDevices;
