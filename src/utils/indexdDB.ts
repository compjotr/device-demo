import { openDB } from "idb";
import { DeviceStatusValue } from "../constants/device";
import { DEVICE_STATUS } from "../constants/device";

const DB_NAME = "Device Database";
const STORE_NAME = "DeviceStore";
const DB_VERSION = 2;

// Add interface for Device type
interface Device {
  serialNumber: string;
  name: string;
  status: string;
  lastConnectionDate: Date;
}

export const initDB = async (): Promise<void> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        console.log("Database upgrade started");

        // If store exists, delete it for fresh start
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }

        // Create new store
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

    // First transaction: Add devices
    const tx1 = db.transaction(STORE_NAME, "readwrite");
    const store1 = tx1.objectStore(STORE_NAME);

    // Initialize with 200 devices
    const devices: Device[] = Array.from({ length: 200 }, (_, i) => ({
      serialNumber: `SN${i.toString().padStart(5, "0")}`,
      name: `Device ${i + 1}`,
      status: i % 2 === 0 ? "Active" : "Inactive",
      lastConnectionDate: new Date(),
    }));

    // Add all devices
    await Promise.all(devices.map((device) => store1.add(device)));
    await tx1.done;

    // Second transaction: Verify count
    const tx2 = db.transaction(STORE_NAME, "readonly");
    const store2 = tx2.objectStore(STORE_NAME);
    const count = await store2.count();
    console.log(`Database initialized with ${count} devices`);
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export const addDevice = async (device: Device): Promise<boolean> => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    await store.add({
      serialNumber: device.serialNumber,
      name: device.name,
      status: device.status,
      lastConnectionDate: new Date(),
    });

    await tx.done;
    return true;
  } catch (error) {
    console.error("Error adding device:", error);
    return false;
  }
};

export const checkDeviceCount = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // If store doesn't exist, create it
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, {
            keyPath: "serialNumber",
          });

          // Create indexes
          store.createIndex("name", "name", { unique: false });
          store.createIndex("status", "status", { unique: false });
          store.createIndex("lastConnectionDate", "lastConnectionDate", {
            unique: false,
          });
        }
      },
    });

    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const count = await store.count();
    return count;
  } catch (error) {
    console.error("Error checking device count:", error);
    return 0;
  }
};

export const getDeviceCounts = async () => {
  try {
    const db = await openDB(DB_NAME, DB_VERSION);
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.objectStore(STORE_NAME);
    const activeCount = (await store.index("status").getAll("Active")).length;
    const inactiveCount = (await store.index("status").getAll("Inactive"))
      .length;
    return { active: activeCount, inactive: inactiveCount };
  } catch (error) {
    console.warn("Database not initialized yet");
    return { active: 0, inactive: 0 };
  }
};

export const getDevices = async (statusFilter: DeviceStatusValue) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);

  if (statusFilter === DEVICE_STATUS.ALL) return store.getAll();

  const index = store.index("status");
  return index.getAll(statusFilter);
};

export const updateDevice = async (id: string, updatedDevice: Device) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.put({ ...updatedDevice, serialNumber: id });
  await tx.done;
};

export const deleteDevice = async (id: string) => {
  const db = await openDB(DB_NAME, DB_VERSION);
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.delete(id);
  await tx.done;
};

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
