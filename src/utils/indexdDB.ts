import { openDB } from "idb";
import { DeviceStatus } from "../constants/device";

// Database configuration constants
const DB_NAME = "Device Database";
const STORE_NAME = "DeviceStore";
const DB_VERSION = 5; // Increment this when making structural changes to the database

type Device = {
  serialNumber: string;
  name: string;
  status: string;
  lastConnectionDate: Date;
};

/**
 * Initializes the IndexedDB database with a fresh set of demo data.
 * This function will:
 * 1. Delete any existing database
 * 2. Create a new database with the specified schema
 * 3. Populate it with 200 demo devices
 *
 * @returns Promise<void>
 * @throws Error if database initialization fails
 */
export const initDB = async (): Promise<void> => {
  let db;
  try {
    console.log("Starting database initialization...");

    // Delete existing database
    await new Promise<void>((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
      deleteRequest.onsuccess = () => {
        console.log("Existing database deleted successfully");
        resolve();
      };
      deleteRequest.onerror = () => reject(deleteRequest.error);
    });

    // Create new database with schema only
    db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: "serialNumber",
        });
        // Create indexes
        store.createIndex("name", "name", { unique: false });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("lastConnectionDate", "lastConnectionDate", {
          unique: false,
        });
      },
    });

    // Add devices using addDevice function
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    for (let i = 1; i <= 200; i++) {
      const isActive = i % 3 === 0;
      const paddedNumber = i.toString().padStart(3, "0");

      // Calculate a date between 1 and 90 days ago
      const daysAgo = Math.floor(Math.random() * 90) + 1;
      const date = new Date(Date.now() - daysAgo * oneDay);

      await addDevice({
        serialNumber: `DEMO-${paddedNumber}`,
        name: `Demo Device ${paddedNumber}`,
        status: isActive ? "Active" : "Inactive",
        lastConnectionDate: date,
      });
    }

    console.log("Database initialized successfully with 200 devices");
    return;
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  } finally {
    if (db) db.close();
  }
};

/**
 * Adds a new device to the database
 *
 * @param device - Device object containing device details
 * @returns Promise<boolean> - true if successful, false if failed
 */

export const addDevice = async (device: Device): Promise<boolean> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await store.add({
      serialNumber: device.serialNumber,
      name: device.name,
      status: device.status,
      lastConnectionDate: device.lastConnectionDate,
    });

    await tx.done;
    db.close();
    return true;
  } catch (error) {
    console.error("Error adding device:", error);
    return false;
  }
};

/**
 * Checks the total number of devices in the database
 *
 * @returns Promise<number> - The total count of devices, or 0 if database doesn't exist
 */
export const checkDeviceCount = async (): Promise<number> => {
  let db;
  try {
    // First check if the database exists
    const databases = await indexedDB.databases();
    const dbExists = databases.some((db) => db.name === DB_NAME);

    if (!dbExists) {
      console.log("Database doesn't exist yet");
      return 0;
    }

    db = await openDB(DB_NAME);

    // Check if store exists
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      console.log("Store doesn't exist yet");
      return 0;
    }

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const count = await store.count();

    return count;
  } catch (error) {
    console.error("Error checking device count:", error);
    return 0;
  } finally {
    if (db) await db.close();
  }
};

/**
 * Gets the count of active and inactive devices
 *
 * @returns Promise<{active: number, inactive: number}> - Object containing counts for each status
 */
export const getDeviceCounts = async () => {
  try {
    // First check if the database exists
    const databases = await indexedDB.databases();
    const dbExists = databases.some((db) => db.name === DB_NAME);

    if (!dbExists) {
      console.log("Database doesn't exist yet");
      return { active: 0, inactive: 0 };
    }

    const db = await openDB(DB_NAME, DB_VERSION);

    // Check if store exists
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      console.log("Store doesn't exist yet");
      return { active: 0, inactive: 0 };
    }

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const activeCount = (await store.index("status").getAll("Active")).length;
    const inactiveCount = (await store.index("status").getAll("Inactive"))
      .length;

    await db.close();
    return { active: activeCount, inactive: inactiveCount };
  } catch (error) {
    console.warn("Database not initialized yet:", error);
    return { active: 0, inactive: 0 };
  }
};

/**
 * Retrieves devices based on their status
 *
 * @param statusFilter - Filter criteria (ALL, Active, or Inactive)
 * @returns Promise<Device[]> - Array of devices matching the filter
 * @throws Error if fetching fails
 */
export const getDevices = async (statusFilter: DeviceStatus) => {
  try {
    console.log("Fetching devices with filter:", statusFilter);
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);

    let results;
    if (statusFilter === DeviceStatus.ALL) {
      results = await store.getAll();
    } else {
      const index = store.index("status");
      results = await index.getAll(statusFilter);
    }

    console.log(`Found ${results.length} devices`);
    return results;
  } catch (error) {
    console.error("Error fetching devices:", error);
    throw error;
  }
};

/**
 * Updates an existing device's information
 *
 * @param id - Serial number of the device to update
 * @param updatedDevice - New device data
 * @throws Error if update fails
 */
export const updateDevice = async (id: string, updatedDevice: Device) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put({ ...updatedDevice, serialNumber: id });
  await tx.done;
};

/**
 * Deletes a specific device from the database
 *
 * @param id - Serial number of the device to delete
 * @throws Error if deletion fails
 */
export const deleteDevice = async (id: string) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};

/**
 * Deletes all IndexedDB databases in the current origin
 * Useful for resetting the application state
 *
 * @throws Error if deletion fails
 */
export const deleteAllDatabases = async () => {
  const databases = await indexedDB.databases();
  await Promise.all(
    databases.map(
      (db) =>
        db.name &&
        new Promise((resolve, reject) => {
          const request = indexedDB.deleteDatabase(db.name!);
          request.onsuccess = () => resolve(void 0);
          request.onerror = () => reject(request.error);
        })
    )
  );
  console.log("All databases deleted");
};
