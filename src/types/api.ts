/**
 * Device and API-related types
 */

// Device types
export interface DeviceEntity {
  entity_name: string;
  attributes: string[];
}

export interface DeviceType {
  entity_type: string;
  entities: DeviceEntity[];
}

export interface DevicesResponse {
  devices: DeviceType[];
}

// Model types
export interface ModelType {
  value: string;
  label: string;
}
