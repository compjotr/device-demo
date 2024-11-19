export const DEVICE_STATUS = {
  ALL: "All",
  ACTIVE: "Active",
  INACTIVE: "Inactive",
};

// Type derived from the constant values
export type DeviceStatus = (typeof DEVICE_STATUS)[keyof typeof DEVICE_STATUS];

// For filter values only
export type DeviceStatusFilter = DeviceStatus;

// For actual device status (excluding 'All')
export type DeviceStatusValue = Exclude<DeviceStatus, typeof DEVICE_STATUS.ALL>;
