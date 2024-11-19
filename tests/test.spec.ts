import { test, expect } from "@playwright/test";

test.describe("Device Management Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:5173");

    const initButton = page.getByTestId("initialize-button");
    await expect(initButton).toBeVisible();
    await expect(initButton).not.toBeDisabled();

    try {
      await initButton.click();
      await expect(initButton).toBeDisabled();
      await expect(
        page.getByText("Current number of devices in database: 200")
      ).toBeVisible();
    } catch (error) {
      console.error("Database initialization failed:", error);
      await page.screenshot({ path: "db-init-error.png" });
      throw error;
    }

    await page.goto("http://localhost:5173/devices");
  });

  test("should display device list with pagination", async ({ page }) => {
    await expect(page.getByTestId("device-item")).toHaveCount(12);
    await expect(page.getByRole("button", { name: "Next" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous" })).toBeDisabled();
  });

  test("should filter devices by status", async ({ page }) => {
    await page.getByTestId("filter-dropdown-button").click();
    await page.getByTestId("filter-option-Active").click();

    const devices = page.getByTestId("device-item").first();
    await expect(devices).toContainText("Active");
    await expect(devices).not.toContainText("Inactive");
  });

  test("should edit device details", async ({ page }) => {
    const newName = "Updated Device Name";

    await page.getByTestId("edit-button").first().click();

    await page.getByTestId("device-name-input").fill(newName);
    await page.getByTestId("save-button").click();

    await expect(page.getByTestId("device-item").first()).toContainText(
      newName
    );
  });

  test("should delete device with confirmation", async ({ page }) => {
    // Get the serial number of the first device before deletion
    const serialNumber =
      (await page.getByTestId("device-serial").first().textContent()) || "";

    // Click delete to open the confirmation modal
    await page.getByTestId("delete-button").first().click();

    // Verify the confirmation modal is shown and wait for it
    await page.getByTestId("confirm-delete-button").click();

    // Add a small wait to allow for UI updates
    await page.waitForTimeout(1000);

    // Verify the deleted device's serial number is no longer present
    await expect(page.getByText(serialNumber)).not.toBeVisible();
  });
});
