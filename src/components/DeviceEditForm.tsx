import React from "react";
import { Device } from "../types/deviceInterface";

interface DeviceEditFormProps {
  device: Device;
  onSave: () => void;
  onCancel: () => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

export const DeviceEditForm: React.FC<DeviceEditFormProps> = ({
  device,
  onSave,
  onCancel,
  onChange,
}) => {
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

      <div className="space-y-3 text-[#A3A3A3]">
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
            className="px-2 py-1 rounded-full bg-[#89CFF0] text-white text-sm border-none focus:ring-2 focus:ring-[#004E82]"
            aria-label="Device status"
            data-testid="device-status-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={onSave}
          className="bg-[#004E82] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex-1"
          disabled={!device.name.trim()}
          data-testid="save-button"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-[#4E8200] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex-1"
          data-testid="cancel-button"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
