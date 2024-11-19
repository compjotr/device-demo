import { useEffect, useState } from "react";
import { getDeviceCounts } from "../utils/indexdDB";

const DeviceCounter = () => {
  const [counts, setCounts] = useState({ active: 0, inactive: 0 });

  useEffect(() => {
    const updateCounts = async () => {
      const newCounts = await getDeviceCounts();
      setCounts(newCounts);
    };

    updateCounts();
    const interval = setInterval(updateCounts, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-4 text-sm font-medium">
      <span className="flex items-center text-green-700">
        <span className="inline-block w-2 h-2 bg-green-700 rounded-full mr-2"></span>
        Active: {counts.active}
      </span>
      <span className="flex items-center text-[#004E82]">
        <span className="inline-block w-2 h-2 bg-[#004E82] rounded-full mr-2"></span>
        Inactive: {counts.inactive}
      </span>
    </div>
  );
};

export default DeviceCounter;
