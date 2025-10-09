// Mock data structure that matches the expected API response
export const mockDevicesResponse = {
  devices: [
    {
      entity_type: 'Sensor',
      entities: [
        {
          entity_name: 'sensor_temperature_01',
          attributes: ['temperature', 'humidity', 'pressure'],
        },
        {
          entity_name: 'sensor_motion_01',
          attributes: ['motion_detected', 'battery_level', 'signal_strength'],
        },
      ],
    },
    {
      entity_type: 'Actuator',
      entities: [
        {
          entity_name: 'actuator_valve_01',
          attributes: ['valve_position', 'flow_rate', 'status'],
        },
        {
          entity_name: 'actuator_motor_01',
          attributes: ['rpm', 'torque', 'temperature', 'status'],
        },
      ],
    },
    {
      entity_type: 'Controller',
      entities: [
        {
          entity_name: 'controller_hvac_01',
          attributes: [
            'setpoint_temperature',
            'current_temperature',
            'fan_speed',
            'mode',
          ],
        },
      ],
    },
  ],
};
