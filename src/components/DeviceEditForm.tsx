import React from "react";
import { Device } from "../types/deviceInterface";
import ButtonComponent from "./Button";
import { toast } from "react-toastify";

interface DeviceEditFormProps {
  device: Device;
  onSave: () => Promise<boolean>;
  onCancel: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const DeviceEditForm = ({
  device,
  onSave,
  onCancel,
  onChange,
}: DeviceEditFormProps) => {
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const success = await onSave();
      console.log("Save result:", success);

      if (success === true) {
        toast.success("Device updated successfully");
      } else {
        toast.error("Failed to update device");
        console.warn("onSave returned:", success);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="mb-4">
        <input
          type="text"
          name="name"
          maxLength={32}
          value={device.name}
          onChange={onChange}
          className="w-full text-[#004E82] font-bold text-xl border-b-2 border-[#004E82] focus:outline-none pb-1"
          aria-label="Device name"
          data-testid="device-name-input"
        />
      </div>

      <div className="space-y-3 text-gray-600">
        <p className="flex items-center">
          <span className="font-medium mr-2">Serial Number:</span>
          <span>{device.serialNumber}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium mr-2">Last Connection:</span>
          <span>{new Date(device.lastConnectionDate).toLocaleString()}</span>
        </p>
        <div className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          <select
            name="status"
            value={device.status}
            onChange={onChange}
            className="px-4 py-2 rounded-full text-white text-sm border-none focus:ring-2 focus:ring-[#004E82]"
            aria-label="Device status"
            data-testid="device-status-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <ButtonComponent
          onClick={handleSave}
          variant="primary"
          disabled={!device.name.trim() || isSaving}
          data-testid="save-button"
        >
          {isSaving ? "Saving..." : "Save"}
        </ButtonComponent>
        <ButtonComponent
          onClick={onCancel}
          variant="primary"
          disabled={isSaving}
          data-testid="cancel-button"
        >
          Cancel
        </ButtonComponent>
      </div>
    </div>
  );
};
