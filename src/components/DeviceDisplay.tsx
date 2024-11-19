import React from "react";
import { Device } from "../types/deviceInterface";

interface DeviceDisplayProps {
  device: Device;
  onEdit: () => void;
  onDelete: (id: string) => void;
}

export const DeviceDisplay: React.FC<DeviceDisplayProps> = ({
  device,
  onEdit,
  onDelete,
}) => {
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

      <div className="space-y-3 text-[#A3A3A3]">
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
          <span className="px-2 py-1 rounded-full bg-[#89CFF0] text-white text-sm">
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
          className="bg-[#4E8200] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors flex-1"
          data-testid="delete-button"
        >
          Delete
        </button>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full mx-4">
            <h4 className="text-lg font-bold mb-4">Confirm Deletion</h4>
            <p className="mb-6">
              Are you sure you want to delete device "{device.name}" with serial
              number {device.serialNumber}?
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                data-testid="confirm-delete-button"
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex-1"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
