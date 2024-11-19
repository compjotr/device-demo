import { useEffect, useState } from "react";
import { getDevices, updateDevice, deleteDevice } from "../utils/indexdDB";
import DeviceItem from "../components/DeviceItemComponent";
import Pagination from "../components/PaginationComponent";
import { DeviceStatusValue } from "../constants/device";
import { Device } from "../types/deviceInterface";
import { DEVICE_STATUS } from "../constants/device";
import FilterDropdown from "../components/FilterDropdown";

const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [statusFilter, setStatusFilter] = useState<DeviceStatusValue>(
    DEVICE_STATUS.ALL as DeviceStatusValue
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchDevices = async () => {
      const allDevices = await getDevices(statusFilter as DeviceStatusValue);
      const devicesWithDates = allDevices.map((device) => ({
        ...device,
        lastConnectionDate: new Date(device.lastConnectionDate),
      }));
      setDevices(devicesWithDates);
    };
    fetchDevices();
  }, [statusFilter]);

  const handleUpdate = async (
    id: string,
    updatedDevice: Device
  ): Promise<void> => {
    await updateDevice(id, updatedDevice);
    setDevices(await getDevices(statusFilter as DeviceStatusValue));
  };

  const handleDelete = async (id: string): Promise<void> => {
    await deleteDevice(id);
    setDevices(await getDevices(statusFilter as DeviceStatusValue));
  };

  const filteredDevices = devices.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-primary">Device Management</h2>
        <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDevices.map((device) => (
          <div key={device.serialNumber}>
            <DeviceItem
              device={device}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Pagination
          totalItems={devices.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default DevicesPage;
