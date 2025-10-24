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

export interface ModelType {
  value: string;
  label: string;
}
