import React, { useState } from "react";
import { Device } from "../types/deviceInterface";
import { DeviceEditForm } from "./DeviceEditForm";
import { DeviceDisplay } from "./DeviceDisplay";

interface DeviceItemProps {
  device: Device;
  onUpdate: (id: string, updatedDevice: Device) => void;
  onDelete: (id: string) => void;
}

type EditState = {
  isEditing: boolean;
  device: Device;
};

const DeviceItem: React.FC<DeviceItemProps> = ({
  device,
  onUpdate,
  onDelete,
}) => {
  const [editState, setEditState] = useState<EditState>({
    isEditing: false,
    device: device,
  });

  const handleEditToggle = () => {
    setEditState((prev) => ({
      isEditing: !prev.isEditing,
      device: !prev.isEditing ? device : prev.device,
    }));
  };

  const handleSave = () => {
    if (!editState.device.name.trim()) {
      return;
    }
    onUpdate(device.serialNumber, editState.device);
    setEditState((prev) => ({ ...prev, isEditing: false }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditState((prev) => ({
      ...prev,
      device: { ...prev.device, [name]: value },
    }));
  };

  return (
    <div data-testid="device-item">
      {editState.isEditing ? (
        <DeviceEditForm
          device={editState.device}
          onSave={handleSave}
          onCancel={handleEditToggle}
          onChange={handleInputChange}
        />
      ) : (
        <DeviceDisplay
          device={device}
          onEdit={handleEditToggle}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default DeviceItem;