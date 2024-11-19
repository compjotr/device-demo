import { Device } from "./deviceInterface";

export interface EditState {
  isEditing: boolean;
  device: Device;
}

export interface BaseDeviceProps {
  device: Device;
}
