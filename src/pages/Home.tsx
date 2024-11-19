import { initDB } from "../utils/indexdDB";
import { checkDeviceCount, deleteAllDatabases } from "../utils/indexdDB";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";

import DeviceCount from "../components/DeviceCount";
import ErrorMessage from "../components/ErrorMessage";
import ButtonComponent from "../components/Button";
type ErrorType = {
  message: string;
} | null;

const HomePage = () => {
  const [deviceCount, setDeviceCount] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string>("");
  const [error, setError] = useState<ErrorType>(null);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await checkDeviceCount();
        setDeviceCount(count);
        setIsInitialized(count > 0);
      } catch (error) {
        setError(error as ErrorType);
        setDeviceCount(0);
        setIsInitialized(false);
      }
    };
    fetchCount();
  }, []);

  const handleInitialize = async () => {
    setIsLoading(true);
    setProgress("Starting database initialization...");
    try {
      setProgress("Creating database structure...");
      await initDB();

      setProgress("Verifying database...");
      await new Promise((resolve) => setTimeout(resolve, 100));

      setProgress("Counting devices...");
      const newCount = await checkDeviceCount();
      setDeviceCount(newCount);
      setIsInitialized(true);

      toast.success("Database initialized successfully!");
      setProgress("");
    } catch (error) {
      setError(error as ErrorType);
      toast.error("Failed to initialize database.");
      console.error(error);
    } finally {
      setIsLoading(false);
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
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome</h1>
      <DeviceCount count={deviceCount} isLoading={isLoading} />

      {progress && (
        <p className="text-blue-600 mb-4" role="status" aria-live="polite">
          {progress}
        </p>
      )}

      <div className="flex gap-4">
        <ButtonComponent
          variant="primary"
          onClick={handleInitialize}
          disabled={isInitialized}
          isLoading={isLoading}
          data-testid="initialize-button"
        >
          {isLoading ? "Initializing..." : "Initialize Database"}
        </ButtonComponent>
        <ButtonComponent
          variant="danger"
          onClick={handleReset}
          disabled={isLoading}
          aria-label="Reset all databases"
        >
          Reset All Databases
        </ButtonComponent>
      </div>

      {error && <ErrorMessage message={error.message} />}
    </main>
  );
};

export default HomePage;
