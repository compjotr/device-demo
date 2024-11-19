type DeviceCountProps = {
  count: number | null;
  isLoading: boolean;
};

const DeviceCount = ({ count, isLoading }: DeviceCountProps) => {
  return (
    <p className="mb-4">
      Current number of devices in database:{" "}
      {isLoading ? "Loading..." : (count ?? "Not initialized")}
    </p>
  );
};

export default DeviceCount;
