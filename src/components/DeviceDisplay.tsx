import React from "react";
import { Device } from "../types/deviceInterface";
import { ConfirmationDialog } from "./ConfirmationDialog";

type DeviceDisplayProps = {
  device: Device;
  onEdit: () => void;
  onDelete: (id: string) => void;
};

export const DeviceDisplay = ({
  device,
  onEdit,
  onDelete,
}: DeviceDisplayProps) => {
  const [showConfirmation, setShowConfirmation] = React.useState(false);

  const handleDelete = () => {
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    onDelete(device.serialNumber);
    setShowConfirmation(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-sm border border-gray-100 hover:shadow-lg transition-shadow">
      <h3 className="text-[#004E82] font-bold text-xl mb-4">{device.name}</h3>

      <div className="space-y-3 text-gray-600">
        <p className="flex items-center">
          <span className="font-medium mr-2">Serial Number:</span>
          <span data-testid="device-serial">{device.serialNumber}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium mr-2">Last Connection:</span>
          <span>{new Date(device.lastConnectionDate).toLocaleString()}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium mr-2">Status:</span>
          <span
            className={`px-4 py-2 rounded-full text-white text-sm ${
              device.status === "Active" ? "bg-green-700" : "bg-[#004E82]"
            }`}
          >
            {device.status}
          </span>
        </p>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={onEdit}
          className="bg-[#004E82] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex-1"
          data-testid="edit-button"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex-1"
          data-testid="delete-button"
        >
          Delete
        </button>
      </div>

      <ConfirmationDialog
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        onConfirm={confirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to delete device "${device.name}" with serial number ${device.serialNumber}?`}
      />
    </div>
  );
};
