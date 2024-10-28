import { test, expect } from '@playwright/test';

const DOCKINGS_PATH = '/dockings';

test.describe('Docking Schedule - Video Scan', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the docking schedule page before each test
    await page.goto(DOCKINGS_PATH);
  });

  test('records a video scan', async ({ page }) => {
    // Find a docked spacecraft and click "Record Scan"
    const dockedRow = page.getByRole('row', {
      name: /docked/i,
    });
    await dockedRow
      .getByRole('button', { name: 'Record Scan' })
      .click();

    // Finish writing this test
  });
});
