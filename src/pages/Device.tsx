import { useEffect, useState } from "react";
import { getDevices, updateDevice, deleteDevice } from "../utils/indexdDB";
import DeviceItem from "../components/DeviceItemComponent";
import Pagination from "../components/PaginationComponent";
import { DeviceStatus } from "../constants/device";
import { Device } from "../types/deviceInterface";
import FilterDropdown from "../components/FilterDropdown";
import { usePagination } from "../hooks/usePagination";

const DevicesPage = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<DeviceStatus>(
    DeviceStatus.ALL
  );
  const itemsPerPage = 12;

  const { currentPage, setCurrentPage, paginatedItems } =
    usePagination<Device>(itemsPerPage);

  useEffect(() => {
    const fetchDevices = async () => {
      setIsLoading(true);
      try {
        const allDevices = await getDevices(statusFilter);
        setDevices(
          allDevices.map((device) => ({
            ...device,
            lastConnectionDate: new Date(device.lastConnectionDate),
          }))
        );
      } catch (error) {
        console.error("Failed to fetch devices:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDevices();
  }, [statusFilter]);

  const handleUpdate = async (
    id: string,
    updatedDevice: Device
  ): Promise<void> => {
    setIsLoading(true);
    try {
      await updateDevice(id, updatedDevice);
      const updatedDevices = await getDevices(statusFilter);
      setDevices(updatedDevices);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteDevice(id);
      const updatedDevices = await getDevices(statusFilter);
      setDevices(updatedDevices);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDevices = paginatedItems(devices);

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container max-w-[1600px] mx-auto px-6 py-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-primary">Device Management</h2>
        <FilterDropdown value={statusFilter} onChange={setStatusFilter} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 xl:gap-12">
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
