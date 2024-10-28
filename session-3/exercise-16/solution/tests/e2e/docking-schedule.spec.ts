import { test, expect } from '@playwright/test';

const DOCKINGS_PATH = '/dockings';

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

test.describe('Docking Schedule', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the docking schedule page before each test
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
  }) => {
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
