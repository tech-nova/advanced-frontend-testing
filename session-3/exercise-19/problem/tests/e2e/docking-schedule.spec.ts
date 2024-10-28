import { test as baseTest, expect } from '@playwright/test';

const DOCKINGS_PATH = '/dockings';
const API_BASE = 'http://localhost:3000/api';

function formatDateForInput(date) {
  // Get the components of the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    '0'
  ); // Months are zero-indexed
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(
    2,
    '0'
  );

  // Format the string according to the 'datetime-local' input requirements
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateForDisplay(date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

// Extend Playwright's test object with a custom fixture
const test = baseTest.extend<{
  transaction: any;
}>({
  /**
   * Manages database transactions through API calls.
   *
   * Fixtures have this call flow for each test:
   *
   * <before test>
   *
   * <test>
   *   await use(null)
   * </test>
   *
   * <after test>
   */
  transaction: async ({ request }, use) => {
    // Start transaction using direct API request
    // Before each test
    await request.post(
      `${API_BASE}/testing/transaction/begin`
    );
    console.log('[TEST] Started transaction');

    try {
      // Run each test
      await use(null);
    } finally {
      // Rollback transaction using direct API request
      // After each test
      await request.post(
        `${API_BASE}/testing/transaction/rollback`
      );
      console.log('[TEST] Rolled back transaction');
    }
  },
});

test.describe('Docking Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DOCKINGS_PATH);
  });

  test('displays the list of scheduled dockings', async ({
    page,
  }) => {
    await expect(
      page.getByRole('heading', {
        name: 'Docking Schedule',
      })
    ).toBeVisible();

    // Check table headers
    await expect(
      page.getByRole('columnheader', {
        name: 'Spacecraft',
      })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Captain' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', {
        name: 'Docking Time',
      })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', {
        name: 'Docking Bay',
      })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Status' })
    ).toBeVisible();
    await expect(
      page.getByRole('columnheader', { name: 'Actions' })
    ).toBeVisible();

    // Check if at least one docking entry is present
    await expect(page.getByRole('row')).toHaveCount(5); // Including header row
  });

  test('allows scheduling a new docking', async ({
    page,
    // All we need to do is destructure the transaction fixture and
    // Playwright will handle the rest of the setup
    transaction,
  }) => {
    console.log('[TEST] Scheduling a new docking');

    await page
      .getByRole('button', { name: 'Schedule Docking' })
      .click();

    // Select a spacecraft from the dropdown using getByLabel
    await page
      .getByLabel('Spacecraft')
      .selectOption({ index: 1 });

    const futureDockingTime = new Date(
      new Date().getTime() + 1000 * 60 * 60 * 24
    );
    futureDockingTime.setSeconds(0, 0);

    await page
      .getByLabel('Docking Time')
      .fill(formatDateForInput(futureDockingTime));

    await page.getByLabel('Docking Bay').fill('555');

    await page
      .getByRole('button', {
        name: 'Schedule',
        exact: true,
      })
      .click();

    // Wait for the modal to close and the new docking to appear in the table
    await expect(
      page.getByRole('dialog')
    ).not.toBeVisible();

    // Check if the new docking appears in the table
    await expect(
      page.getByRole('cell', {
        name: formatDateForDisplay(futureDockingTime),
      })
    ).toBeVisible();
    await expect(
      page.getByRole('cell', { name: '555', exact: true })
    ).toBeVisible();
  });
});
