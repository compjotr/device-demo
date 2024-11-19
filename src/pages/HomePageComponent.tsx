import { initDB } from "../utils/indexdDB";
import { checkDeviceCount, deleteAllDatabases } from "../utils/indexdDB";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

const HomePage = () => {
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await checkDeviceCount();
        setDeviceCount(count);
        setIsInitialized(count > 0);
      } catch (error) {
        // Database or store doesn't exist yet
        setDeviceCount(0);
        setIsInitialized(false);
      }
    };
    fetchCount();
  }, []);

  const handleInitialize = async () => {
    try {
      await initDB();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const newCount = await checkDeviceCount();
      setDeviceCount(newCount);
      setIsInitialized(true);
      toast.success("Database initialized successfully!");
    } catch (error) {
      toast.error("Failed to initialize database.");
      console.error(error);
    }
  };

  const handleReset = async () => {
    try {
      await deleteAllDatabases();
      setDeviceCount(0);
      setIsInitialized(false);
      toast.success("All databases deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete databases.");
      console.error(error);
    }
  };

  return (
    <div className="p-4">
      <h2>Welcome</h2>
      <p>
        Current number of devices in database: {deviceCount ?? "Loading..."}
      </p>
      <button
        className={`text-white p-2 mt-4 ${
          isInitialized ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500"
        }`}
        data-testid="initialize-button"
        onClick={handleInitialize}
        disabled={isInitialized}
      >
        Initialize Database
      </button>
      <button
        className="bg-red-500 text-white p-2 mt-4 ml-4"
        onClick={handleReset}
      >
        Reset All Databases
      </button>
    </div>
  );
};

export default HomePage;
