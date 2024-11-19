import { DeviceStatus } from "../constants/device";

export interface Device {
  serialNumber: string;
  name: string;
  lastConnectionDate: Date;
  status: DeviceStatus;
}
